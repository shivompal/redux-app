import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { saveBug, getUnresolvedBugs, fixBug, loadBugs } from "../bugs";
import configureStore from "../configureStore";

describe("bugsSlice", () => {
  let fakeAxios;
  let store;

  beforeEach(() => {
    fakeAxios = new MockAdapter(axios);
    store = configureStore();
  });

  const bugsSlice = () => store.getState().entities.bugs;

  const createState = () => ({
    entities: {
      bugs: {
        list: [],
      },
    },
  });

  it("It should resolve bug to store if updated successfully", async () => {
    fakeAxios.onPatch("/bugs/1").reply(200, { id: 1, resolved: true });
    fakeAxios.onPost("/bugs").reply(200, { id: 1 });

    await store.dispatch(saveBug({ description: "add bug to fix it later" }));
    await store.dispatch(fixBug(1));

    expect(bugsSlice().list[0].resolved).toBe(true);
  });

  describe("Loading bugs", () => {
    describe("Bug exists in cache", () => {
      it("Bugs should be fetched from cache if they exists there", async () => {
        fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());
        await store.dispatch(loadBugs());

        expect(fakeAxios.history.get.length).toBe(1);
      });
    });

    describe("Bug do not exist in cache", () => {
      it("Bugs should be fetched from server if they do not exist in cache", async () => {
        fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());

        expect(bugsSlice().list).toHaveLength(1);
      });
    });

    describe("Loading indicator", () => {
      it("It should be true while fetching bugs", () => {
        fakeAxios.onGet("/bugs").reply(() => {
          expect(bugsSlice().loading).toBe(true);
          return [200, [{ id: 1 }]];
        });

        store.dispatch(loadBugs());
      });

      it("It should be false after fetching bugs", async () => {
        fakeAxios.onGet("/bugs").reply(200, [{ id: 1 }]);

        await store.dispatch(loadBugs());

        expect(bugsSlice().loading).toBe(false);
      });

      it("It should be false if server returns an error", async () => {
        fakeAxios.onGet("/bugs").reply(500);

        await store.dispatch(loadBugs());

        expect(bugsSlice().loading).toBe(false);
      });
    });
  });

  it("It should not resolve bug to store if not updated successfully", async () => {
    fakeAxios.onPatch("/bugs/1").reply(500);
    fakeAxios.onPost("/bugs").reply(200, { id: 1 });

    await store.dispatch(saveBug({ description: "add bug to fix it later" }));
    await store.dispatch(fixBug(1));

    expect(bugsSlice().list[0].resolved).not.toBe(true);
  });

  it("It should add bug to store if saved successfully", async () => {
    const bug = { description: "Add bug to store" };
    const savedBug = { ...bug, id: 1 };
    fakeAxios.onPost("/bugs").reply(200, savedBug);

    await store.dispatch(saveBug(bug));

    // expect(store.getState().entities.bugs.list).toHaveLength(1);
    expect(bugsSlice().list).toContainEqual(savedBug);
  });

  it("It should not add bug to store if not saved successfully", async () => {
    const bug = { description: "Add bug to store" };
    fakeAxios.onPost("/bugs").reply(500);

    await store.dispatch(saveBug(bug));

    // expect(store.getState().entities.bugs.list).toHaveLength(1);
    expect(bugsSlice().list).toHaveLength(0);
  });

  describe("Selectors", () => {
    it("getUnresolvedBugs", () => {
      const state = createState();
      state.entities.bugs.list = [
        { id: 1, resolved: true },
        { id: 2 },
        { id: 3 },
      ];

      const result = getUnresolvedBugs(state);

      expect(result).toHaveLength(2);
    });
  });
});

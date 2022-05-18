import { saveBug } from "../bugs";
import { apiCallStart } from "../api";

describe("bugSlice", () => {
  describe("Action creators", () => {
    it("saveBug", () => {
      const bugObj = { description: "unit test bug" };
      const result = saveBug(bugObj);

      const expected = {
        type: apiCallStart.type,
        payload: {
          url: "/bugs",
          method: "post",
          data: bugObj,
          onSuccess: "bugs/addBug",
        },
      };

      expect(result).toEqual(expected);
    });
  });
});

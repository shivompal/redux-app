import { createSlice } from "@reduxjs/toolkit";
import { slice } from "lodash";
import { createSelector } from "reselect";
import { apiCallStart } from "./api";
import moment from "moment";

let id = 0;
const bugsSlice = createSlice({
  name: "bugs",
  // initialState: [],
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    bugsRequested: (bugs, action) => {
      bugs.loading = true;
    },
    bugsReceived: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
      bugs.lastFetch = Date.now();
    },
    bugsRequestFailed: (bugs, action) => {
      bugs.loading = false;
    },
    bugAssignedToUser: (bugs, action) => {
      const { id: bugId, userId } = action.payload;
      const index = bugs.list.findIndex((bug) => bug.id === bugId);
      bugs.list[index].userId = userId;
    },
    // action: action handler
    addBug: (bugs, action) => {
      bugs.list.push(action.payload);
    },

    resolveBug: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[index].resolved = true;
    },

    removeBug: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list.splice(index, 1);
    },
  },
});

//console.log("Slice", bugsSlice);
// export const {
const {
  addBug,
  removeBug,
  resolveBug,
  bugsReceived,
  bugsRequested,
  bugAssignedToUser,
  bugsRequestFailed,
} = bugsSlice.actions;
export default bugsSlice.reducer;

// Action creators
const url = "/bugs";
// Fetch bugs
export const loadBugs = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bugs;
  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");

  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallStart({
      url,
      onStart: bugsRequested.type,
      onSuccess: bugsReceived.type,
      onError: bugsRequestFailed.type,
    })
  );
};
/*export const loadBugs = () =>
  apiCallStart({
    url,
    onStart: bugsRequested.type,
    onSuccess: bugsReceived.type,
    onError: bugsRequestFailed.type,
  });*/

export const saveBug = (bug) =>
  apiCallStart({
    url,
    method: "post",
    data: bug,
    onSuccess: addBug.type,
  });

export const fixBug = (id) =>
  apiCallStart({
    url: url + "/" + id,
    method: "patch",
    data: { resolved: true },
    onSuccess: resolveBug.type,
  });

export const assignBugToUser = (bugId, userId) =>
  apiCallStart({
    url: url + "/" + bugId,
    method: "patch",
    data: { userId },
    onSuccess: bugAssignedToUser.type,
  });

// Selector
/*export const getUnresolvedBugs = (state) =>
  state.entities.bugs.filter((bug) => !bug.resolved);*/

export const getUnresolvedBugs = createSelector(
  (state) => state.entities.bugs,
  // (state) => state.entities.projects,
  (bugs) => bugs.list.filter((bug) => !bug.resolved)
  // (bugs, projects) => bugs.list.filter((bug) => !bug.resolved)
);

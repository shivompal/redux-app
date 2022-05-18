import { createSlice } from "@reduxjs/toolkit";

let id = 0;
const projectsSlice = createSlice({
  name: "projects",
  initialState: [],
  reducers: {
    // action: action handler
    addProject: (state, action) => {
      state.push({
        id: ++id,
        description: `${action.payload.description} added with id = ${id}`,
      });
    },
  },
});

export const { addProject } = projectsSlice.actions;
export default projectsSlice.reducer;

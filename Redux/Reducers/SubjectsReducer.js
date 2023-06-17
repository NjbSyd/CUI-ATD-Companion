import { createSlice } from "@reduxjs/toolkit";

const SubjectNames_Slice = createSlice({
  name: "SubjectNames",
  initialState: {
    subjectNames: [],
  },
  reducers: {
    setSubjectNames: (state, action) => {
      state.subjectNames = action.payload;
    },
  },
});

export const { setSubjectNames } = SubjectNames_Slice.actions;
export default SubjectNames_Slice.reducer;

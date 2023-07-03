import { createSlice } from "@reduxjs/toolkit";

const initialState = [{ label: "No data", value: "No Data" }];

const SubjectSlice = createSlice({
  name: "subject",
  initialState,
  reducers: {
    setSubjectNames: (state, action) => {
      state = action.payload;
    },
  },
});

export const { setSubjectNames } = SubjectSlice.actions;
export default SubjectSlice.reducer;

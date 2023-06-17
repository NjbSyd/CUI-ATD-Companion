import { createSlice } from "@reduxjs/toolkit";

const TeacherNames_Slice = createSlice({
  name: "TeacherNames",
  initialState: {
    teacherNames: [],
  },
  reducers: {
    setTeacherNames: (state, action) => {
      state.teacherNames = action.payload.filter(
        (teacher) => state.teacherNames.includes(teacher) === false
      );
    },
  },
});

export const { setTeacherNames } = TeacherNames_Slice.actions;
export default TeacherNames_Slice.reducer;

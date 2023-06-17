import { createSlice } from "@reduxjs/toolkit";

const ClassRoomNames_Slice = createSlice({
  name: "ClassRoomNames",
  initialState: {
    classRoomNames: [],
  },
  reducers: {
    setClassRoomNames: (state, action) => {
      state.classRoomNames = action.payload;
    },
  },
});
export const { setClassRoomNames } = ClassRoomNames_Slice.actions;
export default ClassRoomNames_Slice.reducer;

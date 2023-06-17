import { createSlice } from "@reduxjs/toolkit";

const TimeSlots_Slice = createSlice({
  name: "TimeSlots",
  initialState: {
    timeSlots: [],
  },
  reducers: {
    setTimeSlots: (state, action) => {
      state.timeSlots = action.payload;
    },
  },
});
export const { setTimeSlots } = TimeSlots_Slice.actions;
export default TimeSlots_Slice.reducer;

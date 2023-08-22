import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  available: false,
  freeslots: "No data",
}

const FreeslotsSlice = createSlice({
  name: "freeslots",
  initialState,
  reducers: {
    setFreeslots: (state, action) => {
      if (action.payload === null) {
        state.available = false;
        state.freeslots = "No data";
      } else {
        state.available = true;
        state.freeslots = action.payload;
      }
    }
  }
});

export const {setFreeslots} = FreeslotsSlice.actions;
export default FreeslotsSlice.reducer;

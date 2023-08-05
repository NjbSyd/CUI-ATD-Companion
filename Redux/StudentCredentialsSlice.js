import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  pass: "",
};

const StudentCredentialSlice = createSlice({
  name: "studentCredentials",
  initialState,
  reducers: {
    setRegistration: (state, action) => {
      state.id = action.payload.id;
      state.pass = action.payload.pass;
    },
  },
});

export const { setRegistration } = StudentCredentialSlice.actions;
export default StudentCredentialSlice.reducer;

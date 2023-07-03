import { configureStore } from "@reduxjs/toolkit";
import ClassRoomSlice from "./ClassRoomSlice";
import TeacherSlice from "./TeacherSlice";
import SubjectSlice from "./SubjectSlice";
import TimeslotSlice from "./TimeslotSlice";

export const MyStore = configureStore({
  reducer: {
    ClassRoomSlice,
    TimeslotSlice,
    SubjectSlice,
    TeacherSlice,
  },
});

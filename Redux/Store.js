import { configureStore, combineReducers } from "@reduxjs/toolkit";

import ClassRoomSlice from "./ClassRoomSlice";
import FreeslotsSlice from "./FreeslotsSlice";
import SectionSlice from "./SectionSlice";
import StudentCredentialsSlice from "./StudentCredentialsSlice";
import SubjectSlice from "./SubjectSlice";
import TeacherSlice from "./TeacherSlice";
import TimeslotSlice from "./TimeslotSlice";

const rootReducer = combineReducers({
  ClassRoomSlice,
  TimeslotSlice,
  SubjectSlice,
  TeacherSlice,
  SectionSlice,
  StudentCredentialsSlice,
  FreeslotsSlice,
});

export const MyStore = configureStore({
  reducer: rootReducer,
});

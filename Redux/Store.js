import { configureStore } from "@reduxjs/toolkit";
import GetTimeSlots_Slice from "./Reducers/TimeSlotsReducer";
import GetTeacherNames_Slice from "./Reducers/TeachersReducer";
import GetSubjectNames_Slice from "./Reducers/SubjectsReducer";
import GetClassRoomNames_Slice from "./Reducers/ClassRoomsReducer";

const store = configureStore({
  reducer: {
    timeslots: GetTimeSlots_Slice,
    teacherNames: GetTeacherNames_Slice,
    subjectNames: GetSubjectNames_Slice,
    classRooms: GetClassRoomNames_Slice,
  },
});

export default store;

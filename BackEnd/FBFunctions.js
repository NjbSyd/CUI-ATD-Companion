import {db} from "../Config/FirebaseConfig";
import {doc, collection, getDocs, getDoc} from "firebase/firestore";
import {setData} from "./AsyncStorageFX";

async function refetchAllDataFromFB() {
  await getAllTeachersData();
  await getClassRooms();
  await getTimeslots();
}

async function getAllTeachersData() {
  const teacherNames = [];
  await getDocs(collection(db, "TeacherSchedule")).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      teacherNames.push({label: doc.id, value: doc.id});
      setData(doc.id, JSON.stringify(doc.data().data));
    })
  });
  setData("teacherNames", JSON.stringify(teacherNames));
  return teacherNames;
}


async function getClassRooms() {
  try {
    let ClassRoomNames = []
    let timetableData;
    await getDocs(collection(db, "Timetable")).then((querySnapshot) => {
      timetableData = transformTimetableData(querySnapshot)
      querySnapshot.forEach((doc) => {
        const classData = doc.data();
        Object.keys(classData).forEach((day) => {
          const timeSlots = classData[day];
          Object.keys(timeSlots).forEach((timeSlot) => {
            if (timeSlots[timeSlot] === null) return;
            ClassRoomNames.push(timeSlots[timeSlot].classRoom);
          });
        });
      });
    });
    ClassRoomNames = [...new Set(ClassRoomNames)];
    ClassRoomNames.sort();
    ClassRoomNames = ClassRoomNames.map((item) => ({label: item, value: item}));
    setData("classRoomNames", JSON.stringify(ClassRoomNames));
    setData("timetableData", JSON.stringify(timetableData));
    return ClassRoomNames;
  } catch (e) {
    return [{label: "Error", value: "Error"}];
  }
}


async function getTimeslots() {
  const timeslots = [];
  const docRef = doc(db, "Timetable", "BSE 6A");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    const oneDay = Object.keys(data)[0];
    Object.keys(data[oneDay]).forEach((key) => {
      timeslots.push({label: key, value: key});
    })
  } else {
    console.log("No such document!");
  }
  timeslots.sort(function (a, b) {
    const timeA = parseInt(a.label.split(":")[0]);
    const timeB = parseInt(b.label.split(":")[0]);
    return timeA - timeB;
  });
  setData("timeslots", JSON.stringify(timeslots));
  return timeslots;
}


function transformTimetableData(querySnapshot) {
  const transformedData = {};
  querySnapshot.forEach((doc) => {
    const classData = doc.data();
    const transformedClassData = {};
    Object.keys(classData).forEach((day) => {
      const timeSlots = classData[day];
      const transformedTimeSlots = {};
      Object.keys(timeSlots).forEach((timeSlot) => {
        const timeSlotData = timeSlots[timeSlot];
        if (timeSlotData !== null) {
          transformedTimeSlots[timeSlot] = timeSlotData;
        }
      });
      if (Object.keys(transformedTimeSlots).length > 0) {
        transformedClassData[day] = transformedTimeSlots;
      }
    });
    if (Object.keys(transformedClassData).length > 0) {
      transformedData[doc.id] = transformedClassData;
    }
  });
  return transformedData;
}


export {getAllTeachersData, getTimeslots, getClassRooms,refetchAllDataFromFB};


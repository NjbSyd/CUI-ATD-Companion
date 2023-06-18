import * as SQLite from "expo-sqlite";

function GetTeacherNames() {
  return new Promise((resolve, reject) => {
    const db = SQLite.openDatabase("TimeTable.db");
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT DISTINCT teacher FROM timetables",
        [],
        (_, rows) => {
          let teachers = [];
          for (let i = 0; i < rows.rows.length; i++) {
            teachers.push(rows.rows.item(i).teacher);
          }
          teachers.sort((a, b) => {
            if (a > b) {
              return 1;
            } else if (a < b) {
              return -1;
            } else {
              return 0;
            }
          });
          teachers = teachers.map((teacher) => {
            return { label: teacher, value: teacher };
          });
          resolve(teachers);
        },
        (_, error) => reject(error)
      );
    });
  });
}

function GetTeachersSchedule(teacher) {
  return new Promise((resolve, reject) => {
    const db = SQLite.openDatabase("TimeTable.db");
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM timetables WHERE teacher = ?",
        [teacher],
        (_, rows) => {
          let schedule = [];
          for (let i = 0; i < rows.rows.length; i++) {
            schedule.push(rows.rows.item(i));
          }
          let weekDays = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
          schedule.sort((a, b) => {
            if (weekDays.indexOf(a.day) > weekDays.indexOf(b.day)) {
              return 1;
            } else if (weekDays.indexOf(a.day) < weekDays.indexOf(b.day)) {
              return -1;
            } else {
              return 0;
            }
          });
          resolve(schedule);
        },
        (_, error) => reject(error)
      );
    });
  });
}

function GetTimeSlots() {
  return new Promise((resolve, reject) => {
    const db = SQLite.openDatabase("TimeTable.db");
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT DISTINCT time_slot FROM timetables",
        [],
        (_, rows) => {
          let timeSlots = [];
          for (let i = 0; i < rows.rows.length; i++) {
            timeSlots.push(rows.rows.item(i).time_slot);
          }
          timeSlots.sort((a, b) => {
            if (a > b) {
              return 1;
            } else if (a < b) {
              return -1;
            } else {
              return 0;
            }
          });

          timeSlots = timeSlots.map((time) => {
            return { label: time, value: time };
          });
          resolve(timeSlots);
        },
        (_, error) => reject(error)
      );
    });
  });
}

function GetClassRooms() {
  return new Promise((resolve, reject) => {
    const db = SQLite.openDatabase("TimeTable.db");
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT DISTINCT class_room FROM timetables",
        [],
        (_, rows) => {
          let class_rooms = [];
          for (let i = 0; i < rows.rows.length; i++) {
            class_rooms.push(rows.rows.item(i).class_room);
          }
          class_rooms.sort((a, b) => {
            if (a > b) {
              return 1;
            } else if (a < b) {
              return -1;
            } else {
              return 0;
            }
          });
          class_rooms = class_rooms.map((class_room) => {
            return { label: class_room, value: class_room };
          });
          resolve(class_rooms);
        },
        (_, error) => reject(error)
      );
    });
  });
}

function GetTimeslotBasedClassRoomTimetable(class_room, time_slot) {
  return new Promise((resolve, reject) => {
    const db = SQLite.openDatabase("TimeTable.db");
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM timetables WHERE class_room = ? AND time_slot = ?",
        [class_room, time_slot],
        (_, rows) => {
          let schedule = [];
          for (let i = 0; i < rows.rows.length; i++) {
            schedule.push(rows.rows.item(i));
          }
          let weekDays = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
          schedule.sort((a, b) => {
            if (weekDays.indexOf(a.day) > weekDays.indexOf(b.day)) {
              return 1;
            } else if (weekDays.indexOf(a.day) < weekDays.indexOf(b.day)) {
              return -1;
            } else {
              return 0;
            }
          });
          resolve(schedule);
        },
        (_, error) => reject(error)
      );
    });
  });
}

export {
  GetTeacherNames,
  GetTeachersSchedule,
  GetTimeSlots,
  GetClassRooms,
  GetTimeslotBasedClassRoomTimetable,
};

import * as SQLite from "expo-sqlite";

function GetTeacherNames() {
  const db = SQLite.openDatabase("TimeTable.db");

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT DISTINCT teacher FROM timetables ORDER BY teacher",
        [],
        (_, rows) => {
          const teachers = rows._array.map((row) => ({
            label: row.teacher,
            value: row.teacher,
          }));
          resolve(teachers);
        },
        (_, error) => reject(error)
      );
    });
  });
}

function GetSubjectNames() {
  const db = SQLite.openDatabase("TimeTable.db");

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT DISTINCT subject FROM timetables ORDER BY subject ASC",
        [],
        (_, { rows }) => {
          const subjects = rows._array.map((item) => ({
            label: item.subject,
            value: item.subject,
          }));
          resolve(subjects);
        },
        (_, error) => reject(error)
      );
    });
  });
}

function GetTimeSlots() {
  const db = SQLite.openDatabase("TimeTable.db");

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT DISTINCT time_slot FROM timetables ORDER BY time_slot ASC",
        [],
        (_, { rows }) => {
          const timeSlots = rows._array.map((item) => ({
            label: item.time_slot,
            value: item.time_slot,
          }));
          resolve(timeSlots);
        },
        (_, error) => reject(error)
      );
    });
  });
}

function GetClassRooms() {
  const db = SQLite.openDatabase("TimeTable.db");

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT DISTINCT class_room FROM timetables ORDER BY class_room ASC",
        [],
        (_, { rows }) => {
          const classRooms = rows._array.map((item) => ({
            label: item.class_room,
            value: item.class_room,
          }));
          resolve(classRooms);
        },
        (_, error) => reject(error)
      );
    });
  });
}

function GetTeachersSchedule(teacher) {
  const db = SQLite.openDatabase("TimeTable.db");

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM timetables WHERE teacher = ? ORDER BY CASE day WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3 WHEN 'Thursday' THEN 4 WHEN 'Friday' THEN 5 WHEN 'Saturday' THEN 6 WHEN 'Sunday' THEN 7 END",
        [teacher],
        (_, { rows }) => {
          const schedule = rows._array;
          resolve(schedule);
        },
        (_, error) => reject(error)
      );
    });
  });
}

function GetSubjectsSchedule(subject) {
  const db = SQLite.openDatabase("TimeTable.db");
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT _id, subject, teacher, class_name FROM timetables WHERE subject = ? GROUP BY class_name, teacher ORDER BY teacher",
        [subject],
        (_, { rows }) => {
          const schedule = rows._array;
          resolve(schedule);
        },
        (_, error) => reject(error)
      );
    });
  });
}

function GetTimeslotBasedClassRoomTimetable(class_room, time_slot) {
  const db = SQLite.openDatabase("TimeTable.db");

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM timetables WHERE class_room = ? AND time_slot = ? ORDER BY CASE day WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3 WHEN 'Thursday' THEN 4 WHEN 'Friday' THEN 5 WHEN 'Saturday' THEN 6 WHEN 'Sunday' THEN 7 END",
        [class_room, time_slot],
        (_, { rows }) => {
          const schedule = rows._array;
          resolve(schedule);
        },
        (_, error) => reject(error)
      );
    });
  });
}

export {
  GetTeacherNames,
  GetTimeSlots,
  GetClassRooms,
  GetSubjectNames,
  GetTeachersSchedule,
  GetTimeslotBasedClassRoomTimetable,
  GetSubjectsSchedule,
};

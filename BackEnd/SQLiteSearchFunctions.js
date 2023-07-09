import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("TimeTable.db");

function executeSqlAsync(sqlStatement, params = []) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sqlStatement,
        params,
        (_, resultSet) => resolve(resultSet),
        (_, error) => reject(error)
      );
    });
  });
}

async function GetDistinctValues(columnName, tableName, orderBy = "") {
  try {
    const orderByClause = orderBy ? `ORDER BY ${orderBy}` : "";
    const resultSet = await executeSqlAsync(
      `SELECT DISTINCT ${columnName} FROM ${tableName} ${orderByClause}`
    );

    return resultSet.rows._array.map((item) => ({
      label: item[columnName],
      value: item[columnName],
    }));
  } catch (error) {
    console.error(
      `Error occurred during GetDistinctValues for ${columnName}:`,
      error
    );
    throw error;
  }
}

async function GetTeacherNames() {
  return GetDistinctValues("teacher", "timetables", "teacher");
}

async function GetSubjectNames() {
  return GetDistinctValues("subject", "timetables", "subject ASC");
}

async function GetTimeSlots() {
  return GetDistinctValues("time_slot", "timetables", "time_slot ASC");
}

async function GetClassRooms() {
  return GetDistinctValues("class_room", "timetables", "class_room ASC");
}

async function GetTeachersSchedule(teacher) {
  try {
    const resultSet = await executeSqlAsync(
      `SELECT * FROM timetables WHERE teacher = ? ORDER BY CASE day WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3 WHEN 'Thursday' THEN 4 WHEN 'Friday' THEN 5 WHEN 'Saturday' THEN 6 WHEN 'Sunday' THEN 7 END`,
      [teacher]
    );

    const schedule = resultSet.rows._array;

    return schedule;
  } catch (error) {
    console.error("Error occurred during GetTeachersSchedule:", error);
    throw error;
  }
}

async function GetSubjectsSchedule(subject) {
  try {
    const resultSet = await executeSqlAsync(
      `SELECT _id, subject, teacher, class_name FROM timetables WHERE subject = ? GROUP BY class_name, teacher ORDER BY teacher`,
      [subject]
    );

    return resultSet.rows._array;
  } catch (error) {
    console.error("Error occurred during GetSubjectsSchedule:", error);
    throw error;
  }
}

async function GetTimeslotBasedClassRoomTimetable(class_room, time_slot) {
  try {
    const resultSet = await executeSqlAsync(
      `SELECT * FROM timetables WHERE class_room = ? AND time_slot = ? ORDER BY CASE day WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3 WHEN 'Thursday' THEN 4 WHEN 'Friday' THEN 5 WHEN 'Saturday' THEN 6 WHEN 'Sunday' THEN 7 END`,
      [class_room, time_slot]
    );

    const schedule = resultSet.rows._array;

    return schedule;
  } catch (error) {
    console.error(
      "Error occurred during GetTimeslotBasedClassRoomTimetable:",
      error
    );
    throw error;
  }
}

async function GetDataSyncDate(orderBy = "") {
  const columnName = "Date";
  const tableName = "SyncDate";

  try {
    const DataSyncDate = await GetDistinctValues(
      columnName,
      tableName,
      orderBy
    );
    return DataSyncDate.length > 0 ? DataSyncDate[0].value : null;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
}

export {
  GetTeacherNames,
  GetTimeSlots,
  GetClassRooms,
  GetSubjectNames,
  GetTeachersSchedule,
  GetTimeslotBasedClassRoomTimetable,
  GetSubjectsSchedule,
  GetDataSyncDate,
};

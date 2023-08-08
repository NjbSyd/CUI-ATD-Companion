import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("TimeTable.db");

async function executeSqlAsync(sqlStatement, params = []) {
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
  return await GetDistinctValues("teacher", "timetables", "teacher");
}

async function GetSubjectNames() {
  return await GetDistinctValues("subject", "timetables", "subject ASC");
}

async function GetTimeSlots() {
  return await GetDistinctValues("time_slot", "timetables", "time_slot ASC");
}

async function GetClassRooms() {
  return await GetDistinctValues("class_room", "timetables", "class_room ASC");
}

async function GetClassNames() {
  return await GetDistinctValues("class_name", "timetables", "class_name ASC");
}

async function GetUsers() {
  try {
    const distinctRegistrationNumbers = await GetDistinctValues(
      "RegistrationNumber",
      "UserCredentials",
      "RegistrationNumber ASC"
    );

    const usersWithImages = await Promise.all(
      distinctRegistrationNumbers.map(async (user) => {
        const imagePath = await executeSqlAsync(
          `SELECT Image FROM UserCredentials WHERE RegistrationNumber = ?`,
          [user.value]
        );
        const image = imagePath.rows._array[0]?.Image;
        return {
          label: user.label,
          image: image,
        };
      })
    );

    return usersWithImages;
  } catch (error) {
    console.error("Error occurred during GetUsers:", error);
    throw error;
  }
}

async function GetUserCredentialsByRegistrationNumber(RegistrationNumber) {
  const tableName = "UserCredentials";

  try {
    const userCredentials = await executeSqlAsync(
      `SELECT * FROM ${tableName} WHERE RegistrationNumber = ?`,
      [RegistrationNumber]
    );
    let oneUser = userCredentials.rows._array;
    return oneUser.length > 0 ? oneUser[0] : null;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
}

async function GetTeachersSchedule(teacher) {
  try {
    const resultSet = await executeSqlAsync(
      `SELECT * FROM timetables WHERE teacher = ? ORDER BY CASE day WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3 WHEN 'Thursday' THEN 4 WHEN 'Friday' THEN 5 WHEN 'Saturday' THEN 6 WHEN 'Sunday' THEN 7 END`,
      [teacher]
    );
    return resultSet.rows._array;
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

    return resultSet.rows._array;
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

async function GetTimetableByClassName(class_name) {
  try {
    const resultSet = await executeSqlAsync(
      `SELECT _id, class_name, class_room, day, subject, teacher, time_slot FROM timetables WHERE class_name = ? ORDER BY
        CASE day
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
          ELSE 8
        END,
        time_slot`,
      [class_name]
    );

    return resultSet.rows._array;
  } catch (error) {
    console.error("Error occurred during GetTimetableByClassName:", error);
    throw error;
  }
}

// Function to delete user credentials from the UserCredentials table.
async function DeleteUserCredentialsFromDB(registrationNumber) {
  const tableName = "UserCredentials";
  try {
    // Assuming DeleteUserCredentialsFromDB is a separate function that interacts with the database.
    await db.transaction(async (tx) => {
      await tx.executeSql(
        `DELETE FROM ${tableName} WHERE RegistrationNumber = ?`,
        [registrationNumber]
      );
    });
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
  GetClassNames,
  GetTimetableByClassName,
  DeleteUserCredentialsFromDB,
  GetUserCredentialsByRegistrationNumber,
  GetUsers,
};

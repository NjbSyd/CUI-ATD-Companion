import { KnexDB } from "./KnexDB";

const executeSqlAsync = async (sqlStatement, params = []) => {
  try {
    const resultSet = await KnexDB.raw(sqlStatement, params);
    return resultSet.rows;
  } catch (error) {
    console.error("Error executing SQL statement:", error);
    throw error;
  }
};

const GetDistinctValues = async (columnName, tableName, orderBy) => {
  try {
    if (orderBy) {
      const results = await KnexDB(tableName)
        .distinct(columnName)
        .select(columnName)
        .orderByRaw(`${orderBy}`);
      return results.map((item) => ({
        label: item[columnName],
        value: item[columnName],
      }));
    } else {
      const results = await KnexDB(tableName)
        .distinct(columnName)
        .select(columnName);
      return results.map((item) => ({
        label: item[columnName],
        value: item[columnName],
      }));
    }
  } catch (error) {
    console.error(
      `Error occurred during GetDistinctValues for ${columnName}:`,
      error,
    );
    throw error;
  }
};
const GetTeacherNames = async () =>
  await GetDistinctValues("teacher", "timetables", "teacher");
const GetSubjectNames = async () =>
  await GetDistinctValues("subject", "timetables", "subject ASC");
const GetTimeSlots = async () =>
  await GetDistinctValues("time_slot", "timetables", "time_slot ASC");
const GetClassRooms = async () =>
  await GetDistinctValues("class_room", "timetables", "class_room ASC");
const GetClassNames = async () =>
  await GetDistinctValues("class_name", "timetables", "class_name ASC");

const GetUsers = async () => {
  try {
    const distinctRegistrationNumbers = await GetDistinctValues(
      "RegistrationNumber",
      "UserCredentials",
      null,
    );

    const usersWithImages = await Promise.all(
      distinctRegistrationNumbers.map(async (user) => {
        const imagePath = await KnexDB("UserCredentials")
          .select("Image")
          .where("RegistrationNumber", user.value)
          .first();
        const image = imagePath?.Image;
        return {
          label: user.label,
          image,
        };
      }),
    );

    return usersWithImages;
  } catch (error) {
    console.error("Error occurred during GetUsers:", error);
    throw error;
  }
};

const GetUserCredentialsByRegistrationNumber = async (RegistrationNumber) => {
  try {
    const userCredentials = await KnexDB("UserCredentials")
      .where("RegistrationNumber", RegistrationNumber)
      .first();
    return userCredentials || null;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};

const GetTeachersSchedule = async (teacher) => {
  try {
    const resultSet = await KnexDB("timetables").where("teacher", teacher)
      .orderByRaw(`
        CASE day
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
        END
      `);
    return resultSet;
  } catch (error) {
    console.error("Error occurred during GetTeachersSchedule:", error);
    throw error;
  }
};

const GetSubjectsSchedule = async (subject) => {
  try {
    const resultSet = await KnexDB("timetables")
      .select("_id", "subject", "teacher", "class_name")
      .where("subject", subject)
      .groupBy("class_name", "teacher")
      .orderBy("teacher");

    return resultSet;
  } catch (error) {
    console.error("Error occurred during GetSubjectsSchedule:", error);
    throw error;
  }
};

const GetTimeslotBasedClassRoomTimetable = async (class_room, time_slot) => {
  try {
    const resultSet = await KnexDB("timetables")
      .where("class_room", class_room)
      .where("time_slot", time_slot).orderByRaw(`
        CASE day
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
        END
      `);

    return resultSet;
  } catch (error) {
    console.error(
      "Error occurred during GetTimeslotBasedClassRoomTimetable:",
      error,
    );
    throw error;
  }
};

const GetDataSyncDate = async (orderBy = "") => {
  try {
    const DataSyncDate = await GetDistinctValues("Date", "SyncDate", orderBy);
    return DataSyncDate.length > 0 ? DataSyncDate[0].value : null;
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};

const GetTimetableByClassName = async (class_name) => {
  try {
    return await KnexDB("timetables")
      .select(
        "_id",
        "class_name",
        "class_room",
        "day",
        "subject",
        "teacher",
        "time_slot",
      )
      .where("class_name", class_name).orderByRaw(`
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
        time_slot
      `);
  } catch (error) {
    console.error("Error occurred during GetTimetableByClassName:", error);
    throw error;
  }
};

const DeleteUserCredentialsFromDB = async (registrationNumber) => {
  try {
    await KnexDB("UserCredentials")
      .where("RegistrationNumber", registrationNumber)
      .del();
  } catch (error) {
    console.error("Error occurred:", error);
    throw error;
  }
};

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

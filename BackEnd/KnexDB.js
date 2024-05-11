import ExpoSQLiteDialect from "@expo/knex-expo-sqlite-dialect";
import Knex from "knex";

export const KnexDB = Knex({
  client: ExpoSQLiteDialect,
  connection: {
    filename: "TimeTable.db",
  },
  useNullAsDefault: true,
});

const createTimetableDataTable = async () => {
  try {
    const hasTable = await KnexDB.schema.hasTable("timetables");
    if (!hasTable) {
      await KnexDB.schema.createTable("timetables", (table) => {
        table.string("_id").primary();
        table.string("class_name");
        table.string("class_room");
        table.string("day");
        table.string("subject");
        table.string("teacher");
        table.string("time_slot");
      });
    }
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

const insertOrUpdateTimetableDataInBatch = async (inputDataArray) => {
  try {
    for (const inputData of inputDataArray) {
      const existingRow = await KnexDB("timetables")
        .where("_id", inputData._id)
        .first();

      if (!existingRow) {
        await KnexDB("timetables").insert({
          _id: inputData._id,
          class_name: inputData.class_name,
          class_room: inputData.class_room,
          day: inputData.day,
          subject: inputData.subject,
          teacher: inputData.teacher,
          time_slot: inputData.time_slot,
        });
      } else {
        await KnexDB("timetables").where("_id", inputData._id).update({
          class_name: inputData.class_name,
          class_room: inputData.class_room,
          day: inputData.day,
          subject: inputData.subject,
          teacher: inputData.teacher,
          time_slot: inputData.time_slot,
        });
      }
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

const createUserCredentialsTable = async () => {
  try {
    const hasTable = await KnexDB.schema.hasTable("UserCredentials");
    if (!hasTable) {
      await KnexDB.schema.createTable("UserCredentials", (table) => {
        table.increments("id").primary();
        table.string("RegistrationNumber");
        table.string("Password");
        table.string("Image");
      });
    }
  } catch (error) {
    console.error("Error creating UserCredentials table:", error);
  }
};

const insertOrUpdateUserCredentials = async (registrationNumber, password) => {
  await createUserCredentialsTable();
  const nothing = "null";
  try {
    const existingRow = await KnexDB("UserCredentials")
      .where("RegistrationNumber", registrationNumber)
      .first();

    if (!existingRow) {
      await KnexDB("UserCredentials").insert({
        RegistrationNumber: registrationNumber,
        Password: password,
        Image: nothing,
      });
    } else {
      await KnexDB("UserCredentials")
        .where("RegistrationNumber", registrationNumber)
        .update({ Password: password });
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

const updateImagePath = async (registrationNumber, imagePath) => {
  try {
    await KnexDB("UserCredentials")
      .where("RegistrationNumber", registrationNumber)
      .update({ Image: imagePath });
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

const clearTimetableTable = async () => {
  try {
    await KnexDB("timetables").truncate();
  } catch (error) {
    console.error("Error clearing data:", error);
  }
};

async function initializeAllDatabasesAndTables() {
  await createTimetableDataTable();
  await createUserCredentialsTable();
}

export {
  initializeAllDatabasesAndTables,
  createTimetableDataTable,
  clearTimetableTable,
  insertOrUpdateUserCredentials,
  createUserCredentialsTable,
  updateImagePath,
  insertOrUpdateTimetableDataInBatch,
};

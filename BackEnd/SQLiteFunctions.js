import * as SQLite from "expo-sqlite";

const TimetableDB = SQLite.openDatabase("TimeTable.db");

const createTimetableDataTable = async () => {
  TimetableDB.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS timetables (
        _id TEXT PRIMARY KEY,
        class_name TEXT,
        class_room TEXT,
        day TEXT,
        subject TEXT,
        teacher TEXT,
        time_slot TEXT
      );`,
      [],
      () => {},
      (error) => {
        console.error("Error creating table:", error);
      }
    );
  });
};

const insertOrUpdateTimetableData = async (inputData) => {
  try {
    TimetableDB.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM timetables WHERE _id = ? LIMIT 1`,
        [inputData._id],
        (_, resultSet) => {
          const rows = resultSet.rows._array;
          if (rows.length === 0) {
            tx.executeSql(
              `INSERT INTO timetables (_id, class_name, class_room, day, subject, teacher, time_slot) VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                inputData._id,
                inputData.class_name,
                inputData.class_room,
                inputData.day,
                inputData.subject,
                inputData.teacher,
                inputData.time_slot,
              ],
              () => null,
              (error) => {
                console.error("Error occurred during insert:", error);
                throw error;
              }
            );
          } else {
            tx.executeSql(
              `UPDATE timetables SET class_name = ?, class_room = ?, day = ?, subject = ?, teacher = ?, time_slot = ? WHERE _id = ?`,
              [
                inputData.class_name,
                inputData.class_room,
                inputData.day,
                inputData.subject,
                inputData.teacher,
                inputData.time_slot,
                inputData._id,
              ],
              () => null,
              (error) => {
                console.error("Error occurred during update:", error);
                throw error;
              }
            );
          }
        },
        (error) => {
          console.error("Error occurred during SELECT:", error);
          throw error;
        }
      );
    });
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

const createDataSyncDateTable = async () => {
  TimetableDB.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS SyncDate (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Date TEXT
      );`,
      [],
      () => {},
      (error) => {
        console.error("Error creating SyncDate table:", error);
      }
    );
  });
};

const insertOrUpdateDataSyncDate = async (inputDate) => {
  await createDataSyncDateTable();
  try {
    TimetableDB.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM SyncDate WHERE id = 1 LIMIT 1`,
        [],
        (_, resultSet) => {
          const rows = resultSet.rows._array;
          if (rows.length === 0) {
            tx.executeSql(
              `INSERT INTO SyncDate (id, Date) VALUES (1, ?)`,
              [inputDate],
              () => null,
              (error) => {
                console.error("Error occurred during date insert:", error);
                throw error;
              }
            );
          } else {
            tx.executeSql(
              `UPDATE SyncDate SET Date = ? WHERE id = 1`,
              [inputDate],
              () => null,
              (error) => {
                console.error("Error occurred during date update:", error);
                throw error;
              }
            );
          }
        },
        (error) => {
          console.error("Error occurred during SELECT:", error);
          throw error;
        }
      );
    });
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

const createUserCredentialsTable = async () => {
  try {
    await TimetableDB.transaction(async (tx) => {
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS UserCredentials (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          RegistrationNumber TEXT,
          Password TEXT,
          Image TEXT
        );`
      );
    });
  } catch (error) {
    console.error("Error creating UserCredentials table:", error);
  }
};

const insertOrUpdateUserCredentials = async (registrationNumber, password) => {
  await createUserCredentialsTable();
  let nothing = "null";
  try {
    TimetableDB.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM UserCredentials WHERE RegistrationNumber = ? LIMIT 1`,
        [registrationNumber],
        (_, resultSet) => {
          const rows = resultSet.rows._array;
          if (rows.length === 0) {
            tx.executeSql(
              `INSERT INTO UserCredentials (RegistrationNumber, Password,Image) VALUES (?, ?,?)`,
              [registrationNumber, password, nothing],
              () => null,
              (error) => {
                console.error(
                  "Error occurred during user credentials insert:",
                  error
                );
                throw error;
              }
            );
          } else {
            tx.executeSql(
              `UPDATE UserCredentials SET Password = ? WHERE RegistrationNumber = ?`,
              [password, registrationNumber],
              () => null,
              (error) => {
                console.error(
                  "Error occurred during user credentials update:",
                  error
                );
                throw error;
              }
            );
          }
        },
        (error) => {
          console.error("Error occurred during SELECT:", error);
          throw error;
        }
      );
    });
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

const updateImagePath = async (registrationNumber, imagePath) => {
  await createUserCredentialsTable();
  try {
    TimetableDB.transaction((tx) => {
      tx.executeSql(
        `UPDATE UserCredentials SET Image = ? WHERE RegistrationNumber = ?`,
        [imagePath, registrationNumber],
        () => null,
        (error) => {
          console.error("Error occurred during image path update:", error);
          throw error;
        }
      );
    });
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

const clearTimetableTable = async () => {
  TimetableDB.transaction((tx) => {
    tx.executeSql(
      `DELETE FROM timetables;`,
      [],
      () => {
        console.log("All data cleared from the timetables table.");
      },
      (error) => {
        console.error("Error clearing data:", error);
      }
    );
  });
};

const clearDataSyncDateTable = async () => {
  TimetableDB.transaction((tx) => {
    tx.executeSql(
      `DELETE FROM SyncDate;`,
      [],
      () => {
        console.log("All data cleared from the timetables table.");
      },
      (error) => {
        console.error("Error clearing data:", error);
      }
    );
  });
};

export {
  insertOrUpdateTimetableData,
  createTimetableDataTable,
  clearTimetableTable,
  createDataSyncDateTable,
  clearDataSyncDateTable,
  insertOrUpdateDataSyncDate,
  insertOrUpdateUserCredentials,
  createUserCredentialsTable,
  updateImagePath,
};

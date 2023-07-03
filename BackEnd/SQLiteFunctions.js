import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("TimeTable.db");

const initializeDatabase = () => {
  db.transaction((tx) => {
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

const insertOrUpdateData = (inputData) => {
  try {
    db.transaction((tx) => {
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

export { insertOrUpdateData, initializeDatabase };

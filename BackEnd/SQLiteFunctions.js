import * as SQLite from "expo-sqlite";

// Function to initialize the database and create the table
const initializeDatabase = () => {
  // Open the database
  const db = SQLite.openDatabase("TimeTable.db");
  // Create the table
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
      () => {
      },
      (error) => {
        console.error("Error creating table:", error);
      }
    );
  });
};

// Function to insert or update data into the table
const insertOrUpdateData = (inputData) => {
  try {
    const db = SQLite.openDatabase("TimeTable.db");
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM timetables WHERE _id = ? LIMIT 1`,
        [inputData._id],
        (_, { rows }) => {
          if (rows.length === 0) {
            // Record doesn't exist, so insert it
            db.transaction((tx) => {
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
                () => {},
                (error) => {
                  throw error;
                }
              );
            });
          } else {
            // Record exists, so update it
            db.transaction((tx) => {
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
                () => {},
                (error) => {
                  throw error;
                }
              );
            });
          }
        },
        (error) => {
          throw error;
        }
      );
    });
  } catch (error) {
    console.error(error);
  }
};

export { insertOrUpdateData, initializeDatabase };

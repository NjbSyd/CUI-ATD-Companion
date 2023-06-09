function FindClassRoomDetails(fullSchedule,roomNo,slot) {
  let data = [];
  fullSchedule=fullSchedule[0];
  console.log(JSON.stringify(fullSchedule))
  if(roomNo === undefined || roomNo === null || roomNo === ""){
    return data;
  }
  for (const className in fullSchedule) {
    for (const classObj of fullSchedule[className]) {
      if (classObj[slot] &&
          classObj[slot]["classRoom"].includes(roomNo)) {
        data.push({className, day: classObj["Day"], time: slot, subject: classObj[slot]["subject"], teacher: classObj[slot]["teacher"], classRoom: classObj[slot]["classRoom"]})
      }
    }
  }
  data = [...new Set(data)]
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  data.sort((a, b) => {
    return weekdays.indexOf(a.day) - weekdays.indexOf(b.day);
  });
  console.log(fullSchedule["BSE 6A"][2]["08:00 to 09:30"]["day"])
  return data;
}

function extractAllSubjects(data) {
  let subjects = [];
  Object.values(data).forEach((week) => {
    week.forEach((day) => {
      Object.values(day).forEach((slot) => {
        if (slot !== null && typeof slot === "object" && "subject" in slot) {
          subjects.push(slot.subject);
        }
      });
    });
  });
  subjects = [...new Set(subjects)]
  return subjects;
}

function extractAllTeachers(data) {
  let teachers = [];
  Object.values(data).forEach((week) => {
    week.forEach((day) => {
      Object.values(day).forEach((slot) => {
        if (slot !== null && typeof slot === "object" && "teacher" in slot) {
          teachers.push(slot.teacher);
        }
      });
    });
  });
  teachers = [...new Set(teachers)]
  return teachers;
}

function noOfClasses(JsonData, reqDay) {
  let no = 0;
  Object.keys(JsonData).map((key, index) => {
    JsonData[key].forEach((day) => {
      if (day.Day === reqDay) {
        Object.values(day).forEach((slot) => {
          if (slot !== null && typeof slot === "object" && "teacher" in slot)
            no++;
        });
      }
    })
  })
  console.log(no)
}

function extractAllClassRooms(data) {
  data=data[0];
  let classRooms = [];
  Object.keys(data).map((ClassNameSemesterSection) => {
    for (const daySchedule of data[ClassNameSemesterSection]) {
        for (const timeSlot in daySchedule) {
        if (daySchedule[timeSlot] !== null && typeof daySchedule[timeSlot] === 'object') {
          const room = daySchedule[timeSlot].classRoom;
          if (room && !classRooms.includes(room)) {
            classRooms.push(room);
          }
        }
      }
    }
  });
  classRooms.sort((a, b) => {
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  });

  classRooms= classRooms.map((classRoom) => {
    return {label: classRoom, value: classRoom};
  });
    return classRooms;
}

export {
  FindClassRoomDetails,
  extractAllSubjects,
  extractAllTeachers,
  noOfClasses,
  extractAllClassRooms,
};


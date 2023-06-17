import { Text, View } from "react-native";

export function List({ data, type }) {
  if (data.length === 0) {
    return <Text>No Record</Text>;
  }

  function renderItemClassroomBased(item) {
    return (
      <View
        key={item._id}
        style={{
          marginVertical: 10,
          borderColor: "black",
          borderRadius: 10,
          borderWidth: 1,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            backgroundColor: "rgb(2, 201, 208)",
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {item.class_name}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.day}</Text>
        </View>
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 16, color: "red" }}>{item.subject}</Text>
          <Text style={{ fontSize: 14 }}>{item.teacher.trim()}</Text>
          <Text style={{ fontSize: 14 }}>{item.class_room}</Text>
          <Text style={{ fontSize: 14 }}>{item.time_slot}</Text>
        </View>
      </View>
    );
  }

  function renderItemTeacherBased(item) {
    return (
      <View
        key={item._id}
        style={{
          marginVertical: 10,
          borderColor: "black",
          borderRadius: 10,
          borderWidth: 1,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            backgroundColor: "rgb(2, 201, 208)",
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {item.class_name}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.day}</Text>
        </View>
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 16, color: "red" }}>{item.subject}</Text>
          <Text style={{ fontSize: 14 }}>{item.class_room}</Text>
          <Text style={{ fontSize: 14 }}>{item.time_slot}</Text>
        </View>
      </View>
    );
  }

  if (type === "Classroom") {
    return data.map((item) => renderItemClassroomBased(item));
  } else if (type === "Teacher") {
    return data.map((item) => renderItemTeacherBased(item));
  } else if (type === "Timetable") {
    return <Text>Not Yet</Text>;
  }
}

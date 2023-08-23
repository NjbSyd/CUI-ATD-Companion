import { Text, View, StyleSheet } from "react-native";

function renderClassroomBasedItem(item) {
  const { _id, class_name, day, subject, teacher, class_room, time_slot } =
    item;

  return (
    <View key={_id} style={styles.outerContainer}>
      <View style={styles.innerTopContainer}>
        <Text style={styles.topBoldText}>{class_name}</Text>
        <Text style={styles.topBoldText}>{day}</Text>
      </View>
      <View style={styles.innerBottomContainer}>
        <Text style={styles.bottomImportantText}>{subject}</Text>
        {teacher && (
          <Text style={styles.bottomNormalText}>{teacher.trim()}</Text>
        )}
        <Text style={styles.bottomNormalText}>{class_room}</Text>
        <Text style={styles.bottomNormalText}>{time_slot}</Text>
      </View>
    </View>
  );
}

function renderTeacherBasedItem(item) {
  const { _id, class_name, day, subject, class_room, time_slot } = item;

  return (
    <View key={_id} style={styles.outerContainer}>
      <View style={styles.innerTopContainer}>
        <Text style={styles.topBoldText}>{class_name}</Text>
        <Text style={styles.topBoldText}>{day}</Text>
      </View>
      <View style={styles.innerBottomContainer}>
        <Text style={styles.bottomImportantText}>{subject}</Text>
        <Text style={styles.bottomNormalText}>{class_room}</Text>
        <Text style={styles.bottomNormalText}>{time_slot}</Text>
      </View>
    </View>
  );
}

function renderSubjectBasedItem(item) {
  const { _id, teacher, subject, class_name } = item;

  return (
    <View key={_id} style={styles.outerContainer}>
      <View style={styles.innerTopContainer}>
        <Text style={styles.topBoldText}>{teacher}</Text>
      </View>
      <View style={styles.innerBottomContainer}>
        <Text style={styles.bottomImportantText}>{subject}</Text>
        <Text style={styles.bottomNormalText}>{class_name}</Text>
      </View>
    </View>
  );
}

export function List({ data, type }) {
  const renderItemMap = {
    Classroom: renderClassroomBasedItem,
    Teacher: renderTeacherBasedItem,
    Subject: renderSubjectBasedItem,
  };

  const renderFunction = renderItemMap[type];

  if (!renderFunction) {
    return <Text>Invalid Type</Text>;
  }

  return data.length === 0 ? <Text>No Record</Text> : data.map(renderFunction);
}

const styles = StyleSheet.create({
  outerContainer: {
    marginVertical: 10,
    borderColor: "#cccccc",
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  innerTopContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#f0f0f0",
    borderBottomColor: "#cccccc",
    borderBottomWidth: 0.5,
    padding: 10,
    elevation: 10,
  },
  innerBottomContainer: {
    padding: 10,
  },
  topBoldText: { fontSize: 18, fontWeight: "bold" },
  bottomImportantText: { fontSize: 16, color: "red" },
  bottomNormalText: {
    fontSize: 16,
  },
});

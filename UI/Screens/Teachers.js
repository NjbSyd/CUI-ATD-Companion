import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { List } from "../Components/List";
import { GetTeachersSchedule } from "../../BackEnd/SQLiteSearchFunctions";
import NoResults from "../Components/NoResults";
import { useSelector } from "react-redux";

export function Teachers() {
  const teachersNames = useSelector((state) => state.TeacherSlice.teacher);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedTeacherData, setSelectedTeacherData] = useState([]);

  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.slotSelector}
        data={teachersNames}
        labelField="label"
        valueField="value"
        onChange={(item) => {
          setSelectedTeacher(item);
          GetTeachersSchedule(item.value).then((res) => {
            setSelectedTeacherData(res);
          });
        }}
        mode={"modal"}
        placeholder={"Select a teacher"}
        value={selectedTeacher}
        search={true}
        searchPlaceholder="Teacher name"
        autoScroll={false}
        inputSearchStyle={{ backgroundColor: "#d1fff6" }}
      />
      {selectedTeacherData.length !== 0 && (
        <Text style={styles.label}> {selectedTeacher.label}'s Schedule</Text>
      )}
      <ScrollView style={styles.scrollView}>
        {selectedTeacherData.length === 0 ? (
          <NoResults />
        ) : (
          <List data={selectedTeacherData} type={"Teacher"} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
  },
  scrollView: {
    width: "80%",
    margin: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    alignSelf: "flex-start",
    marginLeft: "6%",
  },
  slotSelector: {
    width: "90%",
    padding: 10,
    marginTop: 10,
    borderWidth: 0.3,
    borderColor: "#000",
    borderRadius: 5,
  },
});

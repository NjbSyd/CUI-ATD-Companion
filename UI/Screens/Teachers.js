import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { List } from "../Components/List";
import { FloatingButton } from "../Components/ReloadButton";
import { Header } from "../Components/Header";
import { useSelector } from "react-redux";
import {
  GetTeacherNames,
  GetTeachersSchedule,
} from "../../BackEnd/SQLiteSearchFunctions";
import Loading from "../Components/Loading";

export function Teachers({ navigation }) {
  const teachersNames = useSelector((state) => state.teacherNames).teacherNames;
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedTeacherData, setSelectedTeacherData] = useState([]);
  return (
    <View style={styles.container}>
      <Header title={"Teachers"} />
      <Dropdown
        style={styles.slotSelector}
        data={teachersNames}
        labelField="label"
        valueField="value"
        onChange={(item) => {
          console.log(item);
          setSelectedTeacher(item);
          GetTeachersSchedule(item.value).then((res) => {
            setSelectedTeacherData(res);
          });
        }}
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
            <Text style={{
              fontSize: 38,
              fontWeight: "bold",
              alignSelf: "center",
            }}>Nothing Here⛔</Text>
        ) : (
          <List data={selectedTeacherData} type={"Teacher"} />
        )}
      </ScrollView>
      <FloatingButton />
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

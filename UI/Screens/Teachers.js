import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRef, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { List } from "../Components/List";
import { GetTeachersSchedule } from "../../BackEnd/SQLiteSearchFunctions";
import NoResults from "../Components/NoResults";
import { useSelector } from "react-redux";
import { FontAwesome5 } from "@expo/vector-icons";

export function Teachers() {
  const teachersNames = useSelector((state) => state.TeacherSlice.teacher);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedTeacherData, setSelectedTeacherData] = useState([]);
  const dropdownRef = useRef(null);

  const openDropDown = () => {
    setTimeout(() => {
      dropdownRef.current.open();
    }, 100);
  };
  return (
    <View style={styles.container}>
      {selectedTeacher !== null ? (
        <TouchableOpacity
          style={styles.slotSelectorPlaceholder}
          onPress={() => {
            setSelectedTeacher(null);
            setSelectedTeacherData([]);
            openDropDown();
          }}
        >
          <Text style={styles.selectedClassText}>
            {selectedTeacher.label}'s Schedule
          </Text>
          <FontAwesome5 name="edit" size={15} color="#4a6cef" />
        </TouchableOpacity>
      ) : (
        <Dropdown
          ref={dropdownRef}
          style={styles.slotSelector}
          inputSearchStyle={styles.slotSearch}
          containerStyle={styles.slotOptionsContainer}
          keyboardAvoiding={true}
          data={teachersNames}
          labelField="label"
          valueField="value"
          onChange={(item) => {
            setSelectedTeacher(item);
            GetTeachersSchedule(item.value).then((res) => {
              setSelectedTeacherData(res);
            });
          }}
          placeholder={"Select a teacher"}
          value={selectedTeacher}
          search={true}
          searchPlaceholder="Enter a Teacher's name to search"
          autoScroll={false}
        />
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
    width: "90%",
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
    width: "95%",
    padding: 10,
    marginTop: 10,
    borderWidth: 0.3,
    borderColor: "#000",
    borderRadius: 5,
  },
  slotOptionsContainer: {
    borderColor: "#000",
    borderWidth: 0.3,
    borderRadius: 5,
  },
  slotSearch: {
    backgroundColor: "#000",
    color: "#fff",
    letterSpacing: 1,
    borderRadius: 5,
    height: 60,
  },
  slotSelectorPlaceholder: {
    marginVertical: 10,
    width: "auto",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#4a6cef",
    borderStyle: "dashed",
  },
  selectedClassText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    letterSpacing: 1,
    marginRight: 20,
  },
});

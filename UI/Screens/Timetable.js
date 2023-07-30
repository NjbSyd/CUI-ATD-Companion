import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { GetTimetableByClassName } from "../../BackEnd/SQLiteSearchFunctions";
import { Dropdown } from "react-native-element-dropdown";
import { useSelector } from "react-redux";
import { FontAwesome5 } from "@expo/vector-icons";
import { List } from "../Components/List";
import NoResults from "../Components/NoResults";

export default function Timetable() {
  const classNames = useSelector((state) => state.SectionSlice.class_name);
  const [selection, setSelection] = useState(-1);
  const [selectedClassname, setSelectedClassname] = useState(null);
  const [isClassNameSelected, setIsClassNameSelected] = useState(
    selectedClassname !== null
  );
  const [selectedClassData, setSelectedClassData] = useState([]);
  const [selectedClassDayData, setSelectedClassDayData] = useState([]);
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  function handleOnClassChange(item) {
    setSelectedClassname(item);
    setIsClassNameSelected(true);
    GetTimetableByClassName(item.value)
      .then((res) => {
        setSelectedClassData(res);
        filterDayData("Monday");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function filterDayData(day = daysOfWeek[selection]) {
    const dayData = selectedClassData.filter((item) => item.day === day);
    setSelectedClassDayData(dayData);
  }

  return (
    <View style={styles.container}>
      {isClassNameSelected ? (
        <View style={styles.slotSelectorPlaceholder}>
          <Text style={styles.selectedClassText}>
            {selectedClassname.label}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setIsClassNameSelected(false);
              setSelectedClassname(null);
              setSelectedClassData([]);
              setSelectedClassDayData([]);
              setSelection(-1);
            }}
          >
            <FontAwesome5 name="edit" size={15} color="#4a6cef" />
          </TouchableOpacity>
        </View>
      ) : (
        <Dropdown
          style={styles.slotSelector}
          data={classNames}
          labelField="label"
          valueField="value"
          onChange={(item) => {
            handleOnClassChange(item);
          }}
          placeholder={"Select a Class"}
          value={selectedClassname}
          mode={"modal"}
          search={true}
          searchPlaceholder="Class name"
          autoScroll={false}
          inputSearchStyle={{ backgroundColor: "#d1fff6" }}
        />
      )}
      <View style={styles.btnGroup} horizontal={true}>
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.button,
              { backgroundColor: selection === index ? "#000" : "#fff" },
            ]}
            disabled={!isClassNameSelected}
            onPress={() => {
              setSelection(index);
              filterDayData(day);
            }}
          >
            <Text
              style={[
                styles.text,
                {
                  color: isClassNameSelected
                    ? selection === index
                      ? "#fff"
                      : "#000"
                    : "#d1d1d1",
                },
              ]}
            >
              {day.substring(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={styles.scrollView}>
        {selectedClassDayData.length <= 0 ? (
          <NoResults />
        ) : (
          <List data={selectedClassDayData} type={"Classroom"} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignContent: "center",
  },
  btnGroup: {
    flexDirection: "row",
    margin: 5,
    maxHeight: 50,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 5,
    borderWidth: 0.2,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  slotSelector: {
    width: "90%",
    padding: 10,
    marginTop: 10,
    marginLeft: "5%",
    borderWidth: 0.3,
    borderColor: "#000",
    borderRadius: 5,
  },
  slotSelectorPlaceholder: {
    marginVertical: 10,
    width: "30%",
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
  },
  scrollView: {
    maxWidth: "90%",
    margin: 20,
  },
});

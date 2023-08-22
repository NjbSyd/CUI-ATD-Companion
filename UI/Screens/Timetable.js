import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, {useRef, useState} from "react";
import {GetTimetableByClassName} from "../../BackEnd/SQLiteSearchFunctions";
import {Dropdown} from "react-native-element-dropdown";
import {useSelector} from "react-redux";
import {FontAwesome5} from "@expo/vector-icons";
import {List} from "../Components/List";
import NoResults from "../Components/NoResults";
import BannerAds from "../../Ads/BannerAd";

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
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const openDropDown = () => {
    setTimeout(() => {
      dropdownRef.current.open();
    }, 100);
  };

  const clickOnMonday = () => {
    if (buttonRef.current)
      buttonRef.current._internalFiberInstanceHandleDEV.memoizedProps.onClick()
  }

  function handleOnClassChange(item) {
    setSelectedClassname(item);
    setIsClassNameSelected(true);
    GetTimetableByClassName(item.value)
    .then((res) => {
      setSelectedClassData(res);
      clickOnMonday()
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
            <>
              <TouchableOpacity
                  style={styles.slotSelectorPlaceholder}
                  onPress={() => {
                    setIsClassNameSelected(false);
                    setSelectedClassname(null);
                    setSelectedClassData([]);
                    setSelectedClassDayData([]);
                    setSelection(-1);
                    openDropDown();
                  }}
              >
                <Text style={styles.selectedClassText}>
                  {selectedClassname.label} TimeTable
                </Text>

                <FontAwesome5 name="edit" size={15} color="#4a6cef"/>
              </TouchableOpacity>
              <View style={styles.btnGroup} horizontal={true}>
                {daysOfWeek.map((day, index) => (
                    <TouchableOpacity
                        key={day}
                        ref={(ref) => {
                          if (index === 0) {
                            buttonRef.current = ref
                          }
                        }}
                        style={[
                          styles.button,
                          {backgroundColor: selection === index ? "#000" : "#fff"},
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
            </>
        ) : (
             <Dropdown
                 ref={dropdownRef}
                 style={styles.slotSelector}
                 inputSearchStyle={styles.slotSearch}
                 containerStyle={styles.slotOptionsContainer}
                 keyboardAvoiding={true}
                 data={classNames}
                 labelField="label"
                 valueField="value"
                 onChange={(item) => {
                   handleOnClassChange(item);
                 }}
                 placeholder={"Select a Class"}
                 value={selectedClassname}
                 search={true}
                 searchPlaceholder="Enter a Class name to search"
                 autoScroll={false}
             />
         )}

        <ScrollView style={styles.scrollView}>
          {isClassNameSelected ? (
              selection <= -1 ? (
                  <Text style={styles.requestText}>
                    Select a day to view timetable
                  </Text>
              ) : selectedClassDayData.length > 0 ? (
                  <List data={selectedClassDayData} type={"Classroom"}/>
              ) : (
                      <NoResults/>
                  )
          ) : (
               <NoResults/>
           )}
        </ScrollView>
        <BannerAds/>
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
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowOffset: {width: 0, height: 2},
    shadowColor: "#000",
    shadowOpacity: 0.2,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
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
  scrollView: {
    maxWidth: "90%",
    margin: 20,
    maxHeight: "80%",
  },
  slotSelector: {
    alignSelf: "center",
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
  requestText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
});

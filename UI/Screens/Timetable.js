import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Keyboard,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";

import { fetchDataFromSQLite } from "../../BackEnd/DataHandlers/FrontEndDataHandler";
import { GetTimetableByClassName } from "../../BackEnd/SQLiteSearchFunctions";
import { TimetableDayButton } from "../Components/DayButton";
import { List } from "../Components/List";
import NoResults from "../Components/NoResults";
import NoSelection from "../Components/NoSelection";
import Theme from "../Constants/Theme";

export default function Timetable() {
  const classNames = useSelector((state) => state.SectionSlice.class_name);
  const [selection, setSelection] = useState(-1);
  const [selectedClassname, setSelectedClassname] = useState(null);
  const [isClassNameSelected, setIsClassNameSelected] = useState(
    selectedClassname !== null,
  );
  const [selectedClassData, setSelectedClassData] = useState([]);
  const [selectedClassDayData, setSelectedClassDayData] = useState([]);
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  // eslint-disable-next-line no-unused-vars
  const [_, setIsKeyboardOpen] = useState(false);
  const dropdownRef = useRef(null);
  const Dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem("className")
      .then((item) => {
        if (item) {
          const itemJSON = JSON.parse(item);
          handleOnClassChange(itemJSON, true).then(() => null);
        }
      })
      .catch(() => {});

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardOpen(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardOpen(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  useEffect(() => {
    setSelection(0);
    filterDayData("Monday");
  }, [selectedClassData]);

  async function handleOnClassChange(item, selfCall = false) {
    try {
      setSelectedClassname(item);
      setIsClassNameSelected(true);
      const result = await GetTimetableByClassName(item.value);
      setSelectedClassData(result);
      if (!selfCall) {
        await AsyncStorage.setItem("className", JSON.stringify(item));
      }
    } catch (e) {
      console.error(e);
    }
  }

  function filterDayData(day = "Monday") {
    const dayData = selectedClassData.filter((item) => item.day === day);
    setSelectedClassDayData(dayData);
  }

  return (
    <ScrollView
      scrollEnabled={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          enabled={selectedClassData.length <= 0}
          progressBackgroundColor="#5a6e98"
          progressViewOffset={10}
          colors={["#fff"]}
          onRefresh={() => {
            fetchDataFromSQLite(Dispatch, ["sections"])
              .then(() => {
                setRefreshing(false);
              })
              .catch((err) => {
                console.log(
                  "Classroom.js: Error fetching data from SQLite:",
                  err,
                );
              });
          }}
        />
      }
      contentContainerStyle={styles.container}
    >
      <Dropdown
        ref={dropdownRef}
        style={styles.DropdownStyle}
        inputSearchStyle={styles.Dropdown_InputSearchStyle}
        containerStyle={styles.Dropdown_OptionsContainerStyle}
        itemContainerStyle={styles.Dropdown_ItemContainerStyle}
        keyboardAvoiding
        data={classNames}
        labelField="label"
        valueField="value"
        onChange={handleOnClassChange}
        placeholder="Select a Class"
        renderRightIcon={() => (
          <FontAwesome name="caret-down" size={24} color="black" />
        )}
        value={selectedClassname}
        search
        searchPlaceholder="Enter a Class name to search"
        autoScroll={false}
      />
      {isClassNameSelected && (
        <View style={styles.DayButtonContainer} horizontal>
          {daysOfWeek.map((day, index) =>
            TimetableDayButton(
              day,
              index,
              setSelection,
              filterDayData,
              isClassNameSelected,
              selection,
              styles,
            ),
          )}
        </View>
      )}

      <ScrollView style={styles.ResultScrollView}>
        {isClassNameSelected ? (
          selection <= -1 ? (
            <NoSelection message="Select a day to view timetable" />
          ) : selectedClassDayData.length > 0 ? (
            <List data={selectedClassDayData} type="Classroom" />
          ) : (
            <NoResults message={`No Classes On ${daysOfWeek[selection]}`} />
          )
        ) : (
          <NoSelection message="Pick A Class" />
        )}
      </ScrollView>
      {/*<View*/}
      {/*  style={{*/}
      {/*    display: isKeyboardOpen ? "none" : "flex",*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <BannerAds />*/}
      {/*</View>*/}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  DayButtonContainer: {
    width: Theme.ScreenWidth,
    flexDirection: "row",
    marginVertical: Theme.ScreenHeight * 0.01,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  DayButton: {
    width: Theme.ScreenWidth * 0.13,
    aspectRatio: 1,
    borderRadius: Theme.ScreenWidth * 0.025,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#000",
    shadowOpacity: 0.2,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
  },
  ResultScrollView: {
    width: "90%",
    marginHorizontal: Theme.ScreenWidth * 0.05,
    marginBottom: Theme.ScreenHeight * 0.01,
    maxHeight: Theme.ScreenHeight * 0.9,
  },
  Dropdown_OptionsContainerStyle: {
    borderColor: "#000",
    borderWidth: 0.3,
    borderRadius: 5,
    marginTop: -Theme.ScreenWidth * 0.15,
    maxHeight: "90%",
  },
  Dropdown_InputSearchStyle: {
    color: "#000",
    letterSpacing: 1,
    borderRadius: 5,
    height: 60,
    backgroundColor: "#eae7e7",
  },
  Dropdown_ItemContainerStyle: {
    borderColor: "#d7d4d4",
    borderBottomWidth: 0.3,
  },
  DropdownStyle: {
    marginVertical: 10,
    width: Theme.ScreenWidth * 0.9,
    borderWidth: 1,
    borderColor: "#4a6cef",
    borderStyle: "dashed",
    backgroundColor: "#f0f0f0",
    borderRadius: Theme.ScreenWidth * 0.02,
    paddingHorizontal: Theme.ScreenWidth * 0.05,
    paddingVertical: Theme.ScreenHeight * 0.015,
    elevation: 5,
  },
});

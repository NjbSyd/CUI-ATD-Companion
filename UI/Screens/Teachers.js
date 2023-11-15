import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";

import { fetchDataFromSQLite } from "../../BackEnd/DataHandlers/FrontEndDataHandler";
import { GetTeachersSchedule } from "../../BackEnd/SQLiteSearchFunctions";
import { List } from "../Components/List";
import NoResults from "../Components/NoResults";
import NoSelection from "../Components/NoSelection";
import Theme from "../Constants/Theme";

export function Teachers() {
  const teachersNames = useSelector((state) => state.TeacherSlice.teacher);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedTeacherData, setSelectedTeacherData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const dropdownRef = useRef(null);
  const StateDispatcher = useDispatch();
  // const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     "keyboardDidShow",
  //     () => {
  //       setIsKeyboardOpen(true);
  //     },
  //   );
  //
  //   const keyboardDidHideListener = Keyboard.addListener(
  //     "keyboardDidHide",
  //     () => {
  //       setIsKeyboardOpen(false);
  //     },
  //   );
  //
  //   return () => {
  //     keyboardDidShowListener.remove();
  //     keyboardDidHideListener.remove();
  //   };
  // }, []);
  useEffect(() => {}, [teachersNames]);

  function handleOnChange(item) {
    setSelectedTeacher(item);
    GetTeachersSchedule(item.value).then((res) => {
      setSelectedTeacherData(res);
    });
  }

  return (
    <ScrollView
      scrollEnabled={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          enabled={selectedTeacherData.length <= 0}
          progressBackgroundColor="#5a6e98"
          colors={["#fff"]}
          progressViewOffset={10}
          onRefresh={() => {
            fetchDataFromSQLite(StateDispatcher, ["teachers"])
              .then(() => {
                console.log("Teachers.js: Data fetched from SQLite");
                setRefreshing(false);
              })
              .catch((err) => {
                console.log(
                  "Teachers.js: Error fetching data from SQLite:",
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
        data={teachersNames}
        labelField="label"
        valueField="value"
        onChange={handleOnChange}
        placeholder="Select a teacher"
        value={selectedTeacher}
        renderRightIcon={() => (
          <FontAwesome name="caret-down" size={24} color="black" />
        )}
        search
        searchPlaceholder="Enter a Teacher's name to search"
        autoScroll={false}
      />
      <ScrollView style={styles.ResultScrollView}>
        {selectedTeacherData.length === 0 ? (
          selectedTeacher !== null ? (
            <NoResults />
          ) : (
            <NoSelection message="Select a Teacher to view Schedule" />
          )
        ) : (
          <List data={selectedTeacherData} type="Teacher" />
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: Theme.ScreenWidth,
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

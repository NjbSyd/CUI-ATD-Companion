import { FontAwesome } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";

import { fetchDataFromSQLite } from "../../BackEnd/DataHandlers/FrontEndDataHandler";
import { GetSubjectsSchedule } from "../../BackEnd/SQLiteSearchFunctions";
import { List } from "../Components/List";
import NoResults from "../Components/NoResults";
import NoSelection from "../Components/NoSelection";
import Theme from "../Constants/Theme";

export function Subjects() {
  const subjectNames = useSelector((state) => state.SubjectSlice.subject);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSubjectData, setSelectedSubjectData] = useState([]);
  const dropdownRef = useRef(null);
  const Dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  return (
    <ScrollView
      scrollEnabled={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          enabled={selectedSubjectData.length <= 0}
          progressBackgroundColor="#5a6e98"
          colors={["#fff"]}
          progressViewOffset={10}
          onRefresh={() => {
            fetchDataFromSQLite(Dispatch, ["subjects"])
              .then(() => {
                setRefreshing(false);
              })
              .catch((err) => {
                console.log(
                  "Subjects.js: Error fetching data from SQLite:",
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
        data={subjectNames}
        labelField="label"
        valueField="value"
        renderRightIcon={() => (
          <FontAwesome name="caret-down" size={24} color="black" />
        )}
        onChange={(item) => {
          setSelectedSubject(item);
          GetSubjectsSchedule(item.value).then((res) => {
            setSelectedSubjectData(res);
          });
        }}
        placeholder="Select a Subject"
        value={selectedSubject}
        search
        searchPlaceholder="Enter a Subject name to search"
        autoScroll={false}
      />
      <ScrollView style={styles.ResultScrollView}>
        {selectedSubjectData.length === 0 ? (
          selectedSubject !== null ? (
            <NoResults />
          ) : (
            <NoSelection message="Select a Subject" />
          )
        ) : (
          <List data={selectedSubjectData} type="Subject" />
        )}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
  },
  ResultScrollView: {
    width: Theme.ScreenWidth * 0.9,
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

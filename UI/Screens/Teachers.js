import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { List } from "../Components/List";
import { GetTeachersSchedule } from "../../BackEnd/SQLiteSearchFunctions";
import NoResults from "../Components/NoResults";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome5 } from "@expo/vector-icons";
import BannerAds from "../../Ads/BannerAd";
import { fetchDataFromSQLite } from "../../BackEnd/DataHandlers/FrontEndDataHandler";
import NoSelection from "../Components/NoSelection";

export function Teachers() {
  const teachersNames = useSelector((state) => state.TeacherSlice.teacher);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedTeacherData, setSelectedTeacherData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const dropdownRef = useRef(null);
  const StateDispatcher = useDispatch();
  useEffect(() => {}, [teachersNames]);
  const openDropDown = () => {
    setTimeout(() => {
      dropdownRef.current.open();
    }, 100);
  };
  return (
    <ScrollView
      scrollEnabled={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          enabled={selectedTeacherData.length <= 0}
          progressBackgroundColor={"#5a6e98"}
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
                  err
                );
              });
          }}
        />
      }
      contentContainerStyle={styles.container}
    >
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
          selectedTeacher !== null ? (
            <NoResults />
          ) : (
            <NoSelection message={"Select a Teacher to view Schedule"} />
          )
        ) : (
          <List data={selectedTeacherData} type={"Teacher"} />
        )}
      </ScrollView>
      <BannerAds />
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
  scrollView: {
    width: "90%",
    margin: 20,
    maxHeight: "80%",
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

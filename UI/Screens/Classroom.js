import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";

import { fetchDataFromSQLite } from "../../BackEnd/DataHandlers/FrontEndDataHandler";
import { GetTimeslotBasedClassRoomTimetable } from "../../BackEnd/KnexDB_Search";
import { List } from "../Components/List";
import LoadingPopup from "../Components/Loading";
import NoResults from "../Components/NoResults";
import NoSelection from "../Components/NoSelection";
import Theme from "../Constants/Theme";
import { fakeSleep } from "../Functions/UIHelpers";

export function Classroom() {
  const rooms = useSelector((state) => state.ClassRoomSlice.classRoom);
  const timeslots = useSelector((state) => state.TimeslotSlice.timeSlot);
  const [resultingData, setResultingData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
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
  useEffect(() => {}, [rooms, timeslots, resultingData]);
  useEffect(() => {
    trySearch();
  }, [selectedRoom, selectedTimeSlot]);

  function trySearch() {
    if (selectedTimeSlot === null || selectedRoom === null) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    setResultingData([]);
    GetTimeslotBasedClassRoomTimetable(selectedRoom, selectedTimeSlot)
      .then(async (res) => {
        await fakeSleep(200);
        setResultingData(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsSearching(false);
      });
  }

  return (
    <ScrollView
      scrollEnabled={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          enabled={resultingData.length <= 0}
          progressBackgroundColor="#5a6e98"
          colors={["#fff"]}
          progressViewOffset={10}
          onRefresh={() => {
            fetchDataFromSQLite(StateDispatcher, ["classRooms", "timeSlots"])
              .then(() => {
                setRefreshing(false);
              })
              .catch((err) => {
                console.error(
                  "Classroom.js: Error fetching data from SQLite:",
                  err,
                );
              });
          }}
        />
      }
      contentContainerStyle={styles.container}
    >
      <View style={styles.selectorContainer}>
        <Dropdown
          ref={dropdownRef}
          style={styles.selectorView}
          containerStyle={styles.selectorList}
          itemContainerStyle={styles.itemContainerStyle}
          data={timeslots}
          labelField="label"
          valueField="value"
          onChange={(item) => {
            const previouslySelectedTimeSlot = selectedTimeSlot;
            setSelectedTimeSlot(item.value);
            if (item.value === previouslySelectedTimeSlot) {
              trySearch();
            }
          }}
          renderRightIcon={() => (
            <FontAwesome name="caret-down" size={24} color="black" />
          )}
          value={selectedTimeSlot}
          mode="modal"
          autoScroll={false}
          placeholder="Timeslot..."
          inputSearchStyle={{ backgroundColor: "#d1fff6" }}
        />
        <Dropdown
          style={styles.selectorView}
          containerStyle={styles.selectorList}
          inputSearchStyle={styles.slotSearch}
          itemContainerStyle={styles.itemContainerStyle}
          keyboardAvoiding
          data={rooms}
          mode="modal"
          labelField="label"
          valueField="value"
          onChange={(item) => {
            const previouslySelectedRoom = selectedRoom;
            setSelectedRoom(item.value);
            if (item.value === previouslySelectedRoom) {
              trySearch();
            }
          }}
          renderRightIcon={() => (
            <FontAwesome name="caret-down" size={24} color="black" />
          )}
          value={selectedRoom}
          search
          autoScroll={false}
          placeholder="Room#..."
          searchPlaceholder="Enter a room number to search"
        />
      </View>
      <ScrollView style={styles.ResultScrollView}>
        {resultingData.length === 0 ? (
          selectedRoom !== null && selectedTimeSlot !== null && !isSearching ? (
            <NoResults
              message={`No Classes Found in Room: ${selectedRoom} at Time: ${selectedTimeSlot} `}
            />
          ) : (
            !isSearching && (
              <NoSelection
                message={`Choose a ${selectedRoom === null ? "Room No" : ""}${
                  !selectedRoom && !selectedTimeSlot ? " & " : ""
                }${selectedTimeSlot === null ? "TimeSlot" : ""}`}
              />
            )
          )
        ) : (
          <List data={resultingData} type="Classroom" />
        )}
      </ScrollView>
      <LoadingPopup text="Searching..." visible={isSearching} />
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
    width: "90%",
    marginHorizontal: Theme.ScreenWidth * 0.05,
    marginBottom: Theme.ScreenHeight * 0.01,
    maxHeight: Theme.ScreenHeight * 0.9,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    alignSelf: "flex-start",
    marginLeft: "6%",
  },
  selectorView: {
    marginVertical: 10,
    width: Theme.ScreenWidth * 0.45,
    borderWidth: 1,
    borderColor: "#4a6cef",
    borderStyle: "dashed",
    backgroundColor: "#f0f0f0",
    borderRadius: Theme.ScreenWidth * 0.02,
    paddingHorizontal: Theme.ScreenWidth * 0.025,
    paddingVertical: Theme.ScreenHeight * 0.015,
    elevation: 5,
  },
  selectorList: {
    width: Theme.ScreenWidth * 0.75,
    maxHeight: Theme.ScreenHeight * 0.6,
    padding: 10,
    borderWidth: 0.3,
    borderColor: "#000",
    borderRadius: 5,
  },
  selectorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "95%",
  },
  slotSearch: {
    color: "#000",
    letterSpacing: 1,
    borderRadius: 5,
    height: 60,
    backgroundColor: "#eae7e7",
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

  itemContainerStyle: {
    borderColor: "#d7d4d4",
    borderBottomWidth: 0.3,
  },
});

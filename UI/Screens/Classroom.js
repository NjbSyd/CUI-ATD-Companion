import { Dropdown } from "react-native-element-dropdown";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { List } from "../Components/List";
import LoadingPopup from "../Components/Loading";
import { GetTimeslotBasedClassRoomTimetable } from "../../BackEnd/SQLiteSearchFunctions";
import NoResults from "../Components/NoResults";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome5 } from "@expo/vector-icons";
import BannerAds from "../../Ads/BannerAd";
import { fetchDataFromSQLite } from "../../BackEnd/DataHandlers/FrontEndDataHandler";
import NoSelection from "../Components/NoSelection";

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
  useEffect(() => {}, [rooms, timeslots, resultingData]);
  useEffect(() => {
    trySearch();
  }, [selectedRoom, selectedTimeSlot]);
  const openDropDown = () => {
    setTimeout(() => {
      dropdownRef.current.open();
    }, 100);
  };
  function trySearch() {
    if (selectedTimeSlot === null || selectedRoom === null) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    setResultingData([]);
    GetTimeslotBasedClassRoomTimetable(selectedRoom, selectedTimeSlot)
      .then((res) => {
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
          progressBackgroundColor={"#5a6e98"}
          colors={["#fff"]}
          progressViewOffset={10}
          onRefresh={() => {
            fetchDataFromSQLite(StateDispatcher, ["classRooms", "timeSlots"])
              .then(() => {
                setRefreshing(false);
              })
              .catch((err) => {
                console.log(
                  "Classroom.js: Error fetching data from SQLite:",
                  err
                );
              });
          }}
        />
      }
      contentContainerStyle={styles.container}
    >
      {resultingData.length > 0 ? (
        <TouchableOpacity
          style={styles.slotSelectorPlaceholder}
          onPress={() => {
            setResultingData([]);
            setSelectedTimeSlot(null);
            openDropDown();
          }}
        >
          <Text style={styles.selectedClassText}>
            Classroom: {selectedRoom + "\n"}Timeslot: {selectedTimeSlot}
          </Text>
          <FontAwesome5 name="edit" size={15} color="#4a6cef" />
        </TouchableOpacity>
      ) : (
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
              const previoslySelectedTimeSlot = selectedTimeSlot;
              setSelectedTimeSlot(item.value);
              if (item.value === previoslySelectedTimeSlot) {
                trySearch();
              }
            }}
            value={selectedTimeSlot}
            mode={"modal"}
            autoScroll={false}
            placeholder={"Timeslot..."}
            inputSearchStyle={{ backgroundColor: "#d1fff6" }}
          />
          <Dropdown
            style={styles.selectorView}
            containerStyle={styles.selectorList}
            inputSearchStyle={styles.slotSearch}
            itemContainerStyle={styles.itemContainerStyle}
            keyboardAvoiding={true}
            data={rooms}
            mode={"modal"}
            labelField="label"
            valueField="value"
            onChange={(item) => {
              const previoslySelectedRoom = selectedRoom;
              setSelectedRoom(item.value);
              if (item.value === previoslySelectedRoom) {
                trySearch();
              }
            }}
            value={selectedRoom}
            search={true}
            autoScroll={false}
            placeholder={"Room#..."}
            searchPlaceholder={"Enter a room number to search"}
          />
        </View>
      )}
      <ScrollView style={styles.scrollView}>
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
          <List data={resultingData} type={"Classroom"} />
        )}
      </ScrollView>
      <LoadingPopup text={"Searching..."} visible={isSearching} />
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
    maxHeight: "80%",
    margin: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    alignSelf: "flex-start",
    marginLeft: "6%",
  },
  selectorView: {
    width: "45%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 0.3,
    borderColor: "#000",
    borderRadius: 5,
    marginRight: 10,
  },
  selectorList: {
    width: "200%",
    padding: 10,
    marginTop: "65%",
    marginBottom: "65%",
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
  selectedClassText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    letterSpacing: 1,
    marginRight: 10,
  },
  itemContainerStyle: {
    borderColor: "#d7d4d4",
    borderBottomWidth: 0.3,
  },
});

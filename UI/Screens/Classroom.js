import {Dropdown} from "react-native-element-dropdown";
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import MagnifierButton from "../Components/SearchButton";
import {useRef, useState} from "react";
import {List} from "../Components/List";
import Loading from "../Components/Loading";
import {GetTimeslotBasedClassRoomTimetable} from "../../BackEnd/SQLiteSearchFunctions";
import NoResults from "../Components/NoResults";
import {useSelector} from "react-redux";
import {FontAwesome5} from "@expo/vector-icons";
import BannerAds from "../../Ads/BannerAd";

export function Classroom() {
  const rooms = useSelector((state) => state.ClassRoomSlice.classRoom);
  const timeslots = useSelector((state) => state.TimeslotSlice.timeSlot);
  const [resultingData, setResultingData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const dropdownRef = useRef(null);

  const openDropDown = () => {
    setTimeout(() => {
      dropdownRef.current.open();
    }, 100);
  };

  function searchButtonOnPress() {
    setIsSearching(true);
    if (selectedTimeSlot === null || selectedRoom === null) {
      setIsSearching(false);
      Alert.alert("Invalid Input", "Please select a room and a time slot");
      return;
    }
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
      <View style={styles.container}>
        {resultingData.length > 0 ? (
            <TouchableOpacity
                style={styles.slotSelectorPlaceholder}
                onPress={() => {
                  setSelectedTimeSlot(null);
                  setSelectedRoom(null);
                  setResultingData([]);
                  openDropDown();
                }}
            >
              <Text style={styles.selectedClassText}>
                Classroom: {selectedRoom + "\n"}Timeslot: {selectedTimeSlot}
              </Text>
              <FontAwesome5 name="edit" size={15} color="#4a6cef"/>
            </TouchableOpacity>
        ) : (
             <View style={styles.selectorContainer}>
               <Dropdown
                   ref={dropdownRef}
                   style={styles.selectorView}
                   containerStyle={styles.selectorList}
                   data={timeslots}
                   labelField="label"
                   valueField="value"
                   onChange={(item) => {
                     setSelectedTimeSlot(item.value);
                   }}
                   value={selectedTimeSlot}
                   mode={"modal"}
                   autoScroll={false}
                   placeholder={"Timeslot..."}
                   inputSearchStyle={{backgroundColor: "#d1fff6"}}
               />
               <Dropdown
                   style={styles.selectorView}
                   containerStyle={styles.selectorList}
                   inputSearchStyle={styles.slotSearch}
                   keyboardAvoiding={true}
                   data={rooms}
                   mode={"modal"}
                   labelField="label"
                   valueField="value"
                   onChange={(item) => {
                     setSelectedRoom(item.value);
                   }}
                   value={selectedRoom}
                   search={true}
                   autoScroll={false}
                   placeholder={"Room#..."}
                   searchPlaceholder={"Enter a room number to search"}
               />
               <MagnifierButton onPress={searchButtonOnPress}/>
             </View>
         )}
        <ScrollView style={styles.scrollView}>
          {resultingData.length === 0 ? (
              <NoResults/>
          ) : (
               <List data={resultingData} type={"Classroom"}/>
           )}
        </ScrollView>
        {isSearching && <Loading/>}
        <BannerAds/>
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    letterSpacing: 1,
    marginRight: 10,
  },
});

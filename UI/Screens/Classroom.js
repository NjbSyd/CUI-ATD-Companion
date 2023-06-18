import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import MagnifierButton from "../Components/SearchButton";
import { useEffect, useState } from "react";
import { List } from "../Components/List";
import { Header } from "../Components/Header";
import Loading from "../Components/Loading";
import {
  GetClassRooms,
  GetTimeslotBasedClassRoomTimetable,
  GetTimeSlots,
} from "../../BackEnd/SQLiteSearchFunctions";

export function Classroom() {
  useEffect(() => {
    GetDropDownPlaceholders().then(() => {});
  }, []);

  const [timeslots, setTimeSlots] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [resultingData, setResultingData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  function searchButtonOnPress() {
    setIsSearching(true);
    if (selectedTimeSlot === null || selectedRoom === null) {
      setIsSearching(false);
      Alert.alert("Please select a timeslot and a room");
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

  const GetDropDownPlaceholders = async () => {
    setIsSearching(true);
    try {
      const receivedRooms = await GetClassRooms();
      setRooms(receivedRooms);
      const receivedTimeslots = await GetTimeSlots();
      setTimeSlots(receivedTimeslots);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };
  return (
    <View style={styles.container}>
      <Header title={"Classroom"} />
      <View style={styles.selectorContainer}>
        <Dropdown
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
          inputSearchStyle={{ backgroundColor: "#d1fff6" }}
        />
        <Dropdown
          style={styles.selectorView}
          containerStyle={styles.selectorList}
          data={rooms}
          labelField="label"
          valueField="value"
          onChange={(item) => {
            setSelectedRoom(item.value);
          }}
          value={selectedRoom}
          search={true}
          mode={"modal"}
          autoScroll={false}
          placeholder={"Room#..."}
          inputSearchStyle={{ backgroundColor: "#d1fff6" }}
        />
        <MagnifierButton onPress={searchButtonOnPress} />
      </View>
      {resultingData.length !== 0 && <Text style={styles.label}>Classes</Text>}
      <ScrollView style={styles.scrollView}>
        {resultingData.length === 0 ? (
          <Text
            style={{
              fontSize: 38,
              fontWeight: "bold",
              alignSelf: "center",
            }}
          >
            Nothing Here⛔
          </Text>
        ) : (
          <List data={resultingData} type={"Classroom"} />
        )}
      </ScrollView>
      {isSearching && <Loading />}
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
    width: "80%",
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
    width: "40%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 0.3,
    borderColor: "#000",
    borderRadius: 5,
  },
  selectorList: {
    width: "200%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 0.3,
    borderColor: "#000",
    borderRadius: 5,
  },
  selectorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
});

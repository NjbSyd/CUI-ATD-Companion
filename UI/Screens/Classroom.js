import {Image, ScrollView, StyleSheet, Text, ToastAndroid, View} from "react-native";
import {Dropdown} from "react-native-element-dropdown";
import MagnifierButton from "../Components/SearchButton";
import {useEffect, useState} from "react";
import {getClassRooms, getTimeslots, refetchAllDataFromFB} from "../../BackEnd/FBFunctions";
import Loading from "../Components/Loading";
import {checkInKeys, getData} from "../../BackEnd/AsyncStorageFX";
import {List} from "../Components/List";
import {FloatingButton} from "../Components/ReloadButton";

export function Classroom() {
  const [reload, setReload] = useState(false);
  useEffect(() => {
    FetchTimeSlotsAndClassRooms().then(() => {
      setSelectedRoom(null)
      setSelectedTimeSlot(null)
    });
    setReload(false)
  }, [reload]);

  async function FetchTimeSlotsAndClassRooms() {
    try {
      setIsLoading(true)
      let classRoomsFoundInAsync = await checkInKeys("classRoomNames");
      if (classRoomsFoundInAsync) {
        let classRooms = await getData("classRoomNames");
        setRooms(classRooms)
      } else {
        await getClassRooms().then((data) => {
          setRooms(data)
        }).catch(() => {
          alert("Server Error! Please restart app & try again.")
        });
      }

      let timeslotsFoundInAsync = await checkInKeys("timeslots");
      if (timeslotsFoundInAsync) {
        let timeslots = await getData("timeslots");
        setTimeslots(timeslots)
      } else {
        await getTimeslots().then((data) => {
          setTimeslots(data)
        }).catch(() => {
          alert("Server Error! Please restart app & try again.")
        });
      }

      //Timetable data is already fetched in getClassRooms()
      // if classRooms are found in async storage then timetable data is also found
      await getData("timetableData").then((data) => {
        setTimeTable(data);
      }).catch((error) => {
        alert("Your Internet Connection is not stable. Please restart app & try again.")
      });
      setIsLoading(false)
    } catch (e) {
      alert(e)
    }
  }

  async function search() {
    setIsSearching(true);
    if (selectedRoom === null || selectedTimeSlot === null) {
      alert("Please! Select Room# & Timeslot before searching.")
      setIsSearching(false)
      return;
    }
    let resultingData = [];
    Object.keys(timeTable).forEach((classKey) => {
      let classAndSection = timeTable[classKey];// BSE 6A
      Object.keys(classAndSection).forEach((dayKey) => {
        let day = classAndSection[dayKey];
        Object.keys(day).forEach((timeSlotKey) => {
          let timeSlot = day[timeSlotKey];
          if (timeSlot.classRoom === selectedRoom && timeSlotKey === selectedTimeSlot) {
            resultingData.push({
              className: classKey,
              day: dayKey,
              subject: timeSlot.subject,
              teacher: timeSlot.teacher,
              classRoom: timeSlot.classRoom,
              time: timeSlotKey
            })
          }
        });
      });
    });
    const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
    resultingData = resultingData.sort((a, b) => {
      const dayA = a.day.toUpperCase();
      const dayB = b.day.toUpperCase();
      if (days.indexOf(dayA) > days.indexOf(dayB)) {
        return 1;
      } else if (days.indexOf(dayA) < days.indexOf(dayB)) {
        return -1;
      } else {
        return 0;
      }
    });
    setResultingData(resultingData)
    setIsSearching(false);
  }

  const [resultingData, setResultingData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeslots, setTimeslots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [timeTable, setTimeTable] = useState();
  return (
      <View style={styles.container}>
        <View style={styles.selectorContainer}>
          <Dropdown style={styles.selectorView} containerStyle={styles.selectorList} data={timeslots} labelField="label"
                    valueField="value"
                    onChange={(item) => {
                      setSelectedTimeSlot(item.value)
                    }}
                    value={selectedTimeSlot}
                    mode={"modal"}
                    autoScroll={false}
                    placeholder={"Timeslot..."}
                    inputSearchStyle={{backgroundColor:"#d1fff6"}}
          />
          <Dropdown style={styles.selectorView} containerStyle={styles.selectorList} data={rooms} labelField="label"
                    valueField="value"
                    onChange={(item) => {
                      setSelectedRoom(item.value)
                    }}
                    value={selectedRoom}
                    search={true}
                    mode={"modal"}
                    autoScroll={false}
                    placeholder={"Room#..."}
                    inputSearchStyle={{backgroundColor:"#d1fff6"}}
          />
          <MagnifierButton onPress={() => search()}/>
        </View>
        <Text style={styles.label}>Classes</Text>
        <ScrollView style={styles.scrollView}>
          {resultingData.length === 0 ? <Image source={require('../../assets/noresults.png')} style={{
                                        width: "100%",
                                        height: 400,
                                        alignSelf: 'center',
                                        resizeMode: 'contain',
                                      }}/> :
           <List data={resultingData} type={"Classroom"}/>}
        </ScrollView>
        <Loading visible={isSearching}/>
        <Loading visible={isLoading}/>
        <FloatingButton onPressLocal={() => setReload(true)} onPressCloud={async () => {
          ToastAndroid.show("Fetching data from server...", ToastAndroid.SHORT);
          setIsLoading(true)
          await refetchAllDataFromFB();
          setReload(true)
        }}/>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#fff', alignItems: 'center', width: '100%',
  }, scrollView: {
    width: '80%', margin: 20,
  }, label: {
    fontSize: 18, fontWeight: 'bold', marginVertical: 10, alignSelf: 'flex-start', marginLeft: '6%',
  },
  selectorView: {
    width: '40%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 0.3,
    borderColor: '#000',
    borderRadius: 5,
  },
  selectorList: {
    width: '200%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 0.3,
    borderColor: '#000',
    borderRadius: 5,

  },
  selectorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  }
});

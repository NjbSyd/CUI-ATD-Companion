import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import React, {useState} from "react";
import {CalculateTotalFreeSlots} from "../Functions/UIHelpers";
import {FetchFreeslotsDataFromMongoDB} from "../../BackEnd/RequestGenerator";
import LoadingPopup from "../Components/Loading";
import NoResults from "../Components/NoResults";
import Accordion from "../Components/Accordian";
import BannerAds from "../../Ads/BannerAd";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];


export default function Freeslots() {
  const StateDispatcher = useDispatch();
  const freeslotsAvailable = useSelector(state => state.FreeslotsSlice.available);
  const freeslots = useSelector(state => state.FreeslotsSlice.freeslots);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading ...")
  const [selection, setSelection] = useState(-1);
  const [selectedDayData, setSelectedDayData] = useState({});

  return (
      <View style={styles.container}>
        {freeslotsAvailable ? (
            <View>
              <View style={styles.btnGroup}>
                {daysOfWeek.map((day, index) => (
                    <TouchableOpacity
                        key={day}
                        style={[
                          styles.button,
                          {backgroundColor: selection === index ? "#000" : "#fff"},
                        ]}
                        onPress={() => {
                          setSelection(index);
                          setSelectedDayData(freeslots[day]);
                        }}
                    >
                      <Text
                          style={[
                            styles.text,
                            selection === index ? {color: "#fff"} : {color: "#000"}]}
                      >
                        {day.substring(0, 3)}
                      </Text>
                      <Text style={[styles.text, {
                        color: "#d1d1d1",
                      }]}>
                        {
                          CalculateTotalFreeSlots(freeslots[day])
                        }
                      </Text>
                    </TouchableOpacity>
                ))}
              </View>
              {selection !== -1 && (
                  <ScrollView style={{
                    marginBottom:140,
                    marginTop:10
                  }}>
                    <Accordion data={selectedDayData}/>
                  </ScrollView>
              )}
            </View>

        ) : (
             <View style={{
               flex: 1
             }}>
               <TouchableOpacity style={styles.fetchDataBtn} onPress={async () => {
                 setLoading(true);
                 await FetchFreeslotsDataFromMongoDB(StateDispatcher, setLoadingText);
                 setLoading(false)
               }}>
                 <Text style={styles.buttonText}>
                   Load Freeslots
                 </Text>
               </TouchableOpacity>
               <NoResults/>
             </View>
         )}
        <LoadingPopup visible={loading} text={loadingText}/>
        <BannerAds/>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  btnGroup: {
    flexDirection: "row",
    marginVertical: 10,
    maxHeight: 50,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
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
  fetchDataBtn: {
    width: "60%",
    height: 50,
    backgroundColor: "#0ac0e8",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    elevation: 10,
    shadowOffset: {width: 0, height: 2},
    shadowColor: "#000",
    marginTop: "10%",
  },
  buttonText: {
    color: "white", fontWeight: "bold", fontSize: 18,
  },
})
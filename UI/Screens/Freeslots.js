import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React, { useRef, useState } from "react";
import {
  CalculateTotalFreeSlots,
  fakeSleep,
  FilterFreeSlotsByTimeSlot,
} from "../Functions/UIHelpers";
import LoadingPopup from "../Components/Loading";
import NoResults from "../Components/NoResults";
import BannerAds from "../../Ads/BannerAd";
import { Dropdown } from "react-native-element-dropdown";
import { FontAwesome5 } from "@expo/vector-icons";
import { List } from "../Components/List";
import { fetchAndStoreFreeslotsData } from "../../BackEnd/DataHandlers/ServerSideDataHandler";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function Freeslots({ navigation }) {
  const StateDispatcher = useDispatch();
  const freeslotsAvailable = useSelector(
    (state) => state.FreeslotsSlice.available
  );
  const timeSlots = useSelector((state) => state.TimeslotSlice.timeSlot);
  const freeslots = useSelector((state) => state.FreeslotsSlice.freeslots);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading ...");
  const [selection, setSelection] = useState(-1);
  const [selectedTimeSlotData, setSelectedTimeSlotData] = useState(null);
  const [selectedDayData, setSelectedDayData] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const dropdownRef = useRef(null);
  let buttonRef = useRef(null);

  const openDropDown = async () => {
    await fakeSleep(100);
    dropdownRef.current.open();
  };

  const clickOnMonday = async () => {
    await fakeSleep(200);
    if (buttonRef) {
      buttonRef.current._internalFiberInstanceHandleDEV.memoizedProps.onClick();
      setSelectedDayData(selectedTimeSlotData[0]);
    }
  };

  return (
    <View style={styles.container}>
      {freeslotsAvailable ? (
        <View
          style={{
            flex: 1,
          }}
        >
          {selectedTimeSlot === null ? (
            <Dropdown
              ref={dropdownRef}
              style={styles.selectorView}
              containerStyle={styles.selectorList}
              data={timeSlots}
              labelField="label"
              valueField="value"
              onChange={(item) => {
                setSelectedTimeSlot(item.value);
                const timeslotData = FilterFreeSlotsByTimeSlot(
                  freeslots,
                  item.value
                );
                setSelectedTimeSlotData(timeslotData);
                clickOnMonday()
                  .then(() => {})
                  .catch(() => {});
              }}
              value={selectedTimeSlot}
              autoScroll={false}
              placeholder={"Timeslot..."}
              inputSearchStyle={{ backgroundColor: "#d1fff6" }}
            />
          ) : (
            <View>
              <TouchableOpacity
                style={styles.slotSelectorPlaceholder}
                onPress={() => {
                  setSelectedTimeSlot(null);
                  setSelectedTimeSlotData(null);
                  setSelectedDayData(null);
                  setSelection(-1);
                  openDropDown()
                    .then(() => {})
                    .catch(() => {});
                }}
              >
                <Text style={styles.selectedClassText}>
                  Timeslot: {selectedTimeSlot}
                </Text>
                <FontAwesome5 name="edit" size={15} color="#4a6cef" />
              </TouchableOpacity>

              <View style={styles.btnGroup}>
                {daysOfWeek.map((day, index) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.button,
                      {
                        backgroundColor: selection === index ? "#000" : "#fff",
                      },
                    ]}
                    ref={(ref) => {
                      if (index === 0) {
                        buttonRef.current = ref;
                      }
                    }}
                    onPress={() => {
                      setSelection(index);
                      setSelectedDayData(selectedTimeSlotData[day]);
                    }}
                  >
                    <Text
                      style={[
                        styles.text,
                        selection === index
                          ? { color: "#fff" }
                          : { color: "#000" },
                      ]}
                    >
                      {day.substring(0, 3)}
                    </Text>
                    <Text
                      style={[
                        styles.text,
                        {
                          color: "#d1d1d1",
                        },
                      ]}
                    >
                      {CalculateTotalFreeSlots(
                        selectedTimeSlotData[day],
                        selectedTimeSlot
                      )}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          {selection !== -1 && (
            <ScrollView
              style={{
                marginBottom: "10%",
                marginTop: 10,
              }}
            >
              {CalculateTotalFreeSlots(selectedDayData, selectedTimeSlot) ===
              0 ? (
                <NoResults />
              ) : (
                <List data={selectedDayData} type="FreeSlot" />
              )}
            </ScrollView>
          )}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
          }}
        >
          <TouchableOpacity
            style={styles.fetchDataBtn}
            onPress={async () => {
              try {
                setLoading(true);
                await fetchAndStoreFreeslotsData(StateDispatcher);
                setLoading(false);
              } catch (e) {
                navigation.replace("Error", {
                  message: {
                    title: "Something Went Wrong!",
                    message: e.message,
                  },
                });
              }
            }}
          >
            <Text style={styles.buttonText}>Load Freeslots</Text>
          </TouchableOpacity>
          <NoResults />
        </View>
      )}
      <LoadingPopup visible={loading} text={loadingText} />
      <View
        style={{
          alignSelf: "flex-end",
        }}
      >
        <BannerAds />
      </View>
    </View>
  );
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#000",
    marginTop: "10%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  selectorView: {
    width: "90%",
    padding: 10,
    height: "10%",
    alignSelf: "center",
    marginVertical: 20,
    borderWidth: 0.3,
    borderColor: "#000",
    borderRadius: 5,
    marginRight: 10,
  },
  selectorList: {
    width: "100%",
    padding: 10,
    borderWidth: 0.3,
    borderColor: "#000",
    borderRadius: 5,
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

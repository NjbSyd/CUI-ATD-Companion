import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";

import { fetchAndStoreFreeslotsData } from "../../BackEnd/DataHandlers/ServerSideDataHandler";
import { FreeSlotsDayButton } from "../Components/DayButton";
import { List } from "../Components/List";
import LoadingPopup from "../Components/Loading";
import NoResults from "../Components/NoResults";
import NoSelection from "../Components/NoSelection";
import Theme from "../Constants/Theme";
import {
  CalculateTotalFreeSlots,
  FilterFreeSlotsByTimeSlot,
} from "../Functions/UIHelpers";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function Freeslots({ navigation }) {
  const StateDispatcher = useDispatch();
  const freeslotsAvailable = useSelector(
    (state) => state.FreeslotsSlice.available,
  );
  const timeSlots = useSelector((state) => state.TimeslotSlice.timeSlot);
  const freeslots = useSelector((state) => state.FreeslotsSlice.freeslots);
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState(-1);
  const [selectedTimeSlotData, setSelectedTimeSlotData] = useState(null);
  const [selectedDayData, setSelectedDayData] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const dropdownRef = useRef(null);
  useEffect(() => {
    if (selectedTimeSlotData) {
      setSelection(0);
      setSelectedDayData(selectedTimeSlotData["Monday"]);
    }
  }, [selectedTimeSlotData, freeslots, freeslotsAvailable, timeSlots]);

  return (
    <View style={styles.container}>
      {freeslotsAvailable ? (
        <View
          style={{
            flex: 1,
          }}
        >
          <Dropdown
            ref={dropdownRef}
            style={styles.DropdownStyle}
            containerStyle={styles.Dropdown_OptionsContainerStyle}
            itemContainerStyle={styles.Dropdown_ItemContainerStyle}
            data={timeSlots}
            labelField="label"
            valueField="value"
            onChange={(item) => {
              setSelectedTimeSlot(item.value);
              const timeslotData = FilterFreeSlotsByTimeSlot(
                freeslots,
                item.value,
              );
              setSelectedTimeSlotData(timeslotData);
            }}
            renderRightIcon={() => (
              <FontAwesome name="caret-down" size={24} color="black" />
            )}
            value={selectedTimeSlot}
            autoScroll={false}
            placeholder="Timeslot..."
            inputSearchStyle={{ backgroundColor: "#d1fff6" }}
          />
          {selectedTimeSlot && (
            <View style={styles.btnGroup}>
              {daysOfWeek.map((day, index) =>
                FreeSlotsDayButton(
                  day,
                  index,
                  selection,
                  setSelection,
                  setSelectedDayData,
                  selectedTimeSlotData,
                  selectedTimeSlot,
                  styles,
                ),
              )}
            </View>
          )}
          {selection !== -1 ? (
            <ScrollView
              style={{
                marginVertical: Theme.ScreenHeight * 0.01,
              }}
            >
              {CalculateTotalFreeSlots(selectedDayData, selectedTimeSlot) ===
              0 ? (
                <NoResults />
              ) : (
                <List data={selectedDayData} type="FreeSlot" />
              )}
            </ScrollView>
          ) : (
            <NoSelection
              message={!selectedTimeSlot ? "Pick a TimeSlot" : "Select a Day"}
            />
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
                const res = await fetchAndStoreFreeslotsData(StateDispatcher);
                setLoading(false);
                if (typeof res === "object") {
                  console.log(res);
                  navigation.navigate("Error", {
                    message: res,
                  });
                }
              } catch (e) {
                Alert.alert("Something Went Wrong!", e.message, [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.goBack();
                    },
                  },
                ]);
              }
            }}
          >
            <Text style={styles.buttonText}>Load Freeslots</Text>
          </TouchableOpacity>
          <NoSelection message="Press the button above to load FreeSlots" />
        </View>
      )}
      <LoadingPopup visible={loading} text="Loading..." />
      {/*<BannerAds />*/}
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
    backgroundColor: Theme.COLORS.MAIN,
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
  Dropdown_OptionsContainerStyle: {
    borderColor: "#000",
    borderWidth: 0.3,
    borderRadius: 5,
    maxHeight: "90%",
  },
  Dropdown_ItemContainerStyle: {
    borderColor: "#d7d4d4",
    borderBottomWidth: 0.3,
  },
  DropdownStyle: {
    alignSelf: "center",
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

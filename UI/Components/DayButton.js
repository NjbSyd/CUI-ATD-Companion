import { Text, TouchableOpacity } from "react-native";
import { CalculateTotalFreeSlots } from "../Functions/UIHelpers";
import React from "react";

export function FreeSlotsDayButton(
  day,
  index,
  selection,
  setSelection,
  setSelectedDayData,
  selectedTimeSlotData,
  selectedTimeSlot,
  styles
) {
  return (
    <TouchableOpacity
      key={day}
      style={[
        styles.button,
        {
          backgroundColor: selection === index ? "#000" : "#fff",
        },
      ]}
      onPress={() => {
        setSelection(index);
        setSelectedDayData(selectedTimeSlotData[day]);
      }}
    >
      <Text
        style={[
          styles.text,
          selection === index ? { color: "#fff" } : { color: "#000" },
        ]}
      >
        {day?.substring(0, 3)}
      </Text>
      <Text
        style={[
          styles.text,
          {
            color: "#d1d1d1",
          },
        ]}
      >
        {CalculateTotalFreeSlots(selectedTimeSlotData[day], selectedTimeSlot)}
      </Text>
    </TouchableOpacity>
  );
}

export function TimetableDayButton(
  day,
  index,
  setSelection,
  filterDayData,
  isClassNameSelected,
  selection,
  styles
) {
  return (
    <TouchableOpacity
      key={day}
      style={[
        styles.DayButton,
        { backgroundColor: selection === index ? "#000" : "#fff" },
      ]}
      disabled={!isClassNameSelected}
      onPress={() => {
        setSelection(index);
        filterDayData(day);
      }}
    >
      <Text
        style={[
          styles.text,
          {
            color: isClassNameSelected
              ? selection === index
                ? "#fff"
                : "#000"
              : "#d1d1d1",
          },
        ]}
      >
        {day?.substring(0, 3)}
      </Text>
    </TouchableOpacity>
  );
}

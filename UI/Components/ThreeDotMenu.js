import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  Modal,
  View,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { fetchDataFromSQLite } from "../../BackEnd/DataHandlers/FrontEndDataHandler";
import {
  fetchAndStoreFreeslotsData,
  updateDataFromServerIfNeeded,
} from "../../BackEnd/DataHandlers/ServerSideDataHandler";

function DropdownMenu({ onReloadCache }) {
  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownOption} onPress={onReloadCache}>
        <Text style={styles.optionText}>Reload Local Cache</Text>
      </TouchableOpacity>
    </View>
  );
}

function ThreeDotMenu({ StateDispatcher, SetLoadingText, SetLoading }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleReloadCache = async () => {
    try {
      setModalVisible(false);
      SetLoading(true);
      await fetchDataFromSQLite(StateDispatcher, "all");
      ToastAndroid.show("Reloaded Successfully✅", ToastAndroid.SHORT);
    } catch (e) {
      ToastAndroid.show(e, ToastAndroid.SHORT);
    } finally {
      SetLoading(false);
      SetLoadingText("Loading ...");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <MaterialCommunityIcons name="dots-vertical" size={30} color="black" />
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <DropdownMenu onReloadCache={handleReloadCache} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={30}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },
  modalContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 13,
    right: 16,
  },
  optionsContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c6c6ce",
    padding: 20,
  },
  optionButton: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
  },
  dropdownContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c6c6ce",

    zIndex: 1,
  },
  dropdownOption: {
    paddingVertical: 10,
    alignItems: "center",
    padding: 10,
  },
});

export { ThreeDotMenu };

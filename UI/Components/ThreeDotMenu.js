import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  Modal,
  View,
  StyleSheet,
  ToastAndroid,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { fetchDataFromSQLite } from "../../BackEnd/DataHandlers/FrontEndDataHandler";

function DropdownMenu({ onReloadCache }) {
  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownOption}
        onPress={onReloadCache}
        pointerEvents="none"
      >
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
        <View
          style={styles.modalContainer}
          onTouchEnd={() => {
            setModalVisible(false);
          }}
        >
          <DropdownMenu onReloadCache={handleReloadCache} />
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
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 13,
    right: 16,
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
  optionText: {
    fontSize: 16,
  },
});

export { ThreeDotMenu };

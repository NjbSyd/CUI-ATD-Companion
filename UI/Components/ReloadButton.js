import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from "@expo/vector-icons";

const LocalReloadButton = ({onPress}) => {
  useEffect(() => {
    setTimeout(() => {
      setTipVisible(false);
    }, 5000);
  }, []);
  const [tipVisible, setTipVisible] = useState(true);
  return (
      <View style={styles.containerLocal}>
        {tipVisible ? <Text style={styles.txt}>Reload From Local Storage</Text> : null}
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <MaterialCommunityIcons name={"folder-sync-outline"} size={25} color={"#000"}/>
        </TouchableOpacity>
      </View>
  );
};
const CloudReloadButton = ({onPress}) => {
  useEffect(() => {
    setTimeout(() => {
      setTipVisible(false);
    }, 5000);
  }, []);
  const [tipVisible, setTipVisible] = useState(true);
  return (
      <View style={styles.containerCloud}>
        {tipVisible ? <Text style={styles.txt}>Reload From Cloud</Text> : null}
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <MaterialCommunityIcons name={"cloud-sync-outline"} size={25} color={"#000"}/>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  containerCloud: {
    position: 'absolute',
    bottom: 60,
    right: 20,
  },
  containerLocal: {
    position: 'absolute',
    bottom: 10,
    right: 20,
  },
  txt: {
    fontSize: 12,
    backgroundColor: "black",
    color: 'white',
    padding: 5,
    borderRadius: 15,
    position: 'absolute',
    bottom: 10,
    right: 40,
    width: 150,
  },
  button: {
    backgroundColor: 'rgb(2, 201, 208)',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    borderRadius: 25,
  }
});

export {LocalReloadButton, CloudReloadButton};

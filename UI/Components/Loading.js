import React from 'react';
import {View, Modal, StyleSheet, Image, Text} from 'react-native';
import AnimatedLottieView from "lottie-react-native";
import {transparent} from "react-native-paper/src/styles/themes/v2/colors";

const LoadingPopup = ({visible}) => {
  return (
      <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
      >
        <View style={styles.container}>
          <View style={styles.popup}>
            <AnimatedLottieView style={{
              flex:1,
              alignSelf: 'center',
            }} source={require('../../assets/Loading.json')} autoPlay  autoSize={true}/>
          </View>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: '50%',
    height: '15%',
    backgroundColor: 'rgba(55,159,234,0.51)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  image: {
    width: 30,
    height: 30,
  },
  txt: {
    fontSize: 30,
    fontWeight: 'bold',
    marginHorizontal: 5,
  }
});

export default LoadingPopup;

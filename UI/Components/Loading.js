import React from 'react';
import {View, Modal, StyleSheet, Image, Text} from 'react-native';

const LoadingPopup = ({visible}) => {
  return (
      <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
      >
        <View style={styles.container}>
          <View style={styles.popup}>
            <Text style={styles.txt}>Loading</Text>
            <Image source={require('../../assets/Loading.gif')} style={styles.image}/>
          </View>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
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

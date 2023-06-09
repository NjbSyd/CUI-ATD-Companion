import React from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MagnifierButton = ({ onPress }) => {
  return (
      <TouchableOpacity style={{alignSelf:'center'}} onPress={onPress}>
        <MaterialIcons name="search" size={35} color="black" />
      </TouchableOpacity>
  );
};


export default MagnifierButton;

import {MaterialCommunityIcons} from "@expo/vector-icons";
import ActionButton from "react-native-action-button";


const FloatingButton = ({onPressCloud,onPressLocal}) => {
return (
    <ActionButton buttonColor="rgb(2, 201, 208)" offsetX={15} offsetY={10} size={50} degrees={135} >
      <ActionButton.Item buttonColor='#a3a8dc' title="Reload From Disk"  onPress={() => onPressLocal()}>
        <MaterialCommunityIcons name="file-refresh-outline" size={28}/>
      </ActionButton.Item>
        <ActionButton.Item buttonColor='#fffb93' title="Reload From Cloud" onPress={() => onPressCloud()}>
            <MaterialCommunityIcons name="cloud-sync-outline" size={28} />
        </ActionButton.Item>
    </ActionButton>
)};

export {FloatingButton};

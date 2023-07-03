import { View, StyleSheet, Image } from "react-native";

const NoResults = () => {
  return (
    <View style={styles.view}>
      <Image
        source={require("../../assets/noresults.jpg")}
        style={styles.img}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  img: {
    width: "80%",
    height: 250,
  },
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default NoResults;

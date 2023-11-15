import { View, StyleSheet, Image, Text } from "react-native";

const NoResults = ({ message }) => {
  const imageSource = require("../../assets/Images/nodata.png");
  return (
    <View style={styles.view}>
      <Text style={styles.txt}>{message || "No Results"}</Text>
      <Image source={imageSource} style={styles.img} />
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
  txt: {
    color: "#fff",
    backgroundColor: "#47267d",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: -10,
    borderColor: "rgba(29, 26, 25,1)",
    borderWidth: 1,
    fontSize: 20,
  },
});
export default NoResults;

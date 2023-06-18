import { View, StyleSheet, Image, ToastAndroid } from "react-native";
import AnimatedLottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { fetchDataAndStore } from "../../BackEnd/RequestGenerator";
import { useDispatch } from "react-redux";
import { setTeacherNames } from "../../Redux/Reducers/TeachersReducer";
import { setClassRoomNames } from "../../Redux/Reducers/ClassRoomsReducer";
import { setTimeSlots } from "../../Redux/Reducers/TimeSlotsReducer";

export function SplashScreen({ navigation }) {
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { teachers, classRooms, timeSlots } = await fetchDataAndStore();
        dispatch(setTeacherNames(teachers));
        dispatch(setClassRoomNames(classRooms));
        dispatch(setTimeSlots(timeSlots));
        ToastAndroid.show("Data Updated", ToastAndroid.SHORT);
      } catch (error) {
        console.log(error);
      }
    };

    const onAnimationFinish = async () => {
      setInitialAnimationDone(true);
      await fetchData();
      navigation.navigate("Main");
    };

    const animationTimeout = setTimeout(onAnimationFinish, 3000);

    return () => {
      clearTimeout(animationTimeout);
    };
  }, [dispatch, navigation]);

  return (
    <View style={{ flex: 1 }}>
      <AnimatedLottieView
        style={styles.splashContainer}
        source={require("../../assets/SplashScreen.json")}
        resizeMode="center"
        autoPlay
        speed={0.7}
        loop={false}
        onAnimationFinish={() => {
          setInitialAnimationDone(true);
        }}
        autoSize
      />
      {initialAnimationDone && (
        <>
          <AnimatedLottieView
            style={styles.progressContainer}
            source={require("../../assets/Progress.json")}
            resizeMode="center"
            autoPlay
            loop
            autoSize
          />
          <Image
            style={styles.image}
            source={require("../../assets/icon.png")}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: "10%",
    width: "100%",
  },
  splashContainer: {
    width: "1000%",
    height: "100%",
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "40%",
    zIndex: 1,
    alignSelf: "center",
    position: "absolute",
    top: "20%",
  },
});

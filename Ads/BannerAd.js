import {View, StyleSheet} from "react-native";
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

let adId = __DEV__ ? TestIds.BANNER : "ca-app-pub-2067708103851582/1914798696";
function BannerAds() {
  return (
        <BannerAd unitId={adId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} requestOptions={{
          requestNonPersonalizedAdsOnly: true,
          keywords: ["university", "timetable", "freebies", "student discounts", "fashion",]
        }}/>
  )
}

const styles = StyleSheet.create({
  bannerAdContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 50,
  }
});


export default BannerAds;
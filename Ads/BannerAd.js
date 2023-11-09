import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { adKeywords } from "./Keywords";
import { View } from "react-native";
import Theme from "../UI/Constants/Theme";

let adId = __DEV__ ? TestIds.BANNER : "ca-app-pub-2067708103851582/4227446312";

function BannerAds() {
  return (
    <View
      style={{
        width: Theme.ScreenWidth,
        height: Theme.ScreenHeight * 0.09,
        backgroundColor: Theme.COLORS.GITHUB,
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <BannerAd
        unitId={adId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
          keywords: adKeywords(),
        }}
      />
    </View>
  );
}

export default BannerAds;

import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import {adKeywords} from "./Keywords";
import {View} from "react-native";

let adId = __DEV__ ? TestIds.BANNER : "ca-app-pub-2067708103851582/4227446312";

function BannerAds() {
  return (
<View style={{
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
}}>
  <BannerAd unitId={adId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} requestOptions={{
    requestNonPersonalizedAdsOnly: false,
    keywords: adKeywords()
  }}/>
</View>
  )
}


export default BannerAds;
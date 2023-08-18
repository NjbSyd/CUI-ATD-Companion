import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import {adKeywords} from "./Keywords";

let adId = __DEV__ ? TestIds.BANNER : "ca-app-pub-2067708103851582/4227446312";

function BannerAds() {
  return (
      <BannerAd unitId={adId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} requestOptions={{
        requestNonPersonalizedAdsOnly: false,
        keywords: adKeywords()
      }}/>
  )
}


export default BannerAds;
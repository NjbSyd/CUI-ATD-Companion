import {AdEventType, InterstitialAd, TestIds} from "react-native-google-mobile-ads";
import {adKeywords} from "./Keywords";

const adId = __DEV__ ? TestIds.INTERSTITIAL : "ca-app-pub-2067708103851582/6662037963"

const interstitialAd = InterstitialAd.createForAdRequest(adId, {
      requestNonPersonalizedAdsOnly: false,
      keywords: adKeywords()
    }
)

export function LoadAndDisplayInterstitialAd() {
  interstitialAd.load();
  return interstitialAd.addAdEventsListener((eventInfo) => {
    if (eventInfo.type === AdEventType.LOADED) {
      console.log("Ad Loaded")
      interstitialAd.show().then(() => {

      });
    } else if (eventInfo.type === AdEventType.ERROR) {
      console.log(eventInfo.payload)
    } else if (eventInfo.type === AdEventType.CLOSED) {
      interstitialAd.removeAllListeners();
    }
  });
}
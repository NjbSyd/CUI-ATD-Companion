import { useEffect, useState } from "react";
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";
import { adKeywords } from "./Keywords";

const adId = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-2067708103851582/6662037963";

const useInterstitialAd = () => {
  const [loadedAd, setLoadedAd] = useState(false);
  const [interstitialAd, setInterstitialAd] = useState(null);
  const [retryTimer, setRetryTimer] = useState(null);
  useEffect(() => {
    const eventListeners = loadNewInterstitialAd();
    return () => {
      eventListeners();
      if (interstitialAd) {
        interstitialAd.removeAllListeners();
      }
      clearTimeout(retryTimer);
    };
  }, []);

  const loadNewInterstitialAd = () => {
    const newAd = InterstitialAd.createForAdRequest(adId, {
      requestNonPersonalizedAdsOnly: false,
      keywords: adKeywords(),
    });

    const newEventListener = newAd.addAdEventsListener((eventInfo) => {
      if (eventInfo.type === AdEventType.LOADED) {
        setLoadedAd(true);
        setInterstitialAd(newAd);
      } else if (eventInfo.type === AdEventType.ERROR) {
        setLoadedAd(false);
        setInterstitialAd(null);
        retryLoading();
      } else if (eventInfo.type === AdEventType.CLOSED) {
        setLoadedAd(false);
        setInterstitialAd(null);
        scheduleNextAdLoad();
      }
    });

    newAd.load();
    return newEventListener;
  };

  const retryLoading = () => {
    const timer = setTimeout(() => {
      loadNewInterstitialAd();
    }, 7000);
    setRetryTimer(timer);
  };

  const scheduleNextAdLoad = () => {
    const timer = setTimeout(() => {
      if (!loadedAd) {
        loadNewInterstitialAd();
      }
    }, 40000);
    setRetryTimer(timer);
  };

  const displayAd = () => {
    try {
      if (loadedAd && interstitialAd) {
        interstitialAd.show().then(() => {});
      }
    } catch (e) {
      console.log(e);
    }
  };

  return { loadedAd, displayAd };
};

export default useInterstitialAd;

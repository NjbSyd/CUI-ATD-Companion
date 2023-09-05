import * as Application from "expo-application";

function getApplicationVersion() {
  return Application.nativeApplicationVersion;
}

// This function is used to check if the app is up-to-datkjsdhfdse or not.
function checkAppVersion() {
  const appVersion = getApplicationVersion();
  const currentVersion = appVersion.split(".");
  return currentVersion[0] >= "6";
}

export { checkAppVersion, getApplicationVersion };

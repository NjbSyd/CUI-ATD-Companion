import * as Application from "expo-application";

function getApplicationVersion() {
  return Application.nativeApplicationVersion;
}

function checkAppVersion() {
  const appVersion = getApplicationVersion();
  const currentVersion = appVersion.split(".");
  return currentVersion[0] >= "6";
}

export { checkAppVersion, getApplicationVersion };

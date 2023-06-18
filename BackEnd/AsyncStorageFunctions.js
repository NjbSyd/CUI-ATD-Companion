import AsyncStorage from '@react-native-async-storage/async-storage';

function setData(key, value) {
  AsyncStorage.setItem(`@${key}`, value)
  .then(() => {
  })
  .catch(e => console.error(e));
}

async function getData(key) {
  try {
    const data = await AsyncStorage.getItem(`@${key}`);
    return JSON.parse(data);
  } catch (e) {
    console.error(e)
    return [];
  }
}

async function checkInKeys(key) {
  try {
    const keys = await AsyncStorage.getAllKeys()
    return keys.includes(`@${key}`);
  } catch (e) {
      console.error(e);
    return false;
  }
}

export {setData, getData, checkInKeys};


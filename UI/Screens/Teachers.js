import {ScrollView, StyleSheet, Text, ToastAndroid, View} from "react-native";
import {useEffect, useState} from "react";
import {getAllTeachersData, refetchAllDataFromFB} from "../../BackEnd/FBFunctions";
import {Dropdown} from "react-native-element-dropdown";
import {List} from "../Components/List";
import {checkInKeys, getData} from "../../BackEnd/AsyncStorageFX";
import Loading from "../Components/Loading";
import {LocalReloadButton, CloudReloadButton} from "../Components/ReloadButton";

export function Teachers() {
  const [reload, setReload] = useState(true);
  useEffect(() => {
    setSelectedTeacher(null)
    setSelectedTeacherData([]);
    setLoading(true)
    extractedMethodFromUseEffect().then(() => {
      setLoading(false)
    }).catch(() => {
      setLoading(false)
      ToastAndroid.show("Error Loading Teachers Data", ToastAndroid.SHORT)
    });
    setReload(false);
  }, [reload]);


  async function extractedMethodFromUseEffect() {
    await checkInKeys("teacherNames").then((res) => {
      if (!res) {
        let promise = getDataNotFoundInAsyncStorage();
      } else {
        let promise = getDataFoundInAsyncStorage();
      }
    }).catch(() => {
      let promise = getDataNotFoundInAsyncStorage();
    });
  }


  async function getDataNotFoundInAsyncStorage() {
    try {
      const teacherNs = await getAllTeachersData()
      setTeachersNames(teacherNs);
    } catch (e) {
      setTeachersNames([{label: e, value: e}])
    }
  }

  async function getDataFoundInAsyncStorage() {
    try {
      const teacherNs = await getData("teacherNames");
      setTeachersNames(teacherNs);
    } catch (e) {
      setTeachersNames([{label: e, value: e}])
    }
  }

  const [teachersNames, setTeachersNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedTeacherData, setSelectedTeacherData] = useState([]);
  return (
      <View style={styles.container}>
        <Dropdown style={styles.slotSelector} data={teachersNames} labelField="label" valueField="value"
                  onChange={(item) => {
                    setSelectedTeacher(item);
                    getData(item.label).then((data) => {
                      setSelectedTeacherData(data);
                    }).catch((e) => {
                      console.log(e);
                    });
                  }}
                  placeholder={"Select a teacher"}
                  value={selectedTeacher}
                  search={true}
                  searchPlaceholder="Teacher name"
                  autoScroll={false}
        />
        <Text style={styles.label}>Teacher's Schedule</Text>
        <ScrollView style={styles.scrollView}>
          {
            selectedTeacherData.length === 0 ?
            <Text style={{fontSize: 100, alignSelf: 'center'}}>🤦‍♂🤷‍♂</Text> :
            <List data={selectedTeacherData} type={"Teacher"}/>
          }
        </ScrollView>
        <Loading visible={loading}/>
        <LocalReloadButton onPress={() => setReload(true)}/>
        <CloudReloadButton onPress={async () => {
          ToastAndroid.show("Fetching data from server...", ToastAndroid.SHORT);
          setLoading(true)
          await refetchAllDataFromFB();
          setReload(true)
        }}/>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#fff', alignItems: 'center', width: '100%',
  }, scrollView: {
    width: '80%', margin: 20,
  }, label: {
    fontSize: 18, fontWeight: 'bold', marginTop: 10, alignSelf: 'flex-start', marginLeft: '6%',
  },
  slotSelector: {
    width: '90%',
    padding: 10,
    marginTop: 10,
    borderWidth: 0.3,
    borderColor: '#000',
    borderRadius: 5,
  },
});
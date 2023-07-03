import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { List } from "../Components/List";
import { Header } from "../Components/Header";
import {
  GetSubjectNames,
  GetSubjectsSchedule,
} from "../../BackEnd/SQLiteSearchFunctions";
import LoadingPopup from "../Components/Loading";
import NoResults from "../Components/NoResults";

export function Subjects() {
  useEffect(() => {
    GetDropDownPlaceholders().then(() => {});
  }, []);
  const [loading, setLoading] = useState(false);
  const [subjectNames, setSubjectNames] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSubjectData, setSelectedSubjectData] = useState([]);

  const GetDropDownPlaceholders = async () => {
    setLoading(true);
    try {
      const receivedSubjects = await GetSubjectNames();
      setSubjectNames(receivedSubjects);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Header title={"Subjects"} />
      <Dropdown
        style={styles.slotSelector}
        data={subjectNames}
        labelField="label"
        valueField="value"
        onChange={(item) => {
          setSelectedSubject(item);
          GetSubjectsSchedule(item.value).then((res) => {
            setSelectedSubjectData(res);
          });
        }}
        placeholder={"Select a Subject"}
        value={selectedSubject}
        search={true}
        searchPlaceholder="Subject name"
        autoScroll={false}
        inputSearchStyle={{ backgroundColor: "#d1fff6" }}
      />
      {selectedSubjectData.length !== 0 && (
        <Text style={styles.label}> {selectedSubject.label}'s Schedule</Text>
      )}
      <ScrollView style={styles.scrollView}>
        {selectedSubjectData.length === 0 ? (
          <NoResults />
        ) : (
          <List data={selectedSubjectData} type={"Subject"} />
        )}
      </ScrollView>
      <LoadingPopup visible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
  },
  scrollView: {
    width: "80%",
    margin: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    alignSelf: "flex-start",
    marginLeft: "6%",
  },
  slotSelector: {
    width: "90%",
    padding: 10,
    marginTop: 10,
    borderWidth: 0.3,
    borderColor: "#000",
    borderRadius: 5,
  },
});

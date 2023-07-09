import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { List } from "../Components/List";
import { GetSubjectsSchedule } from "../../BackEnd/SQLiteSearchFunctions";
import NoResults from "../Components/NoResults";
import { useSelector } from "react-redux";

export function Subjects() {
  const subjectNames = useSelector((state) => state.SubjectSlice.subject);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSubjectData, setSelectedSubjectData] = useState([]);

  return (
    <View style={styles.container}>
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
        mode={"modal"}
        search={true}
        searchPlaceholder="Subject name"
        autoScroll={false}
        inputSearchStyle={{ backgroundColor: "#d1fff6" }}
      />
      {selectedSubjectData.length !== 0 && (
        <Text style={styles.label}>
          {" "}
          Teachers for "{selectedSubject.label}"
        </Text>
      )}
      <ScrollView style={styles.scrollView}>
        {selectedSubjectData.length === 0 ? (
          <NoResults />
        ) : (
          <List data={selectedSubjectData} type={"Subject"} />
        )}
      </ScrollView>
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

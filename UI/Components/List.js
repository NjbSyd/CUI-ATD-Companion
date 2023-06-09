import {Text, View} from "react-native";

export function List({data, type}) {
  if (data.length === 0) {
    return (<Text>No Record</Text>)
  }

  function renderItemClassroomBased(item) {
    return (
        <View style={{
          marginVertical: 10,
          borderColor: 'black',
          borderRadius: 10,
          borderWidth: 1,
          overflow: 'hidden',
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            backgroundColor: 'rgb(2, 201, 208)',
            padding: 10
          }}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.className}</Text>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.day}</Text>
          </View>
          <View style={{padding: 10}}>
            <Text style={{fontSize: 16,color:"red"}}>{item.subject}</Text>
            <Text style={{fontSize: 14}}>{item.teacher.trim()}</Text>
            <Text style={{fontSize: 14}}>{item.classRoom}</Text>
            <Text style={{fontSize: 14}}>{item.time}</Text>
          </View>
        </View>
    );
  }


  function renderItemTeacherBased(item) {
    return (
        <View style={{
          marginVertical: 10,
          borderColor: 'black',
          borderRadius: 10,
          borderWidth: 1,
          overflow: 'hidden',
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            backgroundColor: 'rgb(2, 201, 208)',
            padding: 10
          }}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.className}</Text>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.day}</Text>
          </View>
          <View style={{padding: 10}}>
            <Text style={{fontSize: 16,color:"red"}}>{item.subject}</Text>
            <Text style={{fontSize: 14}}>{item.classRoom}</Text>
            <Text style={{fontSize: 14}}>{item.timeSlot}</Text>
          </View>
        </View>
    );
  }

  if (type === "Classroom") {
    return data.map((item) => renderItemClassroomBased(item))
  } else if (type === "Teacher") {
    return data.map((item) => renderItemTeacherBased(item))
  } else if (type === "Timetable") {
    return <Text>Not Yet</Text>
  }
}

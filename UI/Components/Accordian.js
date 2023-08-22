import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, Text, FlatList, ScrollView } from 'react-native';

const Accordion = ({ data }) => {
  const [expandedRoom, setExpandedRoom] = useState(null);

  const toggleAccordion = useCallback((room) => {
    setExpandedRoom(prevRoom => (prevRoom === room ? null : room));
  }, []);

  const renderItem = ({ item }) => {
    return (
        <View style={styles.innerItemContainer}>
          <Text style={styles.innerItemText}>{item}</Text>
        </View>
    );
  };

  const renderAccordionItem = useCallback(
      (room) => {
        const isExpanded = room === expandedRoom;
        return (
            <TouchableOpacity onPress={() => toggleAccordion(room)}>
              <View style={styles.itemContainer}>
                <Text style={[styles.itemTitle,isExpanded && {
                  marginBottom: 10,
                }]}>{room}</Text>
                {isExpanded && (
                    <FlatList
                        data={data[room]}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        nestedScrollEnabled={true} // Enable nested scrolling
                    />
                )}
              </View>
            </TouchableOpacity>
        );
      },
      [expandedRoom, toggleAccordion, data]
  );

  return (
      <>
        {Object.keys(data).map((room) => (
            <View key={room}>{renderAccordionItem(room)}</View>
        ))}
      </>
  );
};

const styles = {
  container: {
    flex: 1,
    width: '100%',
    marginBottom: 100,
    height: '100%',
  },
  itemContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    elevation: 5,
    borderRadius: 5,
    backgroundRadius: 50,
    marginBottom: 10,
    marginHorizontal:30,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  innerItemContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  innerItemText: {
    fontSize: 16,
  },
};

export default React.memo(Accordion);

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  SafeAreaView,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import PackingList from "@/components/PackingList";
import ActivitySelector from "@/components/ActivitySelector";
import { generatePackingList } from "@/utils/packingListGenerator";

const ACTIVITIES = [
  "Swimming",
  "Hiking",
  "Skiing",
  "Sightseeing",
  "Beach",
  "City exploration",
  "Mountain climbing",
  "Camping",
];

export default function App() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [activities, setActivities] = useState<string[]>([]);
  const [packingList, setPackingList] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleGenerateList = () => {
    const list = generatePackingList(destination, parseInt(days), activities);
    setPackingList(list);
  };

  const toggleActivity = (activity: string) => {
    setActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const checkFormValidity = () => {
    // Add your form validation logic here
    console.log("Form validity checked");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollView}>
        <Text style={styles.title}>Travel Packing Assistant</Text>
        <TextInput
          style={styles.input}
          placeholder="Destination"
          value={destination}
          onChangeText={setDestination}
        />
        <TextInput
          style={styles.input}
          placeholder="Number of Days"
          value={days}
          onChangeText={setDays}
          keyboardType="numeric"
        />
        <Button
          title="Select Activities"
          onPress={() => setModalVisible(true)}
        />
        <Text style={styles.activitiesText}>
          Selected activities: {activities.join(", ")}
        </Text>
        <Button title="Generate Packing List" onPress={handleGenerateList} />
        <PackingList items={packingList} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          checkFormValidity();
        }}
      >
        <ActivitySelector
          activities={ACTIVITIES}
          selectedActivities={activities}
          onToggleActivity={toggleActivity}
          onClose={(selectedActivities) => {
            setActivities(selectedActivities);
            setModalVisible(false);
            checkFormValidity();
          }}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  activitiesText: {
    marginVertical: 10,
  },
});

import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import PackingList from "@/components/PackingList";
import ActivitySelector from "@/components/ActivitySelector";
import { generatePackingList } from "@/utils/packingListGenerator";
import "react-native-get-random-values";

import Constants from "expo-constants";

const ACTIVITIES = [
  "Swimming",
  "Hiking",
  "Skiing",
  "Sightseeing",
  "Beach",
  "City exploration",
  "Mountain climbing",
  "Camping",
  "Snorkeling",
  "Scuba diving",
  "Surfing",
  "Kayaking",
  "Cycling",
  "Photography",
  "Wildlife watching",
  "Museum visits",
  "Food tours",
  "Yoga retreats",
];

export default function App() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [activities, setActivities] = useState<string[]>([]);
  const [packingList, setPackingList] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const googlePlacesRef = useRef<any>(null);
  // const googleApiKey = "AIzaSyDF4sDPUfs72HyRbp6-_LEH3OJp8P_aEPw";
  const googleApiKey = Constants?.expoConfig?.extra?.googleApiKey;

  const validateForm = () => {
    const errors = {
      destination: destination.trim() === "",
      days: days.trim() === "" || isNaN(Number(days)) || Number(days) <= 0,
      activities: activities.length === 0,
    };
    return errors;
  };

  const handleGenerateList = () => {
    const errors = validateForm();
    setShowErrors(true);

    if (Object.values(errors).some((error) => error)) {
      let errorMessage = "Please correct the following errors:\n";
      if (errors.destination) errorMessage += "- Enter a destination\n";
      if (errors.days) errorMessage += "- Enter a valid number of days\n";
      if (errors.activities) errorMessage += "- Select at least one activity\n";
      Alert.alert("Incomplete Form", errorMessage);
      return;
    }

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="always"
      >
        <Text style={styles.title}>Travel Packing Assistant</Text>
        <View style={styles.inputContainer}>
          <GooglePlacesAutocomplete
            ref={googlePlacesRef}
            listViewDisplayed={false}
            placeholder="Enter destination"
            onPress={(data, details = null) => {
              console.log("I am onpress");
              setDestination(data.description);
              googlePlacesRef.current?.setAddressText(data.description);
            }}
            query={{
              key: googleApiKey,
              types: "(cities)",
            }}
            styles={{
              textInputContainer: styles.autocompleteContainer,
              textInput: styles.autocompleteInput,
            }}
            fetchDetails={true}
            enablePoweredByContainer={false}
            minLength={1}
            onFail={(error) => console.error(error)}
            onNotFound={() => console.log("no results")}
            textInputProps={{
              value: destination,
              onChangeText: (text) => {
                setDestination(text);
              },
            }}
          />
          {showErrors && validateForm().destination && (
            <Text style={styles.errorText}>Please enter a destination</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              showErrors && validateForm().days && styles.inputError,
            ]}
            placeholder="Number of Days"
            value={days}
            onChangeText={setDays}
            keyboardType="numeric"
            accessibilityLabel="Enter number of days"
          />
          {showErrors && validateForm().days && (
            <Text style={styles.errorText}>
              Please enter a valid number of days
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.selectActivitiesButton}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="Select activities"
        >
          <Text style={styles.selectActivitiesButtonText}>
            Select Activities
          </Text>
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Text style={styles.activitiesText}>
            Selected activities: {activities.join(", ")}
          </Text>
          {showErrors && validateForm().activities && (
            <Text style={styles.errorText}>
              Please select at least one activity
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerateList}
          accessibilityLabel="Generate packing list"
        >
          <Text style={styles.generateButtonText}>Generate Packing List</Text>
        </TouchableOpacity>
        <PackingList items={packingList} />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ActivitySelector
          activities={ACTIVITIES}
          selectedActivities={activities}
          onToggleActivity={toggleActivity}
          onClose={() => setModalVisible(false)}
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
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  selectActivitiesButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  selectActivitiesButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  activitiesText: {
    marginBottom: 5,
  },
  generateButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  generateButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  autocompleteContainer: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  autocompleteInput: {
    height: 40,
    fontSize: 16,
    paddingHorizontal: 10,
  },
});

import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Modal,
  Text,
  View,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import axios from "axios";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Constants from "expo-constants";
import ActivitySelector from "@/components/ActivitySelector";

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

export default function TabTwoScreen() {
  const [destination, setDestination] = useState("israel");
  const [days, setDays] = useState("12");
  const [arrivaleDate, setArrivaleDate] = useState(new Date());
  const [activities, setActivities] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [packingList, setPackingList] = useState([]);

  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const googlePlacesRef = useRef<any>(null);
  const googleApiKey = Constants?.expoConfig?.extra?.googleApiKey;

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setArrivaleDate(date); // Update the selected date
    }
  };

  const toggleActivity = (activity: string) => {
    setActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const generatePackList = async () => {
    setShowPicker(false);
    setPackingList([]); // Clear previous packing list
    setLoading(true); // Show loading spinner
    const baseUrl = "http://192.168.0.103:5000";

    const activitiesString = activities.join(",");
    const question = `I will give you 4 parameters: destination, arrival date, amount of days to stay, and a list of activities to do there. 
                    You will give me in return a list of items that I need to pack for that trip, considering the weather as well. 
                    The parameters are: 
                    Destination: ${destination},
                    Arrival date: ${arrivaleDate},
                    Amount of days to stay: ${days},
                    List of activities: ${activitiesString}.
                      when you give me the list do not tell me why I need each one . 
                      dont forget to tell me about the basics as well such as passport, phone , cable charger etc . 
                    `;

    console.log(question);

    try {
      console.log("Sending request to the server...");
      const response = await axios.post(
        `${baseUrl}/api/gpt`,
        { question },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response from server:", response.data);
      const cleanedList = response.data
        .trim()
        .split("\n")
        .map((line: string) => line.replace(/^\d+\.\s*/, "").trim());
      setPackingList(cleanedList);
    } catch (error: any) {
      console.error("Error calling the server:", error.message);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  const validateForm = () => {
    const errors = {
      destination: destination.trim() === "",
      days: days.trim() === "" || isNaN(Number(days)) || Number(days) <= 0,
      activities: activities.length === 0,
    };
    return errors;
  };

  const formattedDate = arrivaleDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Plan Your Trip</Text>
          <View style={styles.inputContainer}>
            {/* Destination Input */}
            <Text style={styles.label}>Destination:</Text>
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
                textInputContainer: [
                  styles.autocompleteContainer,
                  { marginBottom: 0 }, // Reduce bottom margin
                ],
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
          </View>
          {/* Days Input */}
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.label}>Number of Days:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter number of days"
              keyboardType="numeric"
              value={days}
              onChangeText={setDays}
              placeholderTextColor="#aaa"
            />
          </View>
          {/* Arrival Date Input */}
          <Text style={styles.label}>Select a Date:</Text>
          <TouchableOpacity
            onPress={() => {
              setShowPicker((prev) => !prev);
            }}
          >
            <TextInput
              style={{ ...styles.input, pointerEvents: "none" }}
              value={formattedDate}
              editable={false} // Prevent typing; use the picker instead
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#aaa"
            />
          </TouchableOpacity>

          {/* Date Picker */}
          {showPicker && (
            <DateTimePicker
              value={arrivaleDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
            />
          )}
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

            {/* Generate Pack List Button */}
            <TouchableOpacity style={styles.button} onPress={generatePackList}>
              <Text style={styles.buttonText}>Generate Pack List</Text>
            </TouchableOpacity>

            {/* Loading Indicator */}
            {loading && (
              <ActivityIndicator
                size="large"
                color="#007BFF"
                style={{ marginTop: 20 }}
              />
            )}

            {/* Packing List Display */}
            {packingList.length > 0 && !loading && (
              <View style={styles.listContainer}>
                <Text style={styles.listTitle}>Packing List:</Text>
                <FlatList
                  data={packingList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <Text style={styles.listItem}>• {item}</Text>
                  )}
                />
              </View>
            )}
          </View>
        </View>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10, // Reduce spacing
    backgroundColor: "#fff",
    color: "#333",
  },
  autocompleteContainer: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10, // Adjust margin here
  },
  autocompleteInput: {
    fontSize: 16,
    paddingHorizontal: 10,
  },
  // scrollContainer: {
  //   flexGrow: 1,
  //   justifyContent: "center",
  //   padding: 20,
  // },
  // container: {
  //   flex: 1,
  //   justifyContent: "center",
  //   backgroundColor: "#f8f9fa",
  // },
  // title: {
  //   fontSize: 24,
  //   fontWeight: "bold",
  //   marginBottom: 20,
  //   textAlign: "center",
  //   color: "#333",
  // },
  // label: {
  //   fontSize: 16,
  //   marginBottom: 8,
  //   color: "#555",
  // },
  // input: {
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  //   borderRadius: 8,
  //   padding: 10,
  //   fontSize: 16,
  //   marginBottom: 16,
  //   backgroundColor: "#fff",
  //   color: "#333",
  // },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  listContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  listItem: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  // autocompleteContainer: {
  //   borderColor: "gray",
  //   borderWidth: 1,
  //   borderRadius: 5,
  // },
  // autocompleteInput: {
  //   fontSize: 16,
  //   paddingHorizontal: 10,
  // },
  inputContainer: {
    marginBottom: 15,
  },
  activitiesText: {
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

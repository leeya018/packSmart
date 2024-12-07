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
import { MaterialIcons } from "@expo/vector-icons";
import { generatePackingList } from "@/utils/packingListGenerator";
import "react-native-get-random-values";

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
  const [arrivaleDate, setArrivaleDate] = useState(new Date());
  const [activities, setActivities] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [packingList, setPackingList] = useState<string[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const googlePlacesRef = useRef<any>(null);
  const googleApiKey = Constants?.expoConfig?.extra?.googleApiKey;

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setArrivaleDate(date);
    }
  };

  console.log({ destination });

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

    const question = `I will give you 4 parameters: destination, arrival date, and amount of days to stay.
    You will give me in return a list of items that I need to pack for that trip, considering the weather as well.
    The parameters are: 
    Destination: ${destination},
    Arrival date: ${arrivaleDate},
    Amount of days to stay: ${days},
                    
    when you give me the list do not tell me why I need each one . `;

    console.log(question);

    try {
      console.log("Sending request to the server...");
      const response = await axios.post(
        `${baseUrl}/api/gpt`,
        { question },
        { headers: { "Content-Type": "application/json" } }
      );
      // items by the contry and time of arivale by gpt
      const trimmedPgtList = response.data
        .trim()
        .split("\n")
        .map((line: string) => line.replace(/^\d+\.\s*/, "").trim());

      // basic list + clothes by day and items for activities
      const activitiesAndBasicList = generatePackingList(
        parseInt(days),
        activities
      );

      // console.log({ activitiesAndBasicList });
      // console.log({ trimmedPgtList });
      const totalList: string[] = [
        ...activitiesAndBasicList,
        ...trimmedPgtList,
      ];
      // remove the duplications from the list
      setPackingList(Array.from(new Set(totalList)));
    } catch (error: any) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = arrivaleDate.toISOString().split("T")[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContainer}
        // onTouchEnd={() => setShowPicker(false)}
      >
        <Text style={styles.title}>Plan Your Perfect Trip</Text>

        {/* Destination Input */}
        <Text style={styles.label}>Destination</Text>
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
        {/* Number of Days */}
        <Text style={styles.label}>Number of Days</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter number of days"
          keyboardType="numeric"
          value={days}
          onChangeText={setDays}
        />

        {/* Arrival Date Picker */}
        <Text style={styles.label}>Arrival Date</Text>
        <TouchableOpacity
          onPress={(e) => {
            // e.stopPropagation();
            setShowPicker((prev) => !prev);
          }}
        >
          <View style={{ ...styles.datePicker, pointerEvents: "none" }}>
            <Text style={styles.datePickerText}>{formattedDate}</Text>
            <MaterialIcons name="date-range" size={24} color="#007BFF" />
          </View>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={arrivaleDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}

        {/* Activities Selector */}
        <TouchableOpacity
          style={styles.activitiesButton}
          onPress={() => {
            setShowPicker(false);
            setModalVisible(true);
          }}
        >
          <Text style={styles.activitiesButtonText}>Select Activities</Text>
        </TouchableOpacity>
        <Text style={styles.activitiesText}>
          Selected: {activities.join(", ") || "None"}
        </Text>

        {/* Generate Pack List Button */}
        <TouchableOpacity
          style={styles.generateButton}
          onPress={generatePackList}
        >
          <Text style={styles.generateButtonText}>Generate Packing List</Text>
        </TouchableOpacity>

        {/* Loading Spinner */}
        {loading && <ActivityIndicator size="large" color="#007BFF" />}

        {/* Packing List */}
        {packingList.length > 0 && !loading && (
          <View style={styles.packingList}>
            <Text style={styles.packingTitle}>Packing List</Text>
            <FlatList
              data={packingList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={styles.packingItem}>• {item}</Text>
              )}
            />
          </View>
        )}
      </ScrollView>
      {/* Activities Modal */}
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
    backgroundColor: "#f0f8ff",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#007BFF",
  },
  label: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
  },
  datePickerText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  activitiesButton: {
    backgroundColor: "#32CD32",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  activitiesButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  activitiesText: {
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  generateButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  packingList: {
    backgroundColor: "#e6f7ff",
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  packingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007BFF",
  },
  packingItem: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
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
});

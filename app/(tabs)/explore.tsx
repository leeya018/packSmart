import React, { useState } from "react";
import {
  StyleSheet,
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

export default function TabTwoScreen() {
  const [destination, setDestination] = useState("israel");
  const [days, setDays] = useState("12");
  const [arrivaleDate, setArrivaleDate] = useState(new Date());
  const [packingList, setPackingList] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setArrivaleDate(date); // Update the selected date
    }
  };

  const generatePackList = async () => {
    setShowPicker(false);
    setPackingList([]); // Clear previous packing list
    setLoading(true); // Show loading spinner
    const baseUrl = "http://172.20.10.4:5000";
    const conutry = "Israel";
    const date = new Date(arrivaleDate);
    const daysToStay = 12;
    const question = `according to the country : ${conutry} and the date for arriving to that place : ${date} and the amount of days to stay : ${daysToStay}
       I want to give me a list of things that I need to pack according to the weather there at that time, make the list to made of clothes , shoes, and accesories for the weather  `;

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

  const formattedDate = arrivaleDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Plan Your Trip</Text>

          {/* Destination Input */}
          <Text style={styles.label}>Destination:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter destination"
            value={destination}
            onChangeText={setDestination}
            placeholderTextColor="#aaa"
          />

          {/* Days Input */}
          <Text style={styles.label}>Number of Days:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter number of days"
            keyboardType="numeric"
            value={days}
            onChangeText={setDays}
            placeholderTextColor="#aaa"
          />

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
      </ScrollView>
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
    marginBottom: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
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
});

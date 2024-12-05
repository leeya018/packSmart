import axios from "axios";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";

export default function TabTwoScreen() {
  const [destination, setDestination] = useState("island");
  const [days, setDays] = useState("12");
  const [arrivaleDate, setArrivaleDate] = useState("2024-01-01");
  const [packingList, setPackingList] = useState([]);

  const generatePackList = async () => {
    const baseUrl = "http://172.20.10.4:5000";
    const conutry = "Israel";
    const date = new Date();
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
    }
  };

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
          <Text style={styles.label}>Arrival Date:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter arrival date (YYYY-MM-DD)"
            value={arrivaleDate}
            onChangeText={setArrivaleDate}
            placeholderTextColor="#aaa"
          />

          {/* Generate Pack List Button */}
          <TouchableOpacity style={styles.button} onPress={generatePackList}>
            <Text style={styles.buttonText}>Generate Pack List</Text>
          </TouchableOpacity>

          {/* Packing List Display */}
          {packingList.length > 0 && (
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

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

export default function TabTwoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContainer}
        // onTouchEnd={() => setShowPicker(false)}
      >
        <Text>what are we going to explore</Text>
      </ScrollView>
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

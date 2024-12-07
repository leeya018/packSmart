import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

interface ActivitySelectorProps {
  activities: string[];
  selectedActivities: string[];
  onToggleActivity: (activity: string) => void;
  onClose: () => void;
  onCloseKeyboard: () => void;
}

const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  activities,
  selectedActivities,
  onToggleActivity,
  onClose,
  onCloseKeyboard,
}) => {
  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>Select Activities</Text>
        <ScrollView style={styles.activitiesList}>
          {activities.map((activity) => (
            <TouchableOpacity
              key={activity}
              style={[
                styles.activityItem,
                selectedActivities.includes(activity) &&
                  styles.selectedActivity,
              ]}
              onPress={() => onToggleActivity(activity)}
            >
              <Text
                style={[
                  styles.activityText,
                  selectedActivities.includes(activity) &&
                    styles.selectedActivityText,
                ]}
              >
                {activity}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            onClose();
            onCloseKeyboard();
          }}
        >
          <Text style={styles.closeButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  activitiesList: {
    width: "100%",
  },
  activityItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  selectedActivity: {
    backgroundColor: "#007AFF",
  },
  activityText: {
    fontSize: 16,
  },
  selectedActivityText: {
    color: "white",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ActivitySelector;

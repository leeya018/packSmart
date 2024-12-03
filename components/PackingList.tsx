import React from "react";
import { StyleSheet, Text, View, FlatList, ScrollView } from "react-native";

interface PackingListProps {
  items: string[];
}

const PackingList: React.FC<PackingListProps> = ({ items }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Packing List:</Text>
        <FlatList
          data={items}
          renderItem={({ item }) => <Text style={styles.item}>• {item}</Text>}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default PackingList;

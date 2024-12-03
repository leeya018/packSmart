export function generatePackingList(
  destination: string,
  days: number,
  activities: string[]
): string[] {
  const basicItems = [
    "Passport",
    "Phone charger",
    "Toothbrush",
    "Toothpaste",
    "Deodorant",
  ];

  const clothingItems = ["Underwear", "Socks", "T-shirts", "Pants/shorts"];

  const packingList = [...basicItems];

  // Add clothing items based on the number of days
  clothingItems.forEach((item) => {
    packingList.push(`${item} (${days})`);
  });

  // Add items based on destination
  if (destination.toLowerCase().includes("beach")) {
    packingList.push("Swimsuit", "Sunscreen", "Beach towel");
  }

  if (destination.toLowerCase().includes("mountain")) {
    packingList.push("Hiking boots", "Warm jacket");
  }

  // Add items based on activities
  activities.forEach((activity) => {
    switch (activity.toLowerCase().trim()) {
      case "swimming":
        packingList.push("Swimsuit", "Goggles");
        break;
      case "hiking":
        packingList.push("Hiking boots", "Water bottle");
        break;
      case "skiing":
        packingList.push("Ski gear", "Warm clothing");
        break;
      // Add more activities and corresponding items as needed
    }
  });

  // Remove duplicates
  return Array.from(new Set(packingList));
}

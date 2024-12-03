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

  // Add items based on activities
  activities.forEach((activity) => {
    switch (activity.toLowerCase()) {
      case "swimming":
        packingList.push("Swimsuit", "Goggles", "Beach towel");
        break;
      case "hiking":
        packingList.push("Hiking boots", "Water bottle", "Backpack");
        break;
      case "skiing":
        packingList.push("Ski gear", "Warm clothing", "Gloves");
        break;
      case "sightseeing":
        packingList.push("Comfortable walking shoes", "Camera", "City map");
        break;
      case "beach":
        packingList.push("Sunscreen", "Beach umbrella", "Flip flops");
        break;
      case "city exploration":
        packingList.push("Comfortable shoes", "City guide", "Day bag");
        break;
      case "mountain climbing":
        packingList.push("Climbing gear", "First-aid kit", "Energy bars");
        break;
      case "camping":
        packingList.push("Tent", "Sleeping bag", "Camping stove");
        break;
    }
  });

  // Remove duplicates
  return Array.from(new Set(packingList));
}

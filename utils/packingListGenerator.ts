export function generatePackingList(
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
    // console.log(`${item} (${days})`);
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
      case "snorkeling":
        packingList.push("Snorkel", "Fins", "Underwater camera");
        break;
      case "scuba diving":
        packingList.push("Diving suit", "Regulator", "Dive computer");
        break;
      case "surfing":
        packingList.push("Surfboard", "Wetsuit", "Wax");
        break;
      case "kayaking":
        packingList.push("Kayak", "Life jacket", "Dry bag");
        break;
      case "cycling":
        packingList.push("Bicycle", "Helmet", "Cycling gloves");
        break;
      case "photography":
        packingList.push("Camera", "Tripod", "Extra batteries");
        break;
      case "wildlife watching":
        packingList.push("Binoculars", "Field guide", "Camouflage clothing");
        break;
      case "museum visits":
        packingList.push("Notebook", "Pen", "Museum guidebook");
        break;
      case "food tours":
        packingList.push(
          "Comfortable shoes",
          "Reusable utensils",
          "Notebook for food notes"
        );
        break;
      case "yoga retreats":
        packingList.push("Yoga mat", "Comfortable clothing", "Water bottle");
        break;
      default:
        console.warn(`Activity "${activity}" not recognized.`);
        break;
    }
  });

  // Remove duplicates
  return Array.from(new Set(packingList));
}

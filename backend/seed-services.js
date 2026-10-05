require("dotenv").config();
const mongoose = require("mongoose");
const Service = require("./src/models/Service");

const services = [
  {
    name: "Plumber",
    icon: "water-outline",
    title: "Plumbing Services",
    description: "Leaks, taps, pipes & plumbing",
    options: [
      "Fix water leakage",
      "Tap & faucet repair",
      "Pipe repair",
      "Bathroom plumbing",
      "Kitchen plumbing",
      "Water tank service",
    ],
    active: true,
  },
  {
    name: "Electrician",
    icon: "flash-outline",
    title: "Electrical Services",
    description: "Wiring, switches & electrical work",
    options: [
      "Switch & socket repair",
      "Fan installation",
      "Light installation",
      "Wiring & rewiring",
      "Power issue diagnosis",
      "Electrical inspection",
    ],
    active: true,
  },
  {
    name: "AC Service",
    icon: "snow-outline",
    title: "AC Services",
    description: "Repair, service & installation",
    options: [
      "AC not cooling",
      "AC servicing",
      "AC gas check",
      "AC installation",
      "AC water leakage",
      "AC noise problem",
    ],
    active: true,
  },
  {
    name: "Appliance Repair",
    icon: "construct-outline",
    title: "Appliance Repair",
    description: "Repair your home appliances",
    options: [
      "Refrigerator repair",
      "Washing machine repair",
      "Microwave repair",
      "TV repair",
      "Dishwasher repair",
      "Other appliance",
    ],
    active: true,
  },
  {
    name: "Home Cleaning",
    icon: "sparkles-outline",
    title: "Home Cleaning",
    description: "Regular & professional cleaning",
    options: [
      "Regular home cleaning",
      "Kitchen cleaning",
      "Bathroom cleaning",
      "Bedroom cleaning",
      "Living room cleaning",
      "Full home cleaning",
    ],
    active: true,
  },
  {
    name: "Deep Cleaning",
    icon: "star-outline",
    title: "Deep Cleaning",
    description: "Complete home deep cleaning",
    options: [
      "Full home deep cleaning",
      "Kitchen deep cleaning",
      "Bathroom deep cleaning",
      "Sofa cleaning",
      "Floor deep cleaning",
      "Move-in cleaning",
    ],
    active: true,
  },
  {
    name: "Pest Control",
    icon: "bug-outline",
    title: "Pest Control",
    description: "Protect your home from pests",
    options: [
      "Cockroach control",
      "Ant control",
      "Mosquito control",
      "Termite treatment",
      "Rodent control",
      "General pest control",
    ],
    active: true,
  },
  {
    name: "Painting",
    icon: "color-palette-outline",
    title: "Painting Services",
    description: "Interior & exterior painting",
    options: [
      "Single room painting",
      "Full home painting",
      "Interior painting",
      "Exterior painting",
      "Wall touch-up",
      "Colour consultation",
    ],
    active: true,
  },
  {
    name: "Carpenter",
    icon: "hammer-outline",
    title: "Carpentry Services",
    description: "Furniture, doors & woodwork",
    options: [
      "Furniture repair",
      "Door repair",
      "Shelf installation",
      "Furniture assembly",
      "Custom woodwork",
      "General carpentry",
    ],
    active: true,
  },
  {
    name: "Interior Work",
    icon: "home-outline",
    title: "Interior Services",
    description: "Design & home improvement",
    options: [
      "Interior consultation",
      "Living room design",
      "Bedroom design",
      "Kitchen improvement",
      "Lighting design",
      "Home renovation",
    ],
    active: true,
  },
  {
    name: "Installation",
    icon: "build-outline",
    title: "Installation Services",
    description: "Professional product installation",
    options: [
      "TV installation",
      "Appliance installation",
      "Fan installation",
      "Light installation",
      "Curtain installation",
      "Other installation",
    ],
    active: true,
  },
  {
    name: "Moving",
    icon: "cube-outline",
    title: "Moving Services",
    description: "Safe home shifting services",
    options: [
      "Local home shifting",
      "Packing service",
      "Loading & unloading",
      "Furniture moving",
      "Office shifting",
      "Full moving service",
    ],
    active: true,
  },
];

async function seedServices() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected.");

    for (const service of services) {
      await Service.findOneAndUpdate(
        { name: service.name },
        service,
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

      console.log(`✓ ${service.name}`);
    }

    console.log("");
    console.log("================================");
    console.log("12 services seeded successfully!");
    console.log("================================");
  } catch (error) {
    console.error("Service seed error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
}

seedServices();
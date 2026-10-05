require("dotenv").config();
const mongoose = require("mongoose");
const Professional = require("./src/models/Professional");

const professionals = [
  {
    name: "Arjun Kumar",
    phone: "9000000001",
    email: "arjun@homeai.com",
    service: "Plumber",
    category: "Home Repair",
    experience: "8 years",
    rating: 4.9,
    reviews: 124,
    price: "₹499",
    location: "Bengaluru",
    image: "",
    available: true,
    verified: true,
    active: true,
  },
  {
    name: "Ravi Electricals",
    phone: "9000000002",
    email: "ravi@homeai.com",
    service: "Electrician",
    category: "Home Repair",
    experience: "7 years",
    rating: 4.8,
    reviews: 98,
    price: "₹449",
    location: "Bengaluru",
    image: "",
    available: true,
    verified: true,
    active: true,
  },
  {
    name: "CoolCare AC Experts",
    phone: "9000000003",
    email: "coolcare@homeai.com",
    service: "AC Service",
    category: "Home Repair",
    experience: "9 years",
    rating: 4.9,
    reviews: 156,
    price: "₹599",
    location: "Bengaluru",
    image: "",
    available: true,
    verified: true,
    active: true,
  },
  {
    name: "HomeFix Appliances",
    phone: "9000000004",
    email: "homefix@homeai.com",
    service: "Appliance Repair",
    category: "Home Repair",
    experience: "6 years",
    rating: 4.7,
    reviews: 87,
    price: "₹499",
    location: "Bengaluru",
    image: "",
    available: true,
    verified: true,
    active: true,
  },
  {
    name: "Sparkle Home Care",
    phone: "9000000005",
    email: "sparkle@homeai.com",
    service: "Home Cleaning",
    category: "Home Care",
    experience: "5 years",
    rating: 4.8,
    reviews: 112,
    price: "₹699",
    location: "Bengaluru",
    image: "",
    available: true,
    verified: true,
    active: true,
  },
  {
    name: "PureHome Cleaning",
    phone: "9000000006",
    email: "purehome@homeai.com",
    service: "Deep Cleaning",
    category: "Home Care",
    experience: "6 years",
    rating: 4.9,
    reviews: 134,
    price: "₹999",
    location: "Bengaluru",
    image: "",
    available: true,
    verified: true,
    active: true,
  },
  {
    name: "SafeShield Pest Control",
    phone: "9000000007",
    email: "safeshield@homeai.com",
    service: "Pest Control",
    category: "Home Care",
    experience: "7 years",
    rating: 4.8,
    reviews: 91,
    price: "₹799",
    location: "Bengaluru",
    image: "",
    available: true,
    verified: true,
    active: true,
  },
  {
    name: "ColorCraft Painters",
    phone: "9000000008",
    email: "colorcraft@homeai.com",
    service: "Painting",
    category: "Home Care",
    experience: "10 years",
    rating: 4.8,
    reviews: 76,
    price: "₹1,499",
    location: "Bengaluru",
    image: "",
    available: true,
    verified: true,
    active: true,
  },
  {
    name: "MasterWood Carpentry",
    phone: "9000000009",
    email: "masterwood@homeai.com",
    service: "Carpenter",
    category: "Home Improvement",
    experience: "12 years",
    rating: 4.9,
    reviews: 143,
    price: "₹549",
    location: "Bengaluru",
    image: "",
    available: true,
    verified: true,
    active: true,
  },
  {
    name: "Urban Interior Studio",
    phone: "9000000010",
    email: "urbaninterior@homeai.com",
    service: "Interior Work",
    category: "Home Improvement",
    experience: "11 years",
    rating: 4.9,
    reviews: 65,
    price: "₹999",
    location: "Bengaluru",
    image: "",
    available: true,
    verified: true,
    active: true,
  },
  {
    name: "ProInstall Services",
    phone: "9000000011",
    email: "proinstall@homeai.com",
    service: "Installation",
    category: "Home Improvement",
    experience: "6 years",
    rating: 4.8,
    reviews: 83,
    price: "₹399",
    location: "Bengaluru",
    image: "",
    available: true,
    verified: true,
    active: true,
  },
  {
    name: "SafeMove Relocations",
    phone: "9000000012",
    email: "safemove@homeai.com",
    service: "Moving",
    category: "Home Improvement",
    experience: "8 years",
    rating: 4.7,
    reviews: 72,
    price: "₹1,999",
    location: "Bengaluru",
    image: "",
    available: true,
    verified: true,
    active: true,
  },
];

async function seedProfessionals() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected.");

    for (const professional of professionals) {
      await Professional.findOneAndUpdate(
        {
          email: professional.email,
        },
        professional,
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

      console.log(`✓ ${professional.name}`);
    }

    console.log("");
    console.log("================================");
    console.log("12 professionals seeded successfully!");
    console.log("================================");
  } catch (error) {
    console.error("Professional seed error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
}

seedProfessionals();
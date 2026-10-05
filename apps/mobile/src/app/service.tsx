import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

const serviceData: Record<
  string,
  {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    options: string[];
  }
> = {
  Plumber: {
    icon: "water-outline",
    title: "Plumbing Services",
    description:
      "Professional plumbing help for leaks, taps, pipes and more.",
    options: [
      "Fix water leakage",
      "Tap & faucet repair",
      "Pipe repair",
      "Bathroom plumbing",
      "Kitchen plumbing",
      "Water tank service",
    ],
  },

  Electrician: {
    icon: "flash-outline",
    title: "Electrical Services",
    description:
      "Trusted electricians for safe and reliable electrical work.",
    options: [
      "Switch & socket repair",
      "Fan installation",
      "Light installation",
      "Wiring & rewiring",
      "Power issue diagnosis",
      "Electrical inspection",
    ],
  },

  "AC Service": {
    icon: "snow-outline",
    title: "AC Services",
    description:
      "AC repair, servicing and installation by trained professionals.",
    options: [
      "AC not cooling",
      "AC servicing",
      "AC gas check",
      "AC installation",
      "AC water leakage",
      "AC noise problem",
    ],
  },

  "Home Cleaning": {
    icon: "sparkles-outline",
    title: "Home Cleaning",
    description:
      "Professional cleaning services for a fresh and healthy home.",
    options: [
      "Regular home cleaning",
      "Kitchen cleaning",
      "Bathroom cleaning",
      "Bedroom cleaning",
      "Living room cleaning",
      "Full home cleaning",
    ],
  },

  "Deep Cleaning": {
    icon: "star-outline",
    title: "Deep Cleaning",
    description:
      "Detailed cleaning for every important area of your home.",
    options: [
      "Full home deep cleaning",
      "Kitchen deep cleaning",
      "Bathroom deep cleaning",
      "Sofa cleaning",
      "Floor deep cleaning",
      "Move-in cleaning",
    ],
  },

  "Pest Control": {
    icon: "bug-outline",
    title: "Pest Control",
    description:
      "Professional pest treatment to keep your home protected.",
    options: [
      "Cockroach control",
      "Ant control",
      "Mosquito control",
      "Termite treatment",
      "Rodent control",
      "General pest control",
    ],
  },

  Painting: {
    icon: "color-palette-outline",
    title: "Painting Services",
    description:
      "Professional painting for beautiful and refreshed spaces.",
    options: [
      "Single room painting",
      "Full home painting",
      "Interior painting",
      "Exterior painting",
      "Wall touch-up",
      "Colour consultation",
    ],
  },

  Carpenter: {
    icon: "hammer-outline",
    title: "Carpentry Services",
    description:
      "Skilled carpenters for furniture, doors and woodwork.",
    options: [
      "Furniture repair",
      "Door repair",
      "Shelf installation",
      "Furniture assembly",
      "Custom woodwork",
      "General carpentry",
    ],
  },

  Appliance: {
    icon: "construct-outline",
    title: "Appliance Repair",
    description:
      "Professional repair for your home appliances.",
    options: [
      "Refrigerator repair",
      "Washing machine repair",
      "Microwave repair",
      "TV repair",
      "Dishwasher repair",
      "Other appliance",
    ],
  },

  "Appliance Repair": {
    icon: "construct-outline",
    title: "Appliance Repair",
    description:
      "Professional repair for your home appliances.",
    options: [
      "Refrigerator repair",
      "Washing machine repair",
      "Microwave repair",
      "TV repair",
      "Dishwasher repair",
      "Other appliance",
    ],
  },

  "Interior Work": {
    icon: "home-outline",
    title: "Interior Services",
    description:
      "Improve your home with professional interior services.",
    options: [
      "Interior consultation",
      "Living room design",
      "Bedroom design",
      "Kitchen improvement",
      "Lighting design",
      "Home renovation",
    ],
  },

  Installation: {
    icon: "build-outline",
    title: "Installation Services",
    description:
      "Professional installation for products around your home.",
    options: [
      "TV installation",
      "Appliance installation",
      "Fan installation",
      "Light installation",
      "Curtain installation",
      "Other installation",
    ],
  },

  Moving: {
    icon: "cube-outline",
    title: "Moving Services",
    description:
      "Safe and reliable help for moving your home.",
    options: [
      "Local home shifting",
      "Packing service",
      "Loading & unloading",
      "Furniture moving",
      "Office shifting",
      "Full moving service",
    ],
  },
};

export default function ServiceScreen() {
  const params = useLocalSearchParams();
  const serviceName = String(params.name || "Plumber");

  const service =
    serviceData[serviceName] || serviceData.Plumber;

  const selectOption = (option: string) => {
  router.push({
    pathname: "/booking-details",
    params: {
      service: service.title,
      option,
    },
  });
};

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#F7F1E3"
          />
        </TouchableOpacity>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons
              name={service.icon}
              size={38}
              color="#D8B56A"
            />
          </View>

          <Text style={styles.heroTitle}>
            {service.title}
          </Text>

          <Text style={styles.heroDescription}>
            {service.description}
          </Text>
        </View>

        {/* What do you need? */}
        <Text style={styles.sectionTitle}>
          What do you need?
        </Text>

        <Text style={styles.sectionSubtitle}>
          Choose the service that best matches your requirement.
        </Text>

        {service.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.optionCard}
            activeOpacity={0.75}
            onPress={() => selectOption(option)}
          >
            <View style={styles.optionIcon}>
              <Ionicons
                name="checkmark-circle-outline"
                size={23}
                color="#D8B56A"
              />
            </View>

            <Text style={styles.optionText}>
              {option}
            </Text>

            <Ionicons
              name="chevron-forward"
              size={19}
              color="#666"
            />
          </TouchableOpacity>
        ))}

        {/* AI help */}
        <TouchableOpacity
          style={styles.aiCard}
          activeOpacity={0.8}
          onPress={() => router.push("/ai")}
        >
          <Ionicons
            name="sparkles"
            size={25}
            color="#D8B56A"
          />

          <View style={styles.aiTextContainer}>
            <Text style={styles.aiTitle}>
              Not sure which one?
            </Text>

            <Text style={styles.aiText}>
              Ask HomeAI to understand your problem.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#D8B56A"
          />
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },

  content: {
    padding: 20,
    paddingTop: 58,
    paddingBottom: 40,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#181818",
    borderWidth: 1,
    borderColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },

  hero: {
    backgroundColor: "#191919",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#35312A",
    padding: 24,
    alignItems: "center",
  },

  heroIcon: {
    width: 78,
    height: 78,
    borderRadius: 25,
    backgroundColor: "#292214",
    borderWidth: 1,
    borderColor: "#4A3B20",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  heroTitle: {
    color: "#F7F1E3",
    fontSize: 27,
    fontWeight: "800",
    textAlign: "center",
  },

  heroDescription: {
    color: "#858585",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 10,
  },

  sectionTitle: {
    color: "#F7F1E3",
    fontSize: 21,
    fontWeight: "800",
    marginTop: 32,
  },

  sectionSubtitle: {
    color: "#707070",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
    marginBottom: 15,
  },

  optionCard: {
    minHeight: 64,
    backgroundColor: "#191919",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#292929",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
  },

  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#242016",
    alignItems: "center",
    justifyContent: "center",
  },

  optionText: {
    flex: 1,
    color: "#E5E5E5",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 13,
  },

  aiCard: {
    marginTop: 25,
    backgroundColor: "#191919",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4A3B20",
    minHeight: 75,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  aiTextContainer: {
    flex: 1,
    marginLeft: 13,
    marginRight: 10,
  },

  aiTitle: {
    color: "#F7F1E3",
    fontSize: 14,
    fontWeight: "700",
  },

  aiText: {
    color: "#777",
    fontSize: 11,
    marginTop: 4,
  },

  bottomSpace: {
    height: 20,
  },
});
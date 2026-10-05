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

const professionals = [
  {
    id: "1",
    name: "Rajesh Kumar",
    initials: "RK",
    rating: "4.9",
    jobs: "520",
    distance: "1.2 km",
    price: "₹499",
    experience: "8 years",
    available: "Available today",
  },
  {
    id: "2",
    name: "Manoj Services",
    initials: "MS",
    rating: "4.8",
    jobs: "386",
    distance: "2.4 km",
    price: "₹549",
    experience: "6 years",
    available: "Available today",
  },
  {
    id: "3",
    name: "HomeFix Pro",
    initials: "HP",
    rating: "4.7",
    jobs: "740",
    distance: "3.1 km",
    price: "₹599",
    experience: "10 years",
    available: "Available tomorrow",
  },
];

export default function ProfessionalsScreen() {
  const params = useLocalSearchParams();

  const service = String(
    params.service || "Home Service"
  );

  const option = String(
    params.option || "General service"
  );

  const date = String(
    params.date || "Tomorrow"
  );

  const time = String(
    params.time || "10:00 AM"
  );

  const address = String(
    params.address || "Home address"
  );

  const selectProfessional = (professional: {
    id: string;
    name: string;
    rating: string;
    price: string;
  }) => {
    router.push({
      pathname: "/final-booking",
      params: {
        service,
        option,
        date,
        time,
        address,
        professionalId: professional.id,
        professionalName: professional.name,
        rating: professional.rating,
        price: professional.price,
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
            size={22}
            color="#F7F1E3"
          />
        </TouchableOpacity>

        <Text style={styles.brand}>
          HOMEAI
        </Text>

        <Text style={styles.title}>
          Choose a Professional
        </Text>

        <Text style={styles.subtitle}>
          Verified professionals available for your service.
        </Text>

        {/* Selected Service */}
        <View style={styles.serviceBar}>
          <View style={styles.serviceIcon}>
            <Ionicons
              name="construct-outline"
              size={21}
              color="#D8B56A"
            />
          </View>

          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>
              {service}
            </Text>

            <Text style={styles.serviceOption}>
              {option}
            </Text>
          </View>
        </View>

        {/* Result info */}
        <View style={styles.resultRow}>
          <Text style={styles.resultText}>
            {professionals.length} professionals found
          </Text>

          <View style={styles.verifiedSmall}>
            <Ionicons
              name="shield-checkmark"
              size={13}
              color="#D8B56A"
            />

            <Text style={styles.verifiedSmallText}>
              Verified
            </Text>
          </View>
        </View>

        {/* Professionals */}
        {professionals.map((professional) => (
          <View
            key={professional.id}
            style={styles.professionalCard}
          >
            {/* Top */}
            <View style={styles.topRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {professional.initials}
                </Text>
              </View>

              <View style={styles.professionalInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.professionalName}>
                    {professional.name}
                  </Text>

                  <Ionicons
                    name="checkmark-circle"
                    size={17}
                    color="#D8B56A"
                  />
                </View>

                <Text style={styles.experience}>
                  {professional.experience} experience
                </Text>
              </View>
            </View>

            {/* NEW: View Profile */}
            <TouchableOpacity
              style={styles.viewProfileButton}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/professional-profile",
                  params: {
                    name: professional.name,
                    initials: professional.initials,
                    rating: professional.rating,
                    jobs: professional.jobs,
                    distance: professional.distance,
                    price: professional.price,
                    experience: professional.experience,
                    available: professional.available,
                    service,
                    option,
                    date,
                    time,
                    address,
                    professionalId: professional.id,
                  },
                })
              }
            >
              <Text style={styles.viewProfileText}>
                View Profile
              </Text>

              <Ionicons
                name="chevron-forward"
                size={16}
                color="#D8B56A"
              />
            </TouchableOpacity>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Ionicons
                  name="star"
                  size={15}
                  color="#D8B56A"
                />

                <Text style={styles.statText}>
                  {professional.rating}
                </Text>
              </View>

              <View style={styles.stat}>
                <Ionicons
                  name="briefcase-outline"
                  size={15}
                  color="#777"
                />

                <Text style={styles.statText}>
                  {professional.jobs} jobs
                </Text>
              </View>

              <View style={styles.stat}>
                <Ionicons
                  name="location-outline"
                  size={15}
                  color="#777"
                />

                <Text style={styles.statText}>
                  {professional.distance}
                </Text>
              </View>
            </View>

            {/* Availability */}
            <View style={styles.availabilityRow}>
              <View style={styles.availableDot} />

              <Text style={styles.availableText}>
                {professional.available}
              </Text>
            </View>

            {/* Bottom */}
            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.startingLabel}>
                  STARTING FROM
                </Text>

                <Text style={styles.price}>
                  {professional.price}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.selectButton}
                activeOpacity={0.8}
                onPress={() =>
                  selectProfessional(professional)
                }
              >
                <Text style={styles.selectText}>
                  Select
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={17}
                  color="#101010"
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Trust card */}
        <View style={styles.trustCard}>
          <Ionicons
            name="shield-checkmark-outline"
            size={26}
            color="#D8B56A"
          />

          <View style={styles.trustContent}>
            <Text style={styles.trustTitle}>
              HomeAI Verified Professionals
            </Text>

            <Text style={styles.trustText}>
              Professionals are verified before joining the HomeAI
              marketplace.
            </Text>
          </View>
        </View>

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
    marginBottom: 25,
  },

  brand: {
    color: "#D8B56A",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
  },

  title: {
    color: "#F7F1E3",
    fontSize: 29,
    fontWeight: "800",
    marginTop: 5,
  },

  subtitle: {
    color: "#777",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
    marginBottom: 22,
  },

  serviceBar: {
    backgroundColor: "#191919",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#35312A",
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
  },

  serviceInfo: {
    marginLeft: 12,
  },

  serviceName: {
    color: "#F7F1E3",
    fontSize: 13,
    fontWeight: "700",
  },

  serviceOption: {
    color: "#777",
    fontSize: 10,
    marginTop: 4,
  },

  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 25,
    marginBottom: 13,
  },

  resultText: {
    color: "#888",
    fontSize: 12,
  },

  verifiedSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  verifiedSmallText: {
    color: "#D8B56A",
    fontSize: 10,
    fontWeight: "600",
  },

  professionalCard: {
    backgroundColor: "#191919",
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 17,
    marginBottom: 13,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#292214",
    borderWidth: 1,
    borderColor: "#4A3B20",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#D8B56A",
    fontSize: 16,
    fontWeight: "800",
  },

  professionalInfo: {
    flex: 1,
    marginLeft: 13,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  professionalName: {
    color: "#F7F1E3",
    fontSize: 15,
    fontWeight: "700",
  },

  experience: {
    color: "#777",
    fontSize: 11,
    marginTop: 5,
  },

  /* NEW: View Profile Button */
  viewProfileButton: {
    marginTop: 13,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3A3222",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  /* NEW: View Profile Text */
  viewProfileText: {
    color: "#D8B56A",
    fontSize: 11,
    fontWeight: "700",
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    gap: 18,
  },

  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  statText: {
    color: "#999",
    fontSize: 10,
  },

  availabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  availableDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#D8B56A",
    marginRight: 7,
  },

  availableText: {
    color: "#D8B56A",
    fontSize: 10,
    fontWeight: "600",
  },

  cardBottom: {
    borderTopWidth: 1,
    borderTopColor: "#292929",
    marginTop: 16,
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  startingLabel: {
    color: "#555",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1,
  },

  price: {
    color: "#D8B56A",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 3,
  },

  selectButton: {
    height: 43,
    paddingHorizontal: 17,
    borderRadius: 14,
    backgroundColor: "#D8B56A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  selectText: {
    color: "#101010",
    fontSize: 12,
    fontWeight: "800",
  },

  trustCard: {
    backgroundColor: "#181818",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  trustContent: {
    flex: 1,
    marginLeft: 12,
  },

  trustTitle: {
    color: "#D9D9D9",
    fontSize: 12,
    fontWeight: "700",
  },

  trustText: {
    color: "#666",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  bottomSpace: {
    height: 20,
  },
});
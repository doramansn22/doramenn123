import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const services = [
  { name: "Plumber", icon: "water-outline" as const },
  { name: "Electrician", icon: "flash-outline" as const },
  { name: "AC Service", icon: "snow-outline" as const },
  { name: "Cleaning", icon: "sparkles-outline" as const },
  { name: "Carpenter", icon: "hammer-outline" as const },
  { name: "Painting", icon: "color-palette-outline" as const },
  { name: "Appliance", icon: "construct-outline" as const },
  { name: "Pest Control", icon: "bug-outline" as const },
];

export default function HomeScreen() {
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem("homeai_auth_token");

      if (!token) {
        router.replace("/auth");
        return;
      }
    } catch (error) {
      console.log("Authentication check error:", error);
      router.replace("/auth");
      return;
    } finally {
      setAuthChecking(false);
    }
  };

  // Open the Services screen
  const handleServicePress = (service: string) => {
    router.push("/services");
  };

  // Open the HomeAI Assistant
  const handleAI = () => {
    router.push("/ai");
  };

  // Open the Services screen
  const handleSeeAllServices = () => {
    router.push("/services");
  };

  // Open Bookings
  const handleBookings = () => {
    router.push("/bookings");
  };

  // Open Profile
  const handleProfile = () => {
    router.push("/profile");
  };

  if (authChecking) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>HOMEAI</Text>
            <Text style={styles.tagline}>Your Home. Managed by AI.</Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              style={styles.accountButton}
              onPress={() => router.push("/account")}
            >
              <Ionicons
                name="person-outline"
                size={21}
                color="#D8B56A"
              />
            </Pressable>

            <Pressable
              style={styles.notificationButton}
              onPress={() =>
                Alert.alert(
                  "Notifications",
                  "Your HomeAI notifications will appear here."
                )
              }
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#F7F1E3"
              />

              <View style={styles.notificationDot} />
            </Pressable>
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Good evening 👋</Text>

          <Text style={styles.greetingSubtitle}>
            How can we take care of your home today?
          </Text>
        </View>

        {/* AI Card */}
        <Pressable style={styles.aiCard} onPress={handleAI}>
          <View style={styles.aiGlow} />

          <View style={styles.aiTopRow}>
            <View style={styles.aiIcon}>
              <Ionicons
                name="sparkles"
                size={22}
                color="#D8B56A"
              />
            </View>

            <View style={styles.aiBadge}>
              <View style={styles.onlineDot} />

              <Text style={styles.aiBadgeText}>
                AI READY
              </Text>
            </View>
          </View>

          <Text style={styles.aiTitle}>
            Ask HomeAI
          </Text>

          <Text style={styles.aiDescription}>
            Tell me what's happening at home. I'll help you find the right
            solution.
          </Text>

          {/* AI Search/Input */}
          <Pressable
            style={styles.aiInput}
            onPress={handleAI}
          >
            <Text style={styles.aiPlaceholder}>
              "My AC is not cooling..."
            </Text>

            <View style={styles.micButton}>
              <Ionicons
                name="mic-outline"
                size={20}
                color="#101010"
              />
            </View>
          </Pressable>
        </Pressable>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Quick Services
          </Text>

          <Pressable onPress={handleSeeAllServices}>
            <Text style={styles.seeAll}>
              See all
            </Text>
          </Pressable>
        </View>

        {/* Services */}
        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <Pressable
              key={service.name}
              style={({ pressed }) => [
                styles.serviceCard,
                pressed && styles.pressed,
              ]}
              onPress={() => handleServicePress(service.name)}
            >
              <View style={styles.serviceIconContainer}>
                <Ionicons
                  name={service.icon}
                  size={24}
                  color="#D8B56A"
                />
              </View>

              <Text style={styles.serviceName}>
                {service.name}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Home Status */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Home Status
          </Text>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={26}
              color="#D8B56A"
            />
          </View>

          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>
              Your home is looking good
            </Text>

            <Text style={styles.statusSubtitle}>
              No urgent maintenance tasks
            </Text>
          </View>

          <View style={styles.statusCheck}>
            <Ionicons
              name="checkmark"
              size={18}
              color="#101010"
            />
          </View>
        </View>

        {/* Upcoming */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Upcoming
          </Text>

          <Text style={styles.smallLabel}>
            THIS WEEK
          </Text>
        </View>

        <Pressable
          style={styles.bookingCard}
          onPress={handleBookings}
        >
          <View style={styles.bookingIcon}>
            <Ionicons
              name="snow-outline"
              size={24}
              color="#D8B56A"
            />
          </View>

          <View style={styles.bookingInfo}>
            <Text style={styles.bookingTitle}>
              AC Service
            </Text>

            <Text style={styles.bookingDate}>
              Tomorrow Â· 10:00 AM
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#777"
          />
        </Pressable>

        {/* Bottom spacing */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>

        {/* Home */}
        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/")}
        >
          <Ionicons
            name="home"
            size={22}
            color="#D8B56A"
          />

          <Text
            style={[
              styles.navText,
              styles.activeNavText,
            ]}
          >
            Home
          </Text>
        </Pressable>

        {/* Services */}
        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/services")}
        >
          <Ionicons
            name="grid-outline"
            size={22}
            color="#777"
          />

          <Text style={styles.navText}>
            Services
          </Text>
        </Pressable>

        {/* AI */}
        <Pressable
          style={styles.aiNavButton}
          onPress={handleAI}
        >
          <Ionicons
            name="sparkles"
            size={22}
            color="#101010"
          />
        </Pressable>

        {/* Bookings */}
        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/bookings")}
        >
          <Ionicons
            name="calendar-outline"
            size={22}
            color="#777"
          />

          <Text style={styles.navText}>
            Bookings
          </Text>
        </Pressable>

        {/* Profile */}
        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/profile")}
        >
          <Ionicons
            name="person-outline"
            size={22}
            color="#777"
          />

          <Text style={styles.navText}>
            Profile
          </Text>
        </Pressable>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 62,
    paddingBottom: 120,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  brand: {
    color: "#F7F1E3",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 3,
  },

  tagline: {
    color: "#777",
    fontSize: 11,
    marginTop: 5,
    letterSpacing: 0.5,
  },

  accountButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#181818",
    borderWidth: 1,
    borderColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#181818",
    borderWidth: 1,
    borderColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },

  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D8B56A",
  },

  greetingSection: {
    marginTop: 34,
    marginBottom: 20,
  },

  greeting: {
    color: "#F7F1E3",
    fontSize: 27,
    fontWeight: "700",
  },

  greetingSubtitle: {
    color: "#858585",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 21,
  },

  aiCard: {
    minHeight: 220,
    borderRadius: 26,
    backgroundColor: "#191919",
    borderWidth: 1,
    borderColor: "#35312A",
    padding: 20,
    overflow: "hidden",
  },

  aiGlow: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    right: -80,
    top: -80,
    backgroundColor: "#2C261A",
  },

  aiTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  aiIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#272116",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#4A3B20",
  },

  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#211F1A",
  },

  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D8B56A",
    marginRight: 6,
  },

  aiBadgeText: {
    color: "#D8B56A",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },

  aiTitle: {
    color: "#F7F1E3",
    fontSize: 23,
    fontWeight: "700",
    marginTop: 20,
  },

  aiDescription: {
    color: "#888",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
    maxWidth: 310,
  },

  aiInput: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#111111",
    marginTop: 18,
    paddingLeft: 15,
    paddingRight: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#292929",
  },

  aiPlaceholder: {
    color: "#656565",
    fontSize: 12,
    fontStyle: "italic",
  },

  micButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#D8B56A",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
    marginBottom: 14,
  },

  sectionTitle: {
    color: "#F7F1E3",
    fontSize: 18,
    fontWeight: "700",
  },

  seeAll: {
    color: "#D8B56A",
    fontSize: 12,
    fontWeight: "600",
  },

  smallLabel: {
    color: "#666",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },

  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },

  serviceCard: {
    width: "23.5%",
    minHeight: 92,
    backgroundColor: "#181818",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },

  serviceIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#242016",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  serviceName: {
    color: "#B7B7B7",
    fontSize: 10,
    textAlign: "center",
    fontWeight: "600",
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },

  statusCard: {
    minHeight: 78,
    borderRadius: 20,
    backgroundColor: "#181818",
    borderWidth: 1,
    borderColor: "#292929",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },

  statusIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#242016",
    alignItems: "center",
    justifyContent: "center",
  },

  statusContent: {
    flex: 1,
    marginLeft: 13,
  },

  statusTitle: {
    color: "#F0F0F0",
    fontSize: 13,
    fontWeight: "600",
  },

  statusSubtitle: {
    color: "#707070",
    fontSize: 11,
    marginTop: 5,
  },

  statusCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#D8B56A",
    alignItems: "center",
    justifyContent: "center",
  },

  bookingCard: {
    minHeight: 76,
    borderRadius: 20,
    backgroundColor: "#181818",
    borderWidth: 1,
    borderColor: "#292929",
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },

  bookingIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#242016",
    alignItems: "center",
    justifyContent: "center",
  },

  bookingInfo: {
    flex: 1,
    marginLeft: 13,
  },

  bookingTitle: {
    color: "#F0F0F0",
    fontSize: 13,
    fontWeight: "600",
  },

  bookingDate: {
    color: "#707070",
    fontSize: 11,
    marginTop: 5,
  },

  bottomSpace: {
    height: 20,
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 86,
    backgroundColor: "#141414",
    borderTopWidth: 1,
    borderTopColor: "#292929",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 8,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 58,
  },

  navText: {
    color: "#666",
    fontSize: 9,
    marginTop: 5,
    fontWeight: "600",
  },

  activeNavText: {
    color: "#D8B56A",
  },

  aiNavButton: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#D8B56A",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -24,
    borderWidth: 4,
    borderColor: "#141414",
  },
});
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

type User = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
};

export default function AccountScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccount();
  }, []);

  const loadAccount = async () => {
    try {
      const token = await AsyncStorage.getItem("homeai_auth_token");
      const savedUser = await AsyncStorage.getItem("homeai_user");

      if (!token) {
        router.replace("/auth");
        return;
      }

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log("Error loading account:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of HomeAI?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("homeai_auth_token");
              await AsyncStorage.removeItem("homeai_user");
              router.replace("/");
            } catch (error) {
              console.log("Logout error:", error);
            }
          },
        },
      ]
    );
  };

  const firstName = user?.name?.trim().split(" ")[0] || "HomeAI User";
  const initials =
    user?.name
      ?.trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "HA";

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <Ionicons name="person-circle-outline" size={54} color="#D8B56A" />
        <Text style={styles.loadingText}>Loading your account...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons
              name="chevron-back"
              size={23}
              color="#F7F1E3"
            />
          </TouchableOpacity>

          <View>
            <Text style={styles.brand}>HOMEAI</Text>
            <Text style={styles.headerTitle}>My Account</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.name}>{user?.name || firstName}</Text>
            <Text style={styles.email}>
              {user?.email || "Email not available"}
            </Text>
          </View>

          <View style={styles.verifiedBadge}>
            <Ionicons
              name="shield-checkmark"
              size={17}
              color="#D8B56A"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>ACCOUNT</Text>

        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/profile")}
            activeOpacity={0.8}
          >
            <View style={styles.menuIcon}>
              <Ionicons
                name="person-outline"
                size={21}
                color="#D8B56A"
              />
            </View>

            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Profile</Text>
              <Text style={styles.menuSubtitle}>
                Manage your personal information
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color="#666"
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/home-profile")}
            activeOpacity={0.8}
          >
            <View style={styles.menuIcon}>
              <Ionicons
                name="home-outline"
                size={21}
                color="#D8B56A"
              />
            </View>

            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Home Details</Text>
              <Text style={styles.menuSubtitle}>
                Manage your home information
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color="#666"
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/appliances")}
            activeOpacity={0.8}
          >
            <View style={styles.menuIcon}>
              <Ionicons
                name="hardware-chip-outline"
                size={21}
                color="#D8B56A"
              />
            </View>

            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>My Appliances</Text>
              <Text style={styles.menuSubtitle}>
                View and manage your appliances
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color="#666"
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/bookings")}
            activeOpacity={0.8}
          >
            <View style={styles.menuIcon}>
              <Ionicons
                name="calendar-outline"
                size={21}
                color="#D8B56A"
              />
            </View>

            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>My Bookings</Text>
              <Text style={styles.menuSubtitle}>
                View your service bookings
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={19}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>ACCOUNT SECURITY</Text>

        <View style={styles.securityCard}>
          <View style={styles.securityIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color="#D8B56A"
            />
          </View>

          <View style={styles.securityContent}>
            <Text style={styles.securityTitle}>
              Account protected
            </Text>

            <Text style={styles.securityText}>
              Your HomeAI account is protected with secure authentication.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#E5A5A5"
          />

          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>HOMEAI • Account</Text>

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

  loadingContainer: {
    flex: 1,
    backgroundColor: "#101010",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#777",
    fontSize: 13,
    marginTop: 12,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 35,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#181818",
    borderWidth: 1,
    borderColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },

  headerSpacer: {
    width: 44,
    height: 44,
  },

  brand: {
    color: "#D8B56A",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 3,
    textAlign: "center",
  },

  headerTitle: {
    color: "#F7F1E3",
    fontSize: 23,
    fontWeight: "800",
    marginTop: 4,
    textAlign: "center",
  },

  profileCard: {
    backgroundColor: "#191919",
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "#35312A",
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: "#292214",
    borderWidth: 1,
    borderColor: "#4A3B20",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#D8B56A",
    fontSize: 19,
    fontWeight: "800",
  },

  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },

  greeting: {
    color: "#777",
    fontSize: 10,
    fontWeight: "600",
  },

  name: {
    color: "#F7F1E3",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 4,
  },

  email: {
    color: "#777",
    fontSize: 11,
    marginTop: 5,
  },

  verifiedBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#242016",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    color: "#777",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginTop: 27,
    marginBottom: 11,
  },

  menuCard: {
    backgroundColor: "#191919",
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#292929",
    paddingHorizontal: 15,
  },

  menuItem: {
    minHeight: 73,
    flexDirection: "row",
    alignItems: "center",
  },

  menuIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#242016",
    alignItems: "center",
    justifyContent: "center",
  },

  menuContent: {
    flex: 1,
    marginLeft: 13,
    marginRight: 10,
  },

  menuTitle: {
    color: "#F0F0F0",
    fontSize: 13,
    fontWeight: "700",
  },

  menuSubtitle: {
    color: "#666",
    fontSize: 10,
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#292929",
  },

  securityCard: {
    backgroundColor: "#191919",
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  securityIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#242016",
    alignItems: "center",
    justifyContent: "center",
  },

  securityContent: {
    flex: 1,
    marginLeft: 13,
  },

  securityTitle: {
    color: "#F0F0F0",
    fontSize: 13,
    fontWeight: "700",
  },

  securityText: {
    color: "#666",
    fontSize: 10,
    lineHeight: 16,
    marginTop: 4,
  },

  logoutButton: {
    height: 53,
    borderRadius: 16,
    backgroundColor: "#1B1717",
    borderWidth: 1,
    borderColor: "#3A2929",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 22,
  },

  logoutText: {
    color: "#E5A5A5",
    fontSize: 13,
    fontWeight: "800",
  },

  version: {
    color: "#444",
    fontSize: 9,
    textAlign: "center",
    marginTop: 20,
    letterSpacing: 1,
  },

  bottomSpace: {
    height: 20,
  },
});

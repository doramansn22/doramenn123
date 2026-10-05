import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

export default function ProfileScreen() {
  const [homeName, setHomeName] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    loadHomeProfile();
  }, []);

  const loadHomeProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem(
        "homeai_home_profile"
      );

      if (saved) {
        const data = JSON.parse(saved);

        setHomeName(data.homeName || "");
        setAddress(data.address || "");
      }
    } catch (error) {
      console.log("Error loading home profile:", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.brand}>HOMEAI</Text>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>U</Text>
        </View>

        {homeName ? (
          <>
            <Text style={styles.name}>{homeName}</Text>

            <Text style={styles.email}>
              {address || "Home profile saved"}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.name}>
              Welcome to HomeAI
            </Text>

            <Text style={styles.email}>
              Set up your profile to manage your home.
            </Text>
          </>
        )}
      </View>

      {/* Home Details */}
      <TouchableOpacity
        style={styles.option}
        activeOpacity={0.75}
        onPress={() => router.push("/home-profile")}
      >
        <Text style={styles.optionText}>
          Home Details
        </Text>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* My Appliances */}
      <TouchableOpacity
        style={styles.option}
        activeOpacity={0.75}
        onPress={() => router.push("/appliances")}
      >
        <Text style={styles.optionText}>
          My Appliances
        </Text>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* Settings */}
      <View style={styles.option}>
        <Text style={styles.optionText}>
          Settings
        </Text>

        <Text style={styles.arrow}>›</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    padding: 24,
    paddingTop: 70,
  },

  brand: {
    color: "#D8B56A",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 4,
  },

  title: {
    color: "#F7F1E3",
    fontSize: 36,
    fontWeight: "800",
    marginTop: 18,
  },

  profileCard: {
    backgroundColor: "#191919",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#303030",
    padding: 24,
    marginTop: 30,
    alignItems: "center",
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#D8B56A",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#111",
    fontSize: 28,
    fontWeight: "800",
  },

  name: {
    color: "#F7F1E3",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 15,
    textAlign: "center",
  },

  email: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
  },

  option: {
    height: 60,
    backgroundColor: "#191919",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#292929",
    marginTop: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionText: {
    color: "#DDD",
    fontSize: 16,
    fontWeight: "600",
  },

  arrow: {
    color: "#D8B56A",
    fontSize: 28,
  },
});
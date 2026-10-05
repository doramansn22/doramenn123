import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { saveHomeProfileToServer, getHomeProfileFromServer } from "../utils/homeProfileApi";

export default function HomeProfileScreen() {
  const [homeName, setHomeName] = useState("");
  const [address, setAddress] = useState("");
  const [homeType, setHomeType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [people, setPeople] = useState("");

  useEffect(() => {
    loadHomeProfile();
  }, []);

  const loadHomeProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem("homeai_home_profile");

      if (saved) {
        const data = JSON.parse(saved);

        setHomeName(data.homeName || "");
        setAddress(data.address || "");
        setHomeType(data.homeType || "");
        setBedrooms(data.bedrooms || "");
        setBathrooms(data.bathrooms || "");
        setPeople(data.people || "");
      }

      try {
        const serverProfile = await getHomeProfileFromServer();

        if (serverProfile) {
          setHomeName(serverProfile.homeName || "");
          setAddress(serverProfile.address || "");
          setHomeType(serverProfile.homeType || "");
          setBedrooms(serverProfile.bedrooms || "");
          setBathrooms(serverProfile.bathrooms || "");
          setPeople(serverProfile.people || "");

          await AsyncStorage.setItem(
            "homeai_home_profile",
            JSON.stringify(serverProfile)
          );
        }
      } catch (serverError) {
        console.log(
          "Home profile server load unavailable, using local data:",
          serverError
        );
      }
    } catch (error) {
      console.log("Error loading home profile:", error);
    }
  };

  const saveHomeProfile = async () => {
    if (!homeName.trim()) {
      Alert.alert("Home Name", "Please enter a name for your home.");
      return;
    }

    if (!address.trim()) {
      Alert.alert("Address", "Please enter your home address.");
      return;
    }

    if (!homeType.trim()) {
      Alert.alert("Home Type", "Please enter your home type.");
      return;
    }

    const homeProfile = {
      homeName,
      address,
      homeType,
      bedrooms,
      bathrooms,
      people,
    };

    try {
      await AsyncStorage.setItem(
        "homeai_home_profile",
        JSON.stringify(homeProfile)
      );

      try {
        await saveHomeProfileToServer(homeProfile);
      } catch (serverError) {
        console.log(
          "Home profile server save unavailable, local profile saved:",
          serverError
        );
      }

      Alert.alert(
        "Home Saved",
        "Your HomeAI home profile has been saved.",
        [
          {
            text: "Continue",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.log("Error saving home profile:", error);

      Alert.alert(
        "Error",
        "Unable to save your home profile."
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
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

          <View>
            <Text style={styles.brand}>HOMEAI</Text>
            <Text style={styles.title}>My Home</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Tell HomeAI about your home so we can manage it better.
        </Text>

        {/* Home Name */}
        <View style={styles.field}>
          <Text style={styles.label}>HOME NAME</Text>

          <View style={styles.inputBox}>
            <Ionicons
              name="home-outline"
              size={20}
              color="#D8B56A"
            />

            <TextInput
              value={homeName}
              onChangeText={setHomeName}
              placeholder="Example: My Home"
              placeholderTextColor="#555"
              style={styles.input}
            />
          </View>
        </View>

        {/* Address */}
        <View style={styles.field}>
          <Text style={styles.label}>HOME ADDRESS</Text>

          <View style={styles.largeInputBox}>
            <Ionicons
              name="location-outline"
              size={20}
              color="#D8B56A"
            />

            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your complete home address"
              placeholderTextColor="#555"
              style={styles.largeInput}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Home Type */}
        <View style={styles.field}>
          <Text style={styles.label}>HOME TYPE</Text>

          <View style={styles.inputBox}>
            <Ionicons
              name="business-outline"
              size={20}
              color="#D8B56A"
            />

            <TextInput
              value={homeType}
              onChangeText={setHomeType}
              placeholder="Example: Apartment / Villa / House"
              placeholderTextColor="#555"
              style={styles.input}
            />
          </View>
        </View>

        {/* Bedrooms */}
        <View style={styles.field}>
          <Text style={styles.label}>BEDROOMS</Text>

          <View style={styles.inputBox}>
            <Ionicons
              name="bed-outline"
              size={20}
              color="#D8B56A"
            />

            <TextInput
              value={bedrooms}
              onChangeText={setBedrooms}
              placeholder="Example: 2"
              placeholderTextColor="#555"
              style={styles.input}
              keyboardType="number-pad"
            />
          </View>
        </View>

        {/* Bathrooms */}
        <View style={styles.field}>
          <Text style={styles.label}>BATHROOMS</Text>

          <View style={styles.inputBox}>
            <Ionicons
              name="water-outline"
              size={20}
              color="#D8B56A"
            />

            <TextInput
              value={bathrooms}
              onChangeText={setBathrooms}
              placeholder="Example: 2"
              placeholderTextColor="#555"
              style={styles.input}
              keyboardType="number-pad"
            />
          </View>
        </View>

        {/* People */}
        <View style={styles.field}>
          <Text style={styles.label}>PEOPLE LIVING AT HOME</Text>

          <View style={styles.inputBox}>
            <Ionicons
              name="people-outline"
              size={20}
              color="#D8B56A"
            />

            <TextInput
              value={people}
              onChangeText={setPeople}
              placeholder="Example: 4"
              placeholderTextColor="#555"
              style={styles.input}
              keyboardType="number-pad"
            />
          </View>
        </View>

        {/* AI Card */}
        <View style={styles.aiCard}>
          <View style={styles.aiIcon}>
            <Ionicons
              name="sparkles"
              size={22}
              color="#D8B56A"
            />
          </View>

          <View style={styles.aiContent}>
            <Text style={styles.aiTitle}>
              Your home, understood by AI
            </Text>

            <Text style={styles.aiText}>
              HomeAI can use these details to give you smarter
              maintenance and service recommendations.
            </Text>
          </View>
        </View>

        {/* Save */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveHomeProfile}
          activeOpacity={0.85}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color="#101010"
          />

          <Text style={styles.saveText}>
            Save Home Profile
          </Text>
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
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
    marginRight: 14,
  },

  brand: {
    color: "#D8B56A",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
  },

  title: {
    color: "#F7F1E3",
    fontSize: 27,
    fontWeight: "800",
    marginTop: 4,
  },

  subtitle: {
    color: "#777",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 27,
  },

  field: {
    marginBottom: 17,
  },

  label: {
    color: "#666",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.3,
    marginBottom: 8,
  },

  inputBox: {
    height: 55,
    backgroundColor: "#191919",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#292929",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    color: "#F7F1E3",
    fontSize: 12,
    marginLeft: 11,
  },

  largeInputBox: {
    minHeight: 90,
    backgroundColor: "#191919",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#292929",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    paddingTop: 16,
  },

  largeInput: {
    flex: 1,
    color: "#F7F1E3",
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 11,
    minHeight: 60,
  },

  aiCard: {
    backgroundColor: "#191919",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#4A3B20",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
  },

  aiIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
  },

  aiContent: {
    flex: 1,
    marginLeft: 11,
  },

  aiTitle: {
    color: "#F7F1E3",
    fontSize: 11,
    fontWeight: "700",
  },

  aiText: {
    color: "#666",
    fontSize: 9,
    lineHeight: 14,
    marginTop: 4,
  },

  saveButton: {
    height: 54,
    borderRadius: 17,
    backgroundColor: "#D8B56A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  saveText: {
    color: "#101010",
    fontSize: 12,
    fontWeight: "800",
  },

  bottomSpace: {
    height: 20,
  },
});
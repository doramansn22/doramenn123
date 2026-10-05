import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

export default function BookingDetailsScreen() {
  const params = useLocalSearchParams();

  const service = String(params.service || "Home Service");
  const option = String(params.option || "General service");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const continueBooking = () => {
    if (!date.trim()) {
      Alert.alert("Select Date", "Please enter your preferred date.");
      return;
    }

    if (!time.trim()) {
      Alert.alert("Select Time", "Please enter your preferred time.");
      return;
    }

    if (!address.trim()) {
      Alert.alert("Enter Address", "Please enter your service address.");
      return;
    }

    router.push({
      pathname: "/professionals",
      params: {
        service,
        option,
        date,
        time,
        address,
        description,
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
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#F7F1E3"
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.brand}>HOMEAI</Text>
            <Text style={styles.title}>Booking Details</Text>
          </View>
        </View>

        {/* Selected Service */}
        <View style={styles.serviceCard}>
          <View style={styles.serviceIcon}>
            <Ionicons
              name="construct-outline"
              size={25}
              color="#D8B56A"
            />
          </View>

          <View style={styles.serviceInfo}>
            <Text style={styles.serviceLabel}>
              SELECTED SERVICE
            </Text>

            <Text style={styles.serviceName}>
              {service}
            </Text>

            <Text style={styles.serviceOption}>
              {option}
            </Text>
          </View>

          <Ionicons
            name="checkmark-circle"
            size={21}
            color="#D8B56A"
          />
        </View>

        {/* Section */}
        <Text style={styles.sectionTitle}>
          Schedule your service
        </Text>

        <Text style={styles.sectionSubtitle}>
          Tell us when and where you need professional help.
        </Text>

        {/* Date */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            PREFERRED DATE
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#D8B56A"
            />

            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="Example: 15 September 2026"
              placeholderTextColor="#555"
              style={styles.input}
            />
          </View>
        </View>

        {/* Time */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            PREFERRED TIME
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="time-outline"
              size={20}
              color="#D8B56A"
            />

            <TextInput
              value={time}
              onChangeText={setTime}
              placeholder="Example: 10:00 AM"
              placeholderTextColor="#555"
              style={styles.input}
            />
          </View>
        </View>

        {/* Address */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            SERVICE ADDRESS
          </Text>

          <View style={styles.addressContainer}>
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
              style={styles.addressInput}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            ADDITIONAL DETAILS
            <Text style={styles.optional}>  OPTIONAL</Text>
          </Text>

          <View style={styles.descriptionContainer}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color="#D8B56A"
            />

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the problem or any special instructions..."
              placeholderTextColor="#555"
              style={styles.descriptionInput}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Trust Card */}
        <View style={styles.trustCard}>
          <View style={styles.trustIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color="#D8B56A"
            />
          </View>

          <View style={styles.trustContent}>
            <Text style={styles.trustTitle}>
              Professional Home Service
            </Text>

            <Text style={styles.trustText}>
              HomeAI will show verified professionals available
              for your selected service.
            </Text>
          </View>
        </View>

        {/* Continue */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={continueBooking}
          activeOpacity={0.85}
        >
          <Text style={styles.continueText}>
            Find Professionals
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#101010"
          />
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          You can review the professional and estimated price
          before confirming your booking.
        </Text>

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
    marginBottom: 25,
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

  headerText: {
    flex: 1,
  },

  brand: {
    color: "#D8B56A",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
  },

  title: {
    color: "#F7F1E3",
    fontSize: 25,
    fontWeight: "800",
    marginTop: 4,
  },

  serviceCard: {
    backgroundColor: "#191919",
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#4A3B20",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  serviceIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
  },

  serviceInfo: {
    flex: 1,
    marginLeft: 13,
  },

  serviceLabel: {
    color: "#666",
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 4,
  },

  serviceName: {
    color: "#F7F1E3",
    fontSize: 15,
    fontWeight: "800",
  },

  serviceOption: {
    color: "#888",
    fontSize: 10,
    marginTop: 4,
  },

  sectionTitle: {
    color: "#F7F1E3",
    fontSize: 21,
    fontWeight: "800",
  },

  sectionSubtitle: {
    color: "#707070",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
    marginBottom: 23,
  },

  field: {
    marginBottom: 18,
  },

  fieldLabel: {
    color: "#666",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.3,
    marginBottom: 8,
  },

  optional: {
    color: "#444",
    fontSize: 7,
  },

  inputContainer: {
    minHeight: 55,
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

  addressContainer: {
    minHeight: 88,
    backgroundColor: "#191919",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#292929",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    paddingTop: 16,
  },

  addressInput: {
    flex: 1,
    color: "#F7F1E3",
    fontSize: 12,
    lineHeight: 19,
    marginLeft: 11,
    minHeight: 55,
  },

  descriptionContainer: {
    minHeight: 105,
    backgroundColor: "#191919",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#292929",
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    paddingTop: 16,
  },

  descriptionInput: {
    flex: 1,
    color: "#F7F1E3",
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 11,
    minHeight: 75,
  },

  trustCard: {
    backgroundColor: "#181818",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
  },

  trustIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
  },

  trustContent: {
    flex: 1,
    marginLeft: 11,
  },

  trustTitle: {
    color: "#D8D2C5",
    fontSize: 11,
    fontWeight: "700",
  },

  trustText: {
    color: "#666",
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
  },

  continueButton: {
    height: 54,
    borderRadius: 17,
    backgroundColor: "#D8B56A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  continueText: {
    color: "#101010",
    fontSize: 12,
    fontWeight: "800",
  },

  bottomText: {
    color: "#555",
    fontSize: 9,
    lineHeight: 14,
    textAlign: "center",
    marginTop: 11,
    paddingHorizontal: 15,
  },

  bottomSpace: {
    height: 20,
  },
});
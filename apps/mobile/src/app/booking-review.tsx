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

export default function BookingReviewScreen() {
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

  const description = String(
    params.description || "No additional details"
  );

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
          Review Booking
        </Text>

        <Text style={styles.subtitle}>
          Check your details before continuing.
        </Text>

        {/* Service */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            SERVICE
          </Text>

          <Text style={styles.mainText}>
            {service}
          </Text>

          <Text style={styles.secondaryText}>
            {option}
          </Text>
        </View>

        {/* Schedule */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            SCHEDULE
          </Text>

          <View style={styles.row}>
            <Ionicons
              name="calendar-outline"
              size={21}
              color="#D8B56A"
            />

            <View style={styles.rowText}>
              <Text style={styles.mainText}>
                {date}
              </Text>

              <Text style={styles.secondaryText}>
                {time}
              </Text>
            </View>
          </View>
        </View>

        {/* Address */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            SERVICE ADDRESS
          </Text>

          <View style={styles.row}>
            <Ionicons
              name="location-outline"
              size={21}
              color="#D8B56A"
            />

            <Text style={styles.addressText}>
              {address}
            </Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            PROBLEM DETAILS
          </Text>

          <Text style={styles.detailText}>
            {description}
          </Text>
        </View>

        {/* Price */}
        <View style={styles.priceCard}>
          <View>
            <Text style={styles.priceLabel}>
              ESTIMATED STARTING PRICE
            </Text>

            <Text style={styles.priceNote}>
              Final price may vary after professional inspection
            </Text>
          </View>

          <Text style={styles.price}>
            ₹499
          </Text>
        </View>

        {/* Continue */}
        <TouchableOpacity
          style={styles.confirmButton}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/professionals",
              params: {
                service,
                option,
                date,
                time,
                address,
              },
            })
          }
        >
          <Text style={styles.confirmText}>
            Confirm & Find Professional
          </Text>

          <Ionicons
            name="arrow-forward"
            size={21}
            color="#101010"
          />
        </TouchableOpacity>

        <Text style={styles.secure}>
          🔒 Secure booking with HomeAI
        </Text>
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
    fontSize: 30,
    fontWeight: "800",
    marginTop: 5,
  },

  subtitle: {
    color: "#777",
    fontSize: 13,
    marginTop: 7,
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#191919",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 17,
    marginBottom: 12,
  },

  cardLabel: {
    color: "#666",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.3,
    marginBottom: 10,
  },

  mainText: {
    color: "#F7F1E3",
    fontSize: 15,
    fontWeight: "700",
  },

  secondaryText: {
    color: "#777",
    fontSize: 11,
    marginTop: 4,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowText: {
    marginLeft: 12,
  },

  addressText: {
    flex: 1,
    color: "#BDBDBD",
    fontSize: 13,
    lineHeight: 19,
    marginLeft: 12,
  },

  detailText: {
    color: "#999",
    fontSize: 13,
    lineHeight: 19,
  },

  priceCard: {
    backgroundColor: "#191919",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4A3B20",
    minHeight: 80,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },

  priceLabel: {
    color: "#999",
    fontSize: 10,
    fontWeight: "700",
  },

  priceNote: {
    color: "#555",
    fontSize: 9,
    maxWidth: 220,
    marginTop: 5,
  },

  price: {
    color: "#D8B56A",
    fontSize: 25,
    fontWeight: "800",
  },

  confirmButton: {
    height: 58,
    backgroundColor: "#D8B56A",
    borderRadius: 18,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  confirmText: {
    color: "#101010",
    fontSize: 14,
    fontWeight: "800",
  },

  secure: {
    color: "#555",
    fontSize: 10,
    textAlign: "center",
    marginTop: 12,
  },
});
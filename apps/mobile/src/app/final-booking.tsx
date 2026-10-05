import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  saveBookingToServer,
} from "../utils/bookingApi";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

export default function FinalBookingScreen() {
  const params = useLocalSearchParams();

  const service = String(params.service || "Home Service");
  const option = String(params.option || "General service");
  const date = String(params.date || "Tomorrow");
  const time = String(params.time || "10:00 AM");
  const address = String(params.address || "Home address");

  const professionalName = String(
    params.professionalName || "Professional"
  );

  const rating = String(params.rating || "4.8");
  const price = String(params.price || "₹499");

  const confirmBooking = async () => {
  const booking = {
    bookingId: `HA-${Date.now()}`,
    service,
    option,
    date,
    time,
    address,
    professionalName,
    rating,
    price,
    status: "Confirmed",
  };

  await AsyncStorage.setItem(
    "homeai_booking",
    JSON.stringify(booking)
  );

  try {
    await saveBookingToServer(booking);
  } catch (error) {
    console.log(
      "Booking server save error. Local booking is still saved:",
      error
    );
  }

  router.push({
      pathname: "/booking-confirmed",
      params: {
        service,
        option,
        date,
        time,
        address,
        professionalName,
        rating,
        price,
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

        <Text style={styles.brand}>HOMEAI</Text>

        <Text style={styles.title}>
          Final Booking
        </Text>

        <Text style={styles.subtitle}>
          Review everything before confirming your service.
        </Text>

        {/* Professional */}

        <Text style={styles.sectionTitle}>
          PROFESSIONAL
        </Text>

        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {professionalName
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)}
            </Text>
          </View>

          <View style={styles.professionalInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.professionalName}>
                {professionalName}
              </Text>

              <Ionicons
                name="checkmark-circle"
                size={17}
                color="#D8B56A"
              />
            </View>

            <View style={styles.ratingRow}>
              <Ionicons
                name="star"
                size={14}
                color="#D8B56A"
              />

              <Text style={styles.rating}>
                {rating}
              </Text>

              <Text style={styles.verified}>
                Verified Professional
              </Text>
            </View>
          </View>
        </View>

        {/* Service */}

        <Text style={styles.sectionTitle}>
          SERVICE
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons
                name="construct-outline"
                size={19}
                color="#D8B56A"
              />
            </View>

            <View style={styles.infoText}>
              <Text style={styles.label}>
                SERVICE
              </Text>

              <Text style={styles.value}>
                {service}
              </Text>

              <Text style={styles.subValue}>
                {option}
              </Text>
            </View>
          </View>
        </View>

        {/* Schedule */}

        <Text style={styles.sectionTitle}>
          SCHEDULE
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.scheduleRow}>
            <View style={styles.scheduleItem}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#D8B56A"
              />

              <View>
                <Text style={styles.label}>
                  DATE
                </Text>

                <Text style={styles.value}>
                  {date}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.scheduleItem}>
              <Ionicons
                name="time-outline"
                size={20}
                color="#D8B56A"
              />

              <View>
                <Text style={styles.label}>
                  TIME
                </Text>

                <Text style={styles.value}>
                  {time}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Address */}

        <Text style={styles.sectionTitle}>
          SERVICE ADDRESS
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.addressRow}>
            <View style={styles.iconBox}>
              <Ionicons
                name="location-outline"
                size={19}
                color="#D8B56A"
              />
            </View>

            <Text style={styles.address}>
              {address}
            </Text>
          </View>
        </View>

        {/* Price */}

        <Text style={styles.sectionTitle}>
          PAYMENT SUMMARY
        </Text>

        <View style={styles.paymentCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Service starting price
            </Text>

            <Text style={styles.priceValue}>
              {price}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Platform fee
            </Text>

            <Text style={styles.priceValue}>
              Included
            </Text>
          </View>

          <View style={styles.priceDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Estimated Total
            </Text>

            <Text style={styles.totalValue}>
              {price}
            </Text>
          </View>

          <Text style={styles.note}>
            Final price may vary depending on the actual work required.
          </Text>
        </View>

        {/* Confirm */}

        <TouchableOpacity
          style={styles.confirmButton}
          activeOpacity={0.85}
          onPress={confirmBooking}
        >
          <Text style={styles.confirmText}>
            Confirm Booking
          </Text>

          <Ionicons
            name="arrow-forward"
            size={21}
            color="#101010"
          />
        </TouchableOpacity>

        <Text style={styles.secureText}>
          🔒 Secure booking • Verified professional • HomeAI protection
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
    lineHeight: 19,
    marginTop: 7,
    marginBottom: 25,
  },

  sectionTitle: {
    color: "#666",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 7,
  },

  card: {
    backgroundColor: "#191919",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 21,
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

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
    gap: 5,
  },

  rating: {
    color: "#D8B56A",
    fontSize: 11,
    fontWeight: "700",
  },

  verified: {
    color: "#777",
    fontSize: 9,
    marginLeft: 5,
  },

  infoCard: {
    backgroundColor: "#191919",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 16,
    marginBottom: 21,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
  },

  infoText: {
    marginLeft: 12,
    flex: 1,
  },

  label: {
    color: "#555",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
  },

  value: {
    color: "#F7F1E3",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 3,
  },

  subValue: {
    color: "#777",
    fontSize: 10,
    marginTop: 3,
  },

  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  scheduleItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#303030",
    marginHorizontal: 10,
  },

  addressRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  address: {
    flex: 1,
    color: "#D8D2C5",
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 12,
  },

  paymentCard: {
    backgroundColor: "#191919",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#35312A",
    padding: 17,
    marginBottom: 22,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },

  priceLabel: {
    color: "#888",
    fontSize: 11,
  },

  priceValue: {
    color: "#D8D2C5",
    fontSize: 11,
    fontWeight: "600",
  },

  priceDivider: {
    height: 1,
    backgroundColor: "#303030",
    marginVertical: 5,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 13,
  },

  totalLabel: {
    color: "#F7F1E3",
    fontSize: 13,
    fontWeight: "700",
  },

  totalValue: {
    color: "#D8B56A",
    fontSize: 22,
    fontWeight: "800",
  },

  note: {
    color: "#666",
    fontSize: 9,
    lineHeight: 14,
    marginTop: 13,
  },

  confirmButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#D8B56A",
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

  secureText: {
    color: "#555",
    fontSize: 9,
    textAlign: "center",
    marginTop: 13,
    lineHeight: 14,
  },

  bottomSpace: {
    height: 25,
  },
});
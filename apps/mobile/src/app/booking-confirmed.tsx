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

export default function BookingConfirmedScreen() {
  const params = useLocalSearchParams();

  const service = String(params.service || "Home Service");
  const option = String(params.option || "General service");
  const date = String(params.date || "Tomorrow");
  const time = String(params.time || "10:00 AM");
  const professionalName = String(
    params.professionalName || "Professional"
  );
  const price = String(params.price || "₹499");

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Success Icon */}

        <View style={styles.successCircle}>
          <Ionicons
            name="checkmark"
            size={46}
            color="#101010"
          />
        </View>

        <Text style={styles.brand}>HOMEAI</Text>

        <Text style={styles.title}>
          Booking Confirmed
        </Text>

        <Text style={styles.subtitle}>
          Your home service has been successfully booked.
        </Text>

        {/* Booking ID */}

        <View style={styles.bookingIdCard}>
          <Text style={styles.bookingIdLabel}>
            BOOKING ID
          </Text>

          <Text style={styles.bookingId}>
            #HA-2026-00124
          </Text>
        </View>

        {/* Service */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            SERVICE
          </Text>

          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Ionicons
                name="construct-outline"
                size={20}
                color="#D8B56A"
              />
            </View>

            <View style={styles.details}>
              <Text style={styles.mainText}>
                {service}
              </Text>

              <Text style={styles.subText}>
                {option}
              </Text>
            </View>
          </View>
        </View>

        {/* Professional */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            PROFESSIONAL
          </Text>

          <View style={styles.row}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {professionalName
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)}
              </Text>
            </View>

            <View style={styles.details}>
              <View style={styles.nameRow}>
                <Text style={styles.mainText}>
                  {professionalName}
                </Text>

                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color="#D8B56A"
                />
              </View>

              <Text style={styles.subText}>
                Verified HomeAI Professional
              </Text>
            </View>
          </View>
        </View>

        {/* Schedule */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            APPOINTMENT
          </Text>

          <View style={styles.appointmentRow}>
            <View style={styles.appointmentItem}>
              <Ionicons
                name="calendar-outline"
                size={19}
                color="#D8B56A"
              />

              <View>
                <Text style={styles.smallLabel}>
                  DATE
                </Text>

                <Text style={styles.mainText}>
                  {date}
                </Text>
              </View>
            </View>

            <View style={styles.verticalLine} />

            <View style={styles.appointmentItem}>
              <Ionicons
                name="time-outline"
                size={19}
                color="#D8B56A"
              />

              <View>
                <Text style={styles.smallLabel}>
                  TIME
                </Text>

                <Text style={styles.mainText}>
                  {time}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment */}

        <View style={styles.paymentCard}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>
              Estimated Total
            </Text>

            <Text style={styles.price}>
              {price}
            </Text>
          </View>

          <Text style={styles.paymentNote}>
            Payment details will be handled securely through HomeAI.
          </Text>
        </View>

        {/* Actions */}

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => router.push("/bookings")}
        >
          <Ionicons
            name="calendar-outline"
            size={19}
            color="#101010"
          />

          <Text style={styles.primaryText}>
            View My Bookings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.8}
          onPress={() => router.push("/")}
        >
          <Text style={styles.secondaryText}>
            Back to Home
          </Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Thank you for choosing HOMEAI.
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
    paddingTop: 65,
    paddingBottom: 40,
    alignItems: "stretch",
  },

  successCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#D8B56A",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  brand: {
    color: "#D8B56A",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
    textAlign: "center",
  },

  title: {
    color: "#F7F1E3",
    fontSize: 29,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 6,
  },

  subtitle: {
    color: "#777",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },

  bookingIdCard: {
    backgroundColor: "#191919",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#35312A",
    padding: 14,
    alignItems: "center",
    marginBottom: 18,
  },

  bookingIdLabel: {
    color: "#666",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  bookingId: {
    color: "#D8B56A",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 5,
    letterSpacing: 1,
  },

  card: {
    backgroundColor: "#191919",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 16,
    marginBottom: 13,
  },

  sectionTitle: {
    color: "#555",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 13,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
  },

  details: {
    flex: 1,
    marginLeft: 12,
  },

  mainText: {
    color: "#F7F1E3",
    fontSize: 13,
    fontWeight: "700",
  },

  subText: {
    color: "#777",
    fontSize: 10,
    marginTop: 4,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#292214",
    borderWidth: 1,
    borderColor: "#4A3B20",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#D8B56A",
    fontSize: 14,
    fontWeight: "800",
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  appointmentRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  appointmentItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  verticalLine: {
    width: 1,
    height: 40,
    backgroundColor: "#303030",
    marginHorizontal: 10,
  },

  smallLabel: {
    color: "#555",
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 3,
  },

  paymentCard: {
    backgroundColor: "#191919",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#35312A",
    padding: 17,
    marginTop: 3,
    marginBottom: 22,
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  paymentLabel: {
    color: "#F7F1E3",
    fontSize: 13,
    fontWeight: "700",
  },

  price: {
    color: "#D8B56A",
    fontSize: 22,
    fontWeight: "800",
  },

  paymentNote: {
    color: "#666",
    fontSize: 9,
    lineHeight: 14,
    marginTop: 10,
  },

  primaryButton: {
    height: 55,
    borderRadius: 18,
    backgroundColor: "#D8B56A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  primaryText: {
    color: "#101010",
    fontSize: 13,
    fontWeight: "800",
  },

  secondaryButton: {
    height: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#393939",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 11,
  },

  secondaryText: {
    color: "#D8D2C5",
    fontSize: 12,
    fontWeight: "700",
  },

  footer: {
    color: "#555",
    fontSize: 9,
    textAlign: "center",
    marginTop: 18,
  },

  bottomSpace: {
    height: 20,
  },
});
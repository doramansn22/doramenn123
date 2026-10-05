import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import {
  getBookingFromServer,
  saveBookingToServer,
  deleteBookingFromServer,
} from "../utils/bookingApi";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

type Booking = {
  bookingId: string;
  service: string;
  option: string;
  date: string;
  time: string;
  address: string;
  professionalName: string;
  rating: string;
  price: string;
  status: string;
};

export default function BookingsScreen() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  const loadBooking = async () => {
    try {
      const savedBooking = await AsyncStorage.getItem(
        "homeai_booking"
      );

      if (savedBooking) {
        setBooking(JSON.parse(savedBooking));
      } else {
        setBooking(null);
      }
    } catch (error) {
      console.log("Error loading local booking:", error);
    }

    try {
      const serverBooking =
        await getBookingFromServer();

      if (serverBooking) {
        setBooking(serverBooking);

        await AsyncStorage.setItem(
          "homeai_booking",
          JSON.stringify(serverBooking)
        );
      } else {
        const savedBooking =
          await AsyncStorage.getItem(
            "homeai_booking"
          );

        if (savedBooking) {
          try {
            const localBooking: Booking =
              JSON.parse(savedBooking);

            await saveBookingToServer(
              localBooking
            );
          } catch (syncError) {
            console.log(
              "Booking sync error:",
              syncError
            );
          }
        }
      }
    } catch (error) {
      console.log(
        "Booking server load error. Using local booking:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, []);

  const cancelBooking = () => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        {
          text: "Keep Booking",
          style: "cancel",
        },
        {
          text: "Cancel Booking",
          style: "destructive",
          onPress: async () => {
            try {
              const bookingId =
                booking?.bookingId;

              await AsyncStorage.removeItem("homeai_booking");

              if (bookingId) {
                try {
                  await deleteBookingFromServer(
                    bookingId
                  );
                } catch (serverError) {
                  console.log(
                    "Booking server delete error. Local booking is still cancelled:",
                    serverError
                  );
                }
              }

              setBooking(null);

              Alert.alert(
                "Booking Cancelled",
                "Your booking has been cancelled."
              );
            } catch (error) {
              console.log("Error cancelling booking:", error);
            }
          },
        },
      ]
    );
  };

  const rescheduleBooking = () => {
    if (!booking) return;

    router.push({
      pathname: "/bookings",
      params: {
        service: booking.service,
        option: booking.option,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />

        <Text style={styles.loadingBrand}>
          HOMEAI
        </Text>

        <Text style={styles.loadingText}>
          Loading your bookings...
        </Text>
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
        {/* Header */}

        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              HOMEAI
            </Text>

            <Text style={styles.title}>
              My Bookings
            </Text>
          </View>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.push("/")}
          >
            <Ionicons
              name="home-outline"
              size={20}
              color="#D8B56A"
            />
          </TouchableOpacity>
        </View>

        {/* Upcoming */}

        <View style={styles.headingRow}>
          <Text style={styles.sectionHeading}>
            UPCOMING
          </Text>

          {booking && (
            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />

              <Text style={styles.activeText}>
                ACTIVE
              </Text>
            </View>
          )}
        </View>

        {/* Booking */}

        {booking ? (
          <View style={styles.bookingCard}>

            {/* Status */}

            <View style={styles.statusRow}>
              <View style={styles.statusBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={15}
                  color="#D8B56A"
                />

                <Text style={styles.statusText}>
                  {booking.status}
                </Text>
              </View>

              <Text style={styles.bookingId}>
                #{booking.bookingId}
              </Text>
            </View>

            {/* Service */}

            <View style={styles.serviceRow}>
              <View style={styles.serviceIcon}>
                <Ionicons
                  name="construct-outline"
                  size={23}
                  color="#D8B56A"
                />
              </View>

              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>
                  {booking.service}
                </Text>

                <Text style={styles.option}>
                  {booking.option}
                </Text>
              </View>
            </View>

            {/* Professional */}

            <View style={styles.professionalRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {booking.professionalName
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)}
                </Text>
              </View>

              <View style={styles.professionalInfo}>
                <Text style={styles.smallLabel}>
                  PROFESSIONAL
                </Text>

                <View style={styles.nameRow}>
                  <Text style={styles.professionalName}>
                    {booking.professionalName}
                  </Text>

                  <Ionicons
                    name="checkmark-circle"
                    size={15}
                    color="#D8B56A"
                  />
                </View>

                <View style={styles.ratingRow}>
                  <Ionicons
                    name="star"
                    size={12}
                    color="#D8B56A"
                  />

                  <Text style={styles.rating}>
                    {booking.rating}
                  </Text>

                  <Text style={styles.verified}>
                    Verified
                  </Text>
                </View>
              </View>
            </View>

            {/* Appointment */}

            <View style={styles.appointmentBox}>
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

                  <Text style={styles.value}>
                    {booking.date}
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

                  <Text style={styles.value}>
                    {booking.time}
                  </Text>
                </View>
              </View>
            </View>

            {/* Address */}

            <View style={styles.addressRow}>
              <Ionicons
                name="location-outline"
                size={18}
                color="#777"
              />

              <Text style={styles.address}>
                {booking.address}
              </Text>
            </View>

            {/* Price */}

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Estimated Total
              </Text>

              <Text style={styles.price}>
                {booking.price}
              </Text>
            </View>

            {/* Buttons */}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.rescheduleButton}
                onPress={rescheduleBooking}
              >
                <Ionicons
                  name="calendar-outline"
                  size={17}
                  color="#D8B56A"
                />

                <Text style={styles.rescheduleText}>
                  Reschedule
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelBooking}
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Empty State */

          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="calendar-outline"
                size={32}
                color="#D8B56A"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No Upcoming Bookings
            </Text>

            <Text style={styles.emptyText}>
              Your upcoming home services will appear here.
            </Text>

            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push("/services")}
            >
              <Text style={styles.browseText}>
                Browse Services
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color="#101010"
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Booking Journey */}

        {booking && (
          <View style={styles.journeyCard}>
            <Text style={styles.journeyTitle}>
              BOOKING JOURNEY
            </Text>

            <View style={styles.stepRow}>
              <View style={styles.stepCircle}>
                <Ionicons
                  name="checkmark"
                  size={13}
                  color="#101010"
                />
              </View>

              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>
                  Booking confirmed
                </Text>

                <Text style={styles.stepText}>
                  Your service request has been confirmed.
                </Text>
              </View>
            </View>

            <View style={styles.stepLine} />

            <View style={styles.stepRow}>
              <View style={styles.stepCircle}>
                <Ionicons
                  name="person"
                  size={13}
                  color="#101010"
                />
              </View>

              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>
                  Professional assigned
                </Text>

                <Text style={styles.stepText}>
                  {booking.professionalName} is assigned to your booking.
                </Text>
              </View>
            </View>

            <View style={styles.stepLine} />

            <View style={styles.stepRow}>
              <View style={styles.pendingCircle}>
                <Ionicons
                  name="time-outline"
                  size={13}
                  color="#777"
                />
              </View>

              <View style={styles.stepContent}>
                <Text style={styles.pendingTitle}>
                  Service pending
                </Text>

                <Text style={styles.stepText}>
                  Your professional will arrive at the scheduled time.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Support */}

        <TouchableOpacity
          style={styles.supportCard}
          onPress={() =>
            Alert.alert(
              "HomeAI Support",
              "Support chat will be connected soon."
            )
          }
        >
          <View style={styles.supportIcon}>
            <Ionicons
              name="headset-outline"
              size={22}
              color="#D8B56A"
            />
          </View>

          <View style={styles.supportInfo}>
            <Text style={styles.supportTitle}>
              Need help?
            </Text>

            <Text style={styles.supportText}>
              Contact HomeAI support
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#666"
          />
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#101010",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingBrand: {
    color: "#D8B56A",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 3,
  },

  loadingText: {
    color: "#777",
    fontSize: 12,
    marginTop: 10,
  },

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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
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

  homeButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#181818",
    borderWidth: 1,
    borderColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },

  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionHeading: {
    color: "#666",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D8B56A",
  },

  activeText: {
    color: "#D8B56A",
    fontSize: 8,
    fontWeight: "800",
  },

  bookingCard: {
    backgroundColor: "#191919",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#35312A",
    padding: 17,
    marginBottom: 22,
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#292214",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
  },

  statusText: {
    color: "#D8B56A",
    fontSize: 9,
    fontWeight: "700",
  },

  bookingId: {
    color: "#555",
    fontSize: 9,
  },

  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  serviceIcon: {
    width: 51,
    height: 51,
    borderRadius: 16,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
  },

  serviceInfo: {
    marginLeft: 12,
    flex: 1,
  },

  serviceName: {
    color: "#F7F1E3",
    fontSize: 17,
    fontWeight: "800",
  },

  option: {
    color: "#777",
    fontSize: 10,
    marginTop: 4,
  },

  professionalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 17,
    borderTopWidth: 1,
    borderTopColor: "#292929",
  },

  avatar: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#292214",
    borderWidth: 1,
    borderColor: "#4A3B20",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#D8B56A",
    fontSize: 13,
    fontWeight: "800",
  },

  professionalInfo: {
    marginLeft: 11,
    flex: 1,
  },

  smallLabel: {
    color: "#555",
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 4,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  professionalName: {
    color: "#D8D2C5",
    fontSize: 12,
    fontWeight: "700",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
  },

  rating: {
    color: "#D8B56A",
    fontSize: 9,
    fontWeight: "700",
  },

  verified: {
    color: "#666",
    fontSize: 8,
    marginLeft: 3,
  },

  appointmentBox: {
    backgroundColor: "#151515",
    borderRadius: 15,
    padding: 14,
    marginTop: 17,
    flexDirection: "row",
    alignItems: "center",
  },

  appointmentItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  verticalLine: {
    width: 1,
    height: 35,
    backgroundColor: "#303030",
    marginHorizontal: 8,
  },

  value: {
    color: "#F7F1E3",
    fontSize: 11,
    fontWeight: "700",
  },

  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    gap: 7,
  },

  address: {
    color: "#888",
    fontSize: 10,
    flex: 1,
    lineHeight: 15,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 17,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#292929",
  },

  priceLabel: {
    color: "#777",
    fontSize: 10,
  },

  price: {
    color: "#D8B56A",
    fontSize: 19,
    fontWeight: "800",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 9,
    marginTop: 15,
  },

  rescheduleButton: {
    flex: 1,
    height: 44,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#3A352A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  rescheduleText: {
    color: "#D8B56A",
    fontSize: 10,
    fontWeight: "700",
  },

  cancelButton: {
    width: 82,
    height: 44,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    color: "#777",
    fontSize: 10,
    fontWeight: "700",
  },

  emptyCard: {
    backgroundColor: "#191919",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 30,
    alignItems: "center",
  },

  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 23,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 17,
  },

  emptyTitle: {
    color: "#F7F1E3",
    fontSize: 17,
    fontWeight: "800",
  },

  emptyText: {
    color: "#666",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 17,
    marginTop: 7,
    marginBottom: 20,
  },

  browseButton: {
    height: 45,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: "#D8B56A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  browseText: {
    color: "#101010",
    fontSize: 11,
    fontWeight: "800",
  },

  journeyCard: {
    backgroundColor: "#191919",
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 17,
    marginBottom: 14,
  },

  journeyTitle: {
    color: "#666",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 18,
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  stepCircle: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#D8B56A",
    alignItems: "center",
    justifyContent: "center",
  },

  pendingCircle: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },

  stepContent: {
    flex: 1,
    marginLeft: 11,
  },

  stepTitle: {
    color: "#D8D2C5",
    fontSize: 11,
    fontWeight: "700",
  },

  pendingTitle: {
    color: "#777",
    fontSize: 11,
    fontWeight: "700",
  },

  stepText: {
    color: "#555",
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
  },

  stepLine: {
    height: 18,
    width: 1,
    backgroundColor: "#353535",
    marginLeft: 13,
    marginVertical: 3,
  },

  supportCard: {
    backgroundColor: "#181818",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  supportIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
  },

  supportInfo: {
    flex: 1,
    marginLeft: 11,
  },

  supportTitle: {
    color: "#D8D2C5",
    fontSize: 12,
    fontWeight: "700",
  },

  supportText: {
    color: "#666",
    fontSize: 9,
    marginTop: 3,
  },

  bottomSpace: {
    height: 25,
  },
});
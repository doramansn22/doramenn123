import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

export default function ProfessionalProfileScreen() {
  const params = useLocalSearchParams();

  const name = String(params.name || "Professional");
  const initials = String(params.initials || "HP");
  const rating = String(params.rating || "4.8");
  const jobs = String(params.jobs || "500");
  const distance = String(params.distance || "2.0 km");
  const price = String(params.price || "₹499");
  const experience = String(params.experience || "8 years");
  const available = String(params.available || "Available today");
  const service = String(params.service || "Home Service");
  const phone = String(params.phone || "");

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
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

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <Text style={styles.name}>{name}</Text>

          <View style={styles.verifiedRow}>
            <Ionicons
              name="shield-checkmark"
              size={17}
              color="#D8B56A"
            />

            <Text style={styles.verifiedText}>
              HomeAI Verified Professional
            </Text>
          </View>

          <View style={styles.ratingBox}>
            <Ionicons
              name="star"
              size={18}
              color="#D8B56A"
            />

            <Text style={styles.rating}>{rating}</Text>

            <Text style={styles.ratingSub}>
              Excellent rating
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Professional Details
        </Text>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons
                name="briefcase-outline"
                size={20}
                color="#D8B56A"
              />
            </View>

            <View>
              <Text style={styles.detailLabel}>
                EXPERIENCE
              </Text>

              <Text style={styles.detailValue}>
                {experience}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons
                name="checkmark-done-outline"
                size={20}
                color="#D8B56A"
              />
            </View>

            <View>
              <Text style={styles.detailLabel}>
                COMPLETED JOBS
              </Text>

              <Text style={styles.detailValue}>
                {jobs} jobs completed
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons
                name="location-outline"
                size={20}
                color="#D8B56A"
              />
            </View>

            <View>
              <Text style={styles.detailLabel}>
                DISTANCE
              </Text>

              <Text style={styles.detailValue}>
                {distance} from your home
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Ionicons
                name="time-outline"
                size={20}
                color="#D8B56A"
              />
            </View>

            <View>
              <Text style={styles.detailLabel}>
                AVAILABILITY
              </Text>

              <Text style={styles.availableValue}>
                {available}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Service Information
        </Text>

        <View style={styles.serviceCard}>
          <View style={styles.serviceIcon}>
            <Ionicons
              name="construct-outline"
              size={24}
              color="#D8B56A"
            />
          </View>

          <View style={styles.serviceContent}>
            <Text style={styles.serviceTitle}>
              Home Service Professional
            </Text>

            <Text style={styles.serviceText}>
              Professional service through the HomeAI
              verified marketplace.
            </Text>
          </View>
        </View>

        <View style={styles.priceCard}>
          <View>
            <Text style={styles.priceLabel}>
              STARTING FROM
            </Text>

            <Text style={styles.price}>
              {price}
            </Text>
          </View>

          <Ionicons
            name="pricetag-outline"
            size={24}
            color="#D8B56A"
          />
        </View>

        <View style={styles.trustCard}>
          <Ionicons
            name="shield-checkmark-outline"
            size={28}
            color="#D8B56A"
          />

          <View style={styles.trustContent}>
            <Text style={styles.trustTitle}>
              HomeAI Verified
            </Text>

            <Text style={styles.trustText}>
              This professional has been verified for
              the HomeAI service marketplace.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Professional Specializations
        </Text>

        <View style={styles.specializationsCard}>
          <View style={styles.specializationItem}>
            <View style={styles.specializationIcon}>
              <Ionicons
                name="construct-outline"
                size={19}
                color="#D8B56A"
              />
            </View>

            <Text style={styles.specializationText}>
              {service}
            </Text>
          </View>

          <View style={styles.specializationItem}>
            <View style={styles.specializationIcon}>
              <Ionicons
                name="settings-outline"
                size={19}
                color="#D8B56A"
              />
            </View>

            <Text style={styles.specializationText}>
              Repair & Maintenance
            </Text>
          </View>

          <View style={styles.specializationItem}>
            <View style={styles.specializationIcon}>
              <Ionicons
                name="build-outline"
                size={19}
                color="#D8B56A"
              />
            </View>

            <Text style={styles.specializationText}>
              Installation & Service
            </Text>
          </View>

          <View style={styles.specializationItem}>
            <View style={styles.specializationIcon}>
              <Ionicons
                name="flash-outline"
                size={19}
                color="#D8B56A"
              />
            </View>

            <Text style={styles.specializationText}>
              Emergency Service
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Availability & Working Hours
        </Text>

        <View style={styles.availabilityCard}>
          <View style={styles.availabilityHeader}>
            <View style={styles.availabilityStatusIcon}>
              <Ionicons
                name="checkmark-circle"
                size={22}
                color="#D8B56A"
              />
            </View>

            <View style={styles.availabilityHeaderContent}>
              <Text style={styles.availabilityLabel}>
                CURRENT AVAILABILITY
              </Text>

              <Text style={styles.availabilityValue}>
                {available}
              </Text>
            </View>

            <View style={styles.availableBadge}>
              <View style={styles.availableDot} />
              <Text style={styles.availableBadgeText}>
                AVAILABLE
              </Text>
            </View>
          </View>

          <View style={styles.availabilityDivider} />

          <View style={styles.workingHoursRow}>
            <View style={styles.workingHoursItem}>
              <View style={styles.workingHoursIcon}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color="#D8B56A"
                />
              </View>

              <View>
                <Text style={styles.workingHoursLabel}>
                  WORKING HOURS
                </Text>

                <Text style={styles.workingHoursValue}>
                  9:00 AM - 8:00 PM
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.emergencyRow}>
            <Ionicons
              name="flash-outline"
              size={18}
              color="#D8B56A"
            />

            <Text style={styles.emergencyText}>
              Emergency service available
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Service Area
        </Text>

        <View style={styles.serviceAreaCard}>
          <View style={styles.serviceAreaRow}>
            <View style={styles.serviceAreaIcon}>
              <Ionicons
                name="location-outline"
                size={21}
                color="#D8B56A"
              />
            </View>

            <View style={styles.serviceAreaContent}>
              <Text style={styles.serviceAreaLabel}>
                SERVICE COVERAGE
              </Text>

              <Text style={styles.serviceAreaValue}>
                Local service area
              </Text>

              <Text style={styles.serviceAreaText}>
                This professional is available for services near your home.
              </Text>
            </View>
          </View>

          <View style={styles.serviceAreaDivider} />

          <View style={styles.serviceAreaInfoRow}>
            <View style={styles.serviceAreaInfoItem}>
              <Ionicons
                name="navigate-outline"
                size={17}
                color="#D8B56A"
              />

              <View>
                <Text style={styles.serviceAreaInfoLabel}>
                  YOUR DISTANCE
                </Text>

                <Text style={styles.serviceAreaInfoValue}>
                  {distance}
                </Text>
              </View>
            </View>

            <View style={styles.serviceAreaInfoItem}>
              <Ionicons
                name="car-outline"
                size={17}
                color="#D8B56A"
              />

              <View>
                <Text style={styles.serviceAreaInfoLabel}>
                  SERVICE RANGE
                </Text>

                <Text style={styles.serviceAreaInfoValue}>
                  Up to 10 km
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Contact Professional
        </Text>

        <View style={styles.contactCard}>
          <TouchableOpacity
            style={styles.contactButton}
            activeOpacity={0.85}
            onPress={() => {
              if (phone) {
                Alert.alert("Call Professional", `Call ${name} at ${phone}?`, [
                  { text: "Cancel", style: "cancel" },
                  { text: "Call", onPress: () => {} },
                ]);
              } else {
                Alert.alert(
                  "Call Professional",
                  "Contact details will be available after booking."
                );
              }
            }}
          >
            <View style={styles.contactIcon}>
              <Ionicons
                name="call-outline"
                size={20}
                color="#D8B56A"
              />
            </View>

            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Call Professional</Text>
              <Text style={styles.contactText}>
                Speak directly with the professional
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#777"
            />
          </TouchableOpacity>

          <View style={styles.contactDivider} />

          <TouchableOpacity
            style={styles.contactButton}
            activeOpacity={0.85}
            onPress={() =>
              Alert.alert(
                "Message Professional",
                "Messaging will be available after booking."
              )
            }
          >
            <View style={styles.contactIcon}>
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color="#D8B56A"
              />
            </View>

            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Message Professional</Text>
              <Text style={styles.contactText}>
                Send a message about your service
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>
          Reviews & Ratings
        </Text>

        <View style={styles.reviewsCard}>
          <View style={styles.reviewSummary}>
            <Text style={styles.reviewScore}>{rating}</Text>

            <View style={styles.reviewStars}>
              <Ionicons name="star" size={15} color="#D8B56A" />
              <Ionicons name="star" size={15} color="#D8B56A" />
              <Ionicons name="star" size={15} color="#D8B56A" />
              <Ionicons name="star" size={15} color="#D8B56A" />
              <Ionicons name="star" size={15} color="#D8B56A" />
            </View>

            <Text style={styles.reviewCount}>
              Based on {jobs} completed jobs
            </Text>
          </View>

          <View style={styles.reviewDivider} />

          <View style={styles.reviewItem}>
            <View style={styles.reviewAvatar}>
              <Text style={styles.reviewAvatarText}>A</Text>
            </View>

            <View style={styles.reviewContent}>
              <View style={styles.reviewNameRow}>
                <Text style={styles.reviewerName}>Arun</Text>

                <View style={styles.smallStars}>
                  <Ionicons name="star" size={11} color="#D8B56A" />
                  <Ionicons name="star" size={11} color="#D8B56A" />
                  <Ionicons name="star" size={11} color="#D8B56A" />
                  <Ionicons name="star" size={11} color="#D8B56A" />
                  <Ionicons name="star" size={11} color="#D8B56A" />
                </View>
              </View>

              <Text style={styles.reviewText}>
                Professional service, arrived on time and fixed the issue perfectly.
              </Text>
            </View>
          </View>

          <View style={styles.reviewDivider} />

          <View style={styles.reviewItem}>
            <View style={styles.reviewAvatar}>
              <Text style={styles.reviewAvatarText}>S</Text>
            </View>

            <View style={styles.reviewContent}>
              <View style={styles.reviewNameRow}>
                <Text style={styles.reviewerName}>Sneha</Text>

                <View style={styles.smallStars}>
                  <Ionicons name="star" size={11} color="#D8B56A" />
                  <Ionicons name="star" size={11} color="#D8B56A" />
                  <Ionicons name="star" size={11} color="#D8B56A" />
                  <Ionicons name="star" size={11} color="#D8B56A" />
                  <Ionicons name="star" size={11} color="#D8B56A" />
                </View>
              </View>

              <Text style={styles.reviewText}>
                Very polite and knowledgeable. The service was quick and reliable.
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.selectButton}
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: "/final-booking",
              params: {
                service: String(params.service || "Home Service"),
                option: String(params.option || "General service"),
                date: String(params.date || "Tomorrow"),
                time: String(params.time || "10:00 AM"),
                address: String(params.address || "Home address"),
                professionalId: String(params.professionalId || ""),
                professionalName: name,
                rating,
                price,
              },
            })
          }
        >
          <Text style={styles.selectButtonText}>
            Select Professional
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color="#101010"
          />
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

  profileCard: {
    backgroundColor: "#191919",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#3A3222",
    padding: 25,
    alignItems: "center",
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: "#292214",
    borderWidth: 1,
    borderColor: "#4A3B20",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#D8B56A",
    fontSize: 27,
    fontWeight: "800",
  },

  name: {
    color: "#F7F1E3",
    fontSize: 25,
    fontWeight: "800",
    marginTop: 18,
  },

  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
    gap: 6,
  },

  verifiedText: {
    color: "#D8B56A",
    fontSize: 11,
    fontWeight: "600",
  },

  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    gap: 6,
  },

  rating: {
    color: "#F7F1E3",
    fontSize: 17,
    fontWeight: "800",
  },

  ratingSub: {
    color: "#777",
    fontSize: 11,
    marginLeft: 3,
  },

  sectionTitle: {
    color: "#F7F1E3",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 28,
    marginBottom: 13,
  },

  detailsCard: {
    backgroundColor: "#191919",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 18,
  },

  detailRow: {
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
    marginRight: 13,
  },

  detailLabel: {
    color: "#666",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  detailValue: {
    color: "#E8E8E8",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },

  availableValue: {
    color: "#D8B56A",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#292929",
    marginVertical: 16,
  },

  serviceCard: {
    backgroundColor: "#191919",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
  },

  serviceContent: {
    flex: 1,
    marginLeft: 13,
  },

  serviceTitle: {
    color: "#F7F1E3",
    fontSize: 14,
    fontWeight: "700",
  },

  serviceText: {
    color: "#777",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  priceCard: {
    backgroundColor: "#191919",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#3A3222",
    padding: 18,
    marginTop: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  priceLabel: {
    color: "#666",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  price: {
    color: "#D8B56A",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 4,
  },

  trustCard: {
    backgroundColor: "#181818",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 13,
  },

  trustContent: {
    flex: 1,
    marginLeft: 12,
  },

  trustTitle: {
    color: "#D9D9D9",
    fontSize: 13,
    fontWeight: "700",
  },

  trustText: {
    color: "#666",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  selectButton: {
    height: 57,
    borderRadius: 18,
    backgroundColor: "#D8B56A",
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  selectButtonText: {
    color: "#101010",
    fontSize: 16,
    fontWeight: "800",
  },

  specializationsCard: {
    backgroundColor: "#191919",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 18,
  },

  specializationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  specializationIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  specializationText: {
    color: "#E8E8E8",
    fontSize: 12,
    fontWeight: "600",
  },

  availabilityCard: {
    backgroundColor: "#191919",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 18,
  },

  availabilityHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  availabilityStatusIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  availabilityHeaderContent: {
    flex: 1,
  },

  availabilityLabel: {
    color: "#666",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
  },

  availabilityValue: {
    color: "#E8E8E8",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  availableBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#242016",
    borderWidth: 1,
    borderColor: "#3A3222",
  },

  availableDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#D8B56A",
    marginRight: 5,
  },

  availableBadgeText: {
    color: "#D8B56A",
    fontSize: 8,
    fontWeight: "800",
  },

  availabilityDivider: {
    height: 1,
    backgroundColor: "#292929",
    marginVertical: 16,
  },

  workingHoursRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  workingHoursItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  workingHoursIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  workingHoursLabel: {
    color: "#666",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  workingHoursValue: {
    color: "#D8D8D8",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },

  emergencyRow: {
    marginTop: 14,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: "#292929",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  emergencyText: {
    color: "#888",
    fontSize: 10,
    fontWeight: "600",
  },

  serviceAreaCard: {
    backgroundColor: "#191919",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 18,
  },

  serviceAreaRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  serviceAreaIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  serviceAreaContent: {
    flex: 1,
  },

  serviceAreaLabel: {
    color: "#666",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  serviceAreaValue: {
    color: "#E8E8E8",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },

  serviceAreaText: {
    color: "#777",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  serviceAreaDivider: {
    height: 1,
    backgroundColor: "#292929",
    marginVertical: 16,
  },

  serviceAreaInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  serviceAreaInfoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  serviceAreaInfoLabel: {
    color: "#666",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  serviceAreaInfoValue: {
    color: "#D8D8D8",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },

  contactCard: {
    backgroundColor: "#191919",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#292929",
    paddingHorizontal: 18,
  },

  contactButton: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
  },

  contactIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  contactContent: {
    flex: 1,
  },

  contactTitle: {
    color: "#F7F1E3",
    fontSize: 13,
    fontWeight: "700",
  },

  contactText: {
    color: "#777",
    fontSize: 10,
    marginTop: 4,
  },

  contactDivider: {
    height: 1,
    backgroundColor: "#292929",
  },

  reviewsCard: {
    backgroundColor: "#191919",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 18,
  },

  reviewSummary: {
    alignItems: "center",
  },

  reviewScore: {
    color: "#F7F1E3",
    fontSize: 30,
    fontWeight: "800",
  },

  reviewStars: {
    flexDirection: "row",
    gap: 3,
    marginTop: 5,
  },

  reviewCount: {
    color: "#777",
    fontSize: 10,
    marginTop: 6,
  },

  reviewDivider: {
    height: 1,
    backgroundColor: "#292929",
    marginVertical: 16,
  },

  reviewItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  reviewAvatar: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: "#292214",
    borderWidth: 1,
    borderColor: "#4A3B20",
    alignItems: "center",
    justifyContent: "center",
  },

  reviewAvatarText: {
    color: "#D8B56A",
    fontSize: 13,
    fontWeight: "800",
  },

  reviewContent: {
    flex: 1,
    marginLeft: 11,
  },

  reviewNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  reviewerName: {
    color: "#F7F1E3",
    fontSize: 12,
    fontWeight: "700",
  },

  smallStars: {
    flexDirection: "row",
    gap: 2,
  },

  reviewText: {
    color: "#777",
    fontSize: 10,
    lineHeight: 16,
    marginTop: 5,
  },

  bottomSpace: {
    height: 20,
  },
});
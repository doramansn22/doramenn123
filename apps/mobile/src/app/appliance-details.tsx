import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

export default function ApplianceDetailsScreen() {
  const params = useLocalSearchParams();

  const type = String(params.type || "Appliance");
  const name = String(params.name || "My Appliance");
  const brand = String(params.brand || "Not added");
  const model = String(params.model || "Not added");
  const purchaseYear = String(params.purchaseYear || "Not added");
  const warranty = String(params.warranty || "Not added");

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={24} color="#F7F1E3" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Appliance Details</Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Appliance Hero */}
        <View style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Ionicons
              name={
                type === "Air Conditioner"
                  ? "snow-outline"
                  : type === "Refrigerator"
                  ? "cube-outline"
                  : type === "Washing Machine"
                  ? "water-outline"
                  : type === "Television"
                  ? "tv-outline"
                  : type === "Microwave"
                  ? "restaurant-outline"
                  : "water-outline"
              }
              size={34}
              color="#D8B56A"
            />
          </View>

          <View style={styles.heroText}>
            <Text style={styles.typeText}>{type}</Text>
            <Text style={styles.applianceName}>{name}</Text>
            <Text style={styles.brandText}>{brand}</Text>
          </View>
        </View>

        {/* Information */}
        <Text style={styles.sectionTitle}>Appliance Information</Text>

        <View style={styles.infoCard}>
          <InfoRow
            icon="business-outline"
            label="Brand"
            value={brand}
          />

          <InfoRow
            icon="cube-outline"
            label="Model"
            value={model}
          />

          <InfoRow
            icon="calendar-outline"
            label="Purchase Year"
            value={purchaseYear}
          />

          <InfoRow
            icon="shield-checkmark-outline"
            label="Warranty"
            value={warranty}
            last
          />
        </View>

        {/* Maintenance */}
        <Text style={styles.sectionTitle}>Maintenance</Text>

        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.8}
          onPress={() =>
  router.push({
    pathname: "/service-history",
    params: {
      id: String(params.id || ""),
      name,
    },
  })
}
        >
          <View style={styles.actionIcon}>
            <Ionicons
              name="construct-outline"
              size={24}
              color="#D8B56A"
            />
          </View>

          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Service History</Text>
            <Text style={styles.actionSubtitle}>
              View previous repairs and services
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#777"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          activeOpacity={0.8}
          onPress={() =>
  router.push({
    pathname: "/maintenance-schedule",
    params: {
      id: String(params.id || ""),
      name,
    },
  })
}
        >
          <View style={styles.actionIcon}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color="#D8B56A"
            />
          </View>

          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Maintenance Schedule</Text>
            <Text style={styles.actionSubtitle}>
              Keep track of upcoming maintenance
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#777"
          />
        </TouchableOpacity>

        {/* AI Card */}
        <View style={styles.aiCard}>
          <View style={styles.aiIcon}>
            <Ionicons
              name="sparkles-outline"
              size={24}
              color="#D8B56A"
            />
          </View>

          <View style={styles.aiContent}>
            <Text style={styles.aiTitle}>Ask HomeAI</Text>

            <Text style={styles.aiText}>
              Need help with this appliance? Ask HomeAI about
              maintenance, problems, or service.
            </Text>

            <TouchableOpacity
              style={styles.aiButton}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/ai",
                  params: {
                    appliance: name,
                    brand,
                    model,
                  },
                })
              }
            >
              <Text style={styles.aiButtonText}>Ask HomeAI</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#101010"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, !last && styles.infoBorder]}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={20} color="#D8B56A" />
      </View>

      <View style={styles.infoDetails}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
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
    paddingTop: 55,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#191919",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#292929",
  },

  headerTitle: {
    color: "#F7F1E3",
    fontSize: 20,
    fontWeight: "700",
  },

  headerSpacer: {
    width: 44,
  },

  heroCard: {
    backgroundColor: "#191919",
    borderRadius: 22,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#292929",
    marginBottom: 30,
  },

  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#241F15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 17,
    borderWidth: 1,
    borderColor: "#4A3B20",
  },

  heroText: {
    flex: 1,
  },

  typeText: {
    color: "#8F8F8F",
    fontSize: 13,
    marginBottom: 4,
  },

  applianceName: {
    color: "#F7F1E3",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },

  brandText: {
    color: "#D8B56A",
    fontSize: 14,
    fontWeight: "600",
  },

  sectionTitle: {
    color: "#F7F1E3",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
  },

  infoCard: {
    backgroundColor: "#191919",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#292929",
    marginBottom: 28,
    overflow: "hidden",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 17,
    paddingVertical: 16,
  },

  infoBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#292929",
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#241F15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  infoDetails: {
    flex: 1,
  },

  infoLabel: {
    color: "#858585",
    fontSize: 12,
    marginBottom: 3,
  },

  infoValue: {
    color: "#F7F1E3",
    fontSize: 15,
    fontWeight: "600",
  },

  actionCard: {
    backgroundColor: "#191919",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#241F15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  actionText: {
    flex: 1,
  },

  actionTitle: {
    color: "#F7F1E3",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },

  actionSubtitle: {
    color: "#858585",
    fontSize: 12,
    lineHeight: 17,
  },

  aiCard: {
    backgroundColor: "#191919",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#4A3B20",
    padding: 18,
    marginTop: 18,
    flexDirection: "row",
  },

  aiIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#241F15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  aiContent: {
    flex: 1,
  },

  aiTitle: {
    color: "#D8B56A",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  aiText: {
    color: "#A0A0A0",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },

  aiButton: {
    alignSelf: "flex-start",
    backgroundColor: "#D8B56A",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  aiButtonText: {
    color: "#101010",
    fontSize: 13,
    fontWeight: "800",
  },
});
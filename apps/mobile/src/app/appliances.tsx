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
import {
  getAppliancesFromServer,
  saveApplianceToServer,
  deleteApplianceFromServer,
} from "../utils/appliancesApi";

type Appliance = {
  id: string;
  type: string;
  name: string;
  brand: string;
  model: string;
  purchaseYear: string;
  warranty: string;
};

const applianceTypes = [
  {
    name: "Air Conditioner",
    icon: "snow-outline" as const,
  },
  {
    name: "Refrigerator",
    icon: "cube-outline" as const,
  },
  {
    name: "Washing Machine",
    icon: "water-outline" as const,
  },
  {
    name: "Television",
    icon: "tv-outline" as const,
  },
  {
    name: "Microwave",
    icon: "restaurant-outline" as const,
  },
  {
    name: "Water Purifier",
    icon: "water-outline" as const,
  },
];

export default function AppliancesScreen() {
  const [appliances, setAppliances] = useState<Appliance[]>([]);

  const [showForm, setShowForm] = useState(false);

  const [selectedType, setSelectedType] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [purchaseYear, setPurchaseYear] = useState("");
  const [warranty, setWarranty] = useState("");

  useEffect(() => {
    loadAppliances();
  }, []);

  const loadAppliances = async () => {
    try {
      const saved = await AsyncStorage.getItem(
        "homeai_appliances"
      );

      let localAppliances: Appliance[] = [];

      if (saved) {
        localAppliances = JSON.parse(saved);
        setAppliances(localAppliances);
      }

      try {
        const serverAppliances =
          await getAppliancesFromServer();

        if (serverAppliances.length > 0) {
          setAppliances(serverAppliances);

          await AsyncStorage.setItem(
            "homeai_appliances",
            JSON.stringify(serverAppliances)
          );
        } else if (localAppliances.length > 0) {
          for (const appliance of localAppliances) {
            try {
              await saveApplianceToServer(appliance);
            } catch (syncError) {
              console.log(
                "Unable to sync appliance:",
                syncError
              );
            }
          }

          const syncedAppliances =
            await getAppliancesFromServer();

          if (syncedAppliances.length > 0) {
            setAppliances(syncedAppliances);

            await AsyncStorage.setItem(
              "homeai_appliances",
              JSON.stringify(syncedAppliances)
            );
          }
        }
      } catch (serverError) {
        console.log(
          "Appliance server load unavailable, using local data:",
          serverError
        );
      }
    } catch (error) {
      console.log("Error loading appliances:", error);
    }
  };

  const openAddForm = () => {
    setSelectedType("");
    setBrand("");
    setModel("");
    setPurchaseYear("");
    setWarranty("");
    setShowForm(true);
  };

  const saveAppliance = async () => {
    if (!selectedType) {
      Alert.alert(
        "Select Appliance",
        "Please select an appliance type."
      );
      return;
    }

    if (!brand.trim()) {
      Alert.alert(
        "Brand Required",
        "Please enter the appliance brand."
      );
      return;
    }

    const newAppliance: Appliance = {
      id: `APP-${Date.now()}`,
      type: selectedType,
      name: selectedType,
      brand,
      model,
      purchaseYear,
      warranty,
    };

    const updatedAppliances = [
      ...appliances,
      newAppliance,
    ];

    try {
      await AsyncStorage.setItem(
        "homeai_appliances",
        JSON.stringify(updatedAppliances)
      );

      try {
        await saveApplianceToServer(newAppliance);
      } catch (serverError) {
        console.log(
          "Appliance server save unavailable, local appliance saved:",
          serverError
        );
      }

      setAppliances(updatedAppliances);
      setShowForm(false);

      Alert.alert(
        "Appliance Added",
        `${selectedType} has been added to your home.`
      );
    } catch (error) {
      console.log("Error saving appliance:", error);

      Alert.alert(
        "Error",
        "Unable to save the appliance."
      );
    }
  };

  const deleteAppliance = (id: string) => {
    Alert.alert(
      "Remove Appliance",
      "Are you sure you want to remove this appliance?",
      [
        {
          text: "Keep",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const updated = appliances.filter(
                (item) => item.id !== id
              );

              await AsyncStorage.setItem(
                "homeai_appliances",
                JSON.stringify(updated)
              );

              try {
                await deleteApplianceFromServer(id);
              } catch (serverError) {
                console.log(
                  "Appliance server delete unavailable, local appliance removed:",
                  serverError
                );
              }

              setAppliances(updated);
            } catch (error) {
              console.log(
                "Error removing appliance:",
                error
              );
            }
          },
        },
      ]
    );
  };

  const getIcon = (type: string) => {
    const found = applianceTypes.find(
      (item) => item.name === type
    );

    return found?.icon || "construct-outline";
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

            <Text style={styles.title}>
              My Appliances
            </Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Keep your home's appliances organized in one place.
        </Text>

        {/* Add Button */}
        {!showForm && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={openAddForm}
            activeOpacity={0.85}
          >
            <Ionicons
              name="add"
              size={22}
              color="#101010"
            />

            <Text style={styles.addButtonText}>
              Add Appliance
            </Text>
          </TouchableOpacity>
        )}

        {/* Add Form */}
        {showForm && (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <View>
                <Text style={styles.formTitle}>
                  Add Appliance
                </Text>

                <Text style={styles.formSubtitle}>
                  Add details about your appliance.
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setShowForm(false)}
                style={styles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color="#777"
                />
              </TouchableOpacity>
            </View>

            {/* Appliance Type */}
            <Text style={styles.label}>
              APPLIANCE TYPE
            </Text>

            <View style={styles.typeGrid}>
              {applianceTypes.map((item) => (
                <TouchableOpacity
                  key={item.name}
                  style={[
                    styles.typeCard,
                    selectedType === item.name &&
                      styles.typeCardSelected,
                  ]}
                  onPress={() =>
                    setSelectedType(item.name)
                  }
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={
                      selectedType === item.name
                        ? "#D8B56A"
                        : "#777"
                    }
                  />

                  <Text
                    style={[
                      styles.typeText,
                      selectedType === item.name &&
                        styles.typeTextSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Brand */}
            <Text style={styles.label}>
              BRAND
            </Text>

            <View style={styles.inputBox}>
              <Ionicons
                name="pricetag-outline"
                size={19}
                color="#D8B56A"
              />

              <TextInput
                value={brand}
                onChangeText={setBrand}
                placeholder="Example: Samsung"
                placeholderTextColor="#555"
                style={styles.input}
              />
            </View>

            {/* Model */}
            <Text style={styles.label}>
              MODEL
            </Text>

            <View style={styles.inputBox}>
              <Ionicons
                name="barcode-outline"
                size={19}
                color="#D8B56A"
              />

              <TextInput
                value={model}
                onChangeText={setModel}
                placeholder="Example: Model number"
                placeholderTextColor="#555"
                style={styles.input}
              />
            </View>

            {/* Purchase Year */}
            <Text style={styles.label}>
              PURCHASE YEAR
            </Text>

            <View style={styles.inputBox}>
              <Ionicons
                name="calendar-outline"
                size={19}
                color="#D8B56A"
              />

              <TextInput
                value={purchaseYear}
                onChangeText={setPurchaseYear}
                placeholder="Example: 2025"
                placeholderTextColor="#555"
                style={styles.input}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>

            {/* Warranty */}
            <Text style={styles.label}>
              WARRANTY
            </Text>

            <View style={styles.inputBox}>
              <Ionicons
                name="shield-checkmark-outline"
                size={19}
                color="#D8B56A"
              />

              <TextInput
                value={warranty}
                onChangeText={setWarranty}
                placeholder="Example: Until 2027"
                placeholderTextColor="#555"
                style={styles.input}
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveAppliance}
              activeOpacity={0.85}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#101010"
              />

              <Text style={styles.saveText}>
                Save Appliance
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Appliance List */}
        {!showForm && (
          <>
            <Text style={styles.sectionTitle}>
              YOUR APPLIANCES
            </Text>

            {appliances.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIcon}>
                  <Ionicons
                    name="hardware-chip-outline"
                    size={30}
                    color="#D8B56A"
                  />
                </View>

                <Text style={styles.emptyTitle}>
                  No Appliances Added
                </Text>

                <Text style={styles.emptyText}>
                  Add your home appliances so HomeAI can
                  help manage their service and maintenance.
                </Text>
              </View>
            ) : (
              appliances.map((appliance) => (
                <TouchableOpacity
                  key={appliance.id}
                  style={styles.applianceCard}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push({
                      pathname: "/appliance-details",
                      params: {
                        id: appliance.id,
                        type: appliance.type,
                        name: appliance.name,
                        brand: appliance.brand,
                        model: appliance.model,
                        purchaseYear: appliance.purchaseYear,
                        warranty: appliance.warranty,
                      },
                    })
                  }
                >
                  <View style={styles.applianceIcon}>
                    <Ionicons
                      name={getIcon(appliance.type)}
                      size={25}
                      color="#D8B56A"
                    />
                  </View>

                  <View style={styles.applianceInfo}>
                    <Text style={styles.applianceName}>
                      {appliance.name}
                    </Text>

                    <Text style={styles.applianceBrand}>
                      {appliance.brand}
                      {appliance.model
                        ? ` • ${appliance.model}`
                        : ""}
                    </Text>

                    {appliance.purchaseYear ? (
                      <Text style={styles.applianceDetail}>
                        Purchased {appliance.purchaseYear}
                      </Text>
                    ) : null}

                    {appliance.warranty ? (
                      <Text style={styles.warranty}>
                        Warranty: {appliance.warranty}
                      </Text>
                    ) : null}
                  </View>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() =>
                      deleteAppliance(appliance.id)
                    }
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color="#777"
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            )}
          </>
        )}

        {/* AI Information */}
        {!showForm && (
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
                HomeAI Appliance Intelligence
              </Text>

              <Text style={styles.aiText}>
                Later, HomeAI can use your appliance
                information for maintenance reminders,
                warranty tracking and service recommendations.
              </Text>
            </View>
          </View>
        )}

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
    fontSize: 27,
    fontWeight: "800",
    marginTop: 4,
  },

  subtitle: {
    color: "#777",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 22,
  },

  addButton: {
    height: 54,
    borderRadius: 17,
    backgroundColor: "#D8B56A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 27,
  },

  addButtonText: {
    color: "#101010",
    fontSize: 12,
    fontWeight: "800",
  },

  formCard: {
    backgroundColor: "#191919",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#35312A",
    padding: 17,
    marginBottom: 27,
  },

  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 23,
  },

  formTitle: {
    color: "#F7F1E3",
    fontSize: 19,
    fontWeight: "800",
  },

  formSubtitle: {
    color: "#666",
    fontSize: 10,
    marginTop: 4,
  },

  closeButton: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    color: "#666",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 5,
  },

  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
  },

  typeCard: {
    width: "48%",
    minHeight: 65,
    backgroundColor: "#151515",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 10,
    justifyContent: "center",
  },

  typeCardSelected: {
    borderColor: "#D8B56A",
    backgroundColor: "#292214",
  },

  typeText: {
    color: "#777",
    fontSize: 9,
    fontWeight: "600",
    marginTop: 5,
  },

  typeTextSelected: {
    color: "#D8B56A",
  },

  inputBox: {
    height: 52,
    backgroundColor: "#151515",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#292929",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 13,
  },

  input: {
    flex: 1,
    color: "#F7F1E3",
    fontSize: 11,
    marginLeft: 10,
  },

  saveButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#D8B56A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },

  saveText: {
    color: "#101010",
    fontSize: 11,
    fontWeight: "800",
  },

  sectionTitle: {
    color: "#666",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  emptyCard: {
    backgroundColor: "#191919",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 28,
    alignItems: "center",
  },

  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  emptyTitle: {
    color: "#F7F1E3",
    fontSize: 17,
    fontWeight: "800",
  },

  emptyText: {
    color: "#666",
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 7,
  },

  applianceCard: {
    backgroundColor: "#191919",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  applianceIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
  },

  applianceInfo: {
    flex: 1,
    marginLeft: 12,
  },

  applianceName: {
    color: "#F7F1E3",
    fontSize: 14,
    fontWeight: "800",
  },

  applianceBrand: {
    color: "#888",
    fontSize: 10,
    marginTop: 4,
  },

  applianceDetail: {
    color: "#666",
    fontSize: 9,
    marginTop: 4,
  },

  warranty: {
    color: "#D8B56A",
    fontSize: 9,
    marginTop: 4,
  },

  deleteButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },

  aiCard: {
    backgroundColor: "#191919",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#4A3B20",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
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

  bottomSpace: {
    height: 25,
  },
});
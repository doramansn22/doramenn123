import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, router } from "expo-router";
import {
  getServiceHistoryFromServer,
  saveServiceRecordToServer,
  deleteServiceRecordFromServer,
} from "../utils/serviceHistoryApi";

type ServiceRecord = {
  id: string;
  serviceType: string;
  date: string;
  description: string;
  professional: string;
  cost: string;
};

export default function ServiceHistoryScreen() {
  const params = useLocalSearchParams();

  const applianceId = String(params.id || "");
  const applianceName = String(params.name || "Appliance");

  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [serviceType, setServiceType] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [professional, setProfessional] = useState("");
  const [cost, setCost] = useState("");

  const storageKey = `homeai_service_history_${applianceId}`;

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem(storageKey);

      if (saved) {
        setRecords(JSON.parse(saved));
      }

      try {
        const serverRecords =
          await getServiceHistoryFromServer(applianceId);

        setRecords(serverRecords);

        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify(serverRecords)
        );
      } catch (serverError) {
        console.log(
          "Service history server load unavailable, using local data:",
          serverError
        );
      }
    } catch (error) {
      console.log("Error loading service history:", error);
    }
  };

  const openForm = () => {
    setServiceType("");
    setDate("");
    setDescription("");
    setProfessional("");
    setCost("");
    setShowForm(true);
  };

  const saveService = async () => {
    if (!serviceType.trim()) {
      Alert.alert(
        "Service Type Required",
        "Please enter the type of service."
      );
      return;
    }

    if (!date.trim()) {
      Alert.alert(
        "Date Required",
        "Please enter the service date."
      );
      return;
    }

    const newRecord: ServiceRecord = {
      id: `SERVICE-${Date.now()}`,
      serviceType: serviceType.trim(),
      date: date.trim(),
      description: description.trim(),
      professional: professional.trim(),
      cost: cost.trim(),
    };

    const updatedRecords = [newRecord, ...records];

    try {
      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify(updatedRecords)
      );

      try {
        await saveServiceRecordToServer(
          applianceId,
          newRecord
        );
      } catch (serverError) {
        console.log(
          "Service history server save unavailable, local record saved:",
          serverError
        );
      }

      setRecords(updatedRecords);
      setShowForm(false);

      Alert.alert(
        "Service Added",
        "Service history has been updated."
      );
    } catch (error) {
      console.log("Error saving service:", error);

      Alert.alert(
        "Error",
        "Unable to save the service record."
      );
    }
  };

  const deleteService = (id: string) => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service record?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedRecords = records.filter(
                (item) => item.id !== id
              );

              await AsyncStorage.setItem(
                storageKey,
                JSON.stringify(updatedRecords)
              );

              try {
                await deleteServiceRecordFromServer(
                  applianceId,
                  id
                );
              } catch (serverError) {
                console.log(
                  "Service history server delete unavailable, local record deleted:",
                  serverError
                );
              }

              setRecords(updatedRecords);
            } catch (error) {
              console.log(
                "Error deleting service:",
                error
              );
            }
          },
        },
      ]
    );
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
              Service History
            </Text>
          </View>
        </View>

        {/* Appliance */}
        <View style={styles.applianceCard}>
          <View style={styles.applianceIcon}>
            <Ionicons
              name="construct-outline"
              size={25}
              color="#D8B56A"
            />
          </View>

          <View style={styles.applianceInfo}>
            <Text style={styles.applianceLabel}>
              APPLIANCE
            </Text>

            <Text style={styles.applianceName}>
              {applianceName}
            </Text>
          </View>
        </View>

        {/* Add Button */}
        {!showForm && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={openForm}
            activeOpacity={0.85}
          >
            <Ionicons
              name="add"
              size={22}
              color="#101010"
            />

            <Text style={styles.addButtonText}>
              Add Service Record
            </Text>
          </TouchableOpacity>
        )}

        {/* Form */}
        {showForm && (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <View>
                <Text style={styles.formTitle}>
                  Add Service
                </Text>

                <Text style={styles.formSubtitle}>
                  Record a repair or maintenance service.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowForm(false)}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color="#777"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>
              SERVICE TYPE
            </Text>

            <View style={styles.inputBox}>
              <Ionicons
                name="construct-outline"
                size={19}
                color="#D8B56A"
              />

              <TextInput
                value={serviceType}
                onChangeText={setServiceType}
                placeholder="Example: AC Servicing"
                placeholderTextColor="#555"
                style={styles.input}
              />
            </View>

            <Text style={styles.label}>
              SERVICE DATE
            </Text>

            <View style={styles.inputBox}>
              <Ionicons
                name="calendar-outline"
                size={19}
                color="#D8B56A"
              />

              <TextInput
                value={date}
                onChangeText={setDate}
                placeholder="Example: 10 Sep 2026"
                placeholderTextColor="#555"
                style={styles.input}
              />
            </View>

            <Text style={styles.label}>
              DESCRIPTION
            </Text>

            <View style={styles.textAreaBox}>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Example: Filter cleaned and gas checked"
                placeholderTextColor="#555"
                style={styles.textArea}
                multiline
              />
            </View>

            <Text style={styles.label}>
              PROFESSIONAL / COMPANY
            </Text>

            <View style={styles.inputBox}>
              <Ionicons
                name="person-outline"
                size={19}
                color="#D8B56A"
              />

              <TextInput
                value={professional}
                onChangeText={setProfessional}
                placeholder="Example: HomeAI Professional"
                placeholderTextColor="#555"
                style={styles.input}
              />
            </View>

            <Text style={styles.label}>
              COST
            </Text>

            <View style={styles.inputBox}>
              <Ionicons
                name="cash-outline"
                size={19}
                color="#D8B56A"
              />

              <TextInput
                value={cost}
                onChangeText={setCost}
                placeholder="Example: ₹500"
                placeholderTextColor="#555"
                style={styles.input}
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveService}
              activeOpacity={0.85}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#101010"
              />

              <Text style={styles.saveText}>
                Save Service
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* History */}
        {!showForm && (
          <>
            <Text style={styles.sectionTitle}>
              SERVICE RECORDS
            </Text>

            {records.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIcon}>
                  <Ionicons
                    name="construct-outline"
                    size={30}
                    color="#D8B56A"
                  />
                </View>

                <Text style={styles.emptyTitle}>
                  No Service History
                </Text>

                <Text style={styles.emptyText}>
                  Your previous repairs and maintenance
                  services will appear here.
                </Text>
              </View>
            ) : (
              records.map((record) => (
                <View
                  key={record.id}
                  style={styles.recordCard}
                >
                  <View style={styles.recordTop}>
                    <View style={styles.recordIcon}>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={23}
                        color="#D8B56A"
                      />
                    </View>

                    <View style={styles.recordMain}>
                      <Text style={styles.recordTitle}>
                        {record.serviceType}
                      </Text>

                      <Text style={styles.recordDate}>
                        {record.date}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() =>
                        deleteService(record.id)
                      }
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#777"
                      />
                    </TouchableOpacity>
                  </View>

                  {record.description ? (
                    <Text style={styles.description}>
                      {record.description}
                    </Text>
                  ) : null}

                  {record.professional ? (
                    <View style={styles.detailRow}>
                      <Ionicons
                        name="person-outline"
                        size={15}
                        color="#777"
                      />

                      <Text style={styles.detailText}>
                        {record.professional}
                      </Text>
                    </View>
                  ) : null}

                  {record.cost ? (
                    <View style={styles.detailRow}>
                      <Ionicons
                        name="cash-outline"
                        size={15}
                        color="#D8B56A"
                      />

                      <Text style={styles.costText}>
                        {record.cost}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ))
            )}
          </>
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
    marginBottom: 22,
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

  applianceCard: {
    backgroundColor: "#191919",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
    marginLeft: 13,
  },

  applianceLabel: {
    color: "#666",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 4,
  },

  applianceName: {
    color: "#F7F1E3",
    fontSize: 16,
    fontWeight: "800",
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

  textAreaBox: {
    minHeight: 90,
    backgroundColor: "#151515",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#292929",
    marginBottom: 13,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  textArea: {
    color: "#F7F1E3",
    fontSize: 11,
    minHeight: 65,
    textAlignVertical: "top",
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

  recordCard: {
    backgroundColor: "#191919",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 15,
    marginBottom: 10,
  },

  recordTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  recordIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
  },

  recordMain: {
    flex: 1,
    marginLeft: 12,
  },

  recordTitle: {
    color: "#F7F1E3",
    fontSize: 14,
    fontWeight: "800",
  },

  recordDate: {
    color: "#777",
    fontSize: 10,
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

  description: {
    color: "#999",
    fontSize: 10,
    lineHeight: 16,
    marginTop: 13,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#292929",
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
    gap: 7,
  },

  detailText: {
    color: "#777",
    fontSize: 10,
  },

  costText: {
    color: "#D8B56A",
    fontSize: 10,
    fontWeight: "700",
  },

  bottomSpace: {
    height: 25,
  },
});
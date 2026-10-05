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
import DateTimePicker from "@react-native-community/datetimepicker";
import { 
  scheduleMaintenanceReminder,
  requestNotificationPermission,
} from "../utils/notifications";
import {
  getMaintenanceTasksFromServer,
  saveMaintenanceTaskToServer,
  deleteMaintenanceTaskFromServer,
} from "../utils/maintenanceApi";

type MaintenanceTask = {
  id: string;
  task: string;
  dueDate: string;
  notes: string;
  notificationId?: string | null;
};

export default function MaintenanceScheduleScreen() {
  const params = useLocalSearchParams();

  const applianceId = String(params.id || "");
  const applianceName = String(params.name || "Appliance");

  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const storageKey = `homeai_maintenance_${applianceId}`;

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const saved = await AsyncStorage.getItem(storageKey);

      if (saved) {
        setTasks(JSON.parse(saved));
      }
    } catch (error) {
      console.log("Error loading local maintenance tasks:", error);
    }

    try {
      const serverTasks = await getMaintenanceTasksFromServer(applianceId);

      if (serverTasks.length > 0) {
        setTasks(serverTasks);
        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify(serverTasks)
        );
      } else {
        const saved = await AsyncStorage.getItem(storageKey);

        if (saved) {
          const localTasks: MaintenanceTask[] = JSON.parse(saved);

          for (const item of localTasks) {
            try {
              await saveMaintenanceTaskToServer(
                applianceId,
                item
              );
            } catch (syncError) {
              console.log(
                "Maintenance task sync error:",
                syncError
              );
            }
          }
        }
      }
    } catch (error) {
      console.log(
        "Maintenance server load error. Using local data:",
        error
      );
    }
  };

  const openForm = () => {
    setTask("");
    setDueDate("");
    setDueTime("");
    setNotes("");
    setSelectedDate(new Date());
    setShowDatePicker(false);
    setShowTimePicker(false);
    setShowForm(true);
  };

  const testNotificationPermission = async () => {
    try {
      const granted = await requestNotificationPermission();

      if (granted) {
        Alert.alert(
          "Notifications Enabled",
          "HomeAI is allowed to send maintenance reminders."
        );
      } else {
        Alert.alert(
          "Notifications Not Enabled",
          "Please allow notifications for HomeAI in your iPhone Settings."
        );
      }
    } catch (error) {
      console.log("Notification permission error:", error);

      Alert.alert(
        "Notification Error",
        "Unable to check notification permissions."
      );
    }
  };

  const saveTask = async () => {
    if (!task.trim()) {
      Alert.alert("Missing Information", "Please enter a maintenance task.");
      return;
    }

    if (!dueDate.trim() || !dueTime.trim()) {
      Alert.alert("Missing Information", "Please select both a maintenance date and reminder time.");
      return;
    }

    const reminderDate = new Date(selectedDate);

    if (isNaN(reminderDate.getTime())) {
      Alert.alert("Invalid Date", "Please select a valid date and time.");
      return;
    }

    if (reminderDate.getTime() <= Date.now()) {
      Alert.alert("Invalid Reminder Time", "Please select a future date and time.");
      return;
    }

    const notificationId = await scheduleMaintenanceReminder(
      applianceName,
      task.trim(),
      reminderDate
    );

    if (!notificationId) {
      Alert.alert(
        "Reminder Not Scheduled",
        "Please make sure notifications are enabled and select a future date and time."
      );
      return;
    }

    const newTask: MaintenanceTask = {
      id: Date.now().toString(),
      task: task.trim(),
      dueDate: `${dueDate.trim()} at ${dueTime.trim()}`,
      notes: notes.trim(),
      notificationId,
    };

    const updatedTasks = [...tasks, newTask];

    await AsyncStorage.setItem(storageKey, JSON.stringify(updatedTasks));

    try {
      await saveMaintenanceTaskToServer(
        applianceId,
        newTask
      );
    } catch (error) {
      console.log(
        "Maintenance server save error. Local data is still saved:",
        error
      );
    }

    setTasks(updatedTasks);
    setTask("");
    setDueDate("");
    setDueTime("");
    setNotes("");
    setSelectedDate(new Date());
    setShowForm(false);

    Alert.alert(
      "Maintenance Added",
      "Your maintenance task and notification reminder have been scheduled."
    );
  };
  const deleteTask = (id: string) => {
    Alert.alert(
      "Delete Maintenance",
      "Are you sure you want to delete this maintenance task?",
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
              const updatedTasks = tasks.filter(
                (item) => item.id !== id
              );

              await AsyncStorage.setItem(
                storageKey,
                JSON.stringify(updatedTasks)
              );

              try {
                await deleteMaintenanceTaskFromServer(
                  applianceId,
                  id
                );
              } catch (serverError) {
                console.log(
                  "Maintenance server delete error. Local data is still updated:",
                  serverError
                );
              }

              setTasks(updatedTasks);
            } catch (error) {
              console.log(
                "Error deleting maintenance:",
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
              Maintenance
            </Text>
          </View>
        </View>

        {/* Appliance */}
        <View style={styles.applianceCard}>
          <View style={styles.applianceIcon}>
            <Ionicons
              name="calendar-outline"
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
              Add Maintenance
            </Text>
          </TouchableOpacity>
        )}

        {/* Form */}
        {showForm && (
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <View>
                <Text style={styles.formTitle}>
                  Add Maintenance
                </Text>

                <Text style={styles.formSubtitle}>
                  Create a maintenance task for this appliance.
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

            <Text style={styles.label}>
              MAINTENANCE TASK
            </Text>

            <View style={styles.inputBox}>
              <Ionicons
                name="construct-outline"
                size={19}
                color="#D8B56A"
              />

              <TextInput
                value={task}
                onChangeText={setTask}
                placeholder="Example: Clean AC filters"
                placeholderTextColor="#555"
                style={styles.input}
              />
            </View>

            <Text style={styles.label}>
              DUE DATE
            </Text>

            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.85}
            >
              <Ionicons
                name="calendar-outline"
                size={19}
                color="#D8B56A"
              />

              <Text
                style={[
                  styles.input,
                  !dueDate && styles.placeholderText,
                ]}
              >
                {dueDate || "Select maintenance date"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(event, date) => {
                  setShowDatePicker(false);

                  if (event.type === "set" && date) {
                    setSelectedDate(date);
                    setDueDate(
                      date.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    );
                  }
                }}
              />
            )}

            <Text style={styles.label}>
              REMINDER TIME
            </Text>

            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.85}
            >
              <Ionicons
                name="time-outline"
                size={19}
                color="#D8B56A"
              />

              <Text
                style={[
                  styles.input,
                  !dueTime && styles.placeholderText,
                ]}
              >
                {dueTime || "Select reminder time"}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="time"
                display="default"
                onChange={(event, date) => {
                  setShowTimePicker(false);

                  if (event.type === "set" && date) {
                    setSelectedDate(date);
                    setDueTime(
                      date.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                    );
                  }
                }}
              />
            )}

            <Text style={styles.label}>
              NOTES
            </Text>

            <View style={styles.textAreaBox}>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Example: Schedule professional service"
                placeholderTextColor="#555"
                style={styles.textArea}
                multiline
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveTask}
              activeOpacity={0.85}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#101010"
              />

              <Text style={styles.saveText}>
                Save Maintenance
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Schedule */}
        {!showForm && (
          <>
            <Text style={styles.sectionTitle}>
              UPCOMING MAINTENANCE
            </Text>

            {tasks.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIcon}>
                  <Ionicons
                    name="calendar-outline"
                    size={30}
                    color="#D8B56A"
                  />
                </View>

                <Text style={styles.emptyTitle}>
                  No Maintenance Scheduled
                </Text>

                <Text style={styles.emptyText}>
                  Add maintenance tasks so HomeAI can help
                  you keep your appliances in good condition.
                </Text>
              </View>
            ) : (
              tasks.map((item) => (
                <View
                  key={item.id}
                  style={styles.taskCard}
                >
                  <View style={styles.taskTop}>
                    <View style={styles.taskIcon}>
                      <Ionicons
                        name="calendar-outline"
                        size={23}
                        color="#D8B56A"
                      />
                    </View>

                    <View style={styles.taskMain}>
                      <Text style={styles.taskTitle}>
                        {item.task}
                      </Text>

                      <Text style={styles.taskDate}>
                        Due {item.dueDate}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() =>
                        deleteTask(item.id)
                      }
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#777"
                      />
                    </TouchableOpacity>
                  </View>

                  {item.notes ? (
                    <Text style={styles.notes}>
                      {item.notes}
                    </Text>
                  ) : null}
                </View>
              ))
            )}
          </>
        )}

        {/* Temporary Notification Test */}
        {!showForm && (
          <TouchableOpacity
            style={styles.testNotificationButton}
            onPress={testNotificationPermission}
            activeOpacity={0.85}
          >
            <Ionicons
              name="notifications-outline"
              size={19}
              color="#D8B56A"
            />

            <Text style={styles.testNotificationText}>
              Test Notifications
            </Text>
          </TouchableOpacity>
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
                HomeAI Maintenance Intelligence
              </Text>

              <Text style={styles.aiText}>
                HomeAI can later remind you about upcoming
                maintenance and recommend the right service
                at the right time.
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

  placeholderText: {
    color: "#555",
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

  taskCard: {
    backgroundColor: "#191919",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 15,
    marginBottom: 10,
  },

  taskTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  taskIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
  },

  taskMain: {
    flex: 1,
    marginLeft: 12,
  },

  taskTitle: {
    color: "#F7F1E3",
    fontSize: 14,
    fontWeight: "800",
  },

  taskDate: {
    color: "#D8B56A",
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

  notes: {
    color: "#888",
    fontSize: 10,
    lineHeight: 16,
    marginTop: 13,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#292929",
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

  testNotificationButton: {
    height: 50,
    borderRadius: 15,
    backgroundColor: "#191919",
    borderWidth: 1,
    borderColor: "#4A3B20",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
  },

  testNotificationText: {
    color: "#D8B56A",
    fontSize: 11,
    fontWeight: "800",
  },

  bottomSpace: {
    height: 25,
  },
});
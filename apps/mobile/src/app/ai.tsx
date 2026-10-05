import React, { useState } from "react";
import { analyzeHomeImage } from "../utils/aiApi";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function AIScreen() {
  const [problem, setProblem] = useState("");
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getDiagnosis = () => {
    const text = problem.toLowerCase();

    if (!problem.trim()) {
      return {
        issue: "Please describe your home problem first.",
        service: "Home Service",
        priority: "Normal",
        icon: "help-circle-outline" as const,
      };
    }

    if (
      text.includes("ac") ||
      text.includes("air conditioner") ||
      text.includes("cooling")
    ) {
      return {
        issue:
          "Your AC may have a cooling-system, filter, airflow, or refrigerant-related problem.",
        service: "AC Repair & Service",
        priority: "High",
        icon: "snow-outline" as const,
      };
    }

    if (
      text.includes("water") ||
      text.includes("leak") ||
      text.includes("pipe") ||
      text.includes("tap")
    ) {
      return {
        issue:
          "There may be a plumbing issue such as a leaking pipe, tap, drain, or water connection.",
        service: "Plumbing Service",
        priority: "High",
        icon: "water-outline" as const,
      };
    }

    if (
      text.includes("electric") ||
      text.includes("electrician") ||
      text.includes("power") ||
      text.includes("switch") ||
      text.includes("socket")
    ) {
      return {
        issue:
          "The problem may be related to an electrical connection, switch, socket, or power supply.",
        service: "Electrician Service",
        priority: "High",
        icon: "flash-outline" as const,
      };
    }

    if (
      text.includes("clean") ||
      text.includes("cleaning") ||
      text.includes("dust")
    ) {
      return {
        issue:
          "Your home may need professional cleaning based on the problem you described.",
        service: "Home Cleaning",
        priority: "Normal",
        icon: "sparkles-outline" as const,
      };
    }

    if (
      text.includes("fridge") ||
      text.includes("refrigerator") ||
      text.includes("freezer")
    ) {
      return {
        issue:
          "Your refrigerator may have a cooling, power, compressor, or temperature-control issue.",
        service: "Refrigerator Repair",
        priority: "High",
        icon: "snow-outline" as const,
      };
    }

    if (
      text.includes("washing machine") ||
      text.includes("washer")
    ) {
      return {
        issue:
          "Your washing machine may have a drainage, water supply, motor, or electrical issue.",
        service: "Washing Machine Repair",
        priority: "Normal",
        icon: "water-outline" as const,
      };
    }

    if (
      text.includes("tv") ||
      text.includes("television")
    ) {
      return {
        issue:
          "Your television may have a power, display, sound, or connection-related issue.",
        service: "TV Repair Service",
        priority: "Normal",
        icon: "tv-outline" as const,
      };
    }

    return {
      issue:
        "HomeAI needs more information to identify the exact problem. A professional inspection may be helpful.",
      service: "Home Service Professional",
      priority: "Normal",
      icon: "construct-outline" as const,
    };
  };

  const diagnosis = getDiagnosis();

  const analyzeProblem = () => {
    if (!problem.trim()) {
      setShowDiagnosis(true);
      return;
    }

    setShowDiagnosis(true);
  };

  const analyzeWithRealAI = async () => {
    if (!selectedImage && !problem.trim()) {
      Alert.alert(
        "HomeAI",
        "Please describe your problem or upload a photo first."
      );
      return;
    }

    try {
      setIsAnalyzing(true);
      setAiAnalysis("");

      const result = await analyzeHomeImage(
        selectedImage,
        problem.trim()
      );

      setAiAnalysis(result);
      setShowDiagnosis(true);
    } catch (error) {
      console.error("HomeAI analysis error:", error);

      Alert.alert(
        "AI Analysis Failed",
        "HomeAI could not analyze the problem. Please check that the backend is running and try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Photo Permission Required",
        "Please allow HomeAI to access your photos from iPhone Settings."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
      setShowDiagnosis(false);
      setAiAnalysis("");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color="#F7F1E3" />
        </TouchableOpacity>

        <Text style={styles.brand}>HOMEAI</Text>

        <Text style={styles.title}>How can I help?</Text>

        <Text style={styles.subtitle}>
          Tell HomeAI what's happening at home.
        </Text>

        <View style={styles.aiCard}>
          <View style={styles.iconBox}>
            <Ionicons name="sparkles" size={28} color="#D8B56A" />
          </View>

          <Text style={styles.cardTitle}>Ask HomeAI</Text>

          <Text style={styles.cardText}>
            I can help you understand home problems and find the right
            service.
          </Text>

          <View style={styles.inputBox}>
            <TextInput
              placeholder="Describe your problem..."
              placeholderTextColor="#777"
              style={styles.input}
              multiline
              value={problem}
              onChangeText={(text) => {
                setProblem(text);
                setShowDiagnosis(false);
                setAiAnalysis("");
              }}
            />

            <TouchableOpacity style={styles.micButton}>
              <Ionicons name="mic" size={24} color="#111" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.imageButton}
            activeOpacity={0.8}
            onPress={pickImage}
          >
            <Ionicons
              name="camera-outline"
              size={22}
              color="#D8B56A"
            />

            <Text style={styles.imageText}>
              {selectedImage ? "Change photo" : "Upload a photo"}
            </Text>
          </TouchableOpacity>

          {selectedImage && (
            <View style={styles.photoPreview}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.previewImage}
              />

              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={() => {
                  setSelectedImage(null);
                  setAiAnalysis("");
                }}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color="#F7F1E3"
                />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={analyzeWithRealAI}
            activeOpacity={0.85}
          >
            <Ionicons
              name="sparkles"
              size={21}
              color="#111"
            />

            <Text style={styles.analyzeText}>
              Analyze with HomeAI
            </Text>
          </TouchableOpacity>

          {isAnalyzing && (
            <View style={styles.diagnosisCard}>
              <Text style={styles.diagnosisTitle}>
                HomeAI is analyzing...
              </Text>

              <Text style={styles.diagnosisText}>
                Please wait while HomeAI examines your photo.
              </Text>
            </View>
          )}

          {aiAnalysis !== "" && !isAnalyzing && (
            <View style={styles.diagnosisCard}>
              <Text style={styles.diagnosisTitle}>
                HomeAI Photo Analysis
              </Text>

              <Text style={styles.diagnosisText}>
                {aiAnalysis}
              </Text>
            </View>
          )}

          {showDiagnosis && (
            <View style={styles.diagnosisCard}>
              <View style={styles.diagnosisHeader}>
                <View style={styles.diagnosisIcon}>
                  <Ionicons
                    name={diagnosis.icon}
                    size={25}
                    color="#D8B56A"
                  />
                </View>

                <View style={styles.diagnosisHeaderText}>
                  <Text style={styles.diagnosisTitle}>
                    AI Diagnosis
                  </Text>

                  <Text style={styles.diagnosisSubtitle}>
                    HomeAI analysis
                  </Text>
                </View>
              </View>

              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>
                  POSSIBLE ISSUE
                </Text>

                <Text style={styles.resultText}>
                  {diagnosis.issue}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>
                  RECOMMENDED SERVICE
                </Text>

                <View style={styles.serviceRow}>
                  <Ionicons
                    name={diagnosis.icon}
                    size={22}
                    color="#D8B56A"
                  />

                  <Text style={styles.serviceText}>
                    {diagnosis.service}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>
                  PRIORITY
                </Text>

                <View style={styles.priorityBox}>
                  <Ionicons
                    name={
                      diagnosis.priority === "High"
                        ? "alert-circle"
                        : "information-circle"
                    }
                    size={19}
                    color="#D8B56A"
                  />

                  <Text style={styles.priorityText}>
                    {diagnosis.priority}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.bookButton}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: "/services",
                    params: {
                      recommendedService: diagnosis.service,
                    },
                  })
                }
              >
                <Text style={styles.bookButtonText}>
                  Book a Professional
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={21}
                  color="#111"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Try asking</Text>

        {[
          "My AC is not cooling",
          "There is water leaking",
          "I need an electrician",
          "Book home cleaning",
        ].map((item) => (
          <TouchableOpacity
            key={item}
            style={styles.suggestion}
            onPress={() => {
              setProblem(item);
              setShowDiagnosis(false);
              setAiAnalysis("");
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color="#D8B56A"
            />

            <Text style={styles.suggestionText}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
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
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },

  brand: {
    color: "#D8B56A",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 4,
    marginBottom: 20,
  },

  title: {
    color: "#F7F1E3",
    fontSize: 34,
    fontWeight: "800",
  },

  subtitle: {
    color: "#888",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 30,
  },

  aiCard: {
    backgroundColor: "#191919",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#333",
    padding: 22,
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  cardTitle: {
    color: "#F7F1E3",
    fontSize: 25,
    fontWeight: "800",
  },

  cardText: {
    color: "#999",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
    marginBottom: 20,
  },

  inputBox: {
    minHeight: 110,
    backgroundColor: "#0F0F0F",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#303030",
    padding: 15,
    flexDirection: "row",
  },

  input: {
    flex: 1,
    color: "#F7F1E3",
    fontSize: 16,
    textAlignVertical: "top",
  },

  micButton: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: "#D8B56A",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },

  imageButton: {
    marginTop: 15,
    height: 52,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#4A3D22",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  imageText: {
    color: "#D8B56A",
    fontSize: 15,
    fontWeight: "600",
  },

  photoPreview: {
    marginTop: 15,
    height: 210,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
    position: "relative",
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },

  removePhotoButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center",
    justifyContent: "center",
  },

  analyzeButton: {
    marginTop: 15,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#D8B56A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  analyzeText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "800",
  },

  diagnosisCard: {
    backgroundColor: "#191919",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#3A3222",
    padding: 22,
    marginTop: 22,
  },

  diagnosisHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  diagnosisIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: "#292214",
    alignItems: "center",
    justifyContent: "center",
  },

  diagnosisHeaderText: {
    marginLeft: 14,
  },

  diagnosisTitle: {
    color: "#F7F1E3",
    fontSize: 22,
    fontWeight: "800",
  },

  diagnosisSubtitle: {
    color: "#777",
    fontSize: 13,
    marginTop: 3,
  },

  diagnosisText: {
    color: "#D8D8D8",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
  },

  resultSection: {
    marginTop: 22,
  },

  resultLabel: {
    color: "#D8B56A",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 9,
  },

  resultText: {
    color: "#D8D8D8",
    fontSize: 15,
    lineHeight: 23,
  },

  divider: {
    height: 1,
    backgroundColor: "#292929",
    marginTop: 20,
  },

  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  serviceText: {
    color: "#F7F1E3",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },

  priorityBox: {
    alignSelf: "flex-start",
    minHeight: 38,
    paddingHorizontal: 13,
    borderRadius: 12,
    backgroundColor: "#292214",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  priorityText: {
    color: "#D8B56A",
    fontSize: 14,
    fontWeight: "700",
  },

  bookButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#D8B56A",
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  bookButtonText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "800",
  },

  sectionTitle: {
    color: "#F7F1E3",
    fontSize: 21,
    fontWeight: "800",
    marginTop: 32,
    marginBottom: 15,
  },

  suggestion: {
    height: 58,
    backgroundColor: "#181818",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#292929",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 10,
  },

  suggestionText: {
    color: "#DDD",
    fontSize: 15,
    marginLeft: 14,
  },
});
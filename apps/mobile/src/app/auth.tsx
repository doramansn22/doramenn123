import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, registerUser } from "../utils/authApi";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        "Missing information",
        "Please enter your email and password."
      );
      return;
    }

    if (!isLogin && !name.trim()) {
      Alert.alert(
        "Missing information",
        "Please enter your name."
      );
      return;
    }

    if (!isLogin && password.length < 6) {
      Alert.alert(
        "Invalid password",
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      let result;

      if (isLogin) {
        result = await loginUser({
          email: email.trim(),
          password,
        });
      } else {
        result = await registerUser({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
        });
      }

      await AsyncStorage.setItem(
        "homeai_auth_token",
        result.token
      );

      await AsyncStorage.setItem(
        "homeai_user",
        JSON.stringify(result.user)
      );

      Alert.alert(
        isLogin ? "Welcome back" : "Account created",
        isLogin
          ? "You are now logged in to HomeAI."
          : "Your HomeAI account has been created successfully.",
        [
          {
            text: "Continue",
            onPress: () => router.replace("/"),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "HomeAI",
        error?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios" ? "padding" : undefined
      }
    >
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color="#F7F1E3"
            />
          </TouchableOpacity>

          <View style={styles.logoCircle}>
            <Ionicons
              name="home"
              size={25}
              color="#D8B56A"
            />
          </View>

          <Text style={styles.brand}>HOMEAI</Text>

          <Text style={styles.title}>
            {isLogin
              ? "Welcome back"
              : "Create your account"}
          </Text>

          <Text style={styles.subtitle}>
            {isLogin
              ? "Sign in to manage your home with HomeAI."
              : "Create your HomeAI account and take control of your home."}
          </Text>
        </View>

        <View style={styles.card}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={19}
                  color="#777"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor="#666"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={19}
                color="#777"
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Phone Number
              </Text>

              <View style={styles.inputWrapper}>
                <Ionicons
                  name="call-outline"
                  size={19}
                  color="#777"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number"
                  placeholderTextColor="#666"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={19}
                color="#777"
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />

              <TouchableOpacity
                onPress={() =>
                  setShowPassword(!showPassword)
                }
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-outline"
                      : "eye-off-outline"
                  }
                  size={20}
                  color="#777"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.authButton,
              loading && styles.authButtonDisabled,
            ]}
            onPress={handleAuth}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.authButtonText}>
              {loading
                ? "Please wait..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </Text>

            {!loading && (
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#101010"
              />
            )}
          </TouchableOpacity>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}
            </Text>

            <TouchableOpacity
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.switchButton}>
                {isLogin ? "Create Account" : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.securityRow}>
          <Ionicons
            name="shield-checkmark-outline"
            size={17}
            color="#D8B56A"
          />

          <Text style={styles.securityText}>
            Your account is protected with secure authentication.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 35,
  },

  header: {
    alignItems: "center",
    marginBottom: 28,
  },

  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#191919",
    borderWidth: 1,
    borderColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },

  logoCircle: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "#191919",
    borderWidth: 1,
    borderColor: "#3A3222",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  brand: {
    color: "#D8B56A",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 3,
    marginTop: 12,
  },

  title: {
    color: "#F7F1E3",
    fontSize: 27,
    fontWeight: "800",
    marginTop: 13,
    textAlign: "center",
  },

  subtitle: {
    color: "#777",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 9,
    maxWidth: 310,
  },

  card: {
    backgroundColor: "#191919",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 19,
  },

  inputContainer: {
    marginBottom: 17,
  },

  label: {
    color: "#D8D8D8",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },

  inputWrapper: {
    height: 52,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#303030",
    backgroundColor: "#111111",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    color: "#F7F1E3",
    fontSize: 14,
    marginLeft: 10,
    paddingVertical: 0,
  },

  authButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#D8B56A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 5,
  },

  authButtonDisabled: {
    opacity: 0.55,
  },

  authButtonText: {
    color: "#101010",
    fontSize: 14,
    fontWeight: "800",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 21,
    gap: 5,
  },

  switchText: {
    color: "#777",
    fontSize: 12,
  },

  switchButton: {
    color: "#D8B56A",
    fontSize: 12,
    fontWeight: "800",
  },

  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingHorizontal: 12,
  },

  securityText: {
    color: "#666",
    fontSize: 10,
    marginLeft: 7,
    textAlign: "center",
  },
});
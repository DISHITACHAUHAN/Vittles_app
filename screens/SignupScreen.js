import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../contexts/AuthContext";

export default function SignupScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignUp = async () => {
    setError("");

    // Validation
    if (!name || !email || !password) {
      return setError("Please fill all fields.");
    }
    if (!validateEmail(email)) {
      return setError("Please enter a valid email address.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setIsLoading(true);

    try {
      const result = await register(name, email, password);

      if (result.success) {
        Alert.alert(
          "Welcome to Vittles!",
          "Your account has been created successfully",
          [{ text: "Continue", onPress: () => navigation.navigate("Login") }]
        );
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#8B3358", "#670D2F", "#3A081C"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#3A081C" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="restaurant" size={36} color="#FFFFFF" />
              </View>
              <Text style={styles.logoText}>Vittles</Text>
            </View>
            <Text style={styles.tagline}>Delicious experiences await</Text>
          </View>

          {/* Background Decorative Elements */}
          <View style={styles.backgroundCircle1} />
          <View style={styles.backgroundCircle2} />
          
          {/* Signup Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>Join Vittles!</Text>
              <Text style={styles.subtitle}>
                Create your account to start your food journey
              </Text>
            </View>

            {/* Error Message */}
            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={20} color="#DC2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#8B3358"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#A8A8A8"
                value={name}
                onChangeText={setName}
                editable={!isLoading}
                autoCapitalize="words"
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#8B3358"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#A8A8A8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!isLoading}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#8B3358"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A8A8A8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                editable={!isLoading}
                onSubmitEditing={handleSignUp}
              />
              <TouchableOpacity 
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.visibilityToggle}
              >
                <Ionicons 
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#A8A8A8" 
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[
                styles.signupButton,
                isLoading && styles.disabledButton
              ]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.signupButtonText}>Create Account</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                disabled={isLoading}
              >
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    fontStyle: "italic",
    fontWeight: "500",
  },
  backgroundCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(139, 51, 88, 0.2)",
    top: "10%",
    left: -80,
  },
  backgroundCircle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(58, 8, 28, 0.3)",
    bottom: "15%",
    right: -60,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: "#F8F8F8",
    zIndex: 1,
  },
  cardHeader: {
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    color: "#2D2D2D",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    color: "#666",
    lineHeight: 22,
    fontWeight: "500",
  },
  inputContainer: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 58,
    borderWidth: 1.5,
    borderColor: "#F0F0F0",
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2D2D2D",
    height: "100%",
    fontWeight: "500",
  },
  visibilityToggle: {
    padding: 4,
  },
  errorBox: {
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorText: {
    color: "#DC2626",
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  signupButton: {
    backgroundColor: "#8B3358",
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#8B3358",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#666",
    fontSize: 16,
  },
  loginLink: {
    color: "#8B3358",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 4,
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
});
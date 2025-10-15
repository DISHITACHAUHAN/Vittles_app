import React from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import SearchBar from "./SearchBar";
import { LinearGradient } from "expo-linear-gradient";

export default function TopNavbar({
  searchQuery,
  onSearchChange,
  onClearSearch,
}) {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();

  const getResponsivePadding = () => {
    if (width < 375) return 20;
    if (width < 414) return 24;
    if (width < 768) return 28;
    return 32;
  };

  const responsivePadding = getResponsivePadding();

  // Function to get first name only
  

  // Function to get first name only
  const getFirstName = () => {
    if (user && user.name) {
      // Split the full name and return only the first part
      const firstName = user.name.split(' ')[0];
      return firstName;
    }
    return "Guest"; // Default name if not logged in
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <LinearGradient
        colors={["#8B3358", "#670D2F", "#3A081C"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
      >
        {/* Header Section */}
        <View
          style={[
            styles.container,
            { paddingHorizontal: responsivePadding },
          ]}
        >
          <View style={styles.leftSection}>
            <Text style={[styles.greetingText, { color: "#E9B5D2" }]}>
              Hello, {getFirstName()} 
            </Text>
            <Text style={[styles.cravingText, { color: "#FFFFFF" }]}>
              Craving something delicious?
            </Text>
            <Text style={[styles.orderText, { color: "#FFFFFF" }]}>
              Don't wait! Order your food
            </Text>
          </View>
        </View>

        {/* Search Bar Section */}
        <View
          style={[styles.searchContainer, { paddingHorizontal: responsivePadding }]}
        >
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onClearSearch={onClearSearch}
            compact={false}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#670D2F",
  },
  container: {
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 12,
  },
  leftSection: {
    flex: 1,
    justifyContent: "center",
  },
  greetingText: {
    fontSize: 25,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  cravingText: {
    fontSize: 12,
    fontWeight: "400",
    letterSpacing: 0.2,
    fontStyle: "italic",
    marginBottom: 2,
  },
  orderText: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  searchContainer: {
    paddingBottom: 16,
  },
});
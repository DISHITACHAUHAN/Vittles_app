import React from "react";
// import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  Image
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider, useCart } from "./contexts/CartContext";
import { DataProvider } from "./contexts/DataContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import HomeStack from "./navigation/HomeStack";
import ProfileStack from "./navigation/ProfileStack";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import AlertsScreen from "./screens/AlertsScreen";
import CartScreen from "./screens/CartScreen";
import VendorMenu from "./screens/VendorMenu";
import VendorDashboard from "./screens/VendorDashboard";
import vit from './assets/Vittles_2.jpg';
import ForgotPasswordScreen from "./screens/ForgotPassword";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

// Scaling helpers
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;

// Floating Cart Button
const FloatingCartButton = () => {
  const { totalItems } = useCart();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation(); // Now properly imported

  if (totalItems === 0) return null;

  const bottomPosition = insets.bottom + (isTablet ? 75 : 60) + 20;
  const rightPosition = isTablet ? 25 : 20;

  return (
    <TouchableOpacity
      style={[styles.floatingButton, { bottom: bottomPosition, right: rightPosition }]}
      onPress={() => navigation.navigate("Cart")}
      activeOpacity={0.8}
    >
      <View style={[styles.cartButton, { backgroundColor: colors.primary, width: isTablet ? 64 : 56, height: isTablet ? 64 : 56, borderRadius: isTablet ? 32 : 28 }]}>
        <Ionicons name="cart" size={isTablet ? 28 : 24} color="#fff" />
        {totalItems > 0 && (
          <View style={[styles.badge, { minWidth: isTablet ? 24 : 20, height: isTablet ? 24 : 20, borderRadius: isTablet ? 12 : 10, backgroundColor: colors.error }]}>
            <Text style={styles.badgeText}>{totalItems > 99 ? "99+" : totalItems}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Main Tabs
const MainTabs = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const tabBarStyle = {
    backgroundColor: colors.tabBar,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: (isTablet ? 75 : 60) + insets.bottom,
    paddingBottom: insets.bottom + (isTablet ? 12 : 8),
    paddingTop: isTablet ? 12 : 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 8, borderTopWidth: 0 },
    }),
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle={colors.isDark ? 'light-content' : 'dark-content'}
      />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color }) => {
            let iconName;
            if (route.name === "Home") iconName = focused ? "home" : "home-outline";
            else if (route.name === "Alerts") iconName = focused ? "notifications" : "notifications-outline";
            else if (route.name === "Account") iconName = focused ? "person" : "person-outline";
            else if (route.name === "Menu") iconName = focused ? "restaurant" : "restaurant-outline";
            else if (route.name === "Vendor") iconName = focused ? "business" : "business-outline";
            return <Ionicons name={iconName} size={isTablet ? 26 : 22} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle,
          tabBarLabelStyle: { fontSize: isTablet ? 12 : 10, marginBottom: 2, fontWeight: '500' },
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Alerts" component={AlertsScreen} />
        <Tab.Screen name="Account" component={ProfileStack} />
        <Tab.Screen name="Menu" component={VendorMenu} />
        <Tab.Screen name="Vendor" component={VendorDashboard} />
      </Tab.Navigator>
      <FloatingCartButton />
    </View>
  );
};

// Root Navigator
const RootNavigator = () => {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      {user ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Cart" component={CartScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen } />
        </>
      )}
    </Stack.Navigator>
  );
};

// Loading Screen
const LoadingScreen = () => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, position: 'relative', backgroundColor: colors.background }}>
      <Image source={vit} style={{ width: '100%', height: '100%', position: 'absolute' }} resizeMode="cover" />
    </View>
  );
};

// App
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Styles
const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    zIndex: 1000
  },
  cartButton: {
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8
      },
      android: {
        elevation: 8
      }
    })
  },
  badge: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    right: 0,
    borderWidth: 2,
    borderColor: 'white'
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: "bold"
  },
});
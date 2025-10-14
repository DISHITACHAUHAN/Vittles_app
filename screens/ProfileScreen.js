// screens/ProfileScreen.js
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Modal,
  Animated,
  Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const { width, height } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const { logout, user } = useAuth();
  
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [alertContent, setAlertContent] = React.useState('confirm');

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  const menuItems = [
    {
      icon: "card-outline",
      title: "Payment Methods",
      onPress: () => navigation.navigate("PaymentMethods")
    },
    {
      icon: "receipt-outline",
      title: "Order History",
      onPress: () => navigation.navigate("OrderHistory")
    },
    {
      icon: "star-outline",
      title: "My Reviews",
      onPress: () => navigation.navigate("MyReviews")
    },
    {
      icon: "settings-outline",
      title: "Settings",
      onPress: () => navigation.navigate("Settings")
    },
    {
      icon: "help-circle-outline",
      title: "Help & Support",
      onPress: () => navigation.navigate("HelpSupport")
    },
    {
      icon: "document-text-outline",
      title: "Privacy Policy",
      onPress: () => navigation.navigate("PrivacyPolicy")
    },
  ];

  // Beautiful entrance animation
  const showSignOutAlert = () => {
    setAlertContent('confirm');
    setIsModalVisible(true);
    
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(height);
    scaleAnim.setValue(0.8);
    rotateAnim.setValue(0);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  };

  const hideAlert = (callback) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setIsModalVisible(false);
      if (callback) callback();
    });
  };

  const handleSignOut = async () => {
    setAlertContent('success');
    
    // Success animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();

    setTimeout(() => {
      hideAlert(async () => {
        try {
          await logout();
        } catch (error) {
          console.error("Logout failed:", error);
          Alert.alert("Error", "Failed to sign out. Please try again.");
        }
      });
    }, 1500);
  };

  // Rotate animation for the exit icon
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const renderAlertContent = () => {
    if (alertContent === 'success') {
      return (
        <View style={styles.alertContentContainer}>
          {/* Success Animation Container */}
          <Animated.View style={[
            styles.successIconContainer,
            { 
              transform: [{ scale: scaleAnim }],
              backgroundColor: 'rgba(46, 204, 113, 0.1)' 
            }
          ]}>
            <LinearGradient
              colors={['#2ECC71', '#27AE60']}
              style={styles.successGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="checkmark" size={32} color="#FFF" />
            </LinearGradient>
          </Animated.View>
          
          <Text style={[styles.alertTitle, { color: colors.text }]}>
            Successfully Signed Out!
          </Text>
          <Text style={[styles.alertMessage, { color: colors.textSecondary }]}>
            You have been securely signed out.{'\n'}We hope to see you again soon! 👋
          </Text>
          
          {/* Animated dots for loading effect */}
          <View style={styles.loadingDots}>
            <Animated.View style={[styles.dot, { backgroundColor: '#2ECC71' }]} />
            <Animated.View style={[styles.dot, { backgroundColor: '#2ECC71' }]} />
            <Animated.View style={[styles.dot, { backgroundColor: '#2ECC71' }]} />
          </View>
        </View>
      );
    }

    // Confirmation Content
    return (
      <>
        <View style={styles.alertContentContainer}>
          {/* Animated Exit Icon */}
          <Animated.View 
            style={[
              styles.alertIconWrapper,
              { transform: [{ rotate: rotateInterpolate }] }
            ]}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF3B30', '#E74C3C']}
              style={styles.alertIconBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="log-out-outline" size={36} color="#FFF" />
            </LinearGradient>
            
            {/* Pulsing ring effect */}
            <Animated.View style={[styles.pulseRing, { 
              transform: [{ scale: fadeAnim }],
              borderColor: '#FF3B30'
            }]} />
          </Animated.View>

          <Text style={[styles.alertTitle, { color: colors.text }]}>
            Ready to Leave? 🚪
          </Text>
          <Text style={[styles.alertMessage, { color: colors.textSecondary }]}>
            You're about to sign out of your account.{'\n'}Don't worry, your data is safe and sound!
          </Text>
        </View>

        <View style={[styles.alertButtonsContainer, { borderTopColor: 'rgba(255,255,255,0.1)' }]}>
          {/* Cancel Button with nice gradient border */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => hideAlert()}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['transparent', 'transparent']}
              style={[styles.cancelButtonBorder, { borderColor: colors.border }]}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>
                Stay Signed In
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Primary Sign Out Button */}
          <TouchableOpacity
            style={styles.confirmButtonWrapper}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF3B30', '#E74C3C']}
              style={styles.confirmButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="log-out-outline" size={20} color="#FFF" />
              <Text style={styles.confirmButtonText}>Yes, Sign Out</Text>
              
              {/* Button shine effect */}
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
                style={styles.buttonShine}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#8B3358" />

      {/* Header */}
      <LinearGradient
        colors={["#8B3358", "#670D2F", "#3A081C"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Account</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Personal Info Section */}
        <View style={[styles.personalInfoCard, { backgroundColor: colors.card }]}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person-circle-outline" size={80} color={colors.primary} />
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name || "Guest User"}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {user?.email || "No email found"}
            </Text>
            <Text style={[styles.memberSince, { color: colors.textSecondary }]}>
              Member since January 2024
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.editProfileButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate("PersonalInfo")}
          >
            <Ionicons name="pencil-outline" size={16} color="#fff" />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.lastMenuItem,
                { borderBottomColor: colors.border }
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon} size={20} color={colors.primary} />
                </View>
                <Text style={[styles.menuItemText, { color: colors.text }]}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Enhanced Sign Out Button */}
        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: colors.card }]}
          onPress={showSignOutAlert}
        >
          <LinearGradient
            colors={['rgba(255, 59, 48, 0.1)', 'rgba(255, 59, 48, 0.05)']}
            style={styles.signOutIconContainer}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          </LinearGradient>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            App Version 1.0.0
          </Text>
        </View>
      </ScrollView>

      {/* Beautiful Custom Alert Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => hideAlert()}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Animated.View 
            style={[
              styles.customAlertContainer,
              { 
                backgroundColor: colors.card,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            {/* Background decorative elements */}
            <View style={styles.alertBackground}>
              <View style={[styles.bgCircle, styles.bgCircle1]} />
              <View style={[styles.bgCircle, styles.bgCircle2]} />
              <View style={[styles.bgCircle, styles.bgCircle3]} />
            </View>
            
            {renderAlertContent()}
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 30 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: '#FFF', textAlign: 'center' },
  personalInfoCard: {
    padding: 24,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },
  avatarContainer: { marginBottom: 20 },
  avatar: { alignItems: "center", justifyContent: "center" },
  userInfo: { alignItems: "center", marginBottom: 20 },
  userName: { fontSize: 22, fontWeight: "700", marginBottom: 8, textAlign: "center" },
  userEmail: { fontSize: 16, marginBottom: 6, textAlign: "center" },
  memberSince: { fontSize: 14, textAlign: "center" },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  editProfileText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  menuContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  lastMenuItem: { borderBottomWidth: 0 },
  menuItemLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconContainer: { width: 32, alignItems: "center" },
  menuItemText: { fontSize: 16, marginLeft: 12, fontWeight: "500" },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
    padding: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.1)',
  },
  signOutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  signOutText: { fontSize: 16, fontWeight: "600", color: "#FF3B30" },
  versionContainer: { alignItems: "center", marginTop: 8 },
  versionText: { fontSize: 14 },
  
  // --- BEAUTIFUL ALERT STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  customAlertContainer: {
    borderRadius: 28,
    width: '100%',
    maxWidth: 360,
    minHeight: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  alertBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.1,
  },
  bgCircle1: {
    width: 120,
    height: 120,
    backgroundColor: '#FF6B6B',
    top: -40,
    right: -40,
  },
  bgCircle2: {
    width: 80,
    height: 80,
    backgroundColor: '#FF3B30',
    bottom: -20,
    left: -20,
  },
  bgCircle3: {
    width: 60,
    height: 60,
    backgroundColor: '#E74C3C',
    top: '50%',
    left: '70%',
  },
  alertContentContainer: {
    alignItems: 'center',
    padding: 32,
    paddingBottom: 24,
    minHeight: 240,
    justifyContent: 'center',
  },
  alertIconWrapper: {
    position: 'relative',
    marginBottom: 24,
  },
  alertIconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  pulseRing: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 50,
    borderWidth: 2,
    opacity: 0.3,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 24,
    shadowColor: '#2ECC71',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  successGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 32,
  },
  alertMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  alertButtonsContainer: {
    borderTopWidth: 1,
    flexDirection: 'column',
    padding: 0,
  },
  cancelButton: {
    padding: 0,
    margin: 0,
  },
  cancelButtonBorder: {
    paddingVertical: 18,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  confirmButtonWrapper: {
    margin: 0,
    padding: 0,
  },
  confirmButtonGradient: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
  },
  buttonShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    opacity: 0.3,
  },
  loadingDots: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.6,
  },
});
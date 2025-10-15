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
      onPress: () => navigation.navigate("Account", { screen: "PaymentMethods" })
    },
    {
      icon: "receipt-outline",
      title: "Order History",
      onPress: () => navigation.navigate("Account", { screen: "OrderHistory" })
    },
    {
      icon: "star-outline",
      title: "My Reviews",
      onPress: () => navigation.navigate("Account", { screen: "MyReviews" })
    },
    {
      icon: "settings-outline",
      title: "Settings",
      onPress: () => navigation.navigate("Account", { screen: "Settings" })
    },
    {
      icon: "help-circle-outline",
      title: "Help & Support",
      onPress: () => navigation.navigate("Account", { screen: "HelpSupport" })
    },
    {
      icon: "document-text-outline",
      title: "Privacy Policy",
      onPress: () => navigation.navigate("Account", { screen: "PrivacyPolicy" })
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
        {/* Cancel Icon in Top Right */}
        <TouchableOpacity
          style={styles.cancelIconButton}
          onPress={() => hideAlert()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={24} color="#8B3358" />
        </TouchableOpacity>

        <View style={styles.alertContentContainer}>
          {/* Animated Exit Icon */}
          <Animated.View 
            style={[
              styles.alertIconWrapper,
              { transform: [{ rotate: rotateInterpolate }] }
            ]}
          >
            <LinearGradient
              colors={["#8B3358", "#670D2F", "#3A081C"]}
              style={styles.alertIconBackground}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="log-out-outline" size={36} color="#FFF" />
            </LinearGradient>
            
            {/* Pulsing ring effect */}
            <Animated.View style={[styles.pulseRing, { 
              transform: [{ scale: fadeAnim }],
              borderColor: '#8B3358'
            }]} />
          </Animated.View>

          <Text style={[styles.alertTitle, { color: colors.text }]}>
            Ready to Leave? 
          </Text>
          <Text style={[styles.alertMessage, { color: colors.textSecondary }]}>
            You're about to sign out of your account.{'\n'}Don't worry, your data is safe and sound!
          </Text>
        </View>

        <View style={[styles.alertButtonsContainer, { borderTopColor: 'rgba(255,255,255,0.1)' }]}>
          {/* Only Sign Out Button - Cancel button removed */}
          <TouchableOpacity
            style={styles.confirmButtonWrapper}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#8B3358", "#670D2F", "#3A081C"]}
              style={styles.confirmButtonGradient}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="log-out-outline" size={20} color="#FFF" />
              <Text style={styles.confirmButtonText}>LOG OUT</Text>
              
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
              <Ionicons name="person-circle-outline" size={80} color="#8B3358" />
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name || "Guest User"}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {user?.email || "No email found"}
            </Text>
          </View>
          
          {/* Edit Profile Button - Smaller size */}
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate("Account", { screen: "PersonalInfo" })}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#8B3358", "#670D2F", "#3A081C"]}
              style={styles.editProfileGradient}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.editProfileContent}>
                <View style={styles.editProfileIconContainer}>
                  <Ionicons name="pencil-outline" size={18} color="#FFF" />
                </View>
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </View>
              
              {/* Button shine effect */}
              <LinearGradient
                colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0)']}
                style={styles.buttonShine}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </LinearGradient>
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
                  <Ionicons name={item.icon} size={20} color="#8B3358" />
                </View>
                <Text style={[styles.menuItemText, { color: colors.text }]}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8B3358" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Enhanced Sign Out Button with Gradient */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={showSignOutAlert}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#8B3358", "#670D2F", "#3A081C"]}
            style={styles.signOutGradient}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.signOutContent}>
              <View style={styles.signOutIconContainer}>
                <Ionicons name="log-out-outline" size={20} color="#FFF" />
              </View>
              <Text style={styles.signOutText}>Sign Out</Text>
            </View>
            
            {/* Button shine effect */}
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0)']}
              style={styles.buttonShine}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </LinearGradient>
        </TouchableOpacity>
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
  
  // Edit Profile Button - Smaller size
  editProfileButton: {
    marginTop: 10,
    borderRadius: 14, // Smaller border radius
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 }, // Smaller shadow
    shadowOpacity: 0.1,
    shadowRadius: 8, // Smaller shadow radius
    elevation: 4, // Smaller elevation
    overflow: 'hidden',
    height: 48, // Smaller height
    width: '80%', // Smaller width
  },
  editProfileGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  editProfileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editProfileIconContainer: {
    marginRight: 10, // Smaller margin
  },
  editProfileText: { 
    fontSize: 15, // Smaller font size
    fontWeight: "600", 
    color: "#FFF" 
  },
  
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
  
  // Sign Out Button Styles (unchanged - larger size)
  signOutButton: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
    height: 56,
  },
  signOutGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  signOutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutIconContainer: {
    marginRight: 12,
  },
  signOutText: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#FFF" 
  },
  
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
    minHeight: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  // Cancel Icon in Top Right
  cancelIconButton: {
    position: 'absolute',
    top: 16,
    right: 10,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#8B3358',
    top: -40,
    right: -40,
  },
  bgCircle2: {
    width: 80,
    height: 80,
    backgroundColor: '#670D2F',
    bottom: -20,
    left: -20,
  },
  bgCircle3: {
    width: 60,
    height: 60,
    backgroundColor: '#3A081C',
    top: '50%',
    left: '70%',
  },
  alertContentContainer: {
    alignItems: 'center',
    padding: 32,
    paddingTop: 40,
    paddingBottom: 20,
    minHeight: 200,
    justifyContent: 'center',
  },
  alertIconWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  alertIconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B3358',
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
    marginBottom: 20,
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
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 32,
  },
  alertMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  alertButtonsContainer: {
    borderTopWidth: 1,
    flexDirection: 'column',
    padding: 0,
    marginTop: 0,
  },
  confirmButtonWrapper: {
    margin: 0,
    padding: 0,
  },
  confirmButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
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
    marginTop: 16,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.6,
  },
});
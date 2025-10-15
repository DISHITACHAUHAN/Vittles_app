// screens/PersonalInfoScreen.js
import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  StatusBar,
  Alert   
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext"; // Import AuthContext

export default function PersonalInfoScreen({ navigation }) {
  const { colors } = useTheme();
  const { user, updateUserProfile } = useAuth(); // Get user data and update function
  
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    zipCode: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState({});

  // Initialize form data when component mounts or user changes
  useEffect(() => {
    if (user) {
      const userData = {
        fullName: user.name || user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        city: user.city || "",
        zipCode: user.zipCode || ""
      };
      setUserInfo(userData);
      setOriginalData(userData); // Store original data for cancel operation
    }
  }, [user]);

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Prepare data for update
      const updatedData = {
        name: userInfo.fullName,
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber,
        address: userInfo.address,
        city: userInfo.city,
        zipCode: userInfo.zipCode
      };

      // Call update function from AuthContext
      await updateUserProfile(updatedData);
      
      setIsEditing(false);
      setOriginalData(userInfo); // Update original data
      Alert.alert("Success", "Your personal information has been updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset to original data
    setUserInfo(originalData);
    setIsEditing(false);
  };

  const updateField = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!userInfo.fullName.trim()) {
      Alert.alert("Validation Error", "Please enter your full name");
      return false;
    }
    
    if (!userInfo.email.trim()) {
      Alert.alert("Validation Error", "Please enter your email address");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfo.email)) {
      Alert.alert("Validation Error", "Please enter a valid email address");
      return false;
    }

    if (!userInfo.phoneNumber.trim()) {
      Alert.alert("Validation Error", "Please enter your phone number");
      return false;
    }

    return true;
  };

  const hasChanges = () => {
    return JSON.stringify(userInfo) !== JSON.stringify(originalData);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#8B3358" />
      
      {/* Header with LinearGradient */}
      <LinearGradient
        colors={["#8B3358", "#670D2F", "#3A081C"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Personal Information</Text>
            <Text style={styles.headerSubtitle}>Manage your profile details</Text>
          </View>
          {!isEditing ? (
            <TouchableOpacity 
              style={styles.editHeaderButton}
              onPress={handleEdit}
            >
              <Ionicons name="pencil-outline" size={20} color="#FFF" />
              <Text style={styles.editHeaderText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.cancelHeaderButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelHeaderText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Photo Section */}
        <View style={[styles.photoSection, { backgroundColor: colors.card }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="person" size={40} color={colors.primary} />
            </View>
          </View>
         
        </View>

        {/* Personal Information Form */}
        <View style={[styles.form, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Full Name *</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text
                },
                isEditing && styles.inputEditing
              ]}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSecondary}
              value={userInfo.fullName}
              onChangeText={(text) => updateField('fullName', text)}
              editable={isEditing}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email Address *</Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text
                },
                isEditing && styles.inputEditing
              ]}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={userInfo.email}
              onChangeText={(text) => updateField('email', text)}
              editable={isEditing}
            />
          </View>
          
         

          
          
         

          

          {isEditing && (
            <TouchableOpacity 
              style={[
                styles.saveButton, 
                { 
                  backgroundColor: hasChanges() ? colors.primary : colors.textSecondary,
                  opacity: isLoading ? 0.7 : 1
                }
              ]}
              onPress={handleSave}
              disabled={!hasChanges() || isLoading}
            >
              {isLoading ? (
                <Ionicons name="refresh" size={20} color="#FFF" />
              ) : (
                <Ionicons name="checkmark-circle" size={20} color="#FFF" />
              )}
              <Text style={styles.saveButtonText}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Account Security Section */}
        <View style={[styles.securitySection, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Security</Text>
          
          <TouchableOpacity 
            style={[styles.securityButton, { borderColor: colors.border }]}
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <View style={styles.securityButtonLeft}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
              <Text style={[styles.securityButtonText, { color: colors.text }]}>
                Change Password
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.securityButton, { borderColor: colors.border, borderBottomWidth: 0 }]}
            onPress={() => navigation.navigate('TwoFactorAuth')}
          >
            <View style={styles.securityButtonLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
              <Text style={[styles.securityButtonText, { color: colors.text }]}>
                Two-Factor Authentication
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Required Fields Note */}
        {isEditing && (
          <View style={styles.requiredNote}>
            <Text style={[styles.requiredText, { color: colors.textSecondary }]}>
              * Required fields
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  editHeaderButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  editHeaderText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: "600",
  },
  cancelHeaderButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelHeaderText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  photoSection: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  changePhotoButton: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: "600",
  },
  form: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  inputEditing: {
    borderWidth: 2,
    borderColor: '#8B3358',
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  securitySection: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  securityButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  securityButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  securityButtonText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
    flex: 1,
  },
  requiredNote: {
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  requiredText: {
    fontSize: 12,
    fontStyle: "italic",
  },
});
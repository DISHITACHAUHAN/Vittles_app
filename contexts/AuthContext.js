import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const API_URL = 'https://foodapp-3-kmi1.onrender.com';

// Configure axios
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkStoredUser();
  }, []);

  const checkStoredUser = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem('token'),
        AsyncStorage.getItem('user')
      ]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (err) {
      console.error('Token/User check failed:', err.message);
      await clearStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const clearStorage = async () => {
    try {
      setToken(null);
      setUser(null);
      await AsyncStorage.multiRemove(['token', 'user']);
      delete axios.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', {
        email,
        password
      });

      const { user, token } = response.data;

      // Save to state and storage
      setUser(user);
      setToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      return { success: true, user, token };

    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      return {
        success: false,
        error: err.response?.data?.message || err.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/auth/register', {
        name,
        email,
        password
      });

      // ✅ Backend returns only a message — no token or user
      return {
        success: true,
        message: response.data.message || 'Registration successful'
      };

    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      return {
        success: false,
        error:
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Registration failed'
      };
    }
  };

  const logout = async () => {
    await clearStorage();
  };

  // ADDED: Vendor Menu API functions - WITHOUT CHANGING EXISTING CODE

  // Create separate axios instance for vendor API
  const vendorApi = axios.create({
    baseURL: 'https://ineat-vendor.onrender.com',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add interceptors to vendorApi
  vendorApi.interceptors.request.use(
    async config => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );

  vendorApi.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        console.log('Vendor API Error:', error.response.data);
      }
      return Promise.reject(error);
    }
  );

  // Get vendor's menu
  const getVendorMenu = async (vendorId) => {
    try {
      const response = await vendorApi.get(`/vendors/${vendorId}/menu`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor menu:', error);
      throw error;
    }
  };

  // Add item to vendor's menu
  const addMenuItem = async (vendorId, menuItem) => {
    try {
      const response = await vendorApi.post(`/vendors/${vendorId}/menu`, {
        itemName: menuItem.name,
        price: menuItem.price,
        category: menuItem.category,
        description: menuItem.description,
        available: menuItem.available
      });
      return response.data;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  };

  // Update menu item availability - UPDATED for bit field
  const updateMenuItemAvailability = async (vendorId, itemId, available) => {
    try {
      const response = await vendorApi.patch(`/vendors/${vendorId}/menu/${itemId}`, {
        available: available ? 1 : 0 // Convert boolean to bit (1 or 0) for database
      });
      return response.data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw error;
    }
  };

  // Delete menu item
  const deleteMenuItem = async (vendorId, itemId) => {
    try {
      const response = await vendorApi.delete(`/vendors/${vendorId}/menu/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    // ADDED: Vendor menu API functions
    getVendorMenu,
    addMenuItem,
    updateMenuItemAvailability,
    deleteMenuItem
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
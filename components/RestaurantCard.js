import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext'; // Import theme hook

const RestaurantCard = ({ restaurant }) => {
  const navigation = useNavigation();
  const { colors } = useTheme(); // Get theme colors
  const [imageError, setImageError] = React.useState(false);

  const handlePress = () => {
    navigation.navigate('RestaurantDetails', { restaurant });
  };

  // Handle image error
  const handleImageError = () => {
    console.log('Image failed to load:', restaurant.image);
    setImageError(true);
  };

  // Reset error state when restaurant changes
  React.useEffect(() => {
    setImageError(false);
  }, [restaurant.image]);

  // Render rating badge
  const renderRatingBadge = () => (
    <View style={[styles.ratingBadge, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
      <Ionicons name="star" size={12} color="#FFF" />
      <Text style={styles.ratingText}>{restaurant.rating}</Text>
    </View>
  );

  // Render image with overlay
  const renderImage = () => {
    // If image is an emoji or not a valid URL, use emoji container
    if (restaurant.image && typeof restaurant.image === 'string' && !restaurant.image.startsWith('http')) {
      return (
        <View style={styles.imageContainer}>
          <View style={[styles.emojiContainer, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
            <Text style={styles.emojiText}>{restaurant.image}</Text>
          </View>
          {renderRatingBadge()}
        </View>
      );
    }

    // Use fallback image if there's an error or no image
    const imageUri = imageError || !restaurant.image 
      ? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'
      : restaurant.image;

    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.restaurantImage}
          resizeMode="cover"
          onError={handleImageError}
          onLoadStart={() => console.log('Starting to load image:', imageUri)}
          onLoadEnd={() => console.log('Finished loading image:', imageUri)}
        />
        {renderRatingBadge()}
        
      </View>
    );
  };

  // Render delivery info chip
  const renderDeliveryChip = () => (
    <View style={[styles.deliveryChip, { backgroundColor: colors.background }]}>
      <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
      <Text style={[styles.deliveryChipText, { color: colors.textSecondary }]}>{restaurant.time}</Text>
    </View>
  );

  // Render discount badge
  const renderDiscountBadge = () => {
    if (!restaurant.discount) return null;
    
    return (
      <View style={[styles.discountBadge, { 
        backgroundColor: colors.isDark ? 'rgba(255, 107, 53, 0.2)' : 'rgba(255, 107, 53, 0.1)' 
      }]}>
        <Ionicons name="pricetag-outline" size={10} color={colors.primary} />
        <Text style={[styles.discountText, { color: colors.primary }]}>{restaurant.discount}</Text>
      </View>
    );
  };

  // Debug restaurant data
  React.useEffect(() => {
    console.log('Restaurant data:', {
      name: restaurant.name,
      image: restaurant.image,
      imageType: typeof restaurant.image,
      hasImage: !!restaurant.image,
      isHttpUrl: restaurant.image && typeof restaurant.image === 'string' ? restaurant.image.startsWith('http') : false
    });
  }, [restaurant]);

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.card }]} onPress={handlePress}>
      {renderImage()}
      
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.restaurantName, { color: colors.text }]} numberOfLines={1}>
            {restaurant.name}
          </Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={[styles.rating, { color: colors.text }]}>{restaurant.rating}</Text>
            <Text style={[styles.reviewsCount, { color: colors.textSecondary }]}>
              ({restaurant.reviewsCount})
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    width: '100%', // Ensure full width
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0', // Fallback background color
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0', // Show background while loading
  },
  emojiContainer: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  emojiText: {
    fontSize: 80,
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 2,
  },
  ratingText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  vegBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  vegText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4CAF50',
  },
  infoContainer: {
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  freeDeliveryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  freeDeliveryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4CAF50',
  },
  cuisine: {
    fontSize: 14,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statSeparator: {
    width: 4,
    height: 4,
    backgroundColor: '#CCC',
    borderRadius: 2,
    marginHorizontal: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewsCount: {
    fontSize: 12,
  },
  distance: {
    fontSize: 14,
  },
  price: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  deliveryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  deliveryChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  offerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
    borderLeftWidth: 3,
  },
  offerText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default RestaurantCard;
import React, { useRef, useState, useEffect } from "react";
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Dimensions, 
  TouchableOpacity,
  Image
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import one from '../assets/1.png';
import two from '../assets/2.png';
import three from '../assets/3.png';
import four from '../assets/4.png';

const { width } = Dimensions.get("window");

const data = [
  {
    id: "1",
    image: one
  },
  {
    id: "2",
    image: two
  },
  {
    id: "3",
    image: three
  },
  {
    id: "4",
    image: four
  },
];

export default function ImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef();
  const autoScrollTimer = useRef(null);
  const { colors, isDark } = useTheme();

  useEffect(() => {
    startAutoScroll();
    
    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, []);

  // Reset timer when activeIndex changes
  useEffect(() => {
    restartAutoScroll();
  }, [activeIndex]);

  const startAutoScroll = () => {
    autoScrollTimer.current = setInterval(() => {
      const nextIndex = (activeIndex + 1) % data.length;
      scrollToIndex(nextIndex);
    }, 3000);
  };

  const restartAutoScroll = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }
    startAutoScroll();
  };

  const scrollToIndex = (index) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true
    });
    setActiveIndex(index);
  };

  const handleScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slide !== activeIndex) {
      setActiveIndex(slide);
    }
  };

  const handleManualScroll = (index) => {
    scrollToIndex(index);
    // Auto-scroll will automatically restart due to useEffect
  };

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image
        source={item.image}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );

  const getDotColor = (index) => {
    if (index === activeIndex) {
      return colors.primary || "#8B3358";
    }
    return isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)';
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        renderItem={renderItem}
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        initialScrollIndex={0}
      />

      <View style={styles.dotsContainer}>
        {data.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => handleManualScroll(i)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.dot,
                { 
                  backgroundColor: getDotColor(i),
                  width: i === activeIndex ? 20 : 8,
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 1,
    marginBottom: 30,
    height: 250,
  },
  imageContainer: {
    width: width,
    height: 220,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
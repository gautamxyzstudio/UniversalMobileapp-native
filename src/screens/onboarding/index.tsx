/* eslint-disable react-hooks/exhaustive-deps */
import {Animated, FlatList, Text, View, ViewToken} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import SafeAreaView from '@components/safeArea';
import {STRINGS} from 'src/locales/english';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {getStyles} from './styles';
import {verticalScale} from '@utils/metrics';
import NextButton from './components/nextButton';
import {onBoardingData} from './types';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import {debounce} from 'lodash';
import Paginator from './components/paginator';

const viewConfig = {viewAreaCoveragePercentThreshold: 50};

const OnBoarding = () => {
  const styles = useThemeAwareObject(getStyles);
  const navigation = useNavigation<NavigationProps>();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatlistReference = useRef<FlatList | null>(null);
  const posterWidth = verticalScale(342);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const navigateToWelcome = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'login'}],
    });
  };

  const handleNextPress = () => {
    if (currentIndex < onBoardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      flatlistReference.current?.scrollToIndex({
        animated: true,
        index: currentIndex + 1,
      });
    } else {
      navigateToWelcome();
    }
  };

  const viewableItemsChanged = useRef(
    debounce(({viewableItems}: {viewableItems: ViewToken[]}) => {
      const index = viewableItems[0]?.index ?? 0;
      setCurrentIndex(index);
    }, 200),
  ).current;

  const renderItem = useCallback(
    ({item}: any) => {
      const Poster = item.icon;
      return (
        <View style={styles.itemContainer}>
          <Poster
            style={styles.poster}
            width={posterWidth}
            height={verticalScale(410)}
          />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.paragraph}>{item.description}</Text>
        </View>
      );
    },
    [posterWidth],
  );

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text onPress={navigateToWelcome} style={styles.heading}>
          {STRINGS.skip}
        </Text>
        <View style={styles.listContainer}>
          <Animated.FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            scrollEnabled={true}
            ref={flatlistReference}
            data={onBoardingData}
            keyExtractor={item => item.id.toString()}
            pagingEnabled
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {x: scrollX}}}],
              {
                useNativeDriver: false,
              },
            )}
            bounces={false}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            renderItem={renderItem}
          />
        </View>
      </View>
      <View style={styles.dots}>
        <Paginator data={onBoardingData} scrollX={scrollX} />
      </View>
      <View>
        <NextButton index={currentIndex + 1} onPress={handleNextPress} />
      </View>
    </SafeAreaView>
  );
};

export default OnBoarding;

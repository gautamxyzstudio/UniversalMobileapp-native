import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {useSharedValue} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {verticalScale} from '@utils/metrics';
import EmployeeTabBarIcon from './employeeTabBarIcon';
import {Row} from '@components/atoms/Row';

const CustomBottomTab = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const MARGIN = verticalScale(16);
  const TAB_BAR_WIDTH = width - 2 * MARGIN;
  const scaleAnimationValue = useSharedValue(1);
  const styles = useThemeAwareObject(createStyles);

  const onPress = (route: any, index: number) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    const isFocused = state.index === index;
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, {merge: true});
    }
  };

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const isFocused = route.state?.index === index;
        console.log(route, index);
        return (
          <Pressable
            key={index}
            style={styles.tab}
            onPress={() => onPress(route, index)}>
            {!isFocused ? (
              <EmployeeTabBarIcon route={route.name} isFocused={isFocused} />
            ) : (
              <Row alignCenter>
                <EmployeeTabBarIcon route={route.name} isFocused={isFocused} />
                <Text>{route.name}</Text>
              </Row>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

export default CustomBottomTab;

const createStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    tabBarContainer: {
      flexDirection: 'row',
      height: verticalScale(Platform.OS === 'ios' ? 110 : 80),
      width: '100%',
      alignSelf: 'center',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-around',
      shadowColor: color.shadow,
      shadowOffset: {width: 0, height: 0.4},
      elevation: 10,
      shadowRadius: 2,
      shadowOpacity: 0.5,
    },
    tab: {},
  });
  return styles;
};

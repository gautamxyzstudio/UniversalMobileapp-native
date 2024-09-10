import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import SafeAreaView from '@components/safeArea';
import HeaderWithBack from '@components/atoms/headerWithBack';
import {STRINGS} from 'src/locales/english';
import {verticalScale} from '@utils/metrics';
import SearchInput from '@components/molecules/InputTypes/SearchInput';
import {
  ADD_ADDRESS,
  CURRENT_LOCATION,
  RIGHT_ARROW_DROPDOWN,
} from '@assets/exporter';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import BrTag from '@components/atoms/brTag';
import LocationCard from '@components/signup/LocationCard';
import {fonts} from '@utils/common.styles';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';

const SelectLocation = () => {
  const styles = useThemeAwareObject(createStyles);
  const [searchValue, setSearchValue] = useState<string>('');
  const textInputRef = useRef<TextInput | null>(null);
  const navigation = useNavigation<NavigationProps>();

  const crossPressHandler = () => {
    setSearchValue('');
    textInputRef.current?.blur();
  };

  const navigateToNextScreen = () => {
    navigation.navigate('addLocationManually');
  };
  return (
    <SafeAreaView>
      <View style={styles.mainView}>
        <HeaderWithBack isDark={true} headerTitle={STRINGS.location} />
        <View style={styles.searchView}>
          <SearchInput
            inputRef={textInputRef}
            value={searchValue}
            onChangeText={e => setSearchValue(e)}
            onPressCross={crossPressHandler}
            placeHolder={''}
            navigation={navigation}
          />
        </View>
        <View>
          <View style={styles.addressView}>
            <TouchableOpacity style={styles.locationView}>
              <CURRENT_LOCATION
                width={verticalScale(24)}
                height={verticalScale(24)}
              />
              <Text style={styles.title}>{STRINGS.use_current_location}</Text>
            </TouchableOpacity>
            <BrTag />
            <TouchableOpacity
              onPress={navigateToNextScreen}
              style={styles.locationView}>
              <ADD_ADDRESS
                width={verticalScale(24)}
                height={verticalScale(24)}
              />
              <Text style={styles.title}>{STRINGS.add_address}</Text>
              <View style={styles.arrowContainer}>
                <RIGHT_ARROW_DROPDOWN
                  width={verticalScale(24)}
                  height={verticalScale(24)}
                  style={styles.arrowRight}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <BrTag tagStyles={styles.tag} />
      <View style={styles.locations}>
        <LocationCard />
      </View>
    </SafeAreaView>
  );
};

export default SelectLocation;
const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    mainView: {
      marginHorizontal: verticalScale(24),
    },
    searchView: {
      marginTop: verticalScale(12),
      marginBottom: verticalScale(24),
    },
    addressView: {
      paddingVertical: verticalScale(16),
      paddingHorizontal: verticalScale(16),
      borderWidth: 1,
      borderColor: 'rgba(18, 18, 18, 0.12)',
    },
    locationView: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      ...fonts.medium,
      color: theme.color.darkBlue,
      marginLeft: verticalScale(12),
    },
    br: {
      borderWidth: 1,
      borderColor: theme.color.grey,
    },
    arrowRight: {
      flex: 1,
      alignSelf: 'flex-end',
    },
    arrowContainer: {
      flex: 1,
    },
    tag: {
      marginVertical: verticalScale(24),
      height: 4,
      backgroundColor: theme.color.lightGrey,
    },
    locations: {
      marginHorizontal: verticalScale(24),
    },
  });
  return styles;
};

import {StyleSheet, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';
import SafeAreaView from '@components/safeArea';
import HeaderWithBack from '@components/atoms/headerWithBack';
import {STRINGS} from 'src/locales/english';
import {verticalScale, moderateScale} from '@utils/metrics';

import SearchInput from '@components/molecules/InputTypes/SearchInput';
import Svg, {Path} from 'react-native-svg';
import {fontFamily, fonts} from '@utils/common.styles';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/index';
import CustomButton from '@components/molecules/customButton';
import AddAddressModal from '@components/signup/AddAddressModal';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

const AddLocationManually = () => {
  const [searchValue, setSearchValue] = useState('');
  const styles = useThemeAwareObject(getStyles);
  const compRef = useRef<BottomSheetModal | null>(null);
  const onPressCross = () => {
    setSearchValue('');
  };
  const onPressAdd = () => {
    compRef.current?.snapToIndex(1);
  };

  return (
    <SafeAreaView>
      <View style={styles.containerMain}>
        <HeaderWithBack isDark headerTitle={STRINGS.add_address} />
      </View>
      {/* <View style={styles.mapView}>
        <View style={styles.searchContainer}>
          <SearchInput
            value={searchValue}
            onChangeText={text => setSearchValue(text)}
            onPressCross={onPressCross}
            placeHolder={''}
          />
        </View>
        <MapView
          style={styles.mapContainer}
          provider="google"
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
        <View style={styles.marker}>
          <LOCATION_POINTER />
        </View>
        <View style={styles.bottomView}>
          <IC_GPS style={styles.gps} />
          <View style={styles.selectedContainer}>
            <View style={styles.flex}>
              <Svg
                width={verticalScale(24)}
                height={verticalScale(24)}
                viewBox={`0 0 ${verticalScale(24)} ${verticalScale(24)}`}
                fill="none">
                <Path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4 10.6523C4.01441 6.41168 7.46376 2.98568 11.7043 3.00004C15.9449 3.0145 19.3709 6.46385 19.3566 10.7044V10.7914C19.3044 13.5479 17.7652 16.0957 15.8783 18.087C14.7991 19.2077 13.594 20.1998 12.287 21.0436C11.9375 21.3459 11.4191 21.3459 11.0696 21.0436C9.12107 19.7753 7.41094 18.1741 6.01739 16.3131C4.77535 14.6903 4.07017 12.7207 4 10.6784V10.6523Z"
                  stroke="#182452"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <Path
                  d="M11.6778 13.261C13.037 13.261 14.1388 12.1592 14.1388 10.8C14.1388 9.44082 13.037 8.33899 11.6778 8.33899C10.3186 8.33899 9.2168 9.44082 9.2168 10.8C9.2168 12.1592 10.3186 13.261 11.6778 13.261Z"
                  stroke="#182452"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>
              <View style={styles.address}>
                <Text style={styles.title}>CP-67 Unity Homeland</Text>
                <Text style={styles.description}>
                  International Airport Road, Sector 67, Sahibzada Ajit Sing
                  Nagar, Punjab, India
                </Text>
              </View>
            </View>
            <CustomButton
              disabled={false}
              buttonStyle={styles.secondaryButton}
              titleStyles={styles.buttonTitle}
              title={STRINGS.add}
              onButtonPress={onPressAdd}
            />
            <AddAddressModal compRef={compRef} />
          </View>
        </View>
      </View> */}
    </SafeAreaView>
  );
};

export default AddLocationManually;

const getStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    containerMain: {
      marginLeft: verticalScale(24),
    },
    selectedContainer: {
      borderTopLeftRadius: 56,
      paddingHorizontal: verticalScale(24),
      paddingVertical: verticalScale(24),
      backgroundColor: '#fff',
      shadowColor: 'rgba(18, 18, 18, 0.12)',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.6,
      shadowRadius: 7.84,
      elevation: 5,
      // alignItems: 'center',
    },
    flex: {
      flexDirection: 'row',
    },
    mapView: {
      flex: 1,
      justifyContent: 'center',
      top: 0,
      left: 0,
      alignItems: 'center',
      position: 'relative',
    },
    secondaryButton: {
      backgroundColor: '#fff',
      marginTop: verticalScale(24),
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: color.blueLight,
    },
    buttonTitle: {
      color: color.blueLight,
      ...fonts.medium,
    },
    searchContainer: {
      position: 'absolute',
      top: verticalScale(12),
      width: '88%',
      paddingTop: 20,
      zIndex: 1,
      marginHorizontal: verticalScale(24),
    },
    mapContainer: {marginTop: verticalScale(14), width: '100%', height: '100%'},
    marker: {
      position: 'absolute',
    },
    bottomView: {
      position: 'absolute',
      bottom: -20,
      zIndex: 1,
      width: '100%',
    },
    address: {
      flex: 1,
      marginLeft: verticalScale(12),
    },
    gps: {
      alignSelf: 'flex-end',
    },
    title: {
      ...fonts.medium,
      fontFamily: fontFamily.bold,
    },
    description: {
      ...fonts.regular,
      lineHeight: moderateScale(20),
      marginTop: verticalScale(4),
      color: color.disabled,
    },
  });
  return styles;
};

import {StyleSheet, View} from 'react-native';
import React, {useCallback, useReducer, useRef} from 'react';
import SafeAreaView from '@components/safeArea';
import {verticalScale} from '@utils/metrics';
import {fonts} from '@utils/common.styles';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/index';
import {STRINGS} from 'src/locales/english';
import HeaderWithBack from '@components/atoms/headerWithBack';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {IRegisterNewCompanyProps} from './types';
import CustomTextInput from '@components/atoms/customtextInput';
import PhoneNumberInput from '@components/molecules/InputTypes/PhoneNumberInput';
import LocationInput from '@components/molecules/InputTypes/locationInput';
import BottomButtonView from '@components/organisms/bottomButtonView';
import FilterListBottomSheet from '@components/molecules/filterListBottomSheet';
import {provincesAndCities} from '@api/mockData';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import UploadProfilePhoto from '@components/molecules/uploadProfilePhoto';

const RegisterNewCompany = () => {
  const navigation = useNavigation();
  const [state, dispatch] = useReducer(
    (prev: IRegisterNewCompanyProps, next: IRegisterNewCompanyProps) => {
      return {
        ...prev,
        ...next,
      };
    },
    {
      companyName: '',
      companyNameError: '',
      contactNumber: '',
      contactNumberError: '',
      companyEmail: '',
      companyEmailError: '',
      address: '',
      addressError: '',
      location: '',
      locationError: '',
      industry: '',
      industryError: '',
    },
  );
  const styles = useThemeAwareObject(getStyles);

  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const displayModal = useCallback(
    () => bottomSheetRef.current?.snapToIndex(1),
    [],
  );

  const onPressCross = useCallback(() => navigation.goBack(), []);

  return (
    <SafeAreaView>
      <HeaderWithBack
        withCross
        withArrow={false}
        onPressCross={onPressCross}
        isDark
        headerTitle={STRINGS.details}
      />
      <View style={styles.outerContainer}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.contentContainer}>
          <View style={styles.photoContainer}>
            <UploadProfilePhoto getUploadedImageIds={ids => console.log(ids)} />
          </View>
          <CustomTextInput
            title={STRINGS.company_name}
            value={state.companyName}
            onTextChange={e =>
              dispatch({...state, companyName: e, companyNameError: ''})
            }
            errorMessage={undefined}
          />
          <PhoneNumberInput
            value={state.contactNumber}
            onTextChange={e =>
              dispatch({...state, contactNumber: e, contactNumberError: ''})
            }
            errorMessage={state.contactNumberError}
          />
          <CustomTextInput
            title={STRINGS.email}
            value={state.companyEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onTextChange={e =>
              dispatch({...state, companyEmail: e, companyEmailError: ''})
            }
            errorMessage={undefined}
          />
          <CustomTextInput
            title={STRINGS.address}
            value={state.address}
            isMultiline
            multiline
            keyboardType="email-address"
            autoCapitalize="none"
            onTextChange={e =>
              dispatch({...state, address: e, addressError: ''})
            }
            errorMessage={undefined}
          />
          <LocationInput onPress={displayModal} />
          <CustomTextInput
            title={STRINGS.industry}
            value={state.industry}
            keyboardType="email-address"
            autoCapitalize="none"
            onTextChange={e =>
              dispatch({...state, industry: e, industryError: ''})
            }
            errorMessage={undefined}
          />
        </KeyboardAwareScrollView>
        <BottomButtonView
          title={STRINGS.submit}
          disabled={false}
          onButtonPress={() => console.log('hello world')}
        />
      </View>
      <FilterListBottomSheet
        ref={bottomSheetRef}
        buttonTitle={STRINGS.select}
        filters={provincesAndCities}
        snapPoints={[0.01, verticalScale(698)]}
        title={STRINGS.select_location}
        isMultiSelect={false}
        getAppliedFilters={() => console.log('hello world')}
      />
    </SafeAreaView>
  );
};

export default RegisterNewCompany;
export const getStyles = (colors: Theme) => {
  const styles = StyleSheet.create({
    header: {
      paddingHorizontal: verticalScale(24),
      width: '100%',
      borderBottomWidth: 1,
      paddingVertical: verticalScale(14),
      justifyContent: 'center',
      borderColor: colors.color.grey,
    },
    photoContainer: {
      marginBottom: verticalScale(24),
      alignSelf: 'center',
    },
    icon: {
      position: 'absolute',
      left: verticalScale(24),
    },
    title: {
      ...fonts.headingSmall,
      color: colors.color.textPrimary,
      textAlign: 'center',
    },
    outerContainer: {
      paddingHorizontal: verticalScale(24),
      flex: 1,
      paddingTop: verticalScale(24),
    },
    contentContainer: {
      flexGrow: 1,
      gap: verticalScale(16),
    },
  });
  return styles;
};

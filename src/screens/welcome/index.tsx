import {Pressable, Text, View} from 'react-native';
import React, {useState} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {JOB_SEEKER, RECRUITER} from '@assets/exporter';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {getStyles} from './styles';
import {verticalScale} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import {useTheme} from '@theme/Theme.context';
import BottomButtonView from '@components/organisms/bottomButtonView';
import {fontFamily} from '@utils/common.styles';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import Animated, {FlipInXDown} from 'react-native-reanimated';

const Welcome = () => {
  const styles = useThemeAwareObject(getStyles);
  const {theme} = useTheme();
  const [selectedOption, updateSelectedOption] = useState<0 | 1 | null>(null);
  const navigation = useNavigation<NavigationProps>();
  const onPressNext = () => {
    navigation.navigate('signup', {
      user_type: selectedOption === 0 ? 'emp' : 'client',
    });
  };

  return (
    <OnBoardingBackground
      hideBack={false}
      title={STRINGS.hi_there}
      subTitle={STRINGS.welcome_to_universal}>
      <View style={styles.mainView}>
        <Pressable
          onPress={() => updateSelectedOption(1)}
          style={[
            styles.container,
            selectedOption === 1 && {borderColor: theme.color.darkBlue},
            styles.secondary,
          ]}>
          <RECRUITER width={verticalScale(160)} height={verticalScale(160)} />
          <Text
            style={[
              styles.title,
              selectedOption === 1 && {fontFamily: fontFamily.bold},
            ]}>
            {STRINGS.i_Hiring}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => updateSelectedOption(0)}
          style={[
            styles.container,
            selectedOption === 0 && {borderColor: theme.color.darkBlue},
          ]}>
          <JOB_SEEKER width={verticalScale(160)} height={verticalScale(160)} />
          <Text
            style={[
              styles.title,
              selectedOption === 0 && {fontFamily: fontFamily.bold},
            ]}>
            {STRINGS.i_Job_Seeker}
          </Text>
        </Pressable>
      </View>
      <Animated.View entering={FlipInXDown.delay(200)}>
        <BottomButtonView
          disabled={selectedOption !== null ? false : true}
          onButtonPress={onPressNext}
          title={STRINGS.next}
        />
      </Animated.View>
    </OnBoardingBackground>
  );
};

export default Welcome;

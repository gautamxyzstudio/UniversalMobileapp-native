import {View} from 'react-native';
import React from 'react';
import StepIndicator from 'src/lib/ProgerssStepIndecator/index';
import {GLOW_TICK, GREEN_TICK} from '@assets/exporter';
import {useTheme} from '@theme/Theme.context';
import {moderateScale, verticalScale} from '@utils/metrics';
import {fontFamily} from '@utils/common.styles';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {getStyles} from './styles';
import {IProgressStepProps} from './types';

const ProgressSteps: React.FC<IProgressStepProps> = ({activeStep, labels}) => {
  const {theme} = useTheme();
  const styles = useThemeAwareObject(getStyles);
  const customStyles = {
    separatorFinishedColor: 'transparent',
    separatorUnFinishedColor: 'tranparent',
    separatorStrokeUnfinishedWidth: 0,
    separatorStrokeFinishedWidth: 0,
    stepStrokeWidth: 0,
    stepIndicatorFinishedColor: 'transparent',
    currentStepStrokeWidth: 0,
    stepIndicatorUnFinishedColor: 'transparent',
    stepIndicatorCurrentColor: 'transparent',
    currentStepIndicatorSize: verticalScale(70),
    labelColor: theme.color.disabled,
    labelFontFamily: fontFamily.regular,
    currentStepLabelColor: '#ffff',
    stepIndicatorLabelFinishedColor: '#ffff',
    labelSize: moderateScale(12),
    stepIndicatorLabelFontSize: moderateScale(12),
    stepIndicatorSize: verticalScale(50),
  };

  return (
    <StepIndicator
      customStyles={customStyles}
      currentPosition={activeStep}
      stepCount={3}
      labels={labels}
      renderStepIndicator={({stepStatus}) => {
        if (stepStatus === 'finished') {
          return (
            <GREEN_TICK width={verticalScale(25)} height={verticalScale(25)} />
          );
        } else if (stepStatus === 'unfinished') {
          return <View style={styles.unfinished} />;
        } else {
          return (
            <GLOW_TICK width={verticalScale(85)} height={verticalScale(85)} />
          );
        }
      }}
    />
  );
};

export default ProgressSteps;

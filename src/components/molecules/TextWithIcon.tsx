import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import React, {useMemo} from 'react';
import {Row} from '@components/atoms/Row';
import {SvgProps} from 'react-native-svg';
import {verticalScale} from '@utils/metrics';
import CustomText, {ITextPropsBasic} from '@components/atoms/CustomText';

interface ITextWithIconProps extends ITextPropsBasic {
  icon: React.FC<SvgProps>;
  iconWidth?: number;
  iconHeight?: number;
  containerStyles?: StyleProp<ViewStyle>;
  marginVertical?: number;
  marginTop?: number;
}

const TextWithIcon: React.FC<ITextWithIconProps> = ({
  icon,
  iconWidth = 20,
  marginTop,
  marginVertical,
  containerStyles,
  iconHeight = 20,
  ...textProps
}) => {
  const Icon = useMemo(() => icon, [icon]);
  return (
    <Row
      alignCenter
      style={[styles.row, {marginVertical, marginTop}, containerStyles]}>
      <Icon
        width={verticalScale(iconWidth)}
        height={verticalScale(iconHeight)}
      />
      <CustomText {...textProps} />
    </Row>
  );
};

export default TextWithIcon;

const styles = StyleSheet.create({
  row: {
    gap: verticalScale(4),
  },
});

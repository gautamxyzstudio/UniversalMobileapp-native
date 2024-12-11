import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {IHelpAndSupportTicketStatus} from '@utils/enums';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {verticalScale} from '@utils/metrics';
import {Row} from '@components/atoms/Row';
import CustomText, {textSizeEnum} from '@components/atoms/CustomText';
import {useTheme} from '@theme/Theme.context';
import {fonts} from '@utils/common.styles';
import Spacers from '@components/atoms/Spacers';
import {dateFormatter} from '@utils/utils.common';

type IHelpAndSupportCardProps = {
  date: Date;
  status: IHelpAndSupportTicketStatus;
  description: string;
};

const HelpAndSupportCard: React.FC<IHelpAndSupportCardProps> = ({
  date,
  status,
  description,
}) => {
  const styles = useThemeAwareObject(createStyles);
  const {theme} = useTheme();
  const {color, title} = getStatusTextColorFromStatus(status, theme);
  console.log(date, 'DATE');
  return (
    <View style={styles.container}>
      <Row alignCenter spaceBetween>
        <CustomText
          value={dateFormatter(new Date(date))}
          size={textSizeEnum.medium}
          color="disabled"
        />
        <Text style={[styles.status, {color: color}]}>{title}</Text>
      </Row>
      <Spacers type="vertical" scalable size={12} />
      <CustomText value={description} size={textSizeEnum.regular} />
    </View>
  );
};

export default HelpAndSupportCard;

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: theme.color.strokeLight,
      padding: verticalScale(12),
      borderRadius: 4,
    },
    status: {
      ...fonts.regular,
    },
  });
  return styles;
};

const getStatusTextColorFromStatus = (
  status: IHelpAndSupportTicketStatus,
  theme: Theme,
) => {
  switch (status) {
    case IHelpAndSupportTicketStatus.OPEN:
      return {
        color: theme.color.yellow,
        title: 'Pending',
      };
    case IHelpAndSupportTicketStatus.CLOSED:
      return {
        color: theme.color.red,
        title: 'Resolved',
      };
    case IHelpAndSupportTicketStatus.NO_ISSUE:
      return {
        color: theme.color.greenLight,
        title: 'Not An Issue',
      };
    default:
      return {
        color: theme.color.yellow,
        title: 'Pending',
      };
  }
};

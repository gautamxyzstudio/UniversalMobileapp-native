import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import PreUploadedDocCardWithView from './PreUploadedDocCardWithView';
import {IImage} from '@utils/photomanager';
import {IDocument} from '@utils/doumentManager';
import {fonts} from '@utils/common.styles';
import Spacers from '@components/atoms/Spacers';
import {useTheme} from '@theme/Theme.context';
import {Row} from '@components/atoms/Row';
import {MEAT_BALL} from '@assets/exporter';
import {verticalScale} from '@utils/metrics';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';

type IUpdatedDocumentStatusCard = {
  status: 'Pending' | 'Updated';
  title?: string;
  asset: IImage | IDocument;
};

const UpdatedDocumentStatusCard: React.FC<IUpdatedDocumentStatusCard> = ({
  title,
  status,
}) => {
  const styles = useThemeAwareObject(createStyles);
  const navigation = useNavigation<NavigationProps>();

  const {theme} = useTheme();

  const getStatusTextColorFromStatus = () => {
    switch (status) {
      case 'Pending':
        return theme.color.yellow;
      case 'Updated':
        return theme.color.green;
      default:
        return theme.color.green;
    }
  };

  return (
    <View style={styles.container}>
      {title && (
        <>
          <Row alignCenter spaceBetween>
            <Text style={styles.heading}>{title}</Text>
            <Row alignCenter style={styles.gap}>
              <Text
                style={[
                  styles.status,
                  {color: getStatusTextColorFromStatus()},
                ]}>
                {status}
              </Text>
              <MEAT_BALL width={verticalScale(20)} height={verticalScale(20)} />
            </Row>
          </Row>
          <Spacers type="vertical" size={8} />
        </>
      )}
      <PreUploadedDocCardWithView
        withTitle={false}
        document={null}
        navigation={navigation}
      />
    </View>
  );
};

export default UpdatedDocumentStatusCard;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: verticalScale(12),
      backgroundColor: '#fff',
      shadowColor: 'rgba(18, 18, 18, 0.08)',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 1,
      shadowRadius: 4,
      borderRadius: 8,
      elevation: 1,
    },
    heading: {
      ...fonts.mediumBold,
      color: theme.color.textPrimary,
    },
    status: {
      ...fonts.mediumBold,
    },
    gap: {},
  });

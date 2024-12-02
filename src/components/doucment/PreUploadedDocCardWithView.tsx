import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Row} from '@components/atoms/Row';
import {IC_DOCUMENT} from '@assets/exporter';
import {verticalScale} from '@utils/metrics';
import {fonts} from '@utils/common.styles';
import Spacers from '@components/atoms/Spacers';
import {STRINGS} from 'src/locales/english';
import ImageView from 'react-native-image-viewing';
import {
  IDoc,
  IDocumentStatus,
  IEmployeeDocument,
} from '@api/features/user/types';
import {useTheme} from '@theme/Theme.context';
import {getFileExtension} from '@utils/utils.common';
import {NavigationProps} from 'src/navigator/types';

type IPreUploadedDocCardWithView = {
  document: IEmployeeDocument | null;
  withTitle: boolean;
  hideStatus?: boolean;
  navigation: NavigationProps;
};

const PreUploadedDocCardWithView: React.FC<IPreUploadedDocCardWithView> = ({
  document,
  navigation,
  hideStatus,
  withTitle = true,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const [visible, setIsVisible] = useState(false);
  const theme = useTheme();
  const [doc, setDoc] = useState<IDoc | null>(null);

  useEffect(() => {
    if (document) {
      setDoc(document.doc);
    }
  }, [document]);

  const onPressView = () => {
    const fileExtension = getFileExtension(doc?.url ?? '');

    if (fileExtension === 'pdf' || fileExtension === 'docx') {
      navigation.navigate('pdfViewer', {
        source: doc?.url ? {uri: doc.url} : undefined, // Wrapping the URL in an object
      });
    } else {
      setIsVisible(true);
    }
  };

  const statusAttributes = getStatusAttributesFromStatus(
    document?.docStatus ?? IDocumentStatus.PENDING,
    theme.theme,
  );

  return (
    <View>
      {withTitle && (
        <>
          <Row alignCenter spaceBetween>
            <Text style={styles.title}>{document?.docName}</Text>
            {!hideStatus && (
              <Text style={[styles.status, {color: statusAttributes.color}]}>
                {statusAttributes.title}
              </Text>
            )}
          </Row>
          <Spacers type="vertical" size={8} />
        </>
      )}

      <Row alignCenter spaceBetween style={styles.mainView}>
        <Row style={styles.left} alignCenter>
          <IC_DOCUMENT width={verticalScale(16)} height={verticalScale(16)} />
          <Text numberOfLines={1} ellipsizeMode="middle" style={styles.name}>
            {doc?.name}
          </Text>
        </Row>
        <TouchableOpacity onPress={onPressView}>
          <Text style={styles.viewButton}>{STRINGS.view}</Text>
        </TouchableOpacity>
      </Row>
      {doc?.url && (
        <ImageView
          images={[{uri: doc?.url}]}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
          keyExtractor={(imageSrc, index) => `${index}${imageSrc}`}
          imageIndex={0}
        />
      )}
    </View>
  );
};

export default PreUploadedDocCardWithView;

export const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    title: {
      ...fonts.regular,
      color: theme.color.disabled,
    },
    mainView: {
      height: verticalScale(56),
      paddingHorizontal: verticalScale(12),
      backgroundColor: theme.color.ternary,
      borderRadius: 4,
    },
    left: {
      gap: 12,
    },
    name: {
      width: verticalScale(130),

      ...fonts.small,
      color: theme.color.textPrimary,
    },
    viewButton: {
      color: theme.color.blueLight,
      ...fonts.smallBold,
    },
    status: {
      ...fonts.medium,
    },
  });
  return styles;
};

export const getStatusAttributesFromStatus = (
  status: IDocumentStatus,
  theme: Theme,
) => {
  switch (status) {
    case IDocumentStatus.PENDING:
      return {
        color: theme.color.yellow,
        title: STRINGS.pending,
      };
    case IDocumentStatus.APPROVED:
      return {
        title: STRINGS.verified,
        color: theme.color.green,
      };
    case IDocumentStatus.DENIED:
      return {
        color: theme.color.red,
        title: STRINGS.rejected,
      };
    default:
      return {
        color: theme.color.yellow,
        title: STRINGS.pending,
      };
  }
};

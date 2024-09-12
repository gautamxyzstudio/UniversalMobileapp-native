import React from 'react';
import {ICustomErrorResponse} from '@api/types';
import {useTheme} from '@theme/Theme.context';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Image, ImageSourcePropType, Text, View} from 'react-native';
import {STRINGS} from 'src/locales/english';
import {getStyles} from './styles';
import {EMPTY, NO_INTERNET} from '@assets/exporter';
import {verticalScale} from '@utils/metrics';
import {SvgProps} from 'react-native-svg';

type IEmptyStateProps<T> = {
  errorObj: ICustomErrorResponse | null | undefined;
  refreshHandler?: () => void;
  data?: T[];
  errorHeader?: string;
  image?: ImageSourcePropType;
  errorMsg?: string;
  emptyListMessage?: string;
  emptyListIllustration?: React.FC<SvgProps>;
  emptyListSubTitle?: string;
};

const EmptyState: React.FC<IEmptyStateProps<any>> = ({
  errorObj,
  data,
  errorHeader,
  emptyListMessage,
  emptyListIllustration,
  emptyListSubTitle,
  errorMsg,
  image,
  refreshHandler,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const {theme} = useTheme();
  const error = errorHeader ?? 'OOPS !!';

  console.log(errorObj, 'ERROR');
  const errorMessage = errorMsg ?? STRINGS.someting_went_wrong;
  const internetError = STRINGS.your_internet_is_a_little_wonky_right_now;
  const internetErrorMsg = STRINGS.internet_error_msg;
  const EmptyListIcon = emptyListIllustration ?? EMPTY;
  return (
    <View style={styles.container}>
      {!errorObj && data?.length === 0 && (
        <>
          <EmptyListIcon
            width={verticalScale(230)}
            height={verticalScale(163)}
          />
          <Text style={styles.errorHeader}>{emptyListMessage}</Text>
          <Text style={styles.errorDescription}>{emptyListSubTitle}</Text>
        </>
      )}
      {errorObj && errorObj.statusCode === 'FETCH_ERROR' && (
        <>
          <NO_INTERNET />
          <Text style={styles.errorHeader}>{internetError}</Text>
          <Text style={styles.errorDescription}>{internetErrorMsg}</Text>
        </>
      )}
      {errorObj && errorObj?.statusCode !== 'FETCH_ERROR' && (
        <>
          {/* <Image source={IMAGES.commonError_image} /> */}
          <Text style={styles.errorHeader}>{error}</Text>
          <Text style={styles.errorSubHeader}>{errorMessage}</Text>
        </>
      )}
    </View>
  );
};

export default EmptyState;

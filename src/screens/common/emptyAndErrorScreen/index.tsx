import {ICustomErrorResponse} from '@api/types';
import {useTheme} from '@theme/Theme.context';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Image, ImageSourcePropType, Text, View} from 'react-native';
import {STRINGS} from 'src/locales/english';
import {getStyles} from './styles';

type IEmptyStateProps<T> = {
  errorObj: ICustomErrorResponse | null | undefined;
  refreshHandler?: () => void;
  data?: T[];
  errorHeader?: string;
  image?: ImageSourcePropType;
  errorMsg?: string;
  emptyListMessage?: string;
};

const EmptyState: React.FC<IEmptyStateProps<any>> = ({
  errorObj,
  data,
  errorHeader,
  emptyListMessage,
  errorMsg,
  image,
  refreshHandler,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const {theme} = useTheme();
  const error = errorHeader ?? 'OOPS !!';
  const errorMessage = errorMsg ?? STRINGS.someting_went_wrong;
  const internetError = STRINGS.your_internet_is_a_little_wonky_right_now;
  const internetErrorMsg = STRINGS.internet_error_msg;

  return (
    <View style={styles.container}>
      {!errorObj && data?.length === 0 && (
        <>
          <Image source={image} />
          <Text style={styles.errorHeader}>{emptyListMessage}</Text>
        </>
      )}
      {errorObj && errorObj.statusCode === 511 && (
        <>
          {/* <Image source={IMAGES.internetError_image} /> */}
          <Text style={styles.headerText}>{internetError}</Text>
          <Text style={styles.subHeaderText}>{internetErrorMsg}</Text>
        </>
      )}
      {errorObj && errorObj?.statusCode !== 511 && (
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

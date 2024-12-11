import React, {useState, useRef} from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  View,
  StyleProp,
  ImageStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ICustomImageComponentProps} from './types';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {useTheme} from '@theme/Theme.context';
import {getStyles} from './styles';

const CustomImageComponent: React.FC<ICustomImageComponentProps> = ({
  customStyle,
  image,
  resizeMode = 'cover',
  defaultSource,
  loaderSize = 'large',
}) => {
  const [loading, setLoading] = useState(true);
  const hasLoadedRef = useRef(false);
  const styles = useThemeAwareObject(getStyles);
  const {theme} = useTheme();

  const handleLoadState = (isLoading: boolean) => {
    if (!hasLoadedRef.current) {
      setLoading(isLoading);
    }
    if (!isLoading) {
      hasLoadedRef.current = true;
    }
  };

  const imageSource = image
    ? {uri: image, cache: Platform.OS === 'ios' ? 'force-cache' : 'immutable'}
    : defaultSource;

  return (
    <View style={customStyle}>
      {Platform.OS === 'ios' ? (
        <Image
          style={customStyle as StyleProp<ImageStyle>}
          source={imageSource as any}
          resizeMode={resizeMode}
          defaultSource={defaultSource}
          onLoadStart={() => handleLoadState(true)}
          onLoad={() => handleLoadState(false)}
          onLoadEnd={() => handleLoadState(false)}
          onError={() => handleLoadState(false)}
        />
      ) : (
        <FastImage
          style={customStyle as any}
          source={imageSource as any}
          resizeMode={resizeMode}
          fallback
          defaultSource={defaultSource}
          onLoadStart={() => handleLoadState(true)}
          onLoad={() => handleLoadState(false)}
          onLoadEnd={() => handleLoadState(false)}
          onError={() => handleLoadState(false)}
        />
      )}
      {loading && !hasLoadedRef.current && (
        <View style={[customStyle, styles.imageContainer]}>
          <ActivityIndicator size={loaderSize} color={theme.color.primary} />
        </View>
      )}
    </View>
  );
};

export default CustomImageComponent;

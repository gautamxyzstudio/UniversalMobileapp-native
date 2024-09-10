import {ActivityIndicator, Image, Platform, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {ICustomImageComponentProps} from './types';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {useTheme} from '@theme/Theme.context';
import {getStyles} from './styles';

const CustomImageComponent: React.FC<ICustomImageComponentProps> = ({
  customStyle,
  image,
  resizeMode,
  defaultSource,
  loaderSize = 'large',
}) => {
  const [localImage, updateLocalImag] = useState<string | undefined | null>(
    image,
  );
  const [state, updateState] = useState<boolean>(false);
  const styles = useThemeAwareObject(getStyles);
  const {theme} = useTheme();

  useEffect(() => {
    updateLocalImag(image);
  }, [image]);

  const onLoadStart = () => {
    updateState(true);
  };

  const onLoad = () => {
    updateState(false);
  };

  const onLoadEnd = () => {
    updateState(false);
  };

  const onError = () => {
    updateState(false);
  };
  let uri = localImage;
  // console.log("IMAGE URL----->", uri);

  return (
    <View style={customStyle}>
      {Platform.OS === 'ios' ? (
        <Image
          style={customStyle as any}
          onLoadStart={onLoadStart}
          onLoad={onLoad}
          onLoadEnd={onLoadEnd}
          resizeMode={resizeMode ?? 'cover'}
          defaultSource={defaultSource}
          onError={onError}
          source={uri ? {uri, cache: 'force-cache'} : undefined}
        />
      ) : (
        <FastImage
          fallback={true}
          source={uri ? {uri, cache: 'immutable'} : defaultSource}
          style={customStyle as any}
          resizeMode={resizeMode ?? 'cover'}
          onLoadStart={onLoadStart}
          onLoad={onLoad}
          onLoadEnd={onLoadEnd}
          onError={onError}
          defaultSource={defaultSource}
        />
      )}
      {state === true && (
        <View style={[customStyle, styles.imageContainer]}>
          <ActivityIndicator size={loaderSize} color={theme.color.primary} />
        </View>
      )}
    </View>
  );
};

export default CustomImageComponent;

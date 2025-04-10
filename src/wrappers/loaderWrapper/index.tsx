import {View, StyleSheet} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {loadingStateFromSlice} from '@api/features/loading/loadingSlice';
import {useTheme} from '@theme/Theme.context';
import LoaderKit from 'react-native-loader-kit';
import {verticalScale} from '@utils/metrics';

type ILoaderWrapperProps = {
  children: React.ReactNode;
};

const LoaderWrapper: React.FC<ILoaderWrapperProps> = ({children}) => {
  const isLoading = useSelector(loadingStateFromSlice);
  const {theme} = useTheme();

  return (
    <>
      <View style={styles.childrenContainer}>
        <View style={styles.childrenContainer}>{children}</View>
        {isLoading && (
          <View style={styles.loaderBlackOverlay}>
            <LoaderKit
              style={styles.loader}
              name={'BallClipRotatePulse'}
              color={theme.color.darkBlue}
            />
          </View>
        )}
      </View>
    </>
  );
};

export default LoaderWrapper;

export const styles = StyleSheet.create({
  childrenContainer: {
    flex: 1,
  },
  loaderBlackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: verticalScale(56),
    height: verticalScale(56),
  },
  loaderWhiteContainerView: {
    height: 130,
    width: 150,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
  },
});

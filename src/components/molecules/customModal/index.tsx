/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  Animated,
  Easing,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useImperativeHandle} from 'react';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {verticalScale, windowWidth} from '@utils/metrics';
import {ICustomModalProps, customModalRef} from './types';
import {timeOutTimeSheets} from 'src/constants/constants';

const CustomModal = React.forwardRef<customModalRef, ICustomModalProps>(
  ({children, hideOverLay, hideOnClickOutSide}, ref) => {
    const alphaValue = React.useRef(new Animated.Value(0.7)).current;
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const styles = useThemeAwareObject(getStyles);

    useImperativeHandle(ref, () => ({
      handleModalState: handleModalState,
    }));

    const show = () => {
      var alpha = 1.0;
      Animated.timing(alphaValue, {
        toValue: alpha,
        duration: 350,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    };

    const hideModal = () => {
      Animated.timing(alphaValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
      setTimeout(() => {
        setShowModal(false);
      }, timeOutTimeSheets);
    };

    const handleModalState = (value: boolean) => {
      if (value) {
        show();
        setShowModal(value);
      } else {
        hideModal();
      }
    };

    const renderOverlay = useCallback(() => {
      return (
        <Animated.View
          style={[
            styles.loaderOverlay,
            hideOverLay
              ? {backgroundColor: 'transparent'}
              : {opacity: alphaValue},
          ]}>
          {hideOnClickOutSide && (
            <TouchableOpacity onPress={hideModal} style={styles.overlay} />
          )}
        </Animated.View>
      );
    }, [alphaValue, hideOnClickOutSide, hideOverLay]);

    return (
      <Modal
        ref={ref as any}
        animationType="fade"
        statusBarTranslucent
        transparent
        visible={showModal}>
        <View style={styles.container}>
          {renderOverlay()}
          <View style={styles.modalView}>{children}</View>
        </View>
      </Modal>
    );
  },
);

export default CustomModal;

export const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    loaderOverlay: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      top: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.45)', // Default overlay color
    },
    overlay: {
      flex: 1,
    },
    container: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      backgroundColor: 'transparent',
      justifyContent: 'center',
    },
    modalView: {
      backgroundColor: theme.color.primary,
      padding: verticalScale(24),
      width: windowWidth - verticalScale(48),
      borderRadius: 8, // Rounded corners
      zIndex: 1,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  });
  return styles;
};

/* eslint-disable react-native/no-inline-styles */
import React, {ReactNode, useCallback} from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetProps,
} from '@gorhom/bottom-sheet';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {verticalScale} from '@utils/metrics';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {useScreenInsets} from 'src/hooks/useScreenInsets';
import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import Spacers from '@components/atoms/Spacers';
import {Portal} from '@gorhom/portal';

type PropsType = {
  snapPoints: Array<number>;
  children: ReactNode;
  ref: React.RefObject<BottomSheetProps>;
  onClose: () => void;
  onOpen?: () => void;
  headerTitle?: string;
  gestureEnabled?: boolean;
  onBackDropPress?: () => void;
  backgroundColor?: string;
  withoutBackDrop?: boolean;
  headerBackgroundColor?: string;
  modalStyles?: StyleProp<ViewStyle>;
};

export const BaseBottomSheet = React.forwardRef<BottomSheet, PropsType>(
  (
    {
      snapPoints,
      children,
      headerTitle,
      onClose,
      modalStyles,
      onOpen,
      headerBackgroundColor,
      gestureEnabled,
    },
    ref,
  ) => {
    const styles = useThemeAwareObject(createStyles);

    const handleSheetChanges = useCallback(
      (index: number) => {
        index < 1 ? onClose?.() : onOpen?.();
      },
      [onClose, onOpen],
    );

    const {insetsBottom} = useScreenInsets();

    return (
      <Portal>
        <BottomSheet
          snapPoints={snapPoints}
          handleComponent={() => <></>}
          backdropComponent={BottomSheetBackdrop}
          backgroundStyle={styles.bottomSheet}
          ref={ref}
          onChange={handleSheetChanges}
          enableContentPanningGesture={gestureEnabled}
          enableHandlePanningGesture={gestureEnabled}>
          <View
            style={[
              styles.container,
              {
                marginHorizontal:
                  headerTitle && headerTitle?.length > 0
                    ? 0
                    : verticalScale(24),
              },
              Boolean(headerBackgroundColor) && {
                backgroundColor: headerBackgroundColor,
              },
              {
                marginBottom: insetsBottom,
              },
              modalStyles,
            ]}>
            <View style={styles.line} />

            {headerTitle && headerTitle?.length > 0 ? (
              <View style={styles.header}>
                <Text style={styles.heading}>{headerTitle}</Text>
              </View>
            ) : (
              <Spacers size={32} type="vertical" />
            )}
            {children}
          </View>
        </BottomSheet>
      </Portal>
    );
  },
);

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    line: {
      width: verticalScale(64),
      height: verticalScale(4),
      backgroundColor: '#000',
      borderRadius: 4,
      alignSelf: 'center',
      marginTop: verticalScale(16),
      // marginBottom: verticalScale(25.5),
    },
    header: {
      marginTop: verticalScale(32),
      paddingBottom: 12,
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderColor: theme.color.grey,
    },
    heading: {
      ...fonts.headingSmall,
      color: theme.color.textPrimary,
    },
    container: {
      borderTopRightRadius: 32,
      borderTopLeftRadius: 32,
      marginHorizontal: 24,
      flex: 1,
    },
    bottomSheet: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
    },
    // shadow: {
    //   shadowColor: 'red',
    //   shadowOffset: {
    //     width: 0,
    //     height: 2,
    //   },
    //   shadowOpacity: 0.6,
    //   shadowRadius: 7.84,
    //   elevation: 5,
    // },
  });

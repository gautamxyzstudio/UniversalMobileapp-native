import {CROSS_ORANGE, DRAFT, PLUS, PLUS_WHITE} from '@assets/exporter';
import {useNavigation} from '@react-navigation/native';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {fonts} from '@utils/common.styles';
import {verticalScale, windowHeight, windowWidth} from '@utils/metrics';
import React from 'react';
import {StyleSheet} from 'react-native';
import {FAB, Portal} from 'react-native-paper';
import {NavigationProps} from 'src/navigator/types';

const FloatingButton = () => {
  const [state, setState] = React.useState<{open: boolean}>({open: false});
  const styles = useThemeAwareObject(getStyles);
  const navigation = useNavigation<NavigationProps>();
  const onStateChange = ({open}: {open: boolean}) => setState({open});

  const {open} = state;
  return (
    <Portal>
      <FAB.Group
        style={styles.container}
        backdropColor="rgba(18, 18, 18, 0.70)"
        onPress={() => setState({open: !open})}
        open={open}
        fabStyle={styles.button}
        visible
        rippleColor={'transparent'}
        icon={open ? CROSS_ORANGE : PLUS}
        actions={[
          {
            icon: DRAFT,
            style: {
              ...styles.subButton,
              paddingLeft: verticalScale(10),
              paddingTop: verticalScale(6),
            },
            labelStyle: styles.label,
            labelTextColor: '#fff',
            label: 'Draft',
            onPress: () => navigation.navigate('jobPostDrafts'),
          },
          {
            icon: PLUS_WHITE,
            style: {
              ...styles.subButton,
              paddingLeft: verticalScale(6),
              paddingTop: verticalScale(6),
            },
            labelStyle: styles.label,
            labelTextColor: '#fff',
            label: 'Add Post',
            onPress: () => navigation.navigate('jobPosting'),
          },
        ]}
        onStateChange={onStateChange}
      />
    </Portal>
  );
};

export default FloatingButton;

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: windowWidth,
      paddingBottom: verticalScale(112),
      height: windowHeight,
    },
    button: {
      width: verticalScale(56),
      flexDirection: 'row',
      shadowColor: 'rgba(255, 115, 18, 0.12)',
      paddingLeft: verticalScale(2),
      paddingTop: verticalScale(2),
      justifyContent: 'center',
      alignItems: 'center',
      height: verticalScale(56),
      backgroundColor: '#fff',
      borderRadius: verticalScale(28),
    },
    subButton: {
      backgroundColor: theme.color.darkBlue,
      width: verticalScale(40),
      paddingTop: verticalScale(5),
      height: verticalScale(40),
      borderRadius: verticalScale(20),
      justifyContent: 'center',
      alignItems: 'center',
    },
    label: {
      color: theme.color.primary,
      marginRight: -20,
      ...fonts.medium,
    },
  });

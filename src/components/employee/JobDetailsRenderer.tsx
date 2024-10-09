import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {verticalScale} from '@utils/metrics';
import {fonts} from '@utils/common.styles';
import RenderHtml from 'react-native-render-html';
import {STRINGS} from 'src/locales/english';
import Spacers from '@components/atoms/Spacers';

type IJobDetailsRendererPropTypes = {
  heading?: string;
  description: string;
};

const JobDetailsRenderer: React.FC<IJobDetailsRendererPropTypes> = ({
  heading,
  description,
}) => {
  const styles = useThemeAwareObject(createStyles);
  const {width} = useWindowDimensions();

  if (heading === STRINGS.jobDuties) {
    console.log('======================');
    console.log(heading, description);
    console.log('======================');
  }

  return (
    <>
      {heading && <Text style={styles.heading}>{heading}</Text>}
      <Spacers type="vertical" size={8} scalable />
      <View style={styles.descriptionContainer}>
        <RenderHtml
          tagsStyles={{
            p: styles.pStyles,
            span: styles.pStyles,
            div: styles.div,
            ul: styles.ul,
            li: styles.li,
          }}
          contentWidth={width}
          source={{html: description}}
        />
      </View>
    </>
  );
};

export default JobDetailsRenderer;

const createStyles = ({color}: Theme) => {
  return StyleSheet.create({
    title: {
      marginLeft: verticalScale(8),
      ...fonts.regular,
      //   fontWeight: '500',
      letterSpacing: 0.14,
    },
    heading: {
      ...fonts.regularBold,
      letterSpacing: 0.16,
      color: color.textPrimary,
    },
    descriptionContainer: {
      flex: 1,
      // marginTop: verticalScale(12),
    },
    pStyles: {
      color: color.textPrimary,
      ...fonts.regular,
      marginVertical: 0,
    },
    div: {
      flex: 1,
      color: color.textPrimary,
      ...fonts.regular,
      marginVertical: 0,
    },
    ul: {
      paddingLeft: verticalScale(10),
      marginTop: 0,
      marginBottom: 0,
      width: '100%',
    },
    li: {
      color: color.textPrimary,
      marginTop: 1,
      marginLeft: verticalScale(4),
      fontWeight: '400',
      ...fonts.regular,
    },
  });
};

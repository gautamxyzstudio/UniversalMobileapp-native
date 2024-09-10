import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {verticalScale} from '@utils/metrics';
import {fonts} from '@utils/common.styles';
import RenderHtml from 'react-native-render-html';

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

  console.log(description);
  return (
    <>
      {heading && <Text style={styles.heading}>{heading}</Text>}
      <View style={styles.descriptionContainer}>
        <RenderHtml
          tagsStyles={{
            p: styles.pStyles,
            span: styles.pStyles,
            div: styles.pStyles,
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
      // marginTop: verticalScale(12),
    },
    pStyles: {
      color: color.textPrimary,
      ...fonts.regular,
      marginVertical: 0,
    },
    ul: {
      paddingLeft: verticalScale(10),
      marginTop: 0,
      marginBottom: 0,
      width: '99%',
    },
    li: {
      color: color.textPrimary,
      marginLeft: verticalScale(4),
      fontWeight: '400',
      ...fonts.regular,
    },
  });
};

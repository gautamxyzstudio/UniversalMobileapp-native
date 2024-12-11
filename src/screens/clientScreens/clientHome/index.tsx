import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useRef} from 'react';
import {Theme, useThemeAwareObject} from '@theme/index';
import HomeTopView from '@components/employee/HomeTopView';
import {PaperProvider} from 'react-native-paper';
import {verticalScale, windowWidth} from '@utils/metrics';
import SegmentView, {
  ISegmentViewRefMethods,
} from '@components/organisms/segmentView';
import Spacers from '@components/atoms/Spacers';
import ClientOpenJobs from '@components/client/ClientOpenJobs';
import ClientClosedJobs from '@components/client/ClientClosedJobs';
import FloatingButton from '@components/molecules/floatingButton';

const ClientHome = () => {
  const styles = useThemeAwareObject(getStyles);
  const segmentRef = useRef<ISegmentViewRefMethods | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const handleTabsChange = (index: number) => {
    segmentRef.current?.getIndex(index);

    scrollViewRef.current?.scrollTo({
      x: index * windowWidth,
      animated: true,
    });
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <HomeTopView
          withSearch={false}
          height={undefined}
          isLocationApplied={false}
          onPressFilters={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
        <Spacers size={24} scalable type="vertical" />
        <SegmentView
          ref={segmentRef}
          tabs={['Open', 'Closed']}
          marginHorizontal={0}
          onClick={handleTabsChange}
          currentIndex={0}
        />
        <ScrollView
          pagingEnabled={true}
          style={styles.scrollView}
          scrollEventThrottle={32}
          bounces={false}
          contentContainerStyle={styles.scrollContainer}
          ref={scrollViewRef}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          horizontal={true}>
          <View style={styles.tab}>
            <ClientOpenJobs />
          </View>
          <View style={styles.tab}>
            <ClientClosedJobs />
          </View>
        </ScrollView>
        <FloatingButton />
      </View>
    </PaperProvider>
  );
};

export default ClientHome;

const getStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.backgroundWhite,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    tab: {
      width: windowWidth,
      height: '100%',
      paddingHorizontal: verticalScale(24),
    },
    scrollView: {
      flex: 1,
      marginTop: verticalScale(24),
    },
  });
  return styles;
};

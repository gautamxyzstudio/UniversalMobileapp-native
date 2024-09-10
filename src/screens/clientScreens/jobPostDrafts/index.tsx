import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SafeAreaView from '@components/safeArea';
import HeaderWithBack from '@components/atoms/headerWithBack';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import JobPostCard from '@components/client/JobPostCard';

const JobPostDrafts = () => {
  return (
    <OnBoardingBackground title={STRINGS.draft}>
      <JobPostCard
        city={''}
        required_certificates={null}
        postedBy={''}
        jobDuties={JSON.parse('')}
        job_type={
          '/Users/jatinsehgal/Documents/universal/src/utils/enums'.EVENT
        }
        status={0}
        location={''}
        requiredEmployee={0}
        PaymentType={
          '/Users/jatinsehgal/Documents/universal/src/utils/enums'.HOURLY
        }
        startShift={undefined}
        Endshift={undefined}
        description={undefined}
        gender={''}
        startDate={undefined}
        endDate={undefined}
        publishedAt={undefined}
        salary={''}
        address={''}
        postalCode={''}
      />
    </OnBoardingBackground>
  );
};

export default JobPostDrafts;

const styles = StyleSheet.create({});

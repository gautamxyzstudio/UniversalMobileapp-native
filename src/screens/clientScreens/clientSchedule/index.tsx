import {StyleSheet, View} from 'react-native';
import React from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import HorizontalCalendar from '@components/employee/HorizontalCalendar';
import {verticalScale} from '@utils/metrics';
import {IJobPostTypes} from '@api/features/client/types';
import {IJobPostStatus, IJobTypesEnum} from '@utils/enums';
import ScheduledEventCard from '@components/client/ScheduleEventCard';

const ClientSchedules = () => {
  return (
    <OnBoardingBackground
      childrenStyles={styles.children}
      hideBack
      title={STRINGS.schedules}>
      <HorizontalCalendar />
      <View style={styles.mainView}>
        <ScheduledEventCard jobDetails={mockJobPosts[0]} />
        <ScheduledEventCard jobDetails={mockJobPosts[1]} />
      </View>
    </OnBoardingBackground>
  );
};

export default ClientSchedules;

const styles = StyleSheet.create({
  children: {
    paddingHorizontal: 0,
  },
  header: {
    marginLeft: 24,
    marginBottom: 16,
  },
  mainView: {
    marginHorizontal: 24,
    marginTop: verticalScale(20),
    gap: verticalScale(12),
  },
});

export const mockJobPosts: IJobPostTypes[] = [
  {
    id: 1,
    job_name: 'Software Engineer',
    required_certificates: [
      'B.Sc in Computer Science',
      'AWS Certified Developer',
    ],
    city: 'Toronto',
    address: '123 Main Street',
    postalCode: 'M1P 4R7',
    gender: 'Any',
    salary: '$80,000 - $100,000',
    jobDuties: 'Develop and maintain web applications using React and Node.js.',
    job_type: IJobTypesEnum.STATIC,
    publishedAt: new Date('2024-01-15'),
    applicants: null,
    location: 'Toronto, Ontario',
    description:
      'Looking for an experienced software engineer to join our dynamic team.',
    eventDate: new Date('2024-02-01'),
    endShift: new Date('2024-02-01T18:00:00'),
    startShift: new Date('2024-02-01T09:00:00'),
    requiredEmployee: 3,
    status: IJobPostStatus.CLOSED,
    client_details: {
      id: 101,
      Name: 'John Doe',
      companyname: 'Tech Innovations Inc.',
      Industry: 'Software Development',
      Email: 'john.doe@techinnovations.com',
      location: 'Toronto, Ontario',
    },
  },
  {
    id: 2,
    job_name: 'Warehouse Manager',
    required_certificates: [
      'Forklift Certification',
      'Supply Chain Management',
    ],
    city: 'Vancouver',
    address: '456 Industrial Road',
    postalCode: 'V5K 3J9',
    gender: 'Any',
    salary: '$60,000 - $70,000',
    jobDuties: 'Oversee warehouse operations and manage inventory control.',
    job_type: IJobTypesEnum.EVENT,
    publishedAt: new Date('2024-01-20'),
    applicants: null,
    location: 'Vancouver, British Columbia',
    description:
      'Seeking an experienced warehouse manager to oversee daily operations.',
    eventDate: new Date('2024-03-01'),
    endShift: new Date('2024-03-01T17:00:00'),
    startShift: new Date('2024-03-01T08:00:00'),
    requiredEmployee: 1,
    status: IJobPostStatus.OPEN,
    client_details: {
      id: 102,
      Name: 'Jane Smith',
      companyname: 'Logistics Pros Inc.',
      Industry: 'Logistics',
      Email: 'jane.smith@logisticspros.com',
      location: 'Vancouver, British Columbia',
    },
  },
];

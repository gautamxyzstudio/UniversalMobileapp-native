import {POSTER_ONE, POSTER_THREE, POSTER_TWO} from '@assets/exporter';
import {STRINGS} from 'src/locales/english';

export const onBoardingData = [
  {
    id: 0,
    title: STRINGS.connect_job_seekers,
    icon: POSTER_ONE,
    description:
      'Quickly connect with temporary job opportunities that offer flexibility and immediate earnings.',
  },
  {
    id: 1,
    title: STRINGS.jobs_that_match_your_skills,
    description:
      'Match your skills with temporary jobs that offer flexibility and growth potential.',
    icon: POSTER_TWO,
  },
  {
    id: 2,
    title: STRINGS.easy_to_communicate,
    icon: POSTER_THREE,
    description:
      'Seamless communication with employers helps you navigate your job search with ease.',
  },
];

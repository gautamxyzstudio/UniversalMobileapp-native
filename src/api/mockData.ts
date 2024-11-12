import {ICompanyDetails, INotification} from './types';
import {IFilterSheet} from '@components/molecules/filterListBottomSheet/types';
import {ICandidateStatusEnum, IWorkStatus} from '@utils/enums';
import {IDocumentStatus, IEmployeeDocument} from './features/user/types';
import {STRINGS} from 'src/locales/english';

export const appendMockJob = {
  id: 1,
  title: '',
  banner: '',
  location: '',
  companyName: '',
  status: 0,
  jobPostDate: null,
  jobDate: null,
  jobStartTime: null,
  jobEndTime: null,
  postedTime: null,
  event: '',
};

export type ICandidate = {
  id: number;
  name: string;
  date: Date;
  time: Date;
  url: string | null;
  details: {
    name: string;
    contactNumber: string;
    gender: string;
    workStatus: string;
    resume: IEmployeeDocument;
  };
  status: ICandidateStatusEnum;
  jobDetails: {
    jobId: string;
    location: string;
  };
};

export const CandidateListPendingData: ICandidate[] = [
  {
    id: 1,
    name: 'Nusuf Khatri',
    url: 'https://placehold.co/600x400',
    date: new Date('2024-09-10'), // Specific date for example
    time: new Date('2024-09-10T10:00:00'), // Specific time for example
    status: ICandidateStatusEnum.pending,
    details: {
      name: 'Nusuf Khatri',
      contactNumber: '1234567890',
      gender: 'Male',
      workStatus: 'Employed',
      resume: {
        docName: 'CV.pdf',
        docStatus: IDocumentStatus.APPROVED,
        doc: {
          url: '/uploads/thumbnail_3_B4_FD_42_E_954_F_45_C5_8_DEA_FAB_74_E301901_0d3b12fc48.jpg',
          mime: 'image/jpeg',
          id: 605,
          name: 'thumbnail_3B4FD42E-954F-45C5-8DEA-FAB74E301901.jpg',
          size: 11595,
        },
        docId: 605,
      },
    },
    jobDetails: {
      jobId: 'J101',
      location: 'New York',
    },
  },
  {
    id: 2,
    name: 'Sara Ali',
    date: new Date('2024-09-11'),
    url: null,
    time: new Date('2024-09-11T11:30:00'),
    status: ICandidateStatusEnum.pending,
    details: {
      name: 'Sara Ali',
      contactNumber: '9876543210',
      gender: 'Female',
      workStatus: 'Unemployed',
      resume: {
        docName: 'CV.pdf',
        docStatus: IDocumentStatus.APPROVED,
        doc: {
          url: '/uploads/thumbnail_3_B4_FD_42_E_954_F_45_C5_8_DEA_FAB_74_E301901_0d3b12fc48.jpg',
          mime: 'image/jpeg',
          id: 605,
          name: 'thumbnail_3B4FD42E-954F-45C5-8DEA-FAB74E301901.jpg',
          size: 11595,
        },
        docId: 605,
      },
    },
    jobDetails: {
      jobId: 'J102',
      location: 'San Francisco',
    },
  },
  {
    id: 3,
    name: 'John Doe',
    url: null,
    date: new Date('2024-09-12'),
    time: new Date('2024-09-12T09:00:00'),
    status: ICandidateStatusEnum.pending,
    details: {
      name: 'John Doe',
      contactNumber: '5432167890',
      gender: 'Male',
      workStatus: 'Employed',
      resume: {
        docName: 'CV.pdf',
        docStatus: IDocumentStatus.APPROVED,
        doc: {
          url: '/uploads/thumbnail_3_B4_FD_42_E_954_F_45_C5_8_DEA_FAB_74_E301901_0d3b12fc48.jpg',
          mime: 'image/jpeg',
          id: 605,
          name: 'thumbnail_3B4FD42E-954F-45C5-8DEA-FAB74E301901.jpg',
          size: 11595,
        },
        docId: 605,
      },
    },
    jobDetails: {
      jobId: 'J103',
      location: 'Los Angeles',
    },
  },
  {
    id: 4,
    name: 'Emily Davis',
    url: null,
    date: new Date('2024-09-13'),
    time: new Date('2024-09-13T14:45:00'),
    status: ICandidateStatusEnum.pending,
    details: {
      name: 'Emily Davis',
      contactNumber: '1122334455',
      gender: 'Female',
      workStatus: 'Freelancer',
      resume: {
        docName: 'CV.pdf',
        docStatus: IDocumentStatus.APPROVED,
        doc: {
          url: '/uploads/thumbnail_3_B4_FD_42_E_954_F_45_C5_8_DEA_FAB_74_E301901_0d3b12fc48.jpg',
          mime: 'image/jpeg',
          id: 605,
          name: 'thumbnail_3B4FD42E-954F-45C5-8DEA-FAB74E301901.jpg',
          size: 11595,
        },
        docId: 605,
      },
    },
    jobDetails: {
      jobId: 'J104',
      location: 'Chicago',
    },
  },
  {
    id: 5,
    name: 'Michael Brown',
    url: null,
    date: new Date('2024-09-14'),
    time: new Date('2024-09-14T16:00:00'),
    status: ICandidateStatusEnum.pending,
    details: {
      name: 'Michael Brown',
      contactNumber: '6677889900',
      gender: 'Male',
      workStatus: 'Unemployed',
      resume: {
        docName: 'CV.pdf',
        docStatus: IDocumentStatus.APPROVED,
        doc: {
          url: '/uploads/thumbnail_3_B4_FD_42_E_954_F_45_C5_8_DEA_FAB_74_E301901_0d3b12fc48.jpg',
          mime: 'image/jpeg',
          id: 605,
          name: 'thumbnail_3B4FD42E-954F-45C5-8DEA-FAB74E301901.jpg',
          size: 11595,
        },
        docId: 605,
      },
    },
    jobDetails: {
      jobId: 'J105',
      location: 'Austin',
    },
  },
];

export const CandidateListSelectedData: ICandidate[] = [
  {
    id: 1,
    name: 'Nusuf Khatri',
    url: 'https://placehold.co/600x400',
    date: new Date('2024-09-10'), // Specific date for example
    time: new Date('2024-09-10T10:00:00'), // Specific time for example
    status: ICandidateStatusEnum.selected,
    details: {
      name: 'Nusuf Khatri',
      contactNumber: '1234567890',
      gender: 'Male',
      workStatus: 'Employed',
      resume: {
        docName: 'CV.pdf',
        docStatus: IDocumentStatus.APPROVED,
        doc: {
          url: '/uploads/thumbnail_3_B4_FD_42_E_954_F_45_C5_8_DEA_FAB_74_E301901_0d3b12fc48.jpg',
          mime: 'image/jpeg',
          id: 605,
          name: 'thumbnail_3B4FD42E-954F-45C5-8DEA-FAB74E301901.jpg',
          size: 11595,
        },
        docId: 605,
      },
    },
    jobDetails: {
      jobId: 'J101',
      location: 'New York',
    },
  },
  {
    id: 2,
    name: 'Sara Ali',
    date: new Date('2024-09-11'),
    url: null,
    time: new Date('2024-09-11T11:30:00'),
    status: ICandidateStatusEnum.selected,
    details: {
      name: 'Sara Ali',
      contactNumber: '9876543210',
      gender: 'Female',
      workStatus: 'Unemployed',
      resume: {
        docName: 'CV.pdf',
        docStatus: IDocumentStatus.APPROVED,
        doc: {
          url: '/uploads/thumbnail_3_B4_FD_42_E_954_F_45_C5_8_DEA_FAB_74_E301901_0d3b12fc48.jpg',
          mime: 'image/jpeg',
          id: 605,
          name: 'thumbnail_3B4FD42E-954F-45C5-8DEA-FAB74E301901.jpg',
          size: 11595,
        },
        docId: 605,
      },
    },
    jobDetails: {
      jobId: 'J102',
      location: 'San Francisco',
    },
  },
  {
    id: 3,
    name: 'John Doe',
    url: null,
    date: new Date('2024-09-12'),
    time: new Date('2024-09-12T09:00:00'),
    status: ICandidateStatusEnum.selected,
    details: {
      name: 'John Doe',
      contactNumber: '5432167890',
      gender: 'Male',
      workStatus: 'Employed',
      resume: {
        docName: 'CV.pdf',
        docStatus: IDocumentStatus.APPROVED,
        doc: {
          url: '/uploads/thumbnail_3_B4_FD_42_E_954_F_45_C5_8_DEA_FAB_74_E301901_0d3b12fc48.jpg',
          mime: 'image/jpeg',
          id: 605,
          name: 'thumbnail_3B4FD42E-954F-45C5-8DEA-FAB74E301901.jpg',
          size: 11595,
        },
        docId: 605,
      },
    },
    jobDetails: {
      jobId: 'J103',
      location: 'Los Angeles',
    },
  },
  {
    id: 4,
    name: 'Emily Davis',
    url: null,
    date: new Date('2024-09-13'),
    time: new Date('2024-09-13T14:45:00'),
    status: ICandidateStatusEnum.selected,
    details: {
      name: 'Emily Davis',
      contactNumber: '1122334455',
      gender: 'Female',
      workStatus: 'Freelancer',
      resume: {
        docName: 'CV.pdf',
        docStatus: IDocumentStatus.APPROVED,
        doc: {
          url: '/uploads/thumbnail_3_B4_FD_42_E_954_F_45_C5_8_DEA_FAB_74_E301901_0d3b12fc48.jpg',
          mime: 'image/jpeg',
          id: 605,
          name: 'thumbnail_3B4FD42E-954F-45C5-8DEA-FAB74E301901.jpg',
          size: 11595,
        },
        docId: 605,
      },
    },
    jobDetails: {
      jobId: 'J104',
      location: 'Chicago',
    },
  },
  {
    id: 5,
    name: 'Michael Brown',
    url: null,
    date: new Date('2024-09-14'),
    time: new Date('2024-09-14T16:00:00'),
    status: ICandidateStatusEnum.selected,
    details: {
      name: 'Michael Brown',
      contactNumber: '6677889900',
      gender: 'Male',
      workStatus: 'Unemployed',
      resume: {
        docName: 'CV.pdf',
        docStatus: IDocumentStatus.APPROVED,
        doc: {
          url: '/uploads/thumbnail_3_B4_FD_42_E_954_F_45_C5_8_DEA_FAB_74_E301901_0d3b12fc48.jpg',
          mime: 'image/jpeg',
          id: 605,
          name: 'thumbnail_3B4FD42E-954F-45C5-8DEA-FAB74E301901.jpg',
          size: 11595,
        },
        docId: 605,
      },
    },
    jobDetails: {
      jobId: 'J105',
      location: 'Austin',
    },
  },
];

export const CandidateListDeclinedData: ICandidate[] = [
  {
    id: 1,
    name: 'Nusuf Khatri',
    url: 'https://placehold.co/600x400',
    date: new Date('2024-09-10'), // Specific date for example
    time: new Date('2024-09-10T10:00:00'), // Specific time for example
    status: ICandidateStatusEnum.declined,
    details: {
      name: 'Nusuf Khatri',
      contactNumber: '1234567890',
      gender: 'Male',
      workStatus: 'Employed',
      resume: {
        docName: 'CV.pdf',
        docStatus: IDocumentStatus.APPROVED,
        doc: {
          url: '/uploads/thumbnail_3_B4_FD_42_E_954_F_45_C5_8_DEA_FAB_74_E301901_0d3b12fc48.jpg',
          mime: 'image/jpeg',
          id: 605,
          name: 'thumbnail_3B4FD42E-954F-45C5-8DEA-FAB74E301901.jpg',
          size: 11595,
        },
        docId: 605,
      },
    },
    jobDetails: {
      jobId: 'J101',
      location: 'New York',
    },
  },
  {
    id: 2,
    name: 'Sara Ali',
    date: new Date('2024-09-11'),
    url: null,
    time: new Date('2024-09-11T11:30:00'),
    status: ICandidateStatusEnum.declined,
    details: {
      name: 'Sara Ali',
      contactNumber: '9876543210',
      gender: 'Female',
      workStatus: 'Unemployed',
      resume: {
        docName: 'CV.pdf',
        docStatus: IDocumentStatus.APPROVED,
        doc: {
          url: '/uploads/thumbnail_3_B4_FD_42_E_954_F_45_C5_8_DEA_FAB_74_E301901_0d3b12fc48.jpg',
          mime: 'image/jpeg',
          id: 605,
          name: 'thumbnail_3B4FD42E-954F-45C5-8DEA-FAB74E301901.jpg',
          size: 11595,
        },
        docId: 605,
      },
    },
    jobDetails: {
      jobId: 'J102',
      location: 'San Francisco',
    },
  },
  {
    id: 3,
    name: 'John Doe',
    url: null,
    date: new Date('2024-09-12'),
    time: new Date('2024-09-12T09:00:00'),
    status: ICandidateStatusEnum.declined,
    details: {
      name: 'John Doe',
      contactNumber: '5432167890',
      gender: 'Male',
      workStatus: 'Employed',
      resume: {
        docName: 'CV.pdf',
        docStatus: IDocumentStatus.APPROVED,
        doc: {
          url: '/uploads/thumbnail_3_B4_FD_42_E_954_F_45_C5_8_DEA_FAB_74_E301901_0d3b12fc48.jpg',
          mime: 'image/jpeg',
          id: 605,
          name: 'thumbnail_3B4FD42E-954F-45C5-8DEA-FAB74E301901.jpg',
          size: 11595,
        },
        docId: 605,
      },
    },
    jobDetails: {
      jobId: 'J103',
      location: 'Los Angeles',
    },
  },
  {
    id: 4,
    name: 'Emily Davis',
    url: null,
    date: new Date('2024-09-13'),
    time: new Date('2024-09-13T14:45:00'),
    status: ICandidateStatusEnum.declined,
    details: {
      name: 'Emily Davis',
      contactNumber: '1122334455',
      gender: 'Female',
      workStatus: 'Freelancer',
      resume: {
        docName: 'CV.pdf',
        docStatus: IDocumentStatus.APPROVED,
        doc: {
          url: '/uploads/thumbnail_3_B4_FD_42_E_954_F_45_C5_8_DEA_FAB_74_E301901_0d3b12fc48.jpg',
          mime: 'image/jpeg',
          id: 605,
          name: 'thumbnail_3B4FD42E-954F-45C5-8DEA-FAB74E301901.jpg',
          size: 11595,
        },
        docId: 605,
      },
    },
    jobDetails: {
      jobId: 'J104',
      location: 'Chicago',
    },
  },
  {
    id: 5,
    name: 'Michael Brown',
    url: null,
    date: new Date('2024-09-14'),
    time: new Date('2024-09-14T16:00:00'),
    status: ICandidateStatusEnum.declined,
    details: {
      name: 'Michael Brown',
      contactNumber: '6677889900',
      gender: 'Male',
      workStatus: 'Unemployed',
      resume: {
        docName: 'CV.pdf',
        docStatus: IDocumentStatus.APPROVED,
        doc: {
          url: '/uploads/thumbnail_3_B4_FD_42_E_954_F_45_C5_8_DEA_FAB_74_E301901_0d3b12fc48.jpg',
          mime: 'image/jpeg',
          id: 605,
          name: 'thumbnail_3B4FD42E-954F-45C5-8DEA-FAB74E301901.jpg',
          size: 11595,
        },
        docId: 605,
      },
    },
    jobDetails: {
      jobId: 'J105',
      location: 'Austin',
    },
  },
];

export const mockJobPostsLoading: any = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
];

export const userMockJobs = [
  {
    id: 1,
    title: 'Security Guard',
    banner: 'https://example.com/banner1.jpg',
    location: 'San Francisco, CA',
    companyName: 'Tech Innovators',
    jobPostDate: '2024-06-01',
    jobDate: '2024-06-15',
    jobStartTime: '2024-06-15T09:00:00',
    jobEndTime: '2024-06-15T17:00:00',
    postedTime: '2024-06-01T12:00:00',
    status: 1,
    event: 'Event',
  },
  {
    id: 2,
    title: 'Construction worker',
    banner: 'https://example.com/banner1.jpg',
    location: 'San Francisco, CA',
    companyName: 'Nice Construction & Co',
    jobPostDate: '2024-06-01',
    jobDate: '2024-06-16',
    jobStartTime: '2024-06-15T09:00:00',
    jobEndTime: '2024-06-15T17:00:00',
    postedTime: '2024-06-01T12:00:00',
    status: 1,
    event: 'Static',
  },
  {
    id: 3,
    title: 'Waiter',
    banner: 'https://example.com/banner1.jpg',
    location: 'San Francisco, CA',
    companyName: 'Tah Hotels',
    jobPostDate: '2024-06-01',
    jobDate: '2024-06-16',
    jobStartTime: '2024-06-15T09:00:00',
    jobEndTime: '2024-06-15T17:00:00',
    postedTime: '2024-06-01T12:00:00',
    status: 1,
    event: 'Static',
  },
  {
    id: 4,
    title: 'Construction worker',
    banner: 'https://example.com/banner1.jpg',
    location: 'San Francisco, CA',
    companyName: 'Nice Construction & Co',
    jobPostDate: '2024-06-01',
    jobDate: '2024-06-16',
    jobStartTime: '2024-06-15T09:00:00',
    jobEndTime: '2024-06-15T17:00:00',
    postedTime: '2024-06-01T12:00:00',
    status: 2,
    event: 'Static',
  },
  {
    id: 5,
    title: 'Waiter',
    banner: 'https://example.com/banner1.jpg',
    location: 'San Francisco, CA',
    companyName: 'Tah Hotels',
    jobPostDate: '2024-06-01',
    jobDate: '2024-06-16',
    jobStartTime: '2024-06-15T09:00:00',
    jobEndTime: '2024-06-15T17:00:00',
    postedTime: '2024-06-01T12:00:00',
    status: 2,
    event: 'Static',
  },
  {
    id: 6,
    title: 'Bouncer',
    banner: 'https://example.com/banner1.jpg',
    location: 'San Francisco, CA',
    companyName: 'Nice Construction & Co',
    jobPostDate: '2024-06-01',
    jobDate: '2024-06-16',
    jobStartTime: '2024-06-15T09:00:00',
    jobEndTime: '2024-06-15T17:00:00',
    postedTime: '2024-06-01T12:00:00',
    status: 3,
    event: 'Static',
  },
  {
    id: 7,
    title: 'Driver',
    banner: 'https://example.com/banner1.jpg',
    location: 'San Francisco, CA',
    companyName: 'Tah Hotels',
    jobPostDate: '2024-06-01',
    jobDate: '2024-06-16',
    jobStartTime: '2024-06-15T09:00:00',
    jobEndTime: '2024-06-15T17:00:00',
    postedTime: '2024-06-01T12:00:00',
    status: 3,
    event: 'Static',
  },
  {
    id: 8,
    title: 'Bouncer',
    banner: 'https://example.com/banner1.jpg',
    location: 'San Francisco, CA',
    companyName: 'Nice Construction & Co',
    jobPostDate: '2024-06-01',
    jobDate: '2024-06-16',
    jobStartTime: '2024-06-15T09:00:00',
    jobEndTime: '2024-06-15T17:00:00',
    postedTime: '2024-06-01T12:00:00',
    status: 4,
    event: 'Static',
  },
  {
    id: 9,
    title: 'Driver',
    banner: 'https://example.com/banner1.jpg',
    location: 'San Francisco, CA',
    companyName: 'Tah Hotels',
    jobPostDate: '2024-06-01',
    jobDate: '2024-06-16',
    jobStartTime: '2024-06-15T09:00:00',
    jobEndTime: '2024-06-15T17:00:00',
    postedTime: '2024-06-01T12:00:00',
    status: 4,
    event: 'Static',
  },
];

export const mockRecentSearches = [
  {
    id: 1,
    title: 'Warehouse Manager',
  },
  {
    id: 2,
    title: 'Purchase Manager',
  },
  {
    id: 2,
    title: 'Construction',
  },
];

export const mockJobTitles = [
  {id: 1, title: 'Cleaner'},
  {id: 2, title: 'Housekeeper'},
  {id: 3, title: 'Support Worker'},
  {id: 4, title: 'Clerk'},
  {id: 5, title: 'Utility Worker'},
  {id: 6, title: 'Site Clerical'},
  {id: 7, title: 'Nurse'},
  {id: 8, title: 'Part-Time Cleaner'},
  {id: 9, title: 'Cook'},
  {id: 10, title: 'Driver'},
  {id: 11, title: 'Sales Associate'},
  {id: 12, title: 'Data Entry'},
  {id: 13, title: 'Admin Assistant'},
  {id: 14, title: 'Warehouse Worker'},
  {id: 15, title: 'Labourer'},
  {id: 16, title: 'Receptionist'},
  {id: 17, title: 'Customer Service'},
  {id: 18, title: 'Bartender'},
  {id: 19, title: 'Cook'},
  {id: 20, title: 'Dishwasher'},
  {id: 21, title: 'Maintenance'},
  {id: 22, title: 'Cashier'},
  {id: 23, title: 'Stock Clerk'},
  {id: 24, title: 'Merchandiser'},
  {id: 25, title: 'Call Center Agent'},
  {id: 26, title: 'Support Worker'},
  {id: 27, title: 'Security Guard'},
  {id: 28, title: 'Event Staff'},
  {id: 29, title: 'Landscaper'},
  {id: 30, title: 'Farm Worker'},
  {id: 31, title: 'Lifeguard'},
  {id: 32, title: 'Parking Attendant'},
  {id: 33, title: 'Office Assistant'},
  {id: 34, title: 'Medical Assistant'},
  {id: 35, title: 'Retail Associate'},
  {id: 36, title: 'Factory Worker'},
  {id: 37, title: 'Packing Worker'},
  {id: 38, title: 'Housekeeper'},
  {id: 39, title: 'Grocery Clerk'},
  {id: 40, title: 'Host/Hostess'},
  {id: 41, title: 'Server'},
  {id: 42, title: 'Janitor'},
  {id: 43, title: 'Childcare Worker'},
  {id: 44, title: 'Painter'},
  {id: 45, title: 'Moving Helper'},
  {id: 46, title: 'Laborer'},
  {id: 47, title: 'Tutor'},
  {id: 48, title: 'Research Assistant'},
  {id: 49, title: 'Groundskeeper'},
  {id: 50, title: 'Food Worker'},
];

export const mockNotifications: INotification[] = [
  {
    title: 'Telus is hiring for the Senior and Junior Purchase Manager',
    icon: 'https://example.com/icon1.png',
    highlightText: 'Senior and Junior Purchase Manager',
    isRead: true,
    time: '2024-06-14T10:15:00Z',
    id: 20,
  },
  {
    title: 'Meeting with team at 3 PM',
    icon: 'https://example.com/icon2.png',
    highlightText: 'Meeting with team',
    isRead: false,
    time: '2024-06-13T15:00:00Z',
    id: 19,
  },
  {
    title: 'Code review for new feature',
    icon: 'https://example.com/icon3.png',
    highlightText: 'Code review',
    isRead: true,
    time: '2024-06-12T09:30:00Z',
    id: 18,
  },
  {
    title: 'Project deadline approaching',
    icon: 'https://example.com/icon4.png',
    highlightText: 'Project deadline',
    isRead: false,
    time: '2024-06-10T17:45:00Z',
    id: 17,
  },
  {
    title: 'Client feedback received',
    icon: 'https://example.com/icon5.png',
    highlightText: 'Client feedback',
    isRead: true,
    time: '2024-06-08T08:20:00Z',
    id: 16,
  },
  {
    title: 'New design mockups available',
    icon: 'https://example.com/icon6.png',
    highlightText: 'design mockups',
    isRead: false,
    time: '2024-06-07T14:10:00Z',
    id: 15,
  },
  {
    title: 'Budget review meeting',
    icon: 'https://example.com/icon7.png',
    highlightText: 'Budget review',
    isRead: true,
    time: '2024-06-06T11:00:00Z',
    id: 1,
  },
  {
    title: 'New policy updates',
    icon: 'https://example.com/icon8.png',
    highlightText: 'policy updates',
    isRead: false,
    time: '2024-06-04T16:30:00Z',
    id: 2,
  },
  {
    title: 'Weekly team sync',
    icon: 'https://example.com/icon9.png',
    highlightText: 'Weekly team sync',
    isRead: true,
    time: '2024-06-03T10:00:00Z',
    id: 3,
  },
  {
    title: 'New task assigned',
    icon: 'https://example.com/icon10.png',
    highlightText: 'New task',
    isRead: false,
    time: '2024-06-01T12:45:00Z',
    id: 4,
  },
  {
    title: 'System maintenance scheduled',
    icon: 'https://example.com/icon11.png',
    highlightText: 'System maintenance',
    isRead: true,
    time: '2024-05-30T22:15:00Z',
    id: 5,
  },
  {
    title: 'Performance review',
    icon: 'https://example.com/icon12.png',
    highlightText: 'Performance review',
    isRead: false,
    time: '2024-05-28T09:00:00Z',
    id: 6,
  },
  {
    title: 'Quarterly results announced',
    icon: 'https://example.com/icon13.png',
    highlightText: 'Quarterly results',
    isRead: true,
    time: '2024-05-25T18:40:00Z',
    id: 7,
  },
  {
    title: 'New software update',
    icon: 'https://example.com/icon14.png',
    highlightText: 'software update',
    isRead: false,
    time: '2024-05-22T14:20:00Z',
    id: 8,
  },
  {
    title: 'Company-wide meeting',
    icon: 'https://example.com/icon15.png',
    highlightText: 'Company-wide meeting',
    isRead: true,
    time: '2024-05-20T11:30:00Z',
    id: 9,
  },
  {
    title: 'Security alert',
    icon: 'https://example.com/icon16.png',
    highlightText: 'Security alert',
    isRead: false,
    time: '2024-05-18T08:55:00Z',
    id: 10,
  },
  {
    title: 'Holiday announcement',
    icon: 'https://example.com/icon17.png',
    highlightText: 'Holiday announcement',
    isRead: true,
    time: '2024-05-15T16:00:00Z',
    id: 11,
  },
  {
    title: 'New hire onboarding',
    icon: 'https://example.com/icon18.png',
    highlightText: 'New hire',
    isRead: false,
    time: '2024-05-12T10:10:00Z',
    id: 12,
  },
  {
    title: 'Performance bonus released',
    icon: 'https://example.com/icon19.png',
    highlightText: 'Performance bonus',
    isRead: true,
    time: '2024-05-10T13:50:00Z',
    id: 13,
  },
  {
    title: 'Annual company picnic',
    icon: 'https://example.com/icon20.png',
    highlightText: 'company picnic',
    isRead: false,
    time: '2024-05-05T09:30:00Z',
    id: 14,
  },
];

export const jobDescriptionMock =
  '<p>We are seeking a vigilant and responsible Security Guard to join our team. The ideal candidate will be dependable, possess excellent observational skills, and have a keen sense of responsibility.</p>';
export const jobRequirementsMock = `<ul>
    <li>Monitor and control access at building entrances and vehicle gates.</li>
    <li>Monitor surveillance cameras and alarm systems.</li>
    <li>Respond to alarms and investigate disturbances.</li>
    <li>Provide assistance and direction to employees and visitors.</li>
    <li>Report any suspicious activities, hazards, or unusual occurrences.</li>
    <li>Enforce company policies and procedures.</li>
    <li>Assist in emergency situations, including evacuations and medical emergencies.</li>
    <li>Collaborate with law enforcement and emergency services when required.</li>
</ul>
`;

export const requiredCertificatesMock = `
<ul>
    <li>High school diploma or equivalent.</li>
    <li>Valid Security Guard license (as per provincial regulations).</li>
    <li>Previous experience in security or a related field is preferred.</li>
    <li>Proficiency in English (both written and verbal).</li>
    <li>Good physical condition with the ability to walk and stand for extended periods.</li>
    <li>Ability to work in varying weather conditions.</li>
    <li>Ability to handle sensitive and confidential information with discretion.</li>
</ul>
`;

export const scheduledMockJobs: any[] = [
  {
    id: 1,
    title: 'Software Engineer',
    banner: 'https://example.com/banner1.jpg',
    location: 'San Francisco, CA',
    companyName: 'Tech Innovators',
    jobPostDate: '2024-06-01',
    jobDate: '2024-06-15',
    jobStartTime: '2024-06-15T09:00:00',
    jobEndTime: '2024-06-15T17:00:00',
    postedTime: '2024-06-01T12:00:00',
    status: 5,
    event: 'Event',
  },
  {
    id: 1,
    title: 'Software Engineer',
    banner: 'https://example.com/banner1.jpg',
    location: 'San Francisco, CA',
    companyName: 'Tech Innovators',
    jobPostDate: '2024-06-01',
    jobDate: '2024-06-15',
    jobStartTime: '2024-06-15T09:00:00',
    jobEndTime: '2024-06-15T17:00:00',
    postedTime: '2024-06-01T12:00:00',
    status: 6,
    event: 'Event',
  },
];

export const mockGenders = [
  {label: 'Male', value: 'Male'},
  {label: 'Female', value: 'Female'},
  {label: 'others', value: 'Others'},
];

export const eventTypesMock = [
  {label: 'Event', value: 'Event'},
  {label: 'Static', value: 'Static'},
];

export const genderPreferences = [
  {label: 'Male', value: 'Male'},
  {label: 'Female', value: 'Female'},
  {label: 'No Preference', value: 'No Preference'},
  {label: 'Other', value: 'Other'},
];

export const paymentSchedulesMockData = [
  {label: 'Hourly', value: 'Hourly'},
  {label: 'Daily', value: 'Daily'},
];

export const mockWorkStatus = [
  {label: STRINGS.fullTime, value: IWorkStatus.FULL_TIME},
  {label: STRINGS.partTime, value: IWorkStatus.PART_TIME},
];

export const provincesAndCities: IFilterSheet[] = [
  {
    id: 0,
    title: 'Popular Cities',
    value: [
      {id: 100, subTitle: 'Mohali', rowId: 0},
      {id: 1, subTitle: 'Toronto', rowId: 0},
      {id: 2, subTitle: 'Vancouver', rowId: 0},
      {id: 3, subTitle: 'Montreal', rowId: 0},
      {id: 4, subTitle: 'Calgary', rowId: 0},
      {id: 5, subTitle: 'Ottawa', rowId: 0},
    ],
  },
  {
    id: 1,
    title: 'Alberta',
    value: [
      {id: 6, subTitle: 'Calgary', rowId: 1},
      {id: 7, subTitle: 'Edmonton', rowId: 1},
      {id: 8, subTitle: 'Red Deer', rowId: 1},
      {id: 9, subTitle: 'Lethbridge', rowId: 1},
      {id: 10, subTitle: 'St. Albert', rowId: 1},
    ],
  },
  {
    id: 7,
    title: 'British Columbia',
    value: [
      {id: 11, subTitle: 'Vancouver', rowId: 7},
      {id: 12, subTitle: 'Victoria', rowId: 7},
      {id: 13, subTitle: 'Surrey', rowId: 7},
      {id: 14, subTitle: 'Burnaby', rowId: 7},
      {id: 15, subTitle: 'Richmond', rowId: 7},
    ],
  },
  {
    id: 13,
    title: 'Manitoba',
    value: [
      {id: 16, subTitle: 'Winnipeg', rowId: 13},
      {id: 17, subTitle: 'Brandon', rowId: 13},
      {id: 18, subTitle: 'Steinbach', rowId: 13},
      {id: 19, subTitle: 'Thompson', rowId: 13},
      {id: 20, subTitle: 'Portage la Prairie', rowId: 13},
    ],
  },
  {
    id: 19,
    title: 'New Brunswick',
    value: [
      {id: 21, subTitle: 'Fredericton', rowId: 19},
      {id: 22, subTitle: 'Moncton', rowId: 19},
      {id: 23, subTitle: 'Saint John', rowId: 19},
      {id: 24, subTitle: 'Miramichi', rowId: 19},
      {id: 25, subTitle: 'Bathurst', rowId: 19},
    ],
  },
  {
    id: 25,
    title: 'Newfoundland and Labrador',
    value: [
      {id: 26, subTitle: "St. John's", rowId: 25},
      {id: 27, subTitle: 'Mount Pearl', rowId: 25},
      {id: 28, subTitle: 'Corner Brook', rowId: 25},
      {id: 29, subTitle: 'Gander', rowId: 25},
      {id: 30, subTitle: 'Grand Falls-Windsor', rowId: 25},
    ],
  },
  {
    id: 31,
    title: 'Nova Scotia',
    value: [
      {id: 32, subTitle: 'Halifax', rowId: 31},
      {id: 33, subTitle: 'Sydney', rowId: 31},
      {id: 34, subTitle: 'Truro', rowId: 31},
      {id: 35, subTitle: 'New Glasgow', rowId: 31},
      {id: 36, subTitle: 'Glace Bay', rowId: 31},
    ],
  },
  {
    id: 37,
    title: 'Ontario',
    value: [
      {id: 38, subTitle: 'Toronto', rowId: 37},
      {id: 39, subTitle: 'Ottawa', rowId: 37},
      {id: 40, subTitle: 'Mississauga', rowId: 37},
      {id: 41, subTitle: 'Brampton', rowId: 37},
      {id: 42, subTitle: 'Hamilton', rowId: 37},
    ],
  },
  {
    id: 43,
    title: 'Prince Edward Island',
    value: [
      {id: 44, subTitle: 'Charlottetown', rowId: 43},
      {id: 45, subTitle: 'Summerside', rowId: 43},
      {id: 46, subTitle: 'Stratford', rowId: 43},
      {id: 47, subTitle: 'Cornwall', rowId: 43},
    ],
  },
  {
    id: 48,
    title: 'Quebec',
    value: [
      {id: 49, subTitle: 'Montreal', rowId: 48},
      {id: 50, subTitle: 'Quebec City', rowId: 48},
      {id: 51, subTitle: 'Laval', rowId: 48},
      {id: 52, subTitle: 'Gatineau', rowId: 48},
      {id: 53, subTitle: 'Longueuil', rowId: 48},
    ],
  },
  {
    id: 54,
    title: 'Saskatchewan',
    value: [
      {id: 55, subTitle: 'Saskatoon', rowId: 54},
      {id: 56, subTitle: 'Regina', rowId: 54},
      {id: 57, subTitle: 'Prince Albert', rowId: 54},
      {id: 58, subTitle: 'Moose Jaw', rowId: 54},
      {id: 59, subTitle: 'Yorkton', rowId: 54},
    ],
  },
  {
    id: 60,
    title: 'Northwest Territories',
    value: [
      {id: 61, subTitle: 'Yellowknife', rowId: 60},
      {id: 62, subTitle: 'Hay River', rowId: 60},
      {id: 63, subTitle: 'Inuvik', rowId: 60},
      {id: 64, subTitle: 'Fort Smith', rowId: 60},
      {id: 65, subTitle: 'Behchokǫ̀', rowId: 60},
    ],
  },
  {
    id: 66,
    title: 'Nunavut',
    value: [
      {id: 67, subTitle: 'Iqaluit', rowId: 66},
      {id: 68, subTitle: 'Rankin Inlet', rowId: 66},
      {id: 69, subTitle: 'Arviat', rowId: 66},
      {id: 70, subTitle: 'Baker Lake', rowId: 66},
      {id: 71, subTitle: 'Pond Inlet', rowId: 66},
    ],
  },
  {
    id: 72,
    title: 'Yukon',
    value: [
      {id: 73, subTitle: 'Whitehorse', rowId: 72},
      {id: 74, subTitle: 'Dawson City', rowId: 72},
      {id: 75, subTitle: 'Watson Lake', rowId: 72},
      {id: 76, subTitle: 'Haines Junction', rowId: 72},
      {id: 77, subTitle: 'Carcross', rowId: 72},
    ],
  },
];

export const nyDocuments = [
  {
    id: 1,
    value: 'Sin document',
  },
  {
    id: 2,
    value: 'Govt IDs',
  },
  {
    id: 3,
    value: 'Document (PR card, Permit)',
  },
  {
    id: 4,
    value: 'Licenses/certificates',
  },
  {
    id: 5,
    value: 'Resume',
  },
  {
    id: 6,
    value: 'Bank details',
  },
  {
    id: 7,
    value: 'Other',
  },
];

export const companyDetails: ICompanyDetails[] = [
  {
    name: 'Tech Innovators Inc.',
    contactNumber: '123-456-7890',
    companyEmail: 'contact@techinnovators.com',
    address: '123 Innovation Drive, Silicon Valley, CA 94025',
    location: 'Silicon Valley, CA',
    industry: 'Technology',
    poster: 'https://picsum.photos/200/300',
  },
  {
    name: 'Health Solutions Ltd.',
    contactNumber: '234-567-8901',
    companyEmail: 'info@healthsolutions.com',
    address: '456 Wellness Ave, New York, NY 10001',
    location: 'New York, NY',
    industry: 'Healthcare',
    poster: 'https://picsum.photos/200/300',
  },
  {
    name: 'Green Energy Corp.',
    contactNumber: '345-678-9012',
    companyEmail: 'support@greenenergy.com',
    address: '789 Renewable St, Austin, TX 73301',
    location: 'Austin, TX',
    industry: 'Energy',
    poster: 'https://picsum.photos/200/300',
  },
  {
    name: 'EduTech Global',
    contactNumber: '456-789-0123',
    companyEmail: 'contact@edutechglobal.com',
    address: '101 Learning Blvd, Boston, MA 02115',
    location: 'Boston, MA',
    industry: 'Education',
    poster: 'https://picsum.photos/200/300',
  },
  {
    name: 'Finance Wizards LLC',
    contactNumber: '567-890-1234',
    companyEmail: 'info@financewizards.com',
    address: '202 Money Lane, Chicago, IL 60606',
    location: 'Chicago, IL',
    industry: 'Finance',
    poster: 'https://picsum.photos/200/300',
  },
  {
    name: 'Creative Designs Studio',
    contactNumber: '678-901-2345',
    companyEmail: 'support@creativedesigns.com',
    address: '303 Art St, Los Angeles, CA 90001',
    location: 'Los Angeles, CA',
    industry: 'Design',
    poster: 'https://picsum.photos/200/300',
  },
  {
    name: 'Foodies Paradise Co.',
    contactNumber: '789-012-3456',
    companyEmail: 'contact@foodiesparadise.com',
    address: '404 Culinary Ave, San Francisco, CA 94101',
    location: 'San Francisco, CA',
    industry: 'Food & Beverage',
    poster: 'https://picsum.photos/200/300',
  },
  {
    name: 'Logistics Experts Ltd.',
    contactNumber: '890-123-4567',
    companyEmail: 'info@logisticsexperts.com',
    address: '505 Transport Rd, Miami, FL 33101',
    location: 'Miami, FL',
    industry: 'Logistics',
    poster: 'https://picsum.photos/200/300',
  },
  {
    name: 'Retail Hub Inc.',
    contactNumber: '901-234-5678',
    companyEmail: 'support@retailhub.com',
    address: '606 Shopping Blvd, Dallas, TX 75201',
    location: 'Dallas, TX',
    industry: 'Retail',
    poster: 'https://picsum.photos/200/300',
  },
  {
    name: 'Media Visionaries',
    contactNumber: '012-345-6789',
    companyEmail: 'contact@mediavisionaries.com',
    address: '707 Broadcast Lane, Atlanta, GA 30301',
    location: 'Atlanta, GA',
    industry: 'Media',
    poster: 'https://picsum.photos/200/300',
  },
];

export const mockJobPosts: any[] = [
  {
    id: 1,
    positionName: 'Software Engineer',
    banner: 'https://example.com/banner1.jpg',
    postedBy: 'TechCorp',
    applicants: 120,
    event: 'Event',
    requiredCandidates: 5,
    yearOfExperienceLower: 2,
    yearOfExperienceHigher: 5,
    jobStartDate: '2024-09-01T09:00:00Z',
    jobEndDate: '2024-09-30T17:00:00Z',
    jobStartTime: '2024-09-01T09:00:00Z',
    postedTime: '2024-09-30T17:00:00Z',
    jobEndTime: '2024-09-01T17:00:00Z',
    gender: 'Any',
    jobDescription:
      'Responsible for developing and maintaining web applications.',
    location: 'San Francisco, CA',

    jobDetails:
      ' Develop web applications, collaborate with teams, maintain code quality',
    requiredCertificates: [''],
    status: 1,
  },
  {
    id: 2,
    positionName: 'Software Engineer',
    banner: 'https://example.com/banner1.jpg',
    postedBy: 'TechCorp',
    applicants: 120,
    event: 'Event',
    requiredCandidates: 5,
    yearOfExperienceLower: 2,
    yearOfExperienceHigher: 5,
    jobStartDate: '2024-09-01T09:00:00Z',
    jobEndDate: '2024-09-30T17:00:00Z',
    jobStartTime: '2024-09-01T09:00:00Z',
    jobEndTime: '2024-09-01T17:00:00Z',
    gender: 'Any',
    jobDescription:
      'Responsible for developing and maintaining web applications.',
    location: 'San Francisco, CA',

    jobDetails:
      ' Develop web applications, collaborate with teams, maintain code quality',
    requiredCertificates: [''],
    status: 1,
    postedTime: null,
  },
  {
    id: 3,
    positionName: 'Software Engineer',
    banner: 'https://example.com/banner1.jpg',
    postedBy: 'TechCorp',
    applicants: 120,
    event: 'Event',
    requiredCandidates: 5,
    yearOfExperienceLower: 2,
    yearOfExperienceHigher: 5,
    jobStartDate: '2024-09-01T09:00:00Z',
    jobEndDate: '2024-09-30T17:00:00Z',
    jobStartTime: '2024-09-01T09:00:00Z',
    jobEndTime: '2024-09-01T17:00:00Z',
    gender: 'Any',
    jobDescription:
      'Responsible for developing and maintaining web applications.',
    location: 'San Francisco, CA',

    jobDetails:
      ' Develop web applications, collaborate with teams, maintain code quality',
    requiredCertificates: [''],
    status: 1,
    postedTime: null,
  },
  {
    id: 4,
    positionName: 'Software Engineer',
    banner: 'https://example.com/banner1.jpg',
    postedBy: 'TechCorp',
    applicants: 120,
    event: 'Event',
    requiredCandidates: 5,
    yearOfExperienceLower: 2,
    yearOfExperienceHigher: 5,
    jobStartDate: '2024-09-01T09:00:00Z',
    jobEndDate: '2024-09-30T17:00:00Z',
    jobStartTime: '2024-09-01T09:00:00Z',
    jobEndTime: '2024-09-01T17:00:00Z',
    gender: 'Any',
    jobDescription:
      'Responsible for developing and maintaining web applications.',
    location: 'San Francisco, CA',
    postedTime: '2024-09-30T17:00:00Z',
    jobDetails:
      ' Develop web applications, collaborate with teams, maintain code quality',
    requiredCertificates: [''],
    status: 1,
  },
  {
    id: 5,
    positionName: 'Software Engineer',
    banner: 'https://example.com/banner1.jpg',
    postedBy: 'TechCorp',
    applicants: 120,
    event: 'Event',
    requiredCandidates: 5,
    yearOfExperienceLower: 2,
    yearOfExperienceHigher: 5,
    jobStartDate: '2024-09-01T09:00:00Z',
    postedTime: '2024-09-30T17:00:00Z',
    jobEndDate: '2024-09-30T17:00:00Z',
    jobStartTime: '2024-09-01T09:00:00Z',
    jobEndTime: '2024-09-01T17:00:00Z',
    gender: 'Any',
    jobDescription:
      'Responsible for developing and maintaining web applications.',
    location: 'San Francisco, CA',

    jobDetails:
      ' Develop web applications, collaborate with teams, maintain code quality',
    requiredCertificates: [''],
    status: 1,
  },
];

export const HomeFilters: IFilterSheet[] = [
  {
    id: 1,
    title: STRINGS.job_type,
    value: [
      {
        id: 2,
        subTitle: STRINGS.event,
        rowId: 1,
      },
      {
        id: 3,
        subTitle: STRINGS.static,
        rowId: 1,
      },
    ],
  },
  {
    id: 4,
    title: STRINGS.date,
    value: [
      {
        id: 5,
        subTitle: STRINGS.today,
        rowId: 4,
      },

      {
        id: 6,
        subTitle: STRINGS.tomorrow,
        rowId: 4,
      },
      {
        id: 7,
        subTitle: STRINGS.this_Week,
        rowId: 4,
      },
      {
        id: 8,
        subTitle: STRINGS.this_month,
        rowId: 4,
      },
      {
        id: 9,
        subTitle: STRINGS.customDate,
        rowId: 4,
      },
    ],
  },
];

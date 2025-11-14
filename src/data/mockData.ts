import { Endorsement, WorkReport } from '../types';

export const mockEndorsements: Endorsement[] = [
  {
    id: 'end-1',
    studentId: '1',
    studentNo: '22012345',
    studentName: 'John Chan',
    major: 'Computer Science',
    jobTitle: 'Software Engineering Intern',
    company: 'Tech Solutions Ltd',
    department: 'Engineering',
    companyAddress: '123 Innovation Street, Hong Kong',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    employmentType: 'full-time',
    salary: 'HKD 15,000/month',
    supervisorName: 'Ms. Emily Li',
    supervisorPosition: 'Senior Engineering Manager',
    supervisorEmail: 'emily.li@techsolutions.com',
    supervisorPhone: '+852 9876 5432',
    status: 'approved',
    submittedDate: '2025-05-15',
    lastActionDate: '2025-05-20',
    feedback: 'Application approved. Well-documented internship opportunity.',
    documents: ['internship_letter.pdf', 'company_info.pdf'],
    history: [
      {
        id: 'h1',
        action: 'Submitted',
        performedBy: 'John Chan',
        timestamp: '2025-05-15 10:30 AM'
      },
      {
        id: 'h2',
        action: 'Approved',
        performedBy: 'Dr. Sarah Wong',
        timestamp: '2025-05-20 02:15 PM',
        comments: 'Application approved. Well-documented internship opportunity.'
      }
    ]
  },
  {
    id: 'end-2',
    studentId: '1',
    studentNo: '22012345',
    studentName: 'John Chan',
    major: 'Computer Science',
    jobTitle: 'Data Analyst Intern',
    company: 'Analytics Corp',
    department: 'Data Science',
    companyAddress: '456 Data Street, Kowloon',
    startDate: '2025-09-01',
    endDate: '2025-11-30',
    employmentType: 'part-time',
    salary: 'HKD 8,000/month',
    supervisorName: 'Mr. David Wong',
    supervisorPosition: 'Data Team Lead',
    supervisorEmail: 'david.wong@analyticscorp.com',
    supervisorPhone: '+852 9123 4567',
    status: 'pending_resubmission',
    submittedDate: '2025-10-10',
    lastActionDate: '2025-10-25',
    feedback: 'Please provide more details about your specific responsibilities and learning objectives. Also, the company information document is missing.',
    documents: ['internship_offer.pdf'],
    history: [
      {
        id: 'h3',
        action: 'Submitted',
        performedBy: 'John Chan',
        timestamp: '2025-10-10 09:00 AM'
      },
      {
        id: 'h4',
        action: 'Requested Resubmission',
        performedBy: 'Dr. Sarah Wong',
        timestamp: '2025-10-25 11:30 AM',
        comments: 'Please provide more details about your specific responsibilities and learning objectives.'
      }
    ]
  }
];

export const mockReports: WorkReport[] = [
  {
    id: 'rep-1',
    studentId: '1',
    studentNo: '22012345',
    studentName: 'John Chan',
    major: 'Computer Science',
    jobTitle: 'Software Engineering Intern',
    company: 'Tech Solutions Ltd',
    period: 'June 2025 - August 2025',
    selfReflection: 'During my internship at Tech Solutions Ltd, I had the opportunity to work on several key projects that enhanced my technical skills and professional development. I contributed to the development of a customer management system using React and Node.js, which taught me valuable lessons about full-stack development and agile methodologies. The experience also helped me improve my communication skills through daily stand-ups and client presentations.',
    status: 'accepted',
    submittedDate: '2025-09-05',
    lastActionDate: '2025-09-10',
    feedback: 'Excellent reflection demonstrating clear learning outcomes and professional growth.',
    documents: ['work_report.pdf', 'internship_photos.pdf', 'supervisor_evaluation.pdf'],
    history: [
      {
        id: 'h5',
        action: 'Submitted',
        performedBy: 'John Chan',
        timestamp: '2025-09-05 03:00 PM'
      },
      {
        id: 'h6',
        action: 'Reviewed',
        performedBy: 'Dr. Sarah Wong',
        timestamp: '2025-09-08 10:00 AM',
        comments: 'Good work. Please add more specific examples of your contributions.'
      },
      {
        id: 'h7',
        action: 'Accepted',
        performedBy: 'Dr. Sarah Wong',
        timestamp: '2025-09-10 02:30 PM',
        comments: 'Excellent reflection demonstrating clear learning outcomes and professional growth.'
      }
    ]
  }
];

// Mock data for staff view - multiple students
export const mockAllEndorsements: Endorsement[] = [
  ...mockEndorsements,
  {
    id: 'end-3',
    studentId: '2',
    studentNo: '22012346',
    studentName: 'Mary Lam',
    major: 'Business Administration',
    jobTitle: 'Marketing Intern',
    company: 'Marketing Plus',
    department: 'Digital Marketing',
    companyAddress: '789 Marketing Road, Hong Kong',
    startDate: '2025-06-15',
    endDate: '2025-09-15',
    employmentType: 'full-time',
    salary: 'HKD 12,000/month',
    supervisorName: 'Mr. Kevin Chow',
    supervisorPosition: 'Marketing Director',
    supervisorEmail: 'kevin@marketingplus.com',
    supervisorPhone: '+852 9999 8888',
    status: 'pending_approval',
    submittedDate: '2025-10-28',
    lastActionDate: '2025-10-28',
    documents: ['offer_letter.pdf'],
    history: [
      {
        id: 'h8',
        action: 'Submitted',
        performedBy: 'Mary Lam',
        timestamp: '2025-10-28 04:45 PM'
      }
    ]
  },
  {
    id: 'end-4',
    studentId: '3',
    studentNo: '22012347',
    studentName: 'Peter Ng',
    major: 'Computer Science',
    jobTitle: 'UI/UX Designer Intern',
    company: 'Design Studio HK',
    department: 'Design',
    companyAddress: '321 Creative Lane, Kowloon',
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    employmentType: 'full-time',
    salary: 'HKD 14,000/month',
    supervisorName: 'Ms. Alice Cheung',
    supervisorPosition: 'Creative Director',
    supervisorEmail: 'alice@designstudio.hk',
    supervisorPhone: '+852 8888 7777',
    status: 'disapproved',
    submittedDate: '2025-10-20',
    lastActionDate: '2025-10-26',
    feedback: 'The internship does not align with your program requirements. Please ensure the role includes sufficient technical components related to your major.',
    documents: ['internship_contract.pdf'],
    history: [
      {
        id: 'h9',
        action: 'Submitted',
        performedBy: 'Peter Ng',
        timestamp: '2025-10-20 11:00 AM'
      },
      {
        id: 'h10',
        action: 'Disapproved',
        performedBy: 'Dr. Sarah Wong',
        timestamp: '2025-10-26 09:30 AM',
        comments: 'The internship does not align with your program requirements.'
      }
    ]
  }
];

export const mockAllReports: WorkReport[] = [
  ...mockReports,
  {
    id: 'rep-2',
    studentId: '2',
    studentNo: '22012346',
    studentName: 'Mary Lam',
    major: 'Business Administration',
    jobTitle: 'Marketing Intern',
    company: 'Marketing Plus',
    period: 'June 2025 - September 2025',
    selfReflection: 'My internship at Marketing Plus provided hands-on experience in digital marketing strategies.',
    status: 'pending_assessment',
    submittedDate: '2025-10-29',
    lastActionDate: '2025-10-29',
    documents: ['report.pdf'],
    history: [
      {
        id: 'h11',
        action: 'Submitted',
        performedBy: 'Mary Lam',
        timestamp: '2025-10-29 01:00 PM'
      }
    ]
  }
];

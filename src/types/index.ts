import { Status } from '../components/shared/StatusBadge';

export interface Endorsement {
  id: string;
  studentId: string;
  studentNo: string;
  studentName: string;
  major: string;
  jobTitle: string;
  company: string;
  department: string;
  companyAddress: string;
  startDate: string;
  endDate: string;
  employmentType: 'full-time' | 'part-time';
  salary: string;
  supervisorName: string;
  supervisorPosition: string;
  supervisorEmail: string;
  supervisorPhone: string;
  status: Extract<Status, 'pending_approval' | 'approved' | 'disapproved' | 'pending_resubmission'>;
  submittedDate: string;
  lastActionDate: string;
  feedback?: string;
  documents: string[];
  history: HistoryEntry[];
  evaluationToken?: string;
  evaluationSentDate?: string;
  evaluationSubmittedDate?: string;
  evaluationRemindersSent?: number;
}

export interface WorkReport {
  id: string;
  studentId: string;
  studentNo: string;
  studentName: string;
  major: string;
  jobTitle: string;
  company: string;
  period: string;
  selfReflection: string;
  status: Extract<Status, 'pending_assessment' | 'reviewed' | 'accepted' | 'rejected' | 'pending_resubmission'>;
  submittedDate: string;
  lastActionDate: string;
  feedback?: string;
  documents: string[];
  history: HistoryEntry[];
}

export interface HistoryEntry {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  comments?: string;
}

export interface EmployerEvaluation {
  id: string;
  endorsementId: string;
  studentNo: string;
  studentName: string;
  jobTitle: string;
  company: string;
  supervisorName: string;
  supervisorEmail: string;
  submittedDate?: string;
  
  // Evaluation ratings (1-5 scale)
  technicalSkills: number;
  communicationSkills: number;
  teamwork: number;
  problemSolving: number;
  workEthic: number;
  adaptability: number;
  initiative: number;
  overallPerformance: number;
  
  // Comments
  strengths: string;
  areasForImprovement: string;
  additionalComments: string;
  
  // Would hire again
  wouldHireAgain: 'yes' | 'no' | 'maybe';
  
  // Recommendation
  wouldRecommend: boolean;
}

export interface EvaluationDraft {
  token: string;
  endorsementId: string;
  ratings: {
    technicalSkills: number;
    communicationSkills: number;
    teamwork: number;
    problemSolving: number;
    workEthic: number;
    adaptability: number;
    initiative: number;
    overallPerformance: number;
  };
  comments: {
    strengths: string;
    areasForImprovement: string;
    additionalComments: string;
  };
  wouldHireAgain: 'yes' | 'no' | 'maybe';
  wouldRecommend: boolean;
  savedAt: string;
}
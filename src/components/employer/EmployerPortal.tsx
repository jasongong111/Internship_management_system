import { useState, useEffect } from "react";
import { EmployerEvaluationForm } from "./EmployerEvaluationForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, Clock } from "lucide-react";
import { EmployerEvaluation, Endorsement } from "../../types";

interface EmployerPortalProps {
  evaluationToken: string;
}

// Mock data - In production, this would fetch from backend using the token
const getMockEndorsementByToken = (token: string): Endorsement | null => {
  // Simulate different scenarios based on token
  if (token === "invalid") return null;
  
  if (token === "submitted") {
    return {
      id: "END-001",
      studentId: "1",
      studentNo: "22012345",
      studentName: "John Chan",
      major: "Computer Science",
      jobTitle: "Software Engineering Intern",
      company: "Tech Solutions Ltd",
      department: "Development",
      companyAddress: "123 Tech Street, Hong Kong",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      employmentType: "full-time",
      salary: "15000",
      supervisorName: "Ms. Sarah Wong",
      supervisorPosition: "Senior Developer",
      supervisorEmail: "sarah.wong@techsolutions.com",
      supervisorPhone: "9123-4567",
      status: "approved",
      submittedDate: "2024-05-15",
      lastActionDate: "2024-05-20",
      documents: [],
      history: [],
      evaluationToken: token,
      evaluationSentDate: "2024-09-01",
      evaluationSubmittedDate: "2024-09-05",
      evaluationRemindersSent: 0,
    };
  }

  if (token === "expired") {
    return {
      id: "END-002",
      studentId: "2",
      studentNo: "22012346",
      studentName: "Mary Lam",
      major: "Business Administration",
      jobTitle: "Marketing Intern",
      company: "Marketing Pro Ltd",
      department: "Marketing",
      companyAddress: "456 Business Road, Hong Kong",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      employmentType: "full-time",
      salary: "12000",
      supervisorName: "Mr. David Lee",
      supervisorPosition: "Marketing Manager",
      supervisorEmail: "david.lee@marketingpro.com",
      supervisorPhone: "9234-5678",
      status: "approved",
      submittedDate: "2023-12-10",
      lastActionDate: "2023-12-15",
      documents: [],
      history: [],
      evaluationToken: token,
      evaluationSentDate: "2024-04-01",
      evaluationRemindersSent: 3,
    };
  }

  // Default valid token
  return {
    id: "END-003",
    studentId: "3",
    studentNo: "22012347",
    studentName: "Peter Wong",
    major: "Computer Science",
    jobTitle: "Data Analyst Intern",
    company: "Data Insights Corp",
    department: "Analytics",
    companyAddress: "789 Data Avenue, Hong Kong",
    startDate: "2024-09-01",
    endDate: "2024-11-30",
    employmentType: "full-time",
    salary: "14000",
    supervisorName: "Dr. Lisa Chen",
    supervisorPosition: "Analytics Director",
    supervisorEmail: "lisa.chen@datainsights.com",
    supervisorPhone: "9345-6789",
    status: "approved",
    submittedDate: "2024-08-20",
    lastActionDate: "2024-08-25",
    documents: [],
    history: [],
    evaluationToken: token,
    evaluationSentDate: "2024-12-01",
    evaluationRemindersSent: 0,
  };
};

export function EmployerPortal({ evaluationToken }: EmployerPortalProps) {
  const [endorsement, setEndorsement] = useState<Endorsement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to validate token and fetch endorsement
    const fetchEndorsement = async () => {
      try {
        setLoading(true);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const data = getMockEndorsementByToken(evaluationToken);
        
        if (!data) {
          setError("Invalid evaluation link. Please check your email for the correct link.");
          return;
        }

        if (data.evaluationSubmittedDate) {
          setError("This evaluation has already been submitted. Thank you for your participation.");
          return;
        }

        // Check if evaluation period has expired (more than 30 days since end date)
        const endDate = new Date(data.endDate);
        const today = new Date();
        const daysSinceEnd = Math.floor((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceEnd > 60) {
          setError("This evaluation link has expired. Please contact the academic coordinator if you need assistance.");
          return;
        }

        setEndorsement(data);
      } catch (err) {
        setError("An error occurred while loading the evaluation form. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEndorsement();
  }, [evaluationToken]);

  const handleSubmit = async (evaluation: Omit<EmployerEvaluation, 'id' | 'submittedDate'>) => {
    try {
      // In production, this would send the evaluation to the backend
      console.log("Submitting evaluation:", evaluation);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // The EmployerEvaluationForm component handles the success UI
    } catch (err) {
      setError("Failed to submit evaluation. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-[#003366] mx-auto mb-4 animate-pulse" />
            <CardTitle className="text-[#003366] text-lg sm:text-xl">Loading Evaluation Form</CardTitle>
            <CardDescription className="text-sm sm:text-base">Please wait while we verify your access...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="bg-[#003366] text-white py-4 sm:py-6 shadow-lg">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl sm:text-3xl">Internship Student Evaluation</h1>
            <p className="text-xs sm:text-sm text-blue-200 mt-1">Hong Kong Baptist University</p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 sm:py-8 flex items-center justify-center min-h-[70vh]">
          <Card className="max-w-2xl w-full mx-4">
            <CardHeader>
              <div className="flex items-center gap-3 text-red-600">
                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
                <CardTitle className="text-lg sm:text-xl">Unable to Access Evaluation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertDescription className="text-sm sm:text-base">
                  {error}
                </AlertDescription>
              </Alert>
              
              <div className="mt-6 bg-gray-50 rounded-lg p-3 sm:p-4">
                <p className="text-sm sm:text-base text-gray-700 mb-2">
                  <strong>If you continue to experience issues:</strong>
                </p>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Ensure you are using the most recent link from your email</li>
                  <li>Check that the entire link was copied correctly</li>
                  <li>Contact the HKBU Internship Office for assistance</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!endorsement) {
    return null;
  }

  return (
    <EmployerEvaluationForm
      studentName={endorsement.studentName}
      studentNo={endorsement.studentNo}
      jobTitle={endorsement.jobTitle}
      company={endorsement.company}
      supervisorName={endorsement.supervisorName}
      supervisorEmail={endorsement.supervisorEmail}
      endorsementId={endorsement.id}
      onSubmit={handleSubmit}
    />
  );
}
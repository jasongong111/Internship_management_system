import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { User } from "../../App";
import { EmployerEvaluation } from "../../types";
import { CheckCircle2, Clock, Eye, Building2, Calendar } from "lucide-react";
import { getEvaluationsByStudentNo } from "../../utils/evaluationStorage";

// Mock evaluations data - In production, this would come from API
const defaultMockEvaluations: EmployerEvaluation[] = [
  {
    id: "eval-1",
    endorsementId: "END-001",
    studentNo: "22012345",
    studentName: "John Chan",
    jobTitle: "Software Engineering Intern",
    company: "Tech Solutions Ltd",
    supervisorName: "Ms. Sarah Wong",
    supervisorEmail: "sarah.wong@techsolutions.com",
    submittedDate: "2025-09-05",
    technicalSkills: 5,
    communicationSkills: 4,
    teamwork: 5,
    problemSolving: 4,
    workEthic: 5,
    adaptability: 4,
    initiative: 5,
    overallPerformance: 5,
    strengths: "Excellent technical skills and strong work ethic. Very proactive and always willing to help team members.",
    areasForImprovement: "Could improve on presentation skills and public speaking confidence.",
    additionalComments: "Highly recommend for future positions. Would definitely hire again.",
    wouldHireAgain: "yes",
    wouldRecommend: true,
  },
];

const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

interface EvaluationListProps {
  user: User;
}

export function EvaluationList({ user }: EvaluationListProps) {
  const [selectedEvaluation, setSelectedEvaluation] = useState<EmployerEvaluation | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [evaluations, setEvaluations] = useState<EmployerEvaluation[]>(defaultMockEvaluations);
  const [loading, setLoading] = useState(true);

  // Load evaluations for current student
  useEffect(() => {
    const loadEvaluations = async () => {
      try {
        setLoading(true);
        const studentEvals = await getEvaluationsByStudentNo(user.studentNo || '');
        // Merge with default mock data for demo purposes
        const allEvals = [...defaultMockEvaluations, ...studentEvals];
        // Remove duplicates based on endorsementId
        const uniqueEvals = Array.from(
          new Map(allEvals.map(evaluation => [evaluation.endorsementId, evaluation])).values()
        );
        setEvaluations(uniqueEvals);
      } catch (error) {
        console.error('Failed to load evaluations:', error);
        setEvaluations(defaultMockEvaluations);
      } finally {
        setLoading(false);
      }
    };

    loadEvaluations();
    
    // Refresh every 30 seconds to check for new evaluations
    const interval = setInterval(loadEvaluations, 30000);
    return () => clearInterval(interval);
  }, [user.studentNo]);

  // Filter evaluations for current student
  const studentEvaluations = evaluations.filter(
    (evaluation) => evaluation.studentNo === user.studentNo
  );

  const handleViewEvaluation = (evaluation: EmployerEvaluation) => {
    setSelectedEvaluation(evaluation);
    setShowViewDialog(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <CheckCircle2 className="h-5 w-5" />
            Employer Evaluations
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            View feedback from your internship supervisors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
            <p className="text-gray-600 text-sm sm:text-base">Loading evaluations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (studentEvaluations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <CheckCircle2 className="h-5 w-5" />
            Employer Evaluations
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            View feedback from your internship supervisors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-sm sm:text-base">
              No evaluations available yet. Your employer evaluations will appear here once submitted.
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2">
              Evaluations are typically available within 5 minutes after your employer submits them.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <CheckCircle2 className="h-5 w-5" />
            Employer Evaluations
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            View feedback from your internship supervisors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden lg:block border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Overall Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentEvaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        {evaluation.company}
                      </div>
                    </TableCell>
                    <TableCell>{evaluation.jobTitle}</TableCell>
                    <TableCell>{evaluation.supervisorName}</TableCell>
                    <TableCell>
                      {evaluation.submittedDate
                        ? new Date(evaluation.submittedDate).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="gap-1">
                        {ratingLabels[evaluation.overallPerformance - 1]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewEvaluation(evaluation)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card Layout */}
          <div className="lg:hidden space-y-4">
            {studentEvaluations.map((evaluation) => (
              <Card key={evaluation.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        {evaluation.company}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{evaluation.jobTitle}</p>
                    </div>
                    <Badge variant="default" className="gap-1 text-xs">
                      {ratingLabels[evaluation.overallPerformance - 1]}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">
                      <strong>Supervisor:</strong> {evaluation.supervisorName}
                    </p>
                    {evaluation.submittedDate && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        Submitted: {new Date(evaluation.submittedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewEvaluation(evaluation)}
                    className="w-full"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Full Evaluation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Evaluation Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Employer Evaluation Details</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Complete evaluation feedback from your supervisor
            </DialogDescription>
          </DialogHeader>
          {selectedEvaluation && (
            <div className="space-y-6">
              {/* Company Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Internship Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Company</p>
                      <p className="text-sm sm:text-base font-medium">{selectedEvaluation.company}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Position</p>
                      <p className="text-sm sm:text-base font-medium">{selectedEvaluation.jobTitle}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Supervisor</p>
                      <p className="text-sm sm:text-base font-medium">{selectedEvaluation.supervisorName}</p>
                    </div>
                    {selectedEvaluation.submittedDate && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">Submitted Date</p>
                        <p className="text-sm sm:text-base font-medium">
                          {new Date(selectedEvaluation.submittedDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Ratings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Performance Ratings</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Ratings on a scale of 1 (Poor) to 5 (Excellent)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { key: "technicalSkills", label: "Technical Skills" },
                      { key: "communicationSkills", label: "Communication Skills" },
                      { key: "teamwork", label: "Teamwork" },
                      { key: "problemSolving", label: "Problem Solving" },
                      { key: "workEthic", label: "Work Ethic" },
                      { key: "adaptability", label: "Adaptability" },
                      { key: "initiative", label: "Initiative" },
                      { key: "overallPerformance", label: "Overall Performance" },
                    ].map(({ key, label }) => {
                      const value = selectedEvaluation[key as keyof EmployerEvaluation] as number;
                      return (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-sm sm:text-base">{label}</span>
                          <Badge variant="default" className="gap-1">
                            {value}/5 - {ratingLabels[value - 1]}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Written Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Written Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">Key Strengths</p>
                    <p className="text-sm sm:text-base bg-green-50 p-3 rounded-lg">
                      {selectedEvaluation.strengths}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">Areas for Improvement</p>
                    <p className="text-sm sm:text-base bg-yellow-50 p-3 rounded-lg">
                      {selectedEvaluation.areasForImprovement}
                    </p>
                  </div>
                  {selectedEvaluation.additionalComments && (
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">Additional Comments</p>
                      <p className="text-sm sm:text-base bg-blue-50 p-3 rounded-lg">
                        {selectedEvaluation.additionalComments}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Overall Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Overall Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">Would Hire Again</p>
                    <Badge variant={selectedEvaluation.wouldHireAgain === "yes" ? "default" : "secondary"}>
                      {selectedEvaluation.wouldHireAgain === "yes"
                        ? "Yes, definitely"
                        : selectedEvaluation.wouldHireAgain === "maybe"
                        ? "Maybe, depending on the position"
                        : "No"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">Would Recommend</p>
                    <Badge variant={selectedEvaluation.wouldRecommend ? "default" : "secondary"}>
                      {selectedEvaluation.wouldRecommend ? "Yes" : "No"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}


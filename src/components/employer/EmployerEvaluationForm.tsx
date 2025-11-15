import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { Alert, AlertDescription } from "../ui/alert";
import { CheckCircle2, Building2, User, Briefcase, Save, Calendar, Lock } from "lucide-react";
import { EmployerEvaluation } from "../../types";
import { saveDraft, loadDraft, deleteDraft } from "../../utils/draftStorage";
import { toast } from "sonner@2.0.3";

interface EvaluationFormProps {
  studentName: string;
  studentNo: string;
  jobTitle: string;
  company: string;
  supervisorName: string;
  supervisorEmail: string;
  endorsementId: string;
  startDate?: string;
  endDate?: string;
  evaluationToken: string;
  isReadOnly?: boolean;
  onSubmit: (evaluation: Omit<EmployerEvaluation, 'id' | 'submittedDate'>) => void;
}

const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

export function EmployerEvaluationForm({
  studentName,
  studentNo,
  jobTitle,
  company,
  supervisorName,
  supervisorEmail,
  endorsementId,
  startDate,
  endDate,
  evaluationToken,
  isReadOnly = false,
  onSubmit,
}: EvaluationFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [ratings, setRatings] = useState({
    technicalSkills: 3,
    communicationSkills: 3,
    teamwork: 3,
    problemSolving: 3,
    workEthic: 3,
    adaptability: 3,
    initiative: 3,
    overallPerformance: 3,
  });

  const [comments, setComments] = useState({
    strengths: "",
    areasForImprovement: "",
    additionalComments: "",
  });

  const [wouldHireAgain, setWouldHireAgain] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [draftSaved, setDraftSaved] = useState(false);

  // Load draft on mount
  useEffect(() => {
    if (!isReadOnly && evaluationToken) {
      const draft = loadDraft(evaluationToken);
      if (draft) {
        setRatings(draft.ratings);
        setComments(draft.comments);
        setWouldHireAgain(draft.wouldHireAgain);
        setWouldRecommend(draft.wouldRecommend);
        setDraftSaved(true);
        toast.info("Draft loaded", {
          description: "Your previously saved draft has been restored.",
        });
      }
    }
  }, [evaluationToken, isReadOnly]);

  // Auto-save draft when form changes (debounced)
  useEffect(() => {
    if (isReadOnly || submitted || !evaluationToken) return;

    const timeoutId = setTimeout(() => {
      saveDraft(evaluationToken, {
        endorsementId,
        ratings,
        comments,
        wouldHireAgain,
        wouldRecommend,
      });
      setDraftSaved(true);
    }, 2000); // Save 2 seconds after last change

    return () => clearTimeout(timeoutId);
  }, [ratings, comments, wouldHireAgain, wouldRecommend, evaluationToken, endorsementId, isReadOnly, submitted]);

  const handleSaveDraft = () => {
    saveDraft(evaluationToken, {
      endorsementId,
      ratings,
      comments,
      wouldHireAgain,
      wouldRecommend,
    });
    setDraftSaved(true);
    toast.success("Draft saved", {
      description: "Your progress has been saved. You can resume later.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isReadOnly) {
      return;
    }
    
    const evaluation: Omit<EmployerEvaluation, 'id' | 'submittedDate'> = {
      endorsementId,
      studentNo,
      studentName,
      jobTitle,
      company,
      supervisorName,
      supervisorEmail,
      ...ratings,
      ...comments,
      wouldHireAgain,
      wouldRecommend,
    };

    // Delete draft after successful submission
    deleteDraft(evaluationToken);
    
    onSubmit(evaluation);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-green-500" />
            </div>
            <CardTitle className="text-xl sm:text-2xl text-[#003366]">
              Evaluation Submitted Successfully
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Thank you for taking the time to evaluate the student's performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription className="text-sm sm:text-base">
                Your evaluation has been recorded and will be shared with the academic coordinator
                and the student. We appreciate your contribution to the student's professional
                development.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2">
              <p className="text-xs sm:text-sm text-gray-600">
                <strong>Student:</strong> {studentName} ({studentNo})
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                <strong>Position:</strong> {jobTitle}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                <strong>Company:</strong> {company}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 text-center pt-4">
              You may now close this window
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-[#003366] text-white py-4 sm:py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl">Internship Student Evaluation</h1>
          <p className="text-xs sm:text-sm text-blue-200 mt-1">Hong Kong Baptist University</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* Student Information */}
        <Card className="mb-4 sm:mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#003366] text-lg sm:text-xl">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label className="text-gray-600 text-xs sm:text-sm">Student Name</Label>
                <p className="mt-1 text-sm sm:text-base">{studentName}</p>
              </div>
              <div>
                <Label className="text-gray-600 text-xs sm:text-sm">Student Number</Label>
                <p className="mt-1 text-sm sm:text-base">{studentNo}</p>
              </div>
              <div>
                <Label className="text-gray-600 text-xs sm:text-sm">Position</Label>
                <p className="mt-1 flex items-center gap-2 text-sm sm:text-base">
                  <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  {jobTitle}
                </p>
              </div>
              <div>
                <Label className="text-gray-600 text-xs sm:text-sm">Company</Label>
                <p className="mt-1 flex items-center gap-2 text-sm sm:text-base">
                  <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  {company}
                </p>
              </div>
              {startDate && endDate && (
                <div className="sm:col-span-2">
                  <Label className="text-gray-600 text-xs sm:text-sm">Internship Period</Label>
                  <p className="mt-1 flex items-center gap-2 text-sm sm:text-base">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {isReadOnly && (
          <Alert className="mb-4 sm:mb-6">
            <Lock className="h-4 w-4" />
            <AlertDescription className="text-sm sm:text-base">
              This evaluation has already been submitted and is now read-only.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Performance Ratings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#003366] text-lg sm:text-xl">Performance Evaluation</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Please rate the student's performance in the following areas (1 = Poor, 5 = Excellent)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {Object.entries(ratings).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <Label className="capitalize text-sm sm:text-base">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <span className="text-xs sm:text-sm bg-[#003366] text-white px-2 sm:px-3 py-1 rounded w-fit">
                      {ratingLabels[value - 1]}
                    </span>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={(values) =>
                      !isReadOnly && setRatings({ ...ratings, [key]: values[0] })
                    }
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                    disabled={isReadOnly}
                  />
                  <div className="flex justify-between text-[10px] sm:text-xs text-gray-500">
                    <span>Poor</span>
                    <span className="hidden sm:inline">Fair</span>
                    <span>Good</span>
                    <span className="hidden sm:inline">Very Good</span>
                    <span>Excellent</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Written Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#003366] text-lg sm:text-xl">Written Feedback</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Please provide detailed feedback on the student's performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="strengths" className="text-sm sm:text-base">Key Strengths *</Label>
                <Textarea
                  id="strengths"
                  placeholder="Describe the student's main strengths and positive attributes..."
                  value={comments.strengths}
                  onChange={(e) =>
                    !isReadOnly && setComments({ ...comments, strengths: e.target.value })
                  }
                  required={!isReadOnly}
                  rows={4}
                  className="resize-none text-sm sm:text-base"
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="improvements" className="text-sm sm:text-base">Areas for Improvement *</Label>
                <Textarea
                  id="improvements"
                  placeholder="Describe areas where the student could improve..."
                  value={comments.areasForImprovement}
                  onChange={(e) =>
                    !isReadOnly && setComments({ ...comments, areasForImprovement: e.target.value })
                  }
                  required={!isReadOnly}
                  rows={4}
                  className="resize-none text-sm sm:text-base"
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional" className="text-sm sm:text-base">Additional Comments</Label>
                <Textarea
                  id="additional"
                  placeholder="Any other feedback or observations..."
                  value={comments.additionalComments}
                  onChange={(e) =>
                    !isReadOnly && setComments({ ...comments, additionalComments: e.target.value })
                  }
                  rows={4}
                  className="resize-none text-sm sm:text-base"
                  disabled={isReadOnly}
                />
              </div>
            </CardContent>
          </Card>

          {/* Overall Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#003366] text-lg sm:text-xl">Overall Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-3">
                <Label className="text-sm sm:text-base">Would you hire this student again? *</Label>
                <RadioGroup
                  value={wouldHireAgain}
                  onValueChange={(value) => !isReadOnly && setWouldHireAgain(value as 'yes' | 'no' | 'maybe')}
                  disabled={isReadOnly}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="hire-yes" />
                    <Label htmlFor="hire-yes" className="cursor-pointer text-sm sm:text-base">
                      Yes, definitely
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="maybe" id="hire-maybe" />
                    <Label htmlFor="hire-maybe" className="cursor-pointer text-sm sm:text-base">
                      Maybe, depending on the position
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="hire-no" />
                    <Label htmlFor="hire-no" className="cursor-pointer text-sm sm:text-base">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recommend"
                  checked={wouldRecommend}
                  onCheckedChange={(checked) => !isReadOnly && setWouldRecommend(checked as boolean)}
                  disabled={isReadOnly}
                />
                <Label htmlFor="recommend" className="cursor-pointer text-sm sm:text-base">
                  I would recommend this student to other employers
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Supervisor Information Confirmation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#003366] text-lg sm:text-xl">Supervisor Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2">
                <p className="text-xs sm:text-sm text-gray-600">
                  <strong>Name:</strong> {supervisorName}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 break-all">
                  <strong>Email:</strong> {supervisorEmail}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          {!isReadOnly && (
            <div className="flex flex-col sm:flex-row justify-between gap-4 sticky bottom-0 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent pt-4 pb-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                className="w-full sm:w-auto"
                size="lg"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              {draftSaved && (
                <span className="text-xs sm:text-sm text-gray-500 self-center">
                  Draft auto-saved
                </span>
              )}
              <Button
                type="submit"
                className="bg-[#003366] hover:bg-[#004488] text-white px-6 sm:px-8 w-full sm:w-auto"
                size="lg"
              >
                Submit Evaluation
              </Button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
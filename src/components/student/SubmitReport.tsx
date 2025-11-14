import { useState } from 'react';
import { User } from '../../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { FileUpload } from '../shared/FileUpload';
import { ArrowLeft, Save, Send, AlertCircle, CheckCircle2, Clock, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface SubmitReportProps {
  user: User;
  onBack: () => void;
}

export function SubmitReport({ user, onBack }: SubmitReportProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reportNumber, setReportNumber] = useState('');
  const [formData, setFormData] = useState({
    weekNumber: '',
    jobTitle: '',
    company: '',
    reportDate: new Date().toISOString().split('T')[0],
    workDescription: '',
    skillsLearned: '',
    challengesFaced: '',
  });

  // Calculate submission status
  const getSubmissionStatus = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // If submitted before Friday (5), it's on time
    // If submitted on Friday or after, it's late
    if (dayOfWeek < 5) {
      return { status: 'on-time', label: 'On Time', color: 'green' };
    } else {
      return { status: 'late', label: 'Late Submission', color: 'red' };
    }
  };

  const submissionStatus = getSubmissionStatus();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully');
  };

  const generateReportNumber = () => {
    // Generate report number: RPT-YYYY-XXXXXXXX
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    return `RPT-${year}-${randomNum}`;
  };

  const handleSubmit = () => {
    // Generate report number
    const rptNumber = generateReportNumber();
    setReportNumber(rptNumber);
    setShowSuccess(true);
    
    toast.success('Weekly report submitted successfully!');
  };

  const handleCopyReportNumber = () => {
    navigator.clipboard.writeText(reportNumber);
    toast.success('Report number copied to clipboard!');
  };

  const handleReturnToList = () => {
    setShowSuccess(false);
    onBack();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit Weekly Internship Report</CardTitle>
          <CardDescription>
            Submit your weekly report with detailed work description and attachments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Submission Status Alert */}
          {submissionStatus.status === 'on-time' ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>On Time Submission:</strong> You are submitting this report on time. Keep up the good work!
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Late Submission:</strong> This report is being submitted after the Friday deadline. Your record will show this as a late submission.
              </AlertDescription>
            </Alert>
          )}

          {/* Weekly Report Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-[#003366] mt-0.5" />
              <div>
                <h5 className="text-sm text-[#003366] mb-1">Weekly Report Submission</h5>
                <p className="text-xs text-gray-700">
                  Students must submit one weekly report per week. Reports submitted before Friday are marked as "On Time". 
                  Reports submitted on or after Friday are marked as "Late Submission".
                </p>
              </div>
            </div>
          </div>

          {/* Student Information (Read-only) */}
          <div>
            <h4 className="mb-4 text-[#003366]">Student Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Student Name</Label>
                <Input value={user.name} disabled />
              </div>
              <div>
                <Label>Student Number</Label>
                <Input value={user.studentNo} disabled />
              </div>
              <div>
                <Label>Major</Label>
                <Input value={user.major} disabled />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={user.email} disabled />
              </div>
            </div>
          </div>

          {/* Internship Details */}
          <div>
            <h4 className="mb-4 text-[#003366]">Internship Details</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="weekNumber">Week Number *</Label>
                <Input
                  id="weekNumber"
                  value={formData.weekNumber}
                  onChange={(e) => handleInputChange('weekNumber', e.target.value)}
                  placeholder="e.g., 1"
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  placeholder="e.g., Software Engineering Intern"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <Label htmlFor="reportDate">Report Date *</Label>
                  <Input
                    id="reportDate"
                    type="date"
                    value={formData.reportDate}
                    onChange={(e) => handleInputChange('reportDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Work Description */}
          <div>
            <h4 className="mb-4 text-[#003366]">Work Description *</h4>
            <p className="text-sm text-gray-600 mb-2">
              Describe your work activities, projects, and responsibilities during the internship
            </p>
            <Textarea
              value={formData.workDescription}
              onChange={(e) => handleInputChange('workDescription', e.target.value)}
              placeholder="Share your work activities and responsibilities..."
              rows={10}
              className="resize-y"
            />
            <p className="text-xs text-gray-500 mt-2">
              Minimum 200 words recommended. Include specific examples and learning outcomes.
            </p>
          </div>

          {/* Skills Learned */}
          <div>
            <h4 className="mb-4 text-[#003366]">Skills Learned *</h4>
            <p className="text-sm text-gray-600 mb-2">
              Reflect on the skills and knowledge you gained during the internship
            </p>
            <Textarea
              value={formData.skillsLearned}
              onChange={(e) => handleInputChange('skillsLearned', e.target.value)}
              placeholder="Share the skills and knowledge you gained..."
              rows={10}
              className="resize-y"
            />
            <p className="text-xs text-gray-500 mt-2">
              Minimum 200 words recommended. Include specific examples and learning outcomes.
            </p>
          </div>

          {/* Challenges Faced */}
          <div>
            <h4 className="mb-4 text-[#003366]">Challenges Faced *</h4>
            <p className="text-sm text-gray-600 mb-2">
              Discuss the challenges you encountered and how you overcame them
            </p>
            <Textarea
              value={formData.challengesFaced}
              onChange={(e) => handleInputChange('challengesFaced', e.target.value)}
              placeholder="Share the challenges you faced and how you overcame them..."
              rows={10}
              className="resize-y"
            />
            <p className="text-xs text-gray-500 mt-2">
              Minimum 200 words recommended. Include specific examples and learning outcomes.
            </p>
          </div>

          {/* Supporting Documents */}
          <div>
            <h4 className="mb-4 text-[#003366]">Supporting Documents *</h4>
            <p className="text-sm text-gray-600 mb-4">
              Upload your work report, internship photos, supervisor evaluation, or other relevant documents
            </p>
            <FileUpload
              onFilesChange={setFiles}
              acceptedTypes={['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']}
              maxSizeMB={10}
              multiple={true}
              existingFiles={files}
            />
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h5 className="text-sm text-[#003366] mb-2">Report Guidelines</h5>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Include a detailed description of your responsibilities and tasks</li>
              <li>• Reflect on skills and knowledge gained during the internship</li>
              <li>• Discuss challenges faced and how you overcame them</li>
              <li>• Explain how the internship relates to your academic studies</li>
              <li>• Describe your professional development and career insights</li>
              <li>• Include photos or evidence of your work (if applicable)</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-6 border-t">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4 mr-2" />
              Submit Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex flex-col items-center mb-4">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <DialogTitle className="text-center text-2xl">Weekly Report Submitted Successfully!</DialogTitle>
              <DialogDescription className="text-center mt-2">
                Your weekly internship report has been received and is now under review.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Report Details */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Report Number</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-lg text-[#003366]">{reportNumber}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyReportNumber}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Submission Date & Time</p>
                  <p className="text-sm">
                    {new Date().toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })} at {new Date().toLocaleTimeString('en-GB', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Week Number</p>
                  <p className="text-sm">Week {formData.weekNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Company</p>
                  <p className="text-sm">{formData.company || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Position</p>
                  <p className="text-sm">{formData.jobTitle || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Submission Status</p>
                  {submissionStatus.status === 'on-time' ? (
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                      On Time
                    </div>
                  ) : (
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-red-100 text-red-800">
                      Late Submission
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Review Status</p>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
                    Pending Review
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Documents Uploaded</p>
                  <p className="text-sm">{files.length} file(s)</p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h4 className="mb-3 text-[#003366]">What Happens Next?</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#003366] mt-0.5">1.</span>
                  <span>Staff will review your weekly report within 2-3 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#003366] mt-0.5">2.</span>
                  <span>You will receive an email notification with feedback or approval</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#003366] mt-0.5">3.</span>
                  <span>Check your report status anytime in the "My Work Reports" tab</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#003366] mt-0.5">4.</span>
                  <span>Remember to submit your next weekly report before the Friday deadline</span>
                </li>
              </ul>
            </div>

            {/* Submission Status Note */}
            {submissionStatus.status === 'late' ? (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-xs text-red-900">
                  <strong>Note:</strong> This report was submitted after the Friday deadline and is marked as a 
                  <strong> Late Submission</strong>. Please try to submit future reports on time to maintain a good academic record.
                </p>
              </div>
            ) : (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-xs text-green-900">
                  <strong>Great job!</strong> Your report was submitted on time. Keep up the excellent work and continue 
                  submitting your weekly reports before the Friday deadline.
                </p>
              </div>
            )}

            {/* Important Note */}
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <p className="text-xs text-amber-900">
                <strong>Important:</strong> Please save your report number <strong>{reportNumber}</strong> for future reference. 
                You can use this number to track your report status and communicate with staff.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleCopyReportNumber}
                variant="outline"
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Report Number
              </Button>
              <Button
                onClick={handleReturnToList}
                className="flex-1 bg-[#003366] hover:bg-[#004488]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to My Reports
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
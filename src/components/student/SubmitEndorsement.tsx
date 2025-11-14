import { useState } from 'react';
import { User } from '../../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FileUpload } from '../shared/FileUpload';
import { Progress } from '../ui/progress';
import { ArrowLeft, ArrowRight, Save, Send, CheckCircle, Copy } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface SubmitEndorsementProps {
  user: User;
  onBack: () => void;
}

export function SubmitEndorsement({ user, onBack }: SubmitEndorsementProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState('');
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    department: '',
    companyAddress: '',
    startDate: '',
    endDate: '',
    employmentType: 'full-time',
    salary: '',
    supervisorName: '',
    supervisorPosition: '',
    supervisorEmail: '',
    supervisorPhone: '',
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully');
  };

  const generateApplicationNumber = () => {
    // Generate application number: END-YYYY-XXXXXXXX
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    return `END-${year}-${randomNum}`;
  };

  const handleSubmit = () => {
    // Generate application number
    const appNumber = generateApplicationNumber();
    setApplicationNumber(appNumber);
    setShowSuccess(true);
    
    toast.success('Endorsement submitted successfully!');
  };

  const handleCopyApplicationNumber = () => {
    navigator.clipboard.writeText(applicationNumber);
    toast.success('Application number copied to clipboard!');
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
          <CardTitle>Submit Internship Endorsement</CardTitle>
          <CardDescription>
            Step {currentStep} of {totalSteps}: {
              currentStep === 1 ? 'Student Information' :
              currentStep === 2 ? 'Internship Information' :
              currentStep === 3 ? 'Supervisor Information' :
              'Supporting Documents'
            }
          </CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Student Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
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
              <p className="text-sm text-gray-600">
                * Student information is automatically populated from your account
              </p>
            </div>
          )}

          {/* Step 2: Internship Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
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
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="Department"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="companyAddress">Company Address *</Label>
                <Textarea
                  id="companyAddress"
                  value={formData.companyAddress}
                  onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                  placeholder="Full company address"
                  rows={3}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employmentType">Employment Type *</Label>
                  <Select
                    value={formData.employmentType}
                    onValueChange={(value) => handleInputChange('employmentType', value)}
                  >
                    <SelectTrigger id="employmentType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="salary">Salary *</Label>
                  <Input
                    id="salary"
                    value={formData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    placeholder="e.g., HKD 15,000/month"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Supervisor Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supervisorName">Supervisor Name *</Label>
                  <Input
                    id="supervisorName"
                    value={formData.supervisorName}
                    onChange={(e) => handleInputChange('supervisorName', e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <Label htmlFor="supervisorPosition">Position *</Label>
                  <Input
                    id="supervisorPosition"
                    value={formData.supervisorPosition}
                    onChange={(e) => handleInputChange('supervisorPosition', e.target.value)}
                    placeholder="Job title"
                  />
                </div>
                <div>
                  <Label htmlFor="supervisorEmail">Email *</Label>
                  <Input
                    id="supervisorEmail"
                    type="email"
                    value={formData.supervisorEmail}
                    onChange={(e) => handleInputChange('supervisorEmail', e.target.value)}
                    placeholder="email@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="supervisorPhone">Phone Number *</Label>
                  <Input
                    id="supervisorPhone"
                    type="tel"
                    value={formData.supervisorPhone}
                    onChange={(e) => handleInputChange('supervisorPhone', e.target.value)}
                    placeholder="+852 1234 5678"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Supporting Documents */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label>Upload Supporting Documents (PDF Only) *</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Please upload required documents such as offer letter, company information, etc. in PDF format only.
                </p>
                <FileUpload
                  onFilesChange={setFiles}
                  acceptedTypes={['.pdf']}
                  maxSizeMB={10}
                  multiple={true}
                  existingFiles={files}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              {currentStep < totalSteps ? (
                <Button onClick={handleNext} className="bg-[#003366] hover:bg-[#004488]">
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </Button>
              )}
            </div>
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
              <DialogTitle className="text-center text-2xl">Application Submitted Successfully!</DialogTitle>
              <DialogDescription className="text-center mt-2">
                Your internship endorsement application has been received and is now under review.
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Application Details */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Application Number</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-lg text-[#003366]">{applicationNumber}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyApplicationNumber}
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
                  <p className="text-xs text-gray-600 mb-1">Company</p>
                  <p className="text-sm">{formData.company || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Position</p>
                  <p className="text-sm">{formData.jobTitle || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Status</p>
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
                  <span>Staff will review your endorsement application within 3-5 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#003366] mt-0.5">2.</span>
                  <span>You will receive an email notification about the review status</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#003366] mt-0.5">3.</span>
                  <span>Check your application status anytime in the "My Endorsements" tab</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#003366] mt-0.5">4.</span>
                  <span>If additional information is needed, you will be notified to resubmit</span>
                </li>
              </ul>
            </div>

            {/* Important Note */}
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <p className="text-xs text-amber-900">
                <strong>Important:</strong> Please save your application number <strong>{applicationNumber}</strong> for future reference. 
                You can use this number to track your application status.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleCopyApplicationNumber}
                variant="outline"
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Application Number
              </Button>
              <Button
                onClick={handleReturnToList}
                className="flex-1 bg-[#003366] hover:bg-[#004488]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to My Endorsements
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
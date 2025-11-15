import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { 
  ExternalLink, 
  Copy, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Building2,
  User,
  Calendar,
  Mail
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface EvaluationLink {
  token: string;
  studentName: string;
  studentNo: string;
  company: string;
  jobTitle: string;
  supervisorName: string;
  supervisorEmail: string;
  startDate: string;
  endDate: string;
  status: 'valid' | 'expired' | 'submitted';
  sentDate: string;
  submittedDate?: string;
  daysRemaining?: number;
}

const mockEvaluationLinks: EvaluationLink[] = [
  {
    token: "demo",
    studentName: "John Chan",
    studentNo: "22012345",
    company: "Tech Solutions Ltd",
    jobTitle: "Software Engineering Intern",
    supervisorName: "Ms. Sarah Wong",
    supervisorEmail: "sarah.wong@techsolutions.com",
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    status: 'valid',
    sentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
    daysRemaining: 5,
  },
  {
    token: "valid-link-1",
    studentName: "Mary Lam",
    studentNo: "22012346",
    company: "Marketing Pro Ltd",
    jobTitle: "Marketing Intern",
    supervisorName: "Mr. David Lee",
    supervisorEmail: "david.lee@marketingpro.com",
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    status: 'valid',
    sentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day ago
    daysRemaining: 6,
  },
  {
    token: "valid-link-2",
    studentName: "Peter Wong",
    studentNo: "22012347",
    company: "Data Insights Corp",
    jobTitle: "Data Analyst Intern",
    supervisorName: "Dr. Lisa Chen",
    supervisorEmail: "lisa.chen@datainsights.com",
    startDate: "2025-09-01",
    endDate: "2025-11-30",
    status: 'valid',
    sentDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 days ago
    daysRemaining: 1,
  },
  {
    token: "submitted",
    studentName: "John Chan",
    studentNo: "22012345",
    company: "Tech Solutions Ltd",
    jobTitle: "Software Engineering Intern",
    supervisorName: "Ms. Sarah Wong",
    supervisorEmail: "sarah.wong@techsolutions.com",
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    status: 'submitted',
    sentDate: "2025-09-01",
    submittedDate: "2025-09-05",
  },
  {
    token: "expired",
    studentName: "Mary Lam",
    studentNo: "22012346",
    company: "Marketing Pro Ltd",
    jobTitle: "Marketing Intern",
    supervisorName: "Mr. David Lee",
    supervisorEmail: "david.lee@marketingpro.com",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    status: 'expired',
    sentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days ago
  },
];

export function EvaluationLinkDemo() {
  const getEvaluationLink = (token: string) => {
    return `${window.location.origin}/?evaluation=${token}`;
  };

  const copyLink = (token: string) => {
    const link = getEvaluationLink(token);
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard", {
      description: "You can now share this link or test it in a new tab.",
    });
  };

  const openLink = (token: string) => {
    const link = getEvaluationLink(token);
    window.open(link, '_blank');
  };

  const getStatusBadge = (link: EvaluationLink) => {
    switch (link.status) {
      case 'valid':
        return (
          <Badge variant="default" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Valid ({link.daysRemaining} days remaining)
          </Badge>
        );
      case 'submitted':
        return (
          <Badge variant="default" className="gap-1 bg-green-600">
            <CheckCircle2 className="h-3 w-3" />
            Submitted
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Expired
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-[#003366] text-white py-4 sm:py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl">Employer Evaluation Link Demo</h1>
          <p className="text-xs sm:text-sm text-blue-200 mt-1">
            Test evaluation links for different scenarios
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm sm:text-base">
            This page contains sample evaluation links for testing purposes. Click on any link to test
            the employer evaluation form in different scenarios.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 sm:gap-6">
          {mockEvaluationLinks.map((link) => (
            <Card key={link.token} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-[#003366]" />
                      {link.company}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base mt-1">
                      {link.jobTitle}
                    </CardDescription>
                  </div>
                  {getStatusBadge(link)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Student Information */}
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <Label className="text-xs sm:text-sm text-gray-600">Student</Label>
                      <p className="text-sm sm:text-base font-medium">
                        {link.studentName} ({link.studentNo})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <Label className="text-xs sm:text-sm text-gray-600">Supervisor</Label>
                      <p className="text-sm sm:text-base font-medium">{link.supervisorName}</p>
                      <p className="text-xs sm:text-sm text-gray-500 break-all">
                        {link.supervisorEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <Label className="text-xs sm:text-sm text-gray-600">Internship Period</Label>
                      <p className="text-sm sm:text-base">
                        {new Date(link.startDate).toLocaleDateString()} -{" "}
                        {new Date(link.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <Label className="text-xs sm:text-sm text-gray-600">Link Sent</Label>
                      <p className="text-sm sm:text-base">
                        {new Date(link.sentDate).toLocaleDateString()}
                      </p>
                      {link.submittedDate && (
                        <>
                          <Label className="text-xs sm:text-sm text-gray-600 mt-1 block">
                            Submitted
                          </Label>
                          <p className="text-sm sm:text-base">
                            {new Date(link.submittedDate).toLocaleDateString()}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Evaluation Link */}
                <div className="space-y-2 pt-2 border-t">
                  <Label className="text-sm sm:text-base">Evaluation Link</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      value={getEvaluationLink(link.token)}
                      readOnly
                      className="font-mono text-xs sm:text-sm flex-1"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyLink(link.token)}
                        className="flex-1 sm:flex-none"
                      >
                        <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Copy</span>
                      </Button>
                      <Button
                        onClick={() => openLink(link.token)}
                        className="bg-[#003366] hover:bg-[#004488] flex-1 sm:flex-none"
                        size="sm"
                      >
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Open</span>
                        <span className="sm:hidden">Test</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Status Description */}
                {link.status === 'valid' && link.daysRemaining !== undefined && (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription className="text-xs sm:text-sm">
                      This link is valid and can be used to submit an evaluation. It expires in{" "}
                      {link.daysRemaining} {link.daysRemaining === 1 ? "day" : "days"}.
                    </AlertDescription>
                  </Alert>
                )}
                {link.status === 'submitted' && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-xs sm:text-sm text-green-800">
                      This evaluation has already been submitted. The link will show a read-only view
                      of the submitted evaluation.
                    </AlertDescription>
                  </Alert>
                )}
                {link.status === 'expired' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs sm:text-sm">
                      This link has expired (valid for 7 days from send date). It will show an error
                      message when accessed.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Test Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Quick Test Links</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Direct access to test different scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <Button
                variant="outline"
                onClick={() => openLink("demo")}
                className="justify-start"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Valid Evaluation Form (Demo)
              </Button>
              <Button
                variant="outline"
                onClick={() => openLink("submitted")}
                className="justify-start"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Already Submitted Evaluation
              </Button>
              <Button
                variant="outline"
                onClick={() => openLink("expired")}
                className="justify-start"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Expired Link (Error)
              </Button>
              <Button
                variant="outline"
                onClick={() => openLink("invalid")}
                className="justify-start"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Invalid Link (Error)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base text-gray-700">
              <li>Click "Open" or "Test" on any evaluation link to test it in a new tab</li>
              <li>Use "Copy" to copy the link and share it or test in a different browser</li>
              <li>
                Valid links allow you to fill out and submit the evaluation form (with draft saving)
              </li>
              <li>
                Submitted links show a read-only view of the completed evaluation
              </li>
              <li>
                Expired links display an error message explaining the link has expired
              </li>
              <li>
                All links are tied to specific student-internship pairs and cannot be reused
              </li>
            </ol>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


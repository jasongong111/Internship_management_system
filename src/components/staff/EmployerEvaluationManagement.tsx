import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Mail,
  Search,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Eye,
  Filter,
  Building2,
  User,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Endorsement } from "../../types";
import { generateEvaluationToken } from "../../utils/evaluationToken";
import { sendEvaluationLinkEmail } from "../../utils/emailService";
import { processReminders, getPendingReminders } from "../../utils/reminderService";
import { useEffect } from "react";
import { shouldSendReminder } from "../../utils/evaluationToken";
import { processEndedInternships, getEndorsementsReadyForLinkGeneration } from "../../utils/autoLinkGeneration";

// Mock data for approved endorsements
const mockEndorsements: Endorsement[] = [
  {
    id: "END-001",
    studentId: "1",
    studentNo: "22012345",
    studentName: "John Chan",
    major: "Computer Science",
    jobTitle: "Software Engineering Intern",
    company: "Tech Solutions Ltd",
    department: "Development",
    companyAddress: "123 Tech Street, Hong Kong",
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    employmentType: "full-time",
    salary: "15000",
    supervisorName: "Ms. Sarah Wong",
    supervisorPosition: "Senior Developer",
    supervisorEmail: "sarah.wong@techsolutions.com",
    supervisorPhone: "9123-4567",
    status: "approved",
    submittedDate: "2025-05-15",
    lastActionDate: "2025-05-20",
    documents: [],
    history: [],
    evaluationToken: "eval-token-001",
    evaluationSentDate: "2025-09-01",
    evaluationSubmittedDate: "2025-09-05",
    evaluationRemindersSent: 0,
  },
  {
    id: "END-002",
    studentId: "2",
    studentNo: "22012346",
    studentName: "Mary Lam",
    major: "Business Administration",
    jobTitle: "Marketing Intern",
    company: "Marketing Pro Ltd",
    department: "Marketing",
    companyAddress: "456 Business Road, Hong Kong",
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    employmentType: "full-time",
    salary: "12000",
    supervisorName: "Mr. David Lee",
    supervisorPosition: "Marketing Manager",
    supervisorEmail: "david.lee@marketingpro.com",
    supervisorPhone: "9234-5678",
    status: "approved",
    submittedDate: "2025-06-10",
    lastActionDate: "2025-06-15",
    documents: [],
    history: [],
    evaluationToken: "eval-token-002",
    evaluationSentDate: "2025-10-01",
    evaluationRemindersSent: 1,
  },
  {
    id: "END-003",
    studentId: "3",
    studentNo: "22012347",
    studentName: "Peter Wong",
    major: "Computer Science",
    jobTitle: "Data Analyst Intern",
    company: "Data Insights Corp",
    department: "Analytics",
    companyAddress: "789 Data Avenue, Hong Kong",
    startDate: "2025-09-01",
    endDate: "2025-11-30",
    employmentType: "full-time",
    salary: "14000",
    supervisorName: "Dr. Lisa Chen",
    supervisorPosition: "Analytics Director",
    supervisorEmail: "lisa.chen@datainsights.com",
    supervisorPhone: "9345-6789",
    status: "approved",
    submittedDate: "2025-08-20",
    lastActionDate: "2025-08-25",
    documents: [],
    history: [],
  },
  {
    id: "END-004",
    studentId: "4",
    studentNo: "22012348",
    studentName: "Emily Cheung",
    major: "Finance",
    jobTitle: "Financial Analyst Intern",
    company: "Finance Corp",
    department: "Finance",
    companyAddress: "101 Finance Street, Hong Kong",
    startDate: "2025-08-01",
    endDate: "2025-10-31",
    employmentType: "full-time",
    salary: "16000",
    supervisorName: "Mr. James Ng",
    supervisorPosition: "Finance Director",
    supervisorEmail: "james.ng@financecorp.com",
    supervisorPhone: "9456-7890",
    status: "approved",
    submittedDate: "2025-07-15",
    lastActionDate: "2025-07-20",
    documents: [],
    history: [],
    evaluationToken: "eval-token-004",
    evaluationSentDate: "2025-11-01",
    evaluationRemindersSent: 2,
  },
];

type EvaluationStatus = 'all' | 'not_sent' | 'sent' | 'submitted' | 'expired';

export function EmployerEvaluationManagement() {
  const [endorsements, setEndorsements] = useState<Endorsement[]>(mockEndorsements);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<EvaluationStatus>('all');
  const [selectedEndorsement, setSelectedEndorsement] = useState<Endorsement | null>(null);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [showViewLinkDialog, setShowViewLinkDialog] = useState(false);

  // Auto-check for ended internships and generate links
  useEffect(() => {
    const checkEndedInternships = async () => {
      const readyForLinks = getEndorsementsReadyForLinkGeneration(endorsements);
      if (readyForLinks.length > 0) {
        console.log(`Found ${readyForLinks.length} internships ready for evaluation link generation`);
        // In production, this would automatically generate and send links
        // For now, we'll just log it - coordinators can manually send
        // await processEndedInternships(endorsements);
      }
    };

    checkEndedInternships();
    // Check daily
    const interval = setInterval(checkEndedInternships, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [endorsements]);

  // Auto-check for reminders on mount and periodically
  useEffect(() => {
    const checkReminders = async () => {
      const pending = getPendingReminders(endorsements);
      if (pending.length > 0) {
        console.log(`Found ${pending.length} pending reminders`);
        // In production, this would trigger automatic sending
        // For now, we'll just log it
      }
    };

    checkReminders();
    // Check every hour
    const interval = setInterval(checkReminders, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [endorsements]);

  const getEvaluationStatus = (endorsement: Endorsement): {
    status: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ReactNode;
  } => {
    if (endorsement.evaluationSubmittedDate) {
      return {
        status: "Submitted",
        variant: "default",
        icon: <CheckCircle2 className="h-3 w-3" />,
      };
    }

    if (!endorsement.evaluationSentDate) {
      return {
        status: "Not Sent",
        variant: "secondary",
        icon: <Mail className="h-3 w-3" />,
      };
    }

    // Check if overdue (7 days after send date, or if link expired)
    if (endorsement.evaluationSentDate) {
      const sentDate = new Date(endorsement.evaluationSentDate);
      const today = new Date();
      const daysSinceSent = Math.floor((today.getTime() - sentDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceSent > 7) {
        return {
          status: "Expired",
          variant: "destructive",
          icon: <AlertCircle className="h-3 w-3" />,
        };
      }
    }

    return {
      status: "Sent",
      variant: "outline",
      icon: <Clock className="h-3 w-3" />,
    };
  };

  const filteredEndorsements = endorsements.filter((endorsement) => {
    const matchesSearch =
      endorsement.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endorsement.studentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endorsement.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endorsement.supervisorName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;

    const status = getEvaluationStatus(endorsement);
    
    if (statusFilter === 'not_sent') return status.status === 'Not Sent';
    if (statusFilter === 'sent') return status.status === 'Sent';
    if (statusFilter === 'submitted') return status.status === 'Submitted';
    if (statusFilter === 'expired') return status.status === 'Expired';

    return true;
  });

  const handleSendEvaluation = (endorsement: Endorsement) => {
    setSelectedEndorsement(endorsement);
    setShowSendDialog(true);
  };

  const confirmSendEvaluation = async () => {
    if (!selectedEndorsement) return;

    try {
      // Generate unique evaluation token
      const token = generateEvaluationToken(
        selectedEndorsement.id,
        selectedEndorsement.studentNo,
        selectedEndorsement.supervisorEmail
      );

      // Create evaluation link
      const evaluationLink = `${window.location.origin}/?evaluation=${token}`;

      // Send email with evaluation link
      await sendEvaluationLinkEmail(selectedEndorsement, evaluationLink);

      // Update endorsement with token and sent date
      const updatedEndorsements = endorsements.map((end) =>
        end.id === selectedEndorsement.id
          ? {
              ...end,
              evaluationToken: token,
              evaluationSentDate: new Date().toISOString().split('T')[0],
              evaluationRemindersSent: 0,
            }
          : end
      );

      setEndorsements(updatedEndorsements);

      toast.success(
        `Evaluation link sent to ${selectedEndorsement.supervisorEmail}`,
        {
          description: `Student: ${selectedEndorsement.studentName} (${selectedEndorsement.studentNo}). Link valid for 7 days.`,
        }
      );

      setShowSendDialog(false);
      setSelectedEndorsement(null);
    } catch (error) {
      toast.error("Failed to send evaluation link", {
        description: "Please try again or contact support.",
      });
    }
  };

  const handleViewLink = (endorsement: Endorsement) => {
    setSelectedEndorsement(endorsement);
    setShowViewLinkDialog(true);
  };

  const copyEvaluationLink = () => {
    if (!selectedEndorsement?.evaluationToken) return;

    const link = `${window.location.origin}/?evaluation=${selectedEndorsement.evaluationToken}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  };

  const handleSendReminder = async (endorsement: Endorsement) => {
    if (!endorsement.evaluationToken || !endorsement.evaluationSentDate) {
      toast.error("No evaluation link found", {
        description: "Please send the evaluation link first.",
      });
      return;
    }

    const currentReminders = endorsement.evaluationRemindersSent || 0;
    if (currentReminders >= 3) {
      toast.error("Maximum reminders sent", {
        description: "This employer has already received 3 reminders",
      });
      return;
    }

    try {
      // Determine reminder type based on time remaining
      const reminderType = shouldSendReminder(
        endorsement.evaluationSentDate,
        currentReminders
      ) || '3days'; // Default to 3days if logic doesn't match

      const evaluationLink = `${window.location.origin}/?evaluation=${endorsement.evaluationToken}`;
      await sendReminderEmail(endorsement, evaluationLink, reminderType);

      // Update reminder count
      const updatedEndorsements = endorsements.map((end) =>
        end.id === endorsement.id
          ? {
              ...end,
              evaluationRemindersSent: currentReminders + 1,
            }
          : end
      );

      setEndorsements(updatedEndorsements);

      toast.success(
        `Reminder sent to ${endorsement.supervisorEmail}`,
        {
          description: `Reminder ${currentReminders + 1} of 3`,
        }
      );
    } catch (error) {
      toast.error("Failed to send reminder", {
        description: "Please try again later.",
      });
    }
  };

  const stats = {
    total: endorsements.length,
    notSent: endorsements.filter(e => !e.evaluationSentDate).length,
    sent: endorsements.filter(e => e.evaluationSentDate && !e.evaluationSubmittedDate).length,
    submitted: endorsements.filter(e => e.evaluationSubmittedDate).length,
    overdue: endorsements.filter(e => {
      if (e.evaluationSubmittedDate) return false;
      if (!e.evaluationSentDate) return false;
      const sentDate = new Date(e.evaluationSentDate);
      const today = new Date();
      const daysSinceSent = Math.floor((today.getTime() - sentDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceSent > 7;
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs sm:text-sm">Total Internships</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs sm:text-sm">Not Sent</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl text-gray-600">{stats.notSent}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs sm:text-sm">Awaiting Response</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl text-orange-600">{stats.sent}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs sm:text-sm">Submitted</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl text-green-600">{stats.submitted}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="col-span-2 sm:col-span-3 md:col-span-1">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs sm:text-sm">Expired</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl text-red-600">{stats.overdue}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Mail className="h-5 w-5" />
            Employer Evaluation Management
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Send evaluation links to employers and track submission status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by student, company, or supervisor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as EvaluationStatus)}>
              <SelectTrigger className="w-full sm:w-[200px] text-sm sm:text-base">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="not_sent">Not Sent</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reminders</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEndorsements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No endorsements found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEndorsements.map((endorsement) => {
                    const status = getEvaluationStatus(endorsement);
                    return (
                      <TableRow key={endorsement.id}>
                        <TableCell>
                          <div>
                            <div>{endorsement.studentName}</div>
                            <div className="text-sm text-gray-500">
                              {endorsement.studentNo}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{endorsement.company}</div>
                            <div className="text-sm text-gray-500">
                              {endorsement.jobTitle}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{endorsement.supervisorName}</div>
                            <div className="text-sm text-gray-500">
                              {endorsement.supervisorEmail}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{endorsement.endDate}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant} className="gap-1">
                            {status.icon}
                            {status.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {endorsement.evaluationRemindersSent ? (
                            <span className="text-sm text-gray-600">
                              {endorsement.evaluationRemindersSent} / 3
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {!endorsement.evaluationSentDate && (
                              <Button
                                size="sm"
                                onClick={() => handleSendEvaluation(endorsement)}
                                className="bg-[#003366] hover:bg-[#004488]"
                              >
                                <Send className="h-3 w-3 mr-1" />
                                Send
                              </Button>
                            )}
                            {endorsement.evaluationSentDate && !endorsement.evaluationSubmittedDate && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewLink(endorsement)}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View Link
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSendReminder(endorsement)}
                                  disabled={(endorsement.evaluationRemindersSent || 0) >= 3}
                                >
                                  <Mail className="h-3 w-3 mr-1" />
                                  Remind
                                </Button>
                              </>
                            )}
                            {endorsement.evaluationSubmittedDate && (
                              <Button
                                size="sm"
                                variant="outline"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View Results
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card Layout */}
          <div className="lg:hidden space-y-4">
            {filteredEndorsements.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No endorsements found</p>
              </div>
            ) : (
              filteredEndorsements.map((endorsement) => {
                const status = getEvaluationStatus(endorsement);
                return (
                  <Card key={endorsement.id}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{endorsement.studentName}</p>
                          <p className="text-sm text-gray-500">{endorsement.studentNo}</p>
                        </div>
                        <Badge variant={status.variant} className="gap-1 text-xs">
                          {status.icon}
                          {status.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex items-start gap-2">
                          <Building2 className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">{endorsement.company}</p>
                            <p className="text-gray-500">{endorsement.jobTitle}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">{endorsement.supervisorName}</p>
                            <p className="text-gray-500 break-all">{endorsement.supervisorEmail}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">End Date: {endorsement.endDate}</span>
                        </div>
                        
                        {endorsement.evaluationRemindersSent ? (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">
                              Reminders: {endorsement.evaluationRemindersSent} / 3
                            </span>
                          </div>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {!endorsement.evaluationSentDate && (
                          <Button
                            size="sm"
                            onClick={() => handleSendEvaluation(endorsement)}
                            className="bg-[#003366] hover:bg-[#004488] flex-1"
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Send Evaluation
                          </Button>
                        )}
                        {endorsement.evaluationSentDate && !endorsement.evaluationSubmittedDate && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewLink(endorsement)}
                              className="flex-1"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Link
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendReminder(endorsement)}
                              disabled={(endorsement.evaluationRemindersSent || 0) >= 3}
                              className="flex-1"
                            >
                              <Mail className="h-3 w-3 mr-1" />
                              Send Reminder
                            </Button>
                          </>
                        )}
                        {endorsement.evaluationSubmittedDate && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Results
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Help Alert */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm sm:text-base">
                  Evaluation links are automatically generated and sent to employers' email addresses.
                  Links are valid for 7 days from the send date. The system will automatically send
                  up to 3 reminders (at 3 days, 1 day, and 12 hours before expiration) for pending evaluations.
                </AlertDescription>
              </Alert>
        </CardContent>
      </Card>

      {/* Send Evaluation Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="max-w-md sm:max-w-lg mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Send Evaluation Link</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              This will send an exclusive evaluation link to the employer's email address
            </DialogDescription>
          </DialogHeader>
          {selectedEndorsement && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2">
                <p className="text-xs sm:text-sm">
                  <strong>Student:</strong> {selectedEndorsement.studentName} ({selectedEndorsement.studentNo})
                </p>
                <p className="text-xs sm:text-sm">
                  <strong>Company:</strong> {selectedEndorsement.company}
                </p>
                <p className="text-xs sm:text-sm">
                  <strong>Supervisor:</strong> {selectedEndorsement.supervisorName}
                </p>
                <p className="text-xs sm:text-sm break-all">
                  <strong>Email:</strong> {selectedEndorsement.supervisorEmail}
                </p>
                <p className="text-xs sm:text-sm">
                  <strong>Internship End Date:</strong> {selectedEndorsement.endDate}
                </p>
              </div>
              <Alert>
                <AlertDescription className="text-xs sm:text-sm">
                  An email will be sent to <strong>{selectedEndorsement.supervisorEmail}</strong> with
                  a unique evaluation link. The employer will have 7 days to complete the evaluation.
                  Automatic reminders will be sent at 3 days, 1 day, and 12 hours before expiration.
                </AlertDescription>
              </Alert>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowSendDialog(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              onClick={confirmSendEvaluation}
              className="bg-[#003366] hover:bg-[#004488] w-full sm:w-auto"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Link Dialog */}
      <Dialog open={showViewLinkDialog} onOpenChange={setShowViewLinkDialog}>
        <DialogContent className="max-w-md sm:max-w-lg mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Evaluation Link</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Share this exclusive link with the employer
            </DialogDescription>
          </DialogHeader>
          {selectedEndorsement && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2">
                <p className="text-xs sm:text-sm">
                  <strong>Student:</strong> {selectedEndorsement.studentName}
                </p>
                <p className="text-xs sm:text-sm">
                  <strong>Supervisor:</strong> {selectedEndorsement.supervisorName}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Evaluation Link</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={`${window.location.origin}/?evaluation=${selectedEndorsement.evaluationToken}`}
                    readOnly
                    className="font-mono text-xs sm:text-sm flex-1"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={copyEvaluationLink}
                    className="w-full sm:w-auto"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sm:hidden ml-2">Copy Link</span>
                  </Button>
                </div>
              </div>
              {selectedEndorsement.evaluationSentDate && (
                <p className="text-xs sm:text-sm text-gray-600">
                  Link sent on: {selectedEndorsement.evaluationSentDate}
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewLinkDialog(false)} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
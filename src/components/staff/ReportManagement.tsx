import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { StatusBadge } from '../shared/StatusBadge';
import { Eye, Search, Download, Filter } from 'lucide-react';
import { mockAllReports } from '../../data/mockData';
import { WorkReport } from '../../types';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner@2.0.3';

type ReportStatus = 'pending_assessment' | 'reviewed' | 'accepted' | 'rejected' | 'pending_resubmission';

export function ReportManagement() {
  const [selectedTab, setSelectedTab] = useState<ReportStatus | 'all'>('pending_assessment');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<WorkReport | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ReportStatus>('reviewed');
  const [feedback, setFeedback] = useState('');

  const reports = mockAllReports;

  const filteredReports = reports.filter(r => {
    const matchesTab = selectedTab === 'all' || r.status === selectedTab;
    const matchesSearch = 
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.studentNo.includes(searchTerm) ||
      r.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleUpdateStatus = () => {
    toast.success('Report status updated successfully');
    setIsStatusDialogOpen(false);
    setSelectedReport(null);
    setFeedback('');
  };

  const getTabCount = (status: ReportStatus | 'all') => {
    if (status === 'all') return reports.length;
    return reports.filter(r => r.status === status).length;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report Management</CardTitle>
          <CardDescription>
            Review and assess student internship work reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)} className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="pending_assessment">
                Pending ({getTabCount('pending_assessment')})
              </TabsTrigger>
              <TabsTrigger value="pending_resubmission">
                Resubmission ({getTabCount('pending_resubmission')})
              </TabsTrigger>
              <TabsTrigger value="reviewed">
                Reviewed ({getTabCount('reviewed')})
              </TabsTrigger>
              <TabsTrigger value="accepted">
                Accepted ({getTabCount('accepted')})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({getTabCount('rejected')})
              </TabsTrigger>
              <TabsTrigger value="all">
                All ({getTabCount('all')})
              </TabsTrigger>
            </TabsList>

            {/* Search and Filter Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by student name, ID, company, or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Content for each tab */}
            <TabsContent value={selectedTab} className="space-y-4">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student No.</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Major</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                          No reports found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReports.map((report) => (
                        <TableRow key={report.id} className="hover:bg-gray-50">
                          <TableCell>{report.studentNo}</TableCell>
                          <TableCell>{report.studentName}</TableCell>
                          <TableCell>{report.major}</TableCell>
                          <TableCell>{report.company}</TableCell>
                          <TableCell>{report.jobTitle}</TableCell>
                          <TableCell>{report.period}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            {new Date(report.submittedDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={report.status} />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedReport(report)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedReport && !isStatusDialogOpen} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle>Work Report Details</DialogTitle>
                <DialogDescription>
                  Review and assess work report submission
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Current Status */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm">Current Status:</span>
                    <StatusBadge status={selectedReport.status} />
                  </div>
                  <Button 
                    onClick={() => setIsStatusDialogOpen(true)}
                    className="bg-[#003366] hover:bg-[#004488]"
                  >
                    Update Status
                  </Button>
                </div>

                {/* Feedback */}
                {selectedReport.feedback && (
                  <Alert>
                    <AlertDescription>
                      <strong>Previous Feedback:</strong> {selectedReport.feedback}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Student and Internship Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="mb-3 text-[#003366]">Student Information</h4>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-gray-500">Name:</dt>
                        <dd>{selectedReport.studentName}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Student No:</dt>
                        <dd>{selectedReport.studentNo}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Major:</dt>
                        <dd>{selectedReport.major}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h4 className="mb-3 text-[#003366]">Internship Information</h4>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-gray-500">Job Title:</dt>
                        <dd>{selectedReport.jobTitle}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Company:</dt>
                        <dd>{selectedReport.company}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Period:</dt>
                        <dd>{selectedReport.period}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Self-Reflection */}
                <div>
                  <h4 className="mb-3 text-[#003366]">Self-Reflection</h4>
                  <div className="bg-gray-50 rounded-lg p-4 border max-h-96 overflow-y-auto">
                    <p className="text-sm whitespace-pre-wrap">{selectedReport.selfReflection}</p>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h4 className="mb-3 text-[#003366]">Supporting Documents</h4>
                  <div className="space-y-2">
                    {selectedReport.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                        <span className="text-sm">{doc}</span>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* History */}
                <div>
                  <h4 className="mb-3 text-[#003366]">Action History</h4>
                  <div className="space-y-2">
                    {selectedReport.history.map((entry) => (
                      <div key={entry.id} className="border-l-2 border-[#003366] pl-4 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{entry.action}</span>
                          <span className="text-xs text-gray-500">{entry.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-600">by {entry.performedBy}</p>
                        {entry.comments && (
                          <p className="text-sm text-gray-700 mt-1">{entry.comments}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Report Status</DialogTitle>
            <DialogDescription>
              Change the status and provide feedback to the student
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="newStatus">New Status</Label>
              <Select value={newStatus} onValueChange={(v: ReportStatus) => setNewStatus(v)}>
                <SelectTrigger id="newStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reviewed">Mark as Reviewed</SelectItem>
                  <SelectItem value="accepted">Accept</SelectItem>
                  <SelectItem value="rejected">Reject</SelectItem>
                  <SelectItem value="pending_resubmission">Request Resubmission</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="feedback">Feedback / Comments</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback to the student..."
                rows={5}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateStatus}
              className={
                newStatus === 'accepted' ? 'bg-green-600 hover:bg-green-700' :
                newStatus === 'rejected' ? 'bg-red-600 hover:bg-red-700' :
                newStatus === 'pending_resubmission' ? 'bg-orange-600 hover:bg-orange-700' :
                'bg-blue-600 hover:bg-blue-700'
              }
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

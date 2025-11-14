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
import { mockAllEndorsements } from '../../data/mockData';
import { Endorsement } from '../../types';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from 'sonner@2.0.3';

type EndorsementStatus = 'pending_approval' | 'approved' | 'disapproved' | 'pending_resubmission';

export function EndorsementManagement() {
  const [selectedTab, setSelectedTab] = useState<EndorsementStatus | 'all'>('pending_approval');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEndorsement, setSelectedEndorsement] = useState<Endorsement | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<EndorsementStatus>('approved');
  const [feedback, setFeedback] = useState('');

  const endorsements = mockAllEndorsements;

  const filteredEndorsements = endorsements.filter(e => {
    const matchesTab = selectedTab === 'all' || e.status === selectedTab;
    const matchesSearch = 
      e.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.studentNo.includes(searchTerm) ||
      e.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleUpdateStatus = () => {
    toast.success('Endorsement status updated successfully');
    setIsStatusDialogOpen(false);
    setSelectedEndorsement(null);
    setFeedback('');
  };

  const getTabCount = (status: EndorsementStatus | 'all') => {
    if (status === 'all') return endorsements.length;
    return endorsements.filter(e => e.status === status).length;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Endorsement Management</CardTitle>
          <CardDescription>
            Review and manage student internship endorsement applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="pending_approval">
                Pending ({getTabCount('pending_approval')})
              </TabsTrigger>
              <TabsTrigger value="pending_resubmission">
                Resubmission ({getTabCount('pending_resubmission')})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({getTabCount('approved')})
              </TabsTrigger>
              <TabsTrigger value="disapproved">
                Disapproved ({getTabCount('disapproved')})
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
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEndorsements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                          No endorsements found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEndorsements.map((endorsement) => (
                        <TableRow key={endorsement.id} className="hover:bg-gray-50">
                          <TableCell>{endorsement.studentNo}</TableCell>
                          <TableCell>{endorsement.studentName}</TableCell>
                          <TableCell>{endorsement.major}</TableCell>
                          <TableCell>{endorsement.company}</TableCell>
                          <TableCell>{endorsement.jobTitle}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            {new Date(endorsement.submittedDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={endorsement.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedEndorsement(endorsement)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
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
      <Dialog open={!!selectedEndorsement && !isStatusDialogOpen} onOpenChange={() => setSelectedEndorsement(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedEndorsement && (
            <>
              <DialogHeader>
                <DialogTitle>Endorsement Details</DialogTitle>
                <DialogDescription>
                  Review and manage endorsement application
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Current Status */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm">Current Status:</span>
                    <StatusBadge status={selectedEndorsement.status} />
                  </div>
                  <Button 
                    onClick={() => setIsStatusDialogOpen(true)}
                    className="bg-[#003366] hover:bg-[#004488]"
                  >
                    Update Status
                  </Button>
                </div>

                {/* Feedback */}
                {selectedEndorsement.feedback && (
                  <Alert>
                    <AlertDescription>
                      <strong>Previous Feedback:</strong> {selectedEndorsement.feedback}
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
                        <dd>{selectedEndorsement.studentName}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Student No:</dt>
                        <dd>{selectedEndorsement.studentNo}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Major:</dt>
                        <dd>{selectedEndorsement.major}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h4 className="mb-3 text-[#003366]">Position Information</h4>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-gray-500">Job Title:</dt>
                        <dd>{selectedEndorsement.jobTitle}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Company:</dt>
                        <dd>{selectedEndorsement.company}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Department:</dt>
                        <dd>{selectedEndorsement.department}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Period:</dt>
                        <dd>
                          {new Date(selectedEndorsement.startDate).toLocaleDateString()} - {new Date(selectedEndorsement.endDate).toLocaleDateString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Type:</dt>
                        <dd className="capitalize">{selectedEndorsement.employmentType}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Salary:</dt>
                        <dd>{selectedEndorsement.salary}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Supervisor Information */}
                <div>
                  <h4 className="mb-3 text-[#003366]">Supervisor Information</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-gray-500">Name:</dt>
                      <dd>{selectedEndorsement.supervisorName}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Position:</dt>
                      <dd>{selectedEndorsement.supervisorPosition}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Email:</dt>
                      <dd>{selectedEndorsement.supervisorEmail}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Phone:</dt>
                      <dd>{selectedEndorsement.supervisorPhone}</dd>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h4 className="mb-3 text-[#003366]">Supporting Documents</h4>
                  <div className="space-y-2">
                    {selectedEndorsement.documents.map((doc, index) => (
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
                    {selectedEndorsement.history.map((entry) => (
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
            <DialogTitle>Update Endorsement Status</DialogTitle>
            <DialogDescription>
              Change the status and provide feedback to the student
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="newStatus">New Status</Label>
              <Select value={newStatus} onValueChange={(v: EndorsementStatus) => setNewStatus(v)}>
                <SelectTrigger id="newStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approve</SelectItem>
                  <SelectItem value="disapproved">Disapprove</SelectItem>
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
                newStatus === 'approved' ? 'bg-green-600 hover:bg-green-700' :
                newStatus === 'disapproved' ? 'bg-red-600 hover:bg-red-700' :
                'bg-orange-600 hover:bg-orange-700'
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

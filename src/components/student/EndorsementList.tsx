import { useState } from 'react';
import { User } from '../../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
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
} from '../ui/dialog';
import { StatusBadge } from '../shared/StatusBadge';
import { Plus, Eye, Search, Download } from 'lucide-react';
import { mockEndorsements } from '../../data/mockData';
import { Endorsement } from '../../types';
import { Alert, AlertDescription } from '../ui/alert';

interface EndorsementListProps {
  user: User;
  onSubmitNew: () => void;
}

export function EndorsementList({ user, onSubmitNew }: EndorsementListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEndorsement, setSelectedEndorsement] = useState<Endorsement | null>(null);

  const endorsements = mockEndorsements.filter(e => e.studentId === user.id);

  const filteredEndorsements = endorsements.filter(e =>
    e.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Endorsements</CardTitle>
              <CardDescription>Track your internship endorsement applications</CardDescription>
            </div>
            <Button onClick={onSubmitNew} className="bg-[#003366] hover:bg-[#004488]">
              <Plus className="h-4 w-4 mr-2" />
              Submit New Endorsement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by job title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEndorsements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                        No endorsements found. Click "Submit New Endorsement" to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEndorsements.map((endorsement) => (
                      <TableRow key={endorsement.id} className="hover:bg-gray-50">
                        <TableCell>{endorsement.jobTitle}</TableCell>
                        <TableCell>{endorsement.company}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {new Date(endorsement.startDate).toLocaleDateString()} - {new Date(endorsement.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={endorsement.status} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {new Date(endorsement.submittedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedEndorsement(endorsement)}
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
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedEndorsement} onOpenChange={() => setSelectedEndorsement(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedEndorsement && (
            <>
              <DialogHeader>
                <DialogTitle>Endorsement Details</DialogTitle>
                <DialogDescription>
                  Application submitted on {new Date(selectedEndorsement.submittedDate).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status and Feedback */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm">Current Status:</span>
                    <StatusBadge status={selectedEndorsement.status} />
                  </div>

                  {selectedEndorsement.feedback && (
                    <Alert className={
                      selectedEndorsement.status === 'pending_resubmission' 
                        ? 'bg-orange-50 border-orange-200' 
                        : selectedEndorsement.status === 'approved'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }>
                      <AlertDescription className={
                        selectedEndorsement.status === 'pending_resubmission' 
                          ? 'text-orange-800' 
                          : selectedEndorsement.status === 'approved'
                          ? 'text-green-800'
                          : 'text-red-800'
                      }>
                        <strong>Staff Feedback:</strong> {selectedEndorsement.feedback}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Internship Information */}
                <div className="grid md:grid-cols-2 gap-6">
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
                        <dt className="text-gray-500">Employment Type:</dt>
                        <dd className="capitalize">{selectedEndorsement.employmentType}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Salary:</dt>
                        <dd>{selectedEndorsement.salary}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h4 className="mb-3 text-[#003366]">Supervisor Information</h4>
                    <dl className="space-y-2 text-sm">
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
                    </dl>
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
                  <h4 className="mb-3 text-[#003366]">History</h4>
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

                {/* Actions */}
                {selectedEndorsement.status === 'pending_resubmission' && (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSelectedEndorsement(null)}>
                      Close
                    </Button>
                    <Button className="bg-[#003366] hover:bg-[#004488]" onClick={onSubmitNew}>
                      Resubmit Application
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

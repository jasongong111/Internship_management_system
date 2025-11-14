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
import { mockReports } from '../../data/mockData';
import { WorkReport } from '../../types';
import { Alert, AlertDescription } from '../ui/alert';

interface ReportListProps {
  user: User;
  onSubmitNew: () => void;
}

export function ReportList({ user, onSubmitNew }: ReportListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<WorkReport | null>(null);

  const reports = mockReports.filter(r => r.studentId === user.id);

  const filteredReports = reports.filter(r =>
    r.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Work Reports</CardTitle>
              <CardDescription>Submit and track your internship work reports</CardDescription>
            </div>
            <Button onClick={onSubmitNew} className="bg-[#003366] hover:bg-[#004488]">
              <Plus className="h-4 w-4 mr-2" />
              Submit New Report
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
                  {filteredReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                        No reports found. Click "Submit New Report" to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReports.map((report) => (
                      <TableRow key={report.id} className="hover:bg-gray-50">
                        <TableCell>{report.jobTitle}</TableCell>
                        <TableCell>{report.company}</TableCell>
                        <TableCell>{report.period}</TableCell>
                        <TableCell>
                          <StatusBadge status={report.status} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {new Date(report.submittedDate).toLocaleDateString()}
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
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle>Work Report Details</DialogTitle>
                <DialogDescription>
                  Report submitted on {new Date(selectedReport.submittedDate).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status and Feedback */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm">Current Status:</span>
                    <StatusBadge status={selectedReport.status} />
                  </div>

                  {selectedReport.feedback && (
                    <Alert className={
                      selectedReport.status === 'pending_resubmission' 
                        ? 'bg-orange-50 border-orange-200' 
                        : selectedReport.status === 'accepted'
                        ? 'bg-green-50 border-green-200'
                        : selectedReport.status === 'rejected'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-blue-50 border-blue-200'
                    }>
                      <AlertDescription className={
                        selectedReport.status === 'pending_resubmission' 
                          ? 'text-orange-800' 
                          : selectedReport.status === 'accepted'
                          ? 'text-green-800'
                          : selectedReport.status === 'rejected'
                          ? 'text-red-800'
                          : 'text-blue-800'
                      }>
                        <strong>Staff Feedback:</strong> {selectedReport.feedback}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Internship Information */}
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

                {/* Self Reflection */}
                <div>
                  <h4 className="mb-3 text-[#003366]">Self-Reflection</h4>
                  <div className="bg-gray-50 rounded-lg p-4 border">
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
                  <h4 className="mb-3 text-[#003366]">History</h4>
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

                {/* Actions */}
                {selectedReport.status === 'pending_resubmission' && (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSelectedReport(null)}>
                      Close
                    </Button>
                    <Button className="bg-[#003366] hover:bg-[#004488]" onClick={onSubmitNew}>
                      Resubmit Report
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

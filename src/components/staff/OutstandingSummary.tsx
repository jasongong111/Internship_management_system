import { useState } from 'react';
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
import { Badge } from '../ui/badge';
import { Search, Download, AlertCircle } from 'lucide-react';
import { mockAllEndorsements, mockAllReports } from '../../data/mockData';

interface OutstandingItem {
  studentNo: string;
  studentName: string;
  major: string;
  missingEndorsement: boolean;
  missingReport: boolean;
  pendingResubmissions: number;
  lastActivity: string;
}

export function OutstandingSummary() {
  const [searchTerm, setSearchTerm] = useState('');

  // Generate outstanding items summary
  const generateOutstandingSummary = (): OutstandingItem[] => {
    const students = new Map<string, OutstandingItem>();

    // Check for students with no approved endorsement or report
    const allStudentIds = new Set([
      ...mockAllEndorsements.map(e => e.studentId),
      ...mockAllReports.map(r => r.studentId)
    ]);

    allStudentIds.forEach(studentId => {
      const endorsements = mockAllEndorsements.filter(e => e.studentId === studentId);
      const reports = mockAllReports.filter(r => r.studentId === studentId);

      const hasApprovedEndorsement = endorsements.some(e => e.status === 'approved');
      const hasAcceptedReport = reports.some(r => r.status === 'accepted');
      const pendingResubmissions = 
        endorsements.filter(e => e.status === 'pending_resubmission').length +
        reports.filter(r => r.status === 'pending_resubmission').length;

      // Get student info from first endorsement or report
      const studentInfo = endorsements[0] || reports[0];

      if (!hasApprovedEndorsement || !hasAcceptedReport || pendingResubmissions > 0) {
        students.set(studentId, {
          studentNo: studentInfo.studentNo,
          studentName: studentInfo.studentName,
          major: studentInfo.major,
          missingEndorsement: !hasApprovedEndorsement,
          missingReport: !hasAcceptedReport,
          pendingResubmissions,
          lastActivity: studentInfo.lastActionDate
        });
      }
    });

    return Array.from(students.values());
  };

  const outstandingItems = generateOutstandingSummary();

  const filteredItems = outstandingItems.filter(item =>
    item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.studentNo.includes(searchTerm) ||
    item.major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportToExcel = () => {
    // In a real application, this would export to Excel
    console.log('Exporting to Excel...', filteredItems);
    alert('Export functionality would download an Excel file with this data.');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Outstanding Cases Summary</CardTitle>
              <CardDescription>
                Students with missing or pending submissions requiring attention
              </CardDescription>
            </div>
            <Button onClick={handleExportToExcel} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-2xl text-red-600">{outstandingItems.filter(i => i.missingEndorsement).length}</p>
                    <p className="text-sm text-gray-700">Missing Endorsements</p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-2xl text-orange-600">{outstandingItems.filter(i => i.missingReport).length}</p>
                    <p className="text-sm text-gray-700">Missing Reports</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-2xl text-yellow-600">
                      {outstandingItems.reduce((sum, i) => sum + i.pendingResubmissions, 0)}
                    </p>
                    <p className="text-sm text-gray-700">Pending Resubmissions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by student name, ID, or major..."
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
                    <TableHead>Student No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Major</TableHead>
                    <TableHead>Missing Items</TableHead>
                    <TableHead>Pending Resubmissions</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                        {outstandingItems.length === 0 
                          ? 'No outstanding cases! All students are up to date.' 
                          : 'No matching results found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell>{item.studentNo}</TableCell>
                        <TableCell>{item.studentName}</TableCell>
                        <TableCell>{item.major}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {item.missingEndorsement && (
                              <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-300">
                                No Endorsement
                              </Badge>
                            )}
                            {item.missingReport && (
                              <Badge variant="destructive" className="bg-orange-100 text-orange-800 border-orange-300">
                                No Report
                              </Badge>
                            )}
                            {!item.missingEndorsement && !item.missingReport && (
                              <span className="text-gray-500 text-sm">—</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.pendingResubmissions > 0 ? (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              {item.pendingResubmissions} pending
                            </Badge>
                          ) : (
                            <span className="text-gray-500 text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {new Date(item.lastActivity).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {outstandingItems.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="text-sm text-[#003366] mb-2">Actions Required</h4>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• Contact students with missing endorsements or reports</li>
                  <li>• Follow up on pending resubmissions</li>
                  <li>• Review cases approaching deadline</li>
                  <li>• Export this summary for department records</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { StaffView } from './StaffPortal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { 
  FileCheck, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { mockAllEndorsements, mockAllReports } from '../../data/mockData';
import { useState } from 'react';

interface StaffDashboardProps {
  onNavigate: (view: StaffView) => void;
}

export function StaffDashboard({ onNavigate }: StaffDashboardProps) {
  const [academicYear, setAcademicYear] = useState('2025-2026');

  const endorsements = mockAllEndorsements;
  const reports = mockAllReports;

  const pendingEndorsements = endorsements.filter(e => e.status === 'pending_approval').length;
  const approvedEndorsements = endorsements.filter(e => e.status === 'approved').length;
  const disapprovedEndorsements = endorsements.filter(e => e.status === 'disapproved').length;
  const resubmissionEndorsements = endorsements.filter(e => e.status === 'pending_resubmission').length;

  const pendingReports = reports.filter(r => r.status === 'pending_assessment').length;
  const acceptedReports = reports.filter(r => r.status === 'accepted').length;
  const rejectedReports = reports.filter(r => r.status === 'rejected').length;
  const resubmissionReports = reports.filter(r => r.status === 'pending_resubmission').length;

  const totalOutstanding = pendingEndorsements + pendingReports + resubmissionEndorsements + resubmissionReports;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">Staff Dashboard</h1>
            <p className="text-gray-600">
              Manage student internship endorsements and work reports
            </p>
          </div>
          <div className="w-64">
            <Label htmlFor="academicYear">Academic Year</Label>
            <Select value={academicYear} onValueChange={setAcademicYear}>
              <SelectTrigger id="academicYear">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-2026">2025-2026</SelectItem>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        {/* Pending Approvals */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('endorsements')}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Clock className="h-8 w-8 text-yellow-600" />
              <span className="text-3xl">{pendingEndorsements}</span>
            </div>
            <CardTitle className="text-lg">Pending Endorsements</CardTitle>
            <CardDescription>Awaiting approval</CardDescription>
          </CardHeader>
        </Card>

        {/* Pending Reports */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('reports')}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-3xl">{pendingReports}</span>
            </div>
            <CardTitle className="text-lg">Pending Reports</CardTitle>
            <CardDescription>Awaiting assessment</CardDescription>
          </CardHeader>
        </Card>

        {/* Resubmissions */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('outstanding')}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <span className="text-3xl">{resubmissionEndorsements + resubmissionReports}</span>
            </div>
            <CardTitle className="text-lg">Resubmissions</CardTitle>
            <CardDescription>Pending resubmission</CardDescription>
          </CardHeader>
        </Card>

        {/* Total Outstanding */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('outstanding')}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <span className="text-3xl">{totalOutstanding}</span>
            </div>
            <CardTitle className="text-lg">Total Outstanding</CardTitle>
            <CardDescription>Items requiring action</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Endorsement Statistics */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Endorsement Statistics</CardTitle>
                <CardDescription>Overview of all endorsements</CardDescription>
              </div>
              <FileCheck className="h-8 w-8 text-[#003366]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Pending Approval</span>
                </div>
                <span className="text-yellow-600">{pendingEndorsements}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Approved</span>
                </div>
                <span className="text-green-600">{approvedEndorsements}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Disapproved</span>
                </div>
                <span className="text-red-600">{disapprovedEndorsements}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Pending Resubmission</span>
                </div>
                <span className="text-orange-600">{resubmissionEndorsements}</span>
              </div>
            </div>
            <Button 
              className="w-full mt-6" 
              variant="outline"
              onClick={() => onNavigate('endorsements')}
            >
              Manage Endorsements <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Report Statistics */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Report Statistics</CardTitle>
                <CardDescription>Overview of all work reports</CardDescription>
              </div>
              <FileText className="h-8 w-8 text-[#003366]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Pending Assessment</span>
                </div>
                <span className="text-yellow-600">{pendingReports}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Accepted</span>
                </div>
                <span className="text-green-600">{acceptedReports}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Rejected</span>
                </div>
                <span className="text-red-600">{rejectedReports}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Pending Resubmission</span>
                </div>
                <span className="text-orange-600">{resubmissionReports}</span>
              </div>
            </div>
            <Button 
              className="w-full mt-6" 
              variant="outline"
              onClick={() => onNavigate('reports')}
            >
              Manage Reports <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

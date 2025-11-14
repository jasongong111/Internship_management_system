import { User } from '../../App';
import { StudentView } from './StudentPortal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  CheckCircle2, 
  FileCheck, 
  FileText, 
  AlertCircle,
  ArrowRight,
  Clock
} from 'lucide-react';
import { mockEndorsements, mockReports } from '../../data/mockData';
import { StatusBadge } from '../shared/StatusBadge';

interface StudentDashboardProps {
  user: User;
  onNavigate: (view: StudentView) => void;
}

export function StudentDashboard({ user, onNavigate }: StudentDashboardProps) {
  const endorsements = mockEndorsements.filter(e => e.studentId === user.id);
  const reports = mockReports.filter(r => r.studentId === user.id);

  const approvedEndorsements = endorsements.filter(e => e.status === 'approved').length;
  const pendingEndorsements = endorsements.filter(e => e.status === 'pending_approval').length;
  const resubmissionEndorsements = endorsements.filter(e => e.status === 'pending_resubmission').length;
  
  const acceptedReports = reports.filter(r => r.status === 'accepted').length;
  const pendingReports = reports.filter(r => r.status === 'pending_assessment').length;
  const resubmissionReports = reports.filter(r => r.status === 'pending_resubmission').length;

  const hasOutstandingActions = resubmissionEndorsements > 0 || resubmissionReports > 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl mb-2">Welcome back, {user.name}!</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Student ID: {user.studentNo} | Major: {user.major}
        </p>
      </div>

      {/* Notifications */}
      {hasOutstandingActions && (
        <Alert className="bg-orange-50 border-orange-200">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 text-sm sm:text-base">
            You have {resubmissionEndorsements + resubmissionReports} item(s) requiring resubmission. Please review the feedback and update your submissions.
          </AlertDescription>
        </Alert>
      )}

      {/* Status Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Endorsement Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <FileCheck className="h-6 w-6 sm:h-8 sm:w-8 text-[#003366]" />
              <CheckCircle2 className={`h-5 w-5 sm:h-6 sm:w-6 ${approvedEndorsements > 0 ? 'text-green-500' : 'text-gray-300'}`} />
            </div>
            <CardTitle className="text-base sm:text-lg">Endorsements</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Application status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Approved:</span>
                <span className="text-sm sm:text-base text-green-600">{approvedEndorsements}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Pending:</span>
                <span className="text-sm sm:text-base text-yellow-600">{pendingEndorsements}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Resubmission:</span>
                <span className="text-sm sm:text-base text-orange-600">{resubmissionEndorsements}</span>
              </div>
            </div>
            <Button 
              className="w-full mt-4 text-sm sm:text-base" 
              variant="outline"
              onClick={() => onNavigate('endorsements')}
            >
              View All <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Report Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-[#003366]" />
              <CheckCircle2 className={`h-5 w-5 sm:h-6 sm:w-6 ${acceptedReports > 0 ? 'text-green-500' : 'text-gray-300'}`} />
            </div>
            <CardTitle className="text-base sm:text-lg">Work Reports</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Submission status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Accepted:</span>
                <span className="text-sm sm:text-base text-green-600">{acceptedReports}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Pending:</span>
                <span className="text-sm sm:text-base text-yellow-600">{pendingReports}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Resubmission:</span>
                <span className="text-sm sm:text-base text-orange-600">{resubmissionReports}</span>
              </div>
            </div>
            <Button 
              className="w-full mt-4 text-sm sm:text-base" 
              variant="outline"
              onClick={() => onNavigate('reports')}
            >
              View All <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Outstanding Actions */}
        <Card className="sm:col-span-2 md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
            </div>
            <CardTitle className="text-base sm:text-lg">Outstanding Actions</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {resubmissionEndorsements > 0 && (
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <p className="text-xs sm:text-sm text-orange-800">
                    {resubmissionEndorsements} endorsement(s) need resubmission
                  </p>
                </div>
              )}
              {resubmissionReports > 0 && (
                <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <p className="text-xs sm:text-sm text-orange-800">
                    {resubmissionReports} report(s) need resubmission
                  </p>
                </div>
              )}
              {!hasOutstandingActions && (
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-xs sm:text-sm text-green-800">
                    No outstanding actions! Great job! 🎉
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Your latest submissions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...endorsements, ...reports]
              .sort((a, b) => new Date(b.lastActionDate).getTime() - new Date(a.lastActionDate).getTime())
              .slice(0, 5)
              .map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 border-b pb-3 last:border-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {'jobTitle' in item && 'company' in item ? (
                      <FileCheck className="h-4 w-4 sm:h-5 sm:w-5 text-[#003366] flex-shrink-0" />
                    ) : (
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#003366] flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm truncate">{item.jobTitle} - {item.company}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        Last updated: {new Date(item.lastActionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
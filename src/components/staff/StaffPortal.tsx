import { useState } from 'react';
import { User } from '../../App';
import { Header } from '../shared/Header';
import { StaffDashboard } from './StaffDashboard';
import { EndorsementManagement } from './EndorsementManagement';
import { ReportManagement } from './ReportManagement';
import { OutstandingSummary } from './OutstandingSummary';
import { EmployerEvaluationManagement } from './EmployerEvaluationManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LayoutDashboard, FileCheck, FileText, AlertCircle, Mail } from 'lucide-react';

interface StaffPortalProps {
  user: User;
  onLogout: () => void;
}

export type StaffView = 'dashboard' | 'endorsements' | 'reports' | 'evaluations' | 'outstanding';

export function StaffPortal({ user, onLogout }: StaffPortalProps) {
  const [currentView, setCurrentView] = useState<StaffView>('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as StaffView)} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-4xl text-xs sm:text-sm overflow-x-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
              <LayoutDashboard className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="endorsements" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
              <FileCheck className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Endorsements</span>
              <span className="md:hidden">Endorse</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Reports</span>
              <span className="sm:hidden">Rpt</span>
            </TabsTrigger>
            <TabsTrigger value="evaluations" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Evaluations</span>
              <span className="md:hidden">Eval</span>
            </TabsTrigger>
            <TabsTrigger value="outstanding" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Outstanding</span>
              <span className="md:hidden">Due</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <StaffDashboard onNavigate={setCurrentView} />
          </TabsContent>

          <TabsContent value="endorsements">
            <EndorsementManagement />
          </TabsContent>

          <TabsContent value="reports">
            <ReportManagement />
          </TabsContent>

          <TabsContent value="evaluations">
            <EmployerEvaluationManagement />
          </TabsContent>

          <TabsContent value="outstanding">
            <OutstandingSummary />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
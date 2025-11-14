import { useState } from 'react';
import { User } from '../../App';
import { Header } from '../shared/Header';
import { StudentDashboard } from './StudentDashboard';
import { EndorsementList } from './EndorsementList';
import { SubmitEndorsement } from './SubmitEndorsement';
import { ReportList } from './ReportList';
import { SubmitReport } from './SubmitReport';
import { Resources } from './Resources';
import { Profile } from './Profile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  LayoutDashboard, 
  FileCheck, 
  FileText, 
  BookOpen, 
  User as UserIcon 
} from 'lucide-react';

interface StudentPortalProps {
  user: User;
  onLogout: () => void;
}

export type StudentView = 
  | 'dashboard'
  | 'endorsements'
  | 'submit-endorsement'
  | 'reports'
  | 'submit-report'
  | 'resources'
  | 'profile';

export function StudentPortal({ user, onLogout }: StudentPortalProps) {
  const [currentView, setCurrentView] = useState<StudentView>('dashboard');

  // Map currentView to the active tab value
  const getActiveTab = (): string => {
    if (currentView === 'submit-endorsement') return 'endorsements';
    if (currentView === 'submit-report') return 'reports';
    return currentView;
  };

  const handleTabChange = (value: string) => {
    // When switching tabs, reset to the base view
    if (value === 'endorsements') {
      setCurrentView('endorsements');
    } else if (value === 'reports') {
      setCurrentView('reports');
    } else {
      setCurrentView(value as StudentView);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <Tabs value={getActiveTab()} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-4xl text-xs sm:text-sm">
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
              <span className="hidden md:inline">Work Reports</span>
              <span className="md:hidden">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Resources</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3">
              <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <StudentDashboard user={user} onNavigate={setCurrentView} />
          </TabsContent>

          <TabsContent value="endorsements">
            {currentView === 'submit-endorsement' ? (
              <SubmitEndorsement user={user} onBack={() => setCurrentView('endorsements')} />
            ) : (
              <EndorsementList user={user} onSubmitNew={() => setCurrentView('submit-endorsement')} />
            )}
          </TabsContent>

          <TabsContent value="reports">
            {currentView === 'submit-report' ? (
              <SubmitReport user={user} onBack={() => setCurrentView('reports')} />
            ) : (
              <ReportList user={user} onSubmitNew={() => setCurrentView('submit-report')} />
            )}
          </TabsContent>

          <TabsContent value="resources">
            <Resources />
          </TabsContent>

          <TabsContent value="profile">
            <Profile user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
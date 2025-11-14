import { User } from '../../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { User as UserIcon, Mail, GraduationCap, Hash } from 'lucide-react';

interface ProfileProps {
  user: User;
}

export function Profile({ user }: ProfileProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            Your account information from HKBU Single Sign-On
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4 pb-6 border-b">
            <Avatar className="h-20 w-20 bg-[#003366]">
              <AvatarFallback className="text-2xl text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.role === 'student' ? 'Student' : 'Staff Member'}</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <UserIcon className="h-4 w-4" />
                  Full Name
                </Label>
                <Input value={user.name} disabled />
              </div>
              {user.studentNo && (
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Hash className="h-4 w-4" />
                    Student Number
                  </Label>
                  <Input value={user.studentNo} disabled />
                </div>
              )}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input value={user.email} disabled />
              </div>
              {user.major && (
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-4 w-4" />
                    Major
                  </Label>
                  <Input value={user.major} disabled />
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Your profile information is automatically synchronized with the HKBU Single Sign-On system. 
              If you need to update your personal information, please contact the Student Registry or IT Services.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="text-sm">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive email updates on status changes</p>
              </div>
              <div className="text-sm text-gray-600">Enabled by default</div>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="text-sm">Resubmission Reminders</p>
                <p className="text-xs text-gray-500">Get reminded about pending resubmissions</p>
              </div>
              <div className="text-sm text-gray-600">Enabled by default</div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm">Deadline Alerts</p>
                <p className="text-xs text-gray-500">Receive alerts for upcoming deadlines</p>
              </div>
              <div className="text-sm text-gray-600">Enabled by default</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

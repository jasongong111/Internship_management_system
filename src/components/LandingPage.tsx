import { UserRole } from "../App";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  GraduationCap,
  Building2,
  FileText,
} from "lucide-react";
import hkbuLogo from "figma:asset/871fd60940b778989e43378380834e6c4048352d.png";

interface LandingPageProps {
  onLogin: (role: UserRole) => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-[#003366] text-white py-4 sm:py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl">
                Internship Management System
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4 text-[#003366]">
              Welcome to the Internship Management System
            </h2>

            {/* SSO Login Button */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl mb-3 sm:mb-4 text-[#003366]">
                Sign In
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Use your HKBU Single Sign-On credentials to
                access the system
              </p>

              {/* Demo buttons - in production, this would be a single SSO button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  onClick={() => onLogin("student")}
                  className="bg-[#003366] hover:bg-[#004488] text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg w-full sm:w-auto"
                >
                  Login as Student (Demo)
                </Button>
                <Button
                  onClick={() => onLogin("staff")}
                  className="bg-[#006699] hover:bg-[#0077aa] text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg w-full sm:w-auto"
                >
                  Login as Staff (Demo)
                </Button>
              </div>

              {/* Employer Evaluation Demo Link */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                  <strong>Employer Evaluation Demo:</strong>
                </p>
                <div className="flex flex-col gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <a
                    href="/?evaluation=demo"
                    className="text-[#003366] hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    → View Sample Evaluation Form (Valid Link)
                  </a>
                  <a
                    href="/?evaluation=submitted"
                    className="text-gray-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    → Already Submitted Evaluation
                  </a>
                  <a
                    href="/?evaluation=expired"
                    className="text-gray-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    → Expired Evaluation Link
                  </a>
                  <a
                    href="/?evaluation=invalid"
                    className="text-gray-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    → Invalid Evaluation Link
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-[#003366] mb-2" />
                <CardTitle className="text-base sm:text-lg">
                  Submit Endorsements
                </CardTitle>
                <CardDescription className="text-sm">
                  Students can submit internship endorsement
                  applications with supporting documents
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-[#003366] mb-2" />
                <CardTitle className="text-base sm:text-lg">
                  Track Status
                </CardTitle>
                <CardDescription className="text-sm">
                  Monitor approval status and receive feedback
                  from academic staff
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="sm:col-span-2 md:col-span-1">
              <CardHeader>
                <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-[#003366] mb-2" />
                <CardTitle className="text-base sm:text-lg">
                  Work Reports
                </CardTitle>
                <CardDescription className="text-sm">
                  Submit and manage internship work reports with
                  self-reflections
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Footer Information */}
          <div className="bg-gray-100 rounded-lg p-4 sm:p-6">
            <h3 className="mb-2 sm:mb-3 text-[#003366] text-base sm:text-lg">
              System Usage Notes
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
              <li>
                • All submissions require approval from academic
                staff
              </li>
              <li>
                • Upload supporting documents in PDF or DOC
                format (max 10MB)
              </li>
              <li>
                • Check your dashboard regularly for status
                updates and feedback
              </li>
              <li>
                • Contact your department coordinator for
                assistance
              </li>
            </ul>
            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <a href="#" className="hover:text-[#003366]">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-[#003366]">
                Terms of Use
              </a>
              <span>•</span>
              <a href="#" className="hover:text-[#003366]">
                Help & Support
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
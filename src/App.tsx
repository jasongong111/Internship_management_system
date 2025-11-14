import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { StudentPortal } from "./components/student/StudentPortal";
import { StaffPortal } from "./components/staff/StaffPortal";
import { EmployerPortal } from "./components/employer/EmployerPortal";

export type UserRole =
  | "student"
  | "Internship Coordinator"
  | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentNo?: string;
  major?: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [evaluationToken, setEvaluationToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if this is an employer evaluation access
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('evaluation');
    if (token) {
      setEvaluationToken(token);
    }
  }, []);

  const handleLogin = (role: UserRole) => {
    // Mock SSO login - in production this would redirect to HKBU SSO
    if (role === "student") {
      setUser({
        id: "1",
        name: "John Chan",
        email: "johnchan@life.hkbu.edu.hk",
        role: "student",
        studentNo: "22012345",
        major: "Computer Science",
      });
    } else {
      setUser({
        id: "2",
        name: "Dr. LAI, Jean Hok Yin",
        email: "jeanlai@comp.hkbu.edu.hk",
        role: "Internship Coordinator",
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Employer portal access via evaluation token
  if (evaluationToken) {
    return <EmployerPortal evaluationToken={evaluationToken} />;
  }

  if (!user) {
    return <LandingPage onLogin={handleLogin} />;
  }

  if (user.role === "student") {
    return (
      <StudentPortal user={user} onLogout={handleLogout} />
    );
  }

  if (user.role === "Internship Coordinator") {
    return <StaffPortal user={user} onLogout={handleLogout} />;
  }

  return null;
}
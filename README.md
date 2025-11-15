# Internship Management System Design

A comprehensive web application for managing student internships at Hong Kong Baptist University (HKBU). This system facilitates the entire internship lifecycle from application submission to employer evaluation.

**Original Design:** [Figma Design](https://www.figma.com/design/MN7ZKyPJwO4WiTpKSYSbxp/Internship-Management-System-Design)

## 🚀 Features

### Core Functionality

- **Student Portal**
  - Submit internship endorsement applications
  - Upload supporting documents
  - Submit work reports with self-reflection
  - View employer evaluations
  - Track application and report status

- **Staff Portal (Internship Coordinator)**
  - Review and approve/reject endorsements
  - Assess work reports
  - Manage employer evaluations
  - Send evaluation links to employers
  - Track evaluation submission status
  - View comprehensive dashboards and reports

- **Employer Evaluation System (F-004)** ⭐
  - **Exclusive Link Access**: No registration required - employers access evaluation forms via secure, time-limited links
  - **Automatic Link Generation**: Links are automatically generated when internships end
  - **7-Day Validity**: Each link is valid for 7 days from send date
  - **Draft Saving**: Employers can save drafts and resume later (auto-save every 2 seconds)
  - **Automated Reminders**: System sends up to 3 reminders (3 days, 1 day, 12 hours before expiration)
  - **Mobile-Optimized**: Responsive design supporting screen sizes 320px to 1920px+
  - **Read-Only Mode**: Submitted evaluations become read-only
  - **Instant Notifications**: Coordinators and students are notified immediately upon submission

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Internship Management System Design"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - The application will automatically reload when you make changes

## 🏗️ Project Structure

```
src/
├── components/
│   ├── employer/
│   │   ├── EmployerEvaluationForm.tsx    # Evaluation form component
│   │   ├── EmployerPortal.tsx            # Portal for employer access via token
│   │   └── EvaluationLinkDemo.tsx         # Demo page for testing links
│   ├── student/
│   │   ├── StudentPortal.tsx             # Main student portal
│   │   ├── StudentDashboard.tsx          # Student dashboard
│   │   ├── EndorsementList.tsx           # List of endorsements
│   │   ├── SubmitEndorsement.tsx         # Endorsement submission form
│   │   ├── ReportList.tsx                # List of work reports
│   │   ├── SubmitReport.tsx              # Report submission form
│   │   └── EvaluationList.tsx            # View employer evaluations
│   ├── staff/
│   │   ├── StaffPortal.tsx               # Main staff portal
│   │   ├── StaffDashboard.tsx            # Staff dashboard
│   │   ├── EndorsementManagement.tsx     # Manage endorsements
│   │   ├── ReportManagement.tsx          # Manage reports
│   │   └── EmployerEvaluationManagement.tsx  # Manage evaluations
│   ├── shared/                           # Shared components
│   └── ui/                               # UI component library (shadcn/ui)
├── data/
│   └── mockData.ts                       # Mock data for development
├── types/
│   └── index.ts                          # TypeScript type definitions
├── utils/
│   ├── evaluationToken.ts                # Token generation & validation
│   ├── draftStorage.ts                  # Draft saving functionality
│   ├── emailService.ts                  # Email notification service
│   ├── reminderService.ts               # Automated reminder system
│   ├── autoLinkGeneration.ts            # Auto-generate links on end date
│   └── evaluationStorage.ts             # Evaluation data storage
├── App.tsx                               # Main application component
└── main.tsx                              # Application entry point
```

## 🎯 Key Features Explained

### Employer Evaluation Link System

The evaluation system eliminates registration friction by providing secure, one-click access:

1. **Link Generation**: When an internship ends, the system automatically generates a unique, encrypted evaluation token
2. **Email Delivery**: Link is sent to the employer's email with sender name "HKBU Internship Evaluation"
3. **Access**: Employer clicks the link - no login required
4. **Evaluation**: Form displays student information and internship period for verification
5. **Draft Saving**: Progress is auto-saved every 2 seconds, can be resumed within 7 days
6. **Submission**: Once submitted, form becomes read-only
7. **Notifications**: Coordinator and student receive instant notifications

### Evaluation Form Features

- **Performance Ratings**: 8 categories rated on 1-5 scale (Poor to Excellent)
  - Technical Skills
  - Communication Skills
  - Teamwork
  - Problem Solving
  - Work Ethic
  - Adaptability
  - Initiative
  - Overall Performance

- **Written Feedback**: 
  - Key Strengths (required)
  - Areas for Improvement (required)
  - Additional Comments (optional)

- **Overall Assessment**:
  - Would hire again (Yes/Maybe/No)
  - Would recommend to other employers

## 🧪 Testing & Demo

### Demo Links

Access the evaluation link demo page:
```
http://localhost:3000/?demo=evaluation-links
```

### Test Evaluation Links

From the landing page or demo page, you can test:

- **Valid Link**: `/?evaluation=demo` - Active evaluation form
- **Submitted**: `/?evaluation=submitted` - Read-only submitted evaluation
- **Expired**: `/?evaluation=expired` - Expired link error
- **Invalid**: `/?evaluation=invalid` - Invalid token error

### Demo Accounts

**Student Login:**
- Name: John Chan
- Student No: 22012345
- Major: Computer Science

**Staff Login:**
- Name: Dr. LAI, Jean Hok Yin
- Role: Internship Coordinator

## 🛡️ Security Features

- **Token-Based Authentication**: Evaluation links use cryptographically secure tokens
- **Time-Limited Access**: Links expire after 7 days
- **One-Time Use**: Links become read-only after submission
- **Token Validation**: All tokens are validated before granting access
- **No Registration Required**: Eliminates friction while maintaining security

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1920px+)

## 🎨 Technology Stack

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 6.3.5
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast notifications)
- **Forms**: React Hook Form
- **Type Safety**: TypeScript

## 📝 Development Notes

### Mock Data

The application uses mock data stored in:
- `src/data/mockData.ts` - Endorsements and reports
- `localStorage` - Evaluation drafts and submitted evaluations

### Email Service

The email service (`src/utils/emailService.ts`) is currently a mock implementation. In production, this would integrate with:
- SendGrid
- AWS SES
- Or another email service provider

### Backend Integration

Currently, the application uses:
- `localStorage` for data persistence
- Mock API calls with simulated delays

For production, replace these with actual API calls to your backend service.

### Automatic Link Generation

The system includes logic to automatically generate evaluation links when internships end. In production, this would run as a scheduled job (cron) that:
1. Checks for internships ending today
2. Generates evaluation tokens
3. Sends email notifications
4. Updates database records

## 🔄 Key Workflows

### Student Workflow
1. Submit internship endorsement → Wait for approval
2. Start internship → Submit work reports
3. Internship ends → Receive employer evaluation notification
4. View evaluation results in student portal

### Staff Workflow
1. Review endorsement applications → Approve/Reject
2. Review work reports → Accept/Request resubmission
3. Send evaluation links (automatic or manual)
4. Track evaluation submission status
5. View submitted evaluations

### Employer Workflow
1. Receive evaluation link via email
2. Click link → Access evaluation form (no login)
3. Fill out evaluation (can save draft)
4. Submit evaluation → Form becomes read-only
5. Receive confirmation

## 📊 Status Tracking

### Endorsement Status
- `pending_approval` - Awaiting staff review
- `approved` - Approved for internship
- `disapproved` - Rejected
- `pending_resubmission` - Needs revision

### Report Status
- `pending_assessment` - Awaiting review
- `reviewed` - Under review
- `accepted` - Accepted
- `rejected` - Rejected
- `pending_resubmission` - Needs revision

### Evaluation Status
- `not_sent` - Link not yet sent
- `sent` - Link sent, awaiting submission
- `submitted` - Evaluation completed
- `expired` - Link expired (7 days)

## 🐛 Known Limitations

- Email service is mocked (console.log only)
- Data persistence uses localStorage (not persistent across devices)
- Automatic link generation is logged but not executed (requires backend)
- Reminder system is set up but requires backend cron job for automation

## 📚 Additional Documentation

- `TEST_ENGINEERING_SPEC.md` - Comprehensive testing specifications
- `COMP3047_TestPlan.md` - Test plan documentation
- `src/RESPONSIVE_DESIGN_SUMMARY.md` - Responsive design guidelines

## 🤝 Contributing

This is a design implementation project. For production deployment:

1. Replace mock data with API integration
2. Implement actual email service
3. Set up backend database
4. Configure scheduled jobs for automation
5. Add authentication/authorization
6. Implement proper error handling and logging

## 📄 License

This project is part of an academic assignment for COMP3047 at Hong Kong Baptist University.

## 👥 Contact

For questions or issues, please contact the development team or refer to the project documentation.

---

**Last Updated**: 2025
**Version**: 0.1.0

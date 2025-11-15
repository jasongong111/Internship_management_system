/**
 * Mock email service for sending evaluation links and reminders
 * In production, this would integrate with an actual email service (e.g., SendGrid, AWS SES)
 */

import { Endorsement } from '../types';

/**
 * Send evaluation link email to employer
 */
export async function sendEvaluationLinkEmail(
  endorsement: Endorsement,
  evaluationLink: string
): Promise<void> {
  // In production, this would make an API call to send the email
  console.log('📧 Sending evaluation link email:', {
    to: endorsement.supervisorEmail,
    from: 'HKBU Internship Evaluation',
    subject: `Student Evaluation Request: ${endorsement.studentName}`,
    link: evaluationLink,
  });
  
  // Simulate email sending
  await new Promise(resolve => setTimeout(resolve, 500));
}

/**
 * Send reminder email to employer
 */
export async function sendReminderEmail(
  endorsement: Endorsement,
  evaluationLink: string,
  reminderType: '3days' | '1day' | '12hours'
): Promise<void> {
  const reminderMessages = {
    '3days': '3 days remaining',
    '1day': '1 day remaining',
    '12hours': '12 hours remaining',
  };
  
  // In production, this would make an API call to send the email
  console.log('📧 Sending reminder email:', {
    to: endorsement.supervisorEmail,
    from: 'HKBU Internship Evaluation',
    subject: `Reminder: Student Evaluation - ${reminderMessages[reminderType]}`,
    link: evaluationLink,
    reminderType,
  });
  
  // Simulate email sending
  await new Promise(resolve => setTimeout(resolve, 500));
}

/**
 * Send notification email to coordinator when evaluation is submitted
 */
export async function sendCoordinatorNotificationEmail(
  endorsement: Endorsement,
  evaluationId: string
): Promise<void> {
  // In production, this would make an API call to send the email
  console.log('📧 Sending coordinator notification:', {
    subject: `New Evaluation Submitted: ${endorsement.studentName}`,
    studentName: endorsement.studentName,
    studentNo: endorsement.studentNo,
    company: endorsement.company,
    evaluationId,
  });
  
  // Simulate email sending
  await new Promise(resolve => setTimeout(resolve, 500));
}

/**
 * Send notification email to student when evaluation is available
 */
export async function sendStudentNotificationEmail(
  endorsement: Endorsement,
  evaluationLink: string
): Promise<void> {
  // In production, this would make an API call to send the email
  console.log('📧 Sending student notification:', {
    to: `student-${endorsement.studentNo}@life.hkbu.edu.hk`,
    from: 'HKBU Internship Evaluation',
    subject: `Your Employer Evaluation is Now Available`,
    link: evaluationLink,
  });
  
  // Simulate email sending
  await new Promise(resolve => setTimeout(resolve, 500));
}


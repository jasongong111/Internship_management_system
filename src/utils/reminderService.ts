/**
 * Automated reminder service for evaluation links
 * Checks and sends reminders at 3 days, 1 day, and 12 hours before expiration
 */

import { Endorsement } from '../types';
import { shouldSendReminder, getDaysUntilExpiration } from './evaluationToken';
import { sendReminderEmail } from './emailService';

/**
 * Check all endorsements and send reminders if needed
 * This would typically run as a scheduled job (cron) in production
 */
export async function processReminders(endorsements: Endorsement[]): Promise<{
  remindersSent: number;
  errors: string[];
}> {
  const results = {
    remindersSent: 0,
    errors: [] as string[],
  };

  for (const endorsement of endorsements) {
    // Skip if already submitted
    if (endorsement.evaluationSubmittedDate) {
      continue;
    }

    // Skip if no evaluation link has been sent
    if (!endorsement.evaluationSentDate || !endorsement.evaluationToken) {
      continue;
    }

    // Check if link has expired
    const daysRemaining = getDaysUntilExpiration(endorsement.evaluationSentDate);
    if (daysRemaining <= 0) {
      continue;
    }

    // Check if reminder should be sent
    const reminderType = shouldSendReminder(
      endorsement.evaluationSentDate,
      endorsement.evaluationRemindersSent || 0
    );

    if (reminderType) {
      try {
        const evaluationLink = `${window.location.origin}/?evaluation=${endorsement.evaluationToken}`;
        await sendReminderEmail(endorsement, evaluationLink, reminderType);
        
        // In production, this would update the database
        // For now, we'll just log it
        console.log(`Reminder sent: ${reminderType} for ${endorsement.studentName}`);
        results.remindersSent++;
      } catch (error) {
        const errorMsg = `Failed to send reminder for ${endorsement.studentName}: ${error}`;
        console.error(errorMsg);
        results.errors.push(errorMsg);
      }
    }
  }

  return results;
}

/**
 * Get reminders that should be sent (for display purposes)
 */
export function getPendingReminders(endorsements: Endorsement[]): Array<{
  endorsement: Endorsement;
  reminderType: '3days' | '1day' | '12hours';
  daysRemaining: number;
}> {
  const pending: Array<{
    endorsement: Endorsement;
    reminderType: '3days' | '1day' | '12hours';
    daysRemaining: number;
  }> = [];

  for (const endorsement of endorsements) {
    if (endorsement.evaluationSubmittedDate) continue;
    if (!endorsement.evaluationSentDate || !endorsement.evaluationToken) continue;

    const daysRemaining = getDaysUntilExpiration(endorsement.evaluationSentDate);
    if (daysRemaining <= 0) continue;

    const reminderType = shouldSendReminder(
      endorsement.evaluationSentDate,
      endorsement.evaluationRemindersSent || 0
    );

    if (reminderType) {
      pending.push({
        endorsement,
        reminderType,
        daysRemaining,
      });
    }
  }

  return pending;
}


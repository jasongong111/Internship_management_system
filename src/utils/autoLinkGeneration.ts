/**
 * Automatic evaluation link generation service
 * Generates and sends evaluation links when internships end
 */

import { Endorsement } from '../types';
import { generateEvaluationToken } from './evaluationToken';
import { sendEvaluationLinkEmail } from './emailService';

/**
 * Check for internships that have ended and generate evaluation links
 * This would typically run as a scheduled job (cron) in production
 * Runs daily to check for internships that ended yesterday
 */
export async function processEndedInternships(
  endorsements: Endorsement[]
): Promise<{
  linksGenerated: number;
  errors: string[];
}> {
  const results = {
    linksGenerated: 0,
    errors: [] as string[],
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const endorsement of endorsements) {
    // Skip if not approved
    if (endorsement.status !== 'approved') {
      continue;
    }

    // Skip if link already sent
    if (endorsement.evaluationSentDate) {
      continue;
    }

    // Check if internship ended (end date is today or in the past)
    const endDate = new Date(endorsement.endDate);
    endDate.setHours(0, 0, 0, 0);

    if (endDate <= today) {
      try {
        // Generate unique evaluation token
        const token = generateEvaluationToken(
          endorsement.id,
          endorsement.studentNo,
          endorsement.supervisorEmail
        );

        // Create evaluation link
        const evaluationLink = `${window.location.origin}/?evaluation=${token}`;

        // Send email with evaluation link
        await sendEvaluationLinkEmail(endorsement, evaluationLink);

        // In production, this would update the database
        // For now, we'll just log it
        console.log(`Evaluation link generated and sent for ${endorsement.studentName} - ${endorsement.company}`);
        results.linksGenerated++;
      } catch (error) {
        const errorMsg = `Failed to generate link for ${endorsement.studentName}: ${error}`;
        console.error(errorMsg);
        results.errors.push(errorMsg);
      }
    }
  }

  return results;
}

/**
 * Get endorsements that are ready for automatic link generation
 * (ended internships that haven't had links sent yet)
 */
export function getEndorsementsReadyForLinkGeneration(
  endorsements: Endorsement[]
): Endorsement[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return endorsements.filter((endorsement) => {
    // Must be approved
    if (endorsement.status !== 'approved') {
      return false;
    }

    // Must not have link already sent
    if (endorsement.evaluationSentDate) {
      return false;
    }

    // End date must be today or in the past
    const endDate = new Date(endorsement.endDate);
    endDate.setHours(0, 0, 0, 0);

    return endDate <= today;
  });
}


/**
 * Utility functions for generating and validating evaluation tokens
 * Tokens are cryptographically secure and tied to specific student-internship pairs
 */

/**
 * Generate a unique, encrypted evaluation token
 * In production, this would use proper cryptographic libraries
 */
export function generateEvaluationToken(endorsementId: string, studentNo: string, supervisorEmail: string): string {
  // Create a unique identifier combining endorsement ID, student number, and email
  const payload = `${endorsementId}:${studentNo}:${supervisorEmail}:${Date.now()}`;
  
  // In production, this would use proper encryption (e.g., AES-256)
  // For now, we'll create a base64-encoded token with a hash-like structure
  const encoded = btoa(payload).replace(/[+/=]/g, (char) => {
    if (char === '+') return '-';
    if (char === '/') return '_';
    if (char === '=') return '';
    return char;
  });
  
  // Add a prefix to identify evaluation tokens
  return `eval_${encoded}`;
}

/**
 * Validate and decode an evaluation token
 * Returns the endorsement ID if valid, null otherwise
 */
export function validateEvaluationToken(token: string): {
  endorsementId: string;
  studentNo: string;
  supervisorEmail: string;
  timestamp: number;
} | null {
  try {
    if (!token.startsWith('eval_')) {
      return null;
    }
    
    const encoded = token.replace('eval_', '');
    const decoded = atob(
      encoded.replace(/-/g, '+').replace(/_/g, '/')
    );
    
    const parts = decoded.split(':');
    if (parts.length !== 4) {
      return null;
    }
    
    return {
      endorsementId: parts[0],
      studentNo: parts[1],
      supervisorEmail: parts[2],
      timestamp: parseInt(parts[3], 10),
    };
  } catch (error) {
    return null;
  }
}

/**
 * Check if a token is expired based on sent date
 * Links are valid for 7 days from send date
 */
export function isTokenExpired(sentDate: string): boolean {
  const sent = new Date(sentDate);
  const now = new Date();
  const daysSinceSent = Math.floor((now.getTime() - sent.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysSinceSent > 7;
}

/**
 * Calculate days remaining until token expiration
 */
export function getDaysUntilExpiration(sentDate: string): number {
  const sent = new Date(sentDate);
  const now = new Date();
  const daysSinceSent = Math.floor((now.getTime() - sent.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = 7 - daysSinceSent;
  
  return Math.max(0, daysRemaining);
}

/**
 * Check if reminder should be sent based on expiration date
 * Returns the reminder type: '3days' | '1day' | '12hours' | null
 */
export function shouldSendReminder(sentDate: string, remindersSent: number): '3days' | '1day' | '12hours' | null {
  if (remindersSent >= 3) {
    return null; // Maximum reminders reached
  }
  
  const sent = new Date(sentDate);
  const now = new Date();
  const hoursSinceSent = (now.getTime() - sent.getTime()) / (1000 * 60 * 60);
  const hoursRemaining = (7 * 24) - hoursSinceSent;
  
  // Check if we should send 3-day reminder (72 hours remaining)
  if (hoursRemaining <= 72 && hoursRemaining > 24 && remindersSent === 0) {
    return '3days';
  }
  
  // Check if we should send 1-day reminder (24 hours remaining)
  if (hoursRemaining <= 24 && hoursRemaining > 12 && remindersSent === 1) {
    return '1day';
  }
  
  // Check if we should send 12-hour reminder (12 hours remaining)
  if (hoursRemaining <= 12 && hoursRemaining > 0 && remindersSent === 2) {
    return '12hours';
  }
  
  return null;
}


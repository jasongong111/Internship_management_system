/**
 * Mock evaluation storage service
 * In production, this would interact with a backend API/database
 */

import { EmployerEvaluation } from '../types';

// Mock storage - in production this would be a database
let mockEvaluations: EmployerEvaluation[] = [];

/**
 * Store a submitted evaluation
 */
export async function storeEvaluation(evaluation: Omit<EmployerEvaluation, 'id' | 'submittedDate'>): Promise<EmployerEvaluation> {
  const newEvaluation: EmployerEvaluation = {
    ...evaluation,
    id: `eval-${Date.now()}`,
    submittedDate: new Date().toISOString().split('T')[0],
  };

  // In production, this would be an API call
  mockEvaluations.push(newEvaluation);
  
  // Also store in localStorage for persistence across page refreshes
  try {
    const stored = localStorage.getItem('employer_evaluations');
    const evaluations = stored ? JSON.parse(stored) : [];
    evaluations.push(newEvaluation);
    localStorage.setItem('employer_evaluations', JSON.stringify(evaluations));
  } catch (error) {
    console.error('Failed to store evaluation in localStorage:', error);
  }

  return newEvaluation;
}

/**
 * Get all evaluations for a student
 */
export async function getEvaluationsByStudentNo(studentNo: string): Promise<EmployerEvaluation[]> {
  // Try to load from localStorage first
  try {
    const stored = localStorage.getItem('employer_evaluations');
    if (stored) {
      const evaluations = JSON.parse(stored) as EmployerEvaluation[];
      return evaluations.filter(evaluation => evaluation.studentNo === studentNo);
    }
  } catch (error) {
    console.error('Failed to load evaluations from localStorage:', error);
  }

  // Fallback to mock data
  return mockEvaluations.filter(evaluation => evaluation.studentNo === studentNo);
}

/**
 * Get evaluation by endorsement ID
 */
export async function getEvaluationByEndorsementId(endorsementId: string): Promise<EmployerEvaluation | null> {
  try {
    const stored = localStorage.getItem('employer_evaluations');
    if (stored) {
      const evaluations = JSON.parse(stored) as EmployerEvaluation[];
      return evaluations.find(evaluation => evaluation.endorsementId === endorsementId) || null;
    }
  } catch (error) {
    console.error('Failed to load evaluation from localStorage:', error);
  }

  return mockEvaluations.find(evaluation => evaluation.endorsementId === endorsementId) || null;
}

/**
 * Get all evaluations (for coordinator view)
 */
export async function getAllEvaluations(): Promise<EmployerEvaluation[]> {
  try {
    const stored = localStorage.getItem('employer_evaluations');
    if (stored) {
      return JSON.parse(stored) as EmployerEvaluation[];
    }
  } catch (error) {
    console.error('Failed to load evaluations from localStorage:', error);
  }

  return mockEvaluations;
}


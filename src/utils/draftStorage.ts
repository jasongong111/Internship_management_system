/**
 * Utility functions for saving and loading evaluation drafts
 * Uses localStorage to persist drafts across sessions
 */

import { EvaluationDraft } from '../types';

const DRAFT_PREFIX = 'evaluation_draft_';

/**
 * Save an evaluation draft to localStorage
 */
export function saveDraft(token: string, draft: Omit<EvaluationDraft, 'token' | 'savedAt'>): void {
  const draftData: EvaluationDraft = {
    token,
    ...draft,
    savedAt: new Date().toISOString(),
  };
  
  try {
    localStorage.setItem(`${DRAFT_PREFIX}${token}`, JSON.stringify(draftData));
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
}

/**
 * Load an evaluation draft from localStorage
 */
export function loadDraft(token: string): EvaluationDraft | null {
  try {
    const stored = localStorage.getItem(`${DRAFT_PREFIX}${token}`);
    if (!stored) {
      return null;
    }
    
    const draft = JSON.parse(stored) as EvaluationDraft;
    
    // Verify the token matches
    if (draft.token !== token) {
      return null;
    }
    
    return draft;
  } catch (error) {
    console.error('Failed to load draft:', error);
    return null;
  }
}

/**
 * Delete an evaluation draft from localStorage
 */
export function deleteDraft(token: string): void {
  try {
    localStorage.removeItem(`${DRAFT_PREFIX}${token}`);
  } catch (error) {
    console.error('Failed to delete draft:', error);
  }
}

/**
 * Check if a draft exists for a given token
 */
export function hasDraft(token: string): boolean {
  return loadDraft(token) !== null;
}


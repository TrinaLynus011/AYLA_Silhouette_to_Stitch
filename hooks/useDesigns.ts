import { useState, useCallback } from 'react';
import { UserSession } from '@/types';

export function useDesigns() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveDesign = useCallback(async (session: UserSession) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to save design');
      }
      
      return data.id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save design';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDesign = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/designs/${id}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to load design');
      }
      
      return data.design;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load design';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAllDesigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/designs');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to load designs');
      }
      
      return data.designs;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load designs';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDesign = useCallback(async (id: string, updates: Partial<UserSession>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/designs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update design');
      }
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update design';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDesign = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/designs/${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete design');
      }
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete design';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    saveDesign,
    loadDesign,
    loadAllDesigns,
    updateDesign,
    deleteDesign,
    loading,
    error
  };
}

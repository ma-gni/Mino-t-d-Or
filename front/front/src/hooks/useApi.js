/**
 * useApi.js
 * --------------------------------------------------
 * Hook personnalisé pour la gestion des appels API
 * 
 * Ce hook fournit :
 * - État de chargement
 * - Gestion des erreurs
 * - Retry automatique
 * - Cache des données
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personnalisé pour les appels API
 * 
 * @param {Function} apiFunction - Fonction API à exécuter
 * @param {Object} options - Options de configuration
 * @param {boolean} options.autoExecute - Exécuter automatiquement au montage
 * @param {Array} options.dependencies - Dépendances pour re-exécution
 * @param {number} options.retryCount - Nombre de tentatives en cas d'échec
 * @param {number} options.retryDelay - Délai entre les tentatives (ms)
 * @returns {Object} État et fonctions de gestion
 */
export const useApi = (apiFunction, options = {}) => {
  const {
    autoExecute = true,
    dependencies = [],
    retryCount = 3,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryAttempts, setRetryAttempts] = useState(0);

  const execute = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(params);
      setData(result);
      setRetryAttempts(0);
      return result;
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
      
      // Retry automatique si configuré
      if (retryAttempts < retryCount) {
        setTimeout(() => {
          setRetryAttempts(prev => prev + 1);
          execute(params);
        }, retryDelay);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, retryAttempts, retryCount, retryDelay]);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearData = useCallback(() => {
    setData(null);
  }, []);

  // Exécution automatique au montage
  useEffect(() => {
    if (autoExecute) {
      execute();
    }
  }, [autoExecute, execute, ...dependencies]);

  return {
    data,
    loading,
    error,
    execute,
    refetch,
    clearError,
    clearData,
    retryAttempts,
  };
};

/**
 * Hook pour les mutations (POST, PUT, DELETE)
 * 
 * @param {Function} mutationFunction - Fonction de mutation
 * @param {Object} options - Options de configuration
 * @returns {Object} État et fonctions de mutation
 */
export const useMutation = (mutationFunction, options = {}) => {
  const {
    onSuccess,
    onError,
    retryCount = 1,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await mutationFunction(params);
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
      
      if (onError) {
        onError(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    reset,
  };
};

/**
 * Hook pour la pagination
 * 
 * @param {Function} apiFunction - Fonction API avec pagination
 * @param {Object} options - Options de configuration
 * @returns {Object} État et fonctions de pagination
 */
export const usePaginatedApi = (apiFunction, options = {}) => {
  const {
    pageSize = 10,
    autoExecute = true,
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const loadPage = useCallback(async (pageNumber = 1, append = false) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction({
        page: pageNumber,
        size: pageSize,
      });

      if (append) {
        setData(prev => [...prev, ...result.content]);
      } else {
        setData(result.content);
      }

      setTotal(result.totalElements);
      setHasMore(result.content.length === pageSize);
      setPage(pageNumber);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, pageSize]);

  const nextPage = useCallback(() => {
    if (hasMore && !loading) {
      loadPage(page + 1, true);
    }
  }, [hasMore, loading, page, loadPage]);

  const previousPage = useCallback(() => {
    if (page > 1 && !loading) {
      loadPage(page - 1);
    }
  }, [page, loading, loadPage]);

  const goToPage = useCallback((pageNumber) => {
    if (!loading) {
      loadPage(pageNumber);
    }
  }, [loading, loadPage]);

  const refresh = useCallback(() => {
    loadPage(1);
  }, [loadPage]);

  // Exécution automatique au montage
  useEffect(() => {
    if (autoExecute) {
      loadPage(1);
    }
  }, [autoExecute, loadPage]);

  return {
    data,
    loading,
    error,
    page,
    hasMore,
    total,
    nextPage,
    previousPage,
    goToPage,
    refresh,
  };
}; 
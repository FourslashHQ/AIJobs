import { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const useInfiniteJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const initialized = useRef(false);

  useEffect(() => {
    const loadJobs = async () => {
      if (initialized.current) return;
      initialized.current = true;

      try {
        setLoadingMore(true);
        
        // Handle jobs as they come in
        await api.fetchInitialJobs((newJobs) => {
          setJobs(prevJobs => {
            // Filter out any jobs we already have
            const uniqueNewJobs = newJobs.filter(newJob => 
              !prevJobs.some(existingJob => existingJob.id === newJob.id)
            );
            
            // If this is our first batch of jobs, mark initial load as complete
            if (initialLoad && uniqueNewJobs.length > 0) {
              setInitialLoad(false);
            }
            
            return [...prevJobs, ...uniqueNewJobs];
          });
        });
      } catch (err) {
        setError(err.message);
        console.error('Error loading jobs:', err);
      } finally {
        setInitialLoad(false);
        setLoadingMore(false);
      }
    };

    loadJobs();
  }, []); // Only run once on mount

  return {
    jobs,
    loading: initialLoad && jobs.length === 0, // Only show loading if we have no jobs
    loadingMore: loadingMore && jobs.length > 0, // Show loadingMore only if we have some jobs
    error
  };
};

export default useInfiniteJobs;

import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import JobCard from './JobCard';

const JobList = ({ jobs, loading, error }) => {
  if (loading && jobs.length === 0) {
    return (
      <Box sx={{
        textAlign: 'center',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}>
        <CircularProgress />
        <Typography>Loading AI jobs...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        textAlign: 'center',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}>
        <Typography variant="h6" color="error">Error Loading Jobs</Typography>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (jobs.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography>No jobs found matching your criteria.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: 3,
      py: 3
    }}>
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </Box>
  );
};

export default JobList;

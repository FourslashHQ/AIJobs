import React from 'react';
import styled from 'styled-components';
import { Grid, Box } from '@mui/material';
import JobCard from './JobCard';

const GridContainer = styled(Grid)`
  padding: 20px;
  flex-grow: 1;
`;

const JobGrid = ({ jobs }) => {
  return (
    <Box 
      component="main"
      sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 3,
        p: 2
      }}
      role="main"
      aria-label="Job Listings"
    >
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </Box>
  );
};

export default JobGrid;

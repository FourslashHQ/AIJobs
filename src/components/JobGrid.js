import React from 'react';
import styled from 'styled-components';
import { Grid } from '@mui/material';
import JobCard from './JobCard';

const GridContainer = styled(Grid)`
  padding: 20px;
  flex-grow: 1;
`;

const JobGrid = ({ jobs }) => {
  return (
    <GridContainer container spacing={3}>
      {jobs.map((job) => (
        <Grid item xs={12} sm={6} md={4} key={job.id}>
          <JobCard job={job} />
        </Grid>
      ))}
    </GridContainer>
  );
};

export default JobGrid;

import React from 'react';
import { Card, CardContent, Typography, Box, Chip, useTheme } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const JobCard = ({ job }) => {
  const theme = useTheme();

  const handleClick = () => {
    window.open(job.url, '_blank');
  };

  return (
    <Card 
      onClick={handleClick}
      sx={{ 
        mb: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease'
        }
      }}
    >
      <CardContent sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        '&:last-child': { pb: 2 }
      }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {job.title}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {job.companyName}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {job.location}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoneyIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {job.salary}
            </Typography>
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
          mt: 'auto',
          pt: 1
        }}>
          {job.remote && (
            <Chip
              icon={<PublicIcon />}
              label="Remote"
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {job.department && (
            <Chip
              label={job.department}
              size="small"
              color="default"
              variant="outlined"
            />
          )}
          {job.employmentType && (
            <Chip
              label={job.employmentType.replace(/([A-Z])/g, ' $1').trim()}
              size="small"
              color="default"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobCard;

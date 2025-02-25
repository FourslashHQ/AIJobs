import React from 'react';
import { Card, CardContent, Typography, Box, Chip, useTheme, CardActions, Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import PublicIcon from '@mui/icons-material/Public';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import PaidIcon from '@mui/icons-material/Paid';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import StorageIcon from '@mui/icons-material/Storage';
import BiotechIcon from '@mui/icons-material/Biotech';
import SecurityIcon from '@mui/icons-material/Security';
import CloudIcon from '@mui/icons-material/Cloud';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TerminalIcon from '@mui/icons-material/Terminal';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import PeopleIcon from '@mui/icons-material/People';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MarketingIcon from '@mui/icons-material/Campaign';
import SupportIcon from '@mui/icons-material/HeadsetMic';
import DesignIcon from '@mui/icons-material/Brush';
import ContentIcon from '@mui/icons-material/Edit';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HandshakeIcon from '@mui/icons-material/Handshake';

const getJobIcon = (title) => {
  const titleLower = title.toLowerCase();
  
  // Technical Roles
  if (titleLower.includes('machine learning') || titleLower.includes('ml') || titleLower.includes('ai')) {
    return <SmartToyIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
  }
  if (titleLower.includes('data')) {
    return <StorageIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
  }
  if (titleLower.includes('security')) {
    return <SecurityIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
  }
  if (titleLower.includes('cloud')) {
    return <CloudIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
  }
  if (titleLower.includes('backend') || titleLower.includes('back end') || titleLower.includes('back-end')) {
    return <TerminalIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
  }
  if (titleLower.includes('frontend') || titleLower.includes('front end') || titleLower.includes('front-end')) {
    return <IntegrationInstructionsIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
  }
  if (titleLower.includes('full stack') || titleLower.includes('fullstack')) {
    return <DeveloperModeIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
  }
  if (titleLower.includes('api') || titleLower.includes('sdk')) {
    return <DataObjectIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
  }
  if (titleLower.includes('software') || titleLower.includes('developer') || titleLower.includes('engineer')) {
    return <CodeIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
  }

  // Non-technical Roles
  if (titleLower.includes('hr') || titleLower.includes('human resource') || titleLower.includes('recruit')) {
    return <PeopleIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
  }
  if (titleLower.includes('business') || titleLower.includes('operations')) {
    return <BusinessCenterIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
  }
  if (titleLower.includes('sales')) {
    return <TrendingUpIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
  }
  if (titleLower.includes('marketing') || titleLower.includes('brand')) {
    return <MarketingIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
  }
  if (titleLower.includes('support') || titleLower.includes('customer')) {
    return <SupportIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
  }
  if (titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux')) {
    return <DesignIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
  }
  if (titleLower.includes('content') || titleLower.includes('writer') || titleLower.includes('editor')) {
    return <ContentIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
  }
  if (titleLower.includes('analyst') || titleLower.includes('analytics')) {
    return <AnalyticsIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
  }
  if (titleLower.includes('account') || titleLower.includes('client')) {
    return <AccountBoxIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
  }
  if (titleLower.includes('partner') || titleLower.includes('relation')) {
    return <HandshakeIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
  }

  // Default icon for unmatched roles
  return <BusinessIcon sx={{ fontSize: 28, color: '#c1ff72' }} />;
};

const JobCard = ({ job }) => {
  const theme = useTheme();

  const handleClick = () => {
    window.open(job.url, '_blank');
  };

  return (
    <Card
      component="article"
      onClick={handleClick}
      sx={{ 
        mb: { xs: 1.5, sm: 2 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-4px)',
          transition: 'all 0.3s ease-in-out'
        }
      }}
    >
      <CardContent 
        component="section"
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: '100%',
          p: { xs: 1.5, sm: 2 },
          '&:last-child': { pb: { xs: 1.5, sm: 2 } }
        }}
      >
        <Box component="header" sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, mb: { xs: 1.5, sm: 2 } }}>
          {getJobIcon(job.title)}
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom 
            sx={{ 
              color: '#c1ff72', 
              mb: 0,
              fontSize: { xs: '1rem', sm: 'h6.fontSize' },
              lineHeight: { xs: 1.2, sm: 1.5 },
              fontFamily: '"Space Grotesk Variable", "Space Grotesk", sans-serif',
              fontWeight: 500,
              letterSpacing: '-0.02em'
            }}
          >
            {job.title}
          </Typography>
        </Box>

        <Box component="section" sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 1.5 }, mb: { xs: 1.5, sm: 2 } }}>
          <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon fontSize="small" sx={{ color: '#ffffff' }} />
            <Typography 
              variant="body2" 
              component="p" 
              sx={{ 
                color: '#ffffff',
                fontSize: { xs: '0.875rem', sm: 'body2.fontSize' },
                fontFamily: '"Space Grotesk Variable", "Space Grotesk", sans-serif',
                fontWeight: 300,
                letterSpacing: '-0.01em'
              }}
            >
              {job.companyName}
            </Typography>
          </Box>

          <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon fontSize="small" sx={{ color: '#ffffff' }} />
            <Typography 
              variant="body2" 
              component="p" 
              sx={{ 
                color: '#ffffff',
                fontSize: { xs: '0.875rem', sm: 'body2.fontSize' },
                fontFamily: '"Space Grotesk Variable", "Space Grotesk", sans-serif',
                fontWeight: 300,
                letterSpacing: '-0.01em'
              }}
            >
              {job.location}
            </Typography>
          </Box>

          <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoneyIcon fontSize="small" sx={{ color: '#ffffff' }} />
            <Typography 
              variant="body2" 
              component="p" 
              sx={{ 
                color: '#ffffff',
                fontSize: { xs: '0.875rem', sm: 'body2.fontSize' },
                fontFamily: '"Space Grotesk Variable", "Space Grotesk", sans-serif',
                fontWeight: 300,
                letterSpacing: '-0.01em'
              }}
            >
              {job.salary}
            </Typography>
          </Box>
        </Box>

        <Box 
          component="footer"
          sx={{
            display: 'flex',
            gap: { xs: 0.5, sm: 1 },
            flexWrap: 'wrap',
            mt: 'auto',
            pt: { xs: 0.5, sm: 1 }
          }}
        >
          {job.remote && (
            <Chip
              icon={<PublicIcon />}
              label="Remote"
              size="small"
              sx={{
                backgroundColor: '#ffffff',
                color: '#000000',
                '& .MuiSvgIcon-root': {
                  color: '#000000'
                },
                '&:hover': {
                  backgroundColor: '#e0e0e0'
                },
                fontFamily: '"Space Grotesk Variable", "Space Grotesk", sans-serif',
                fontWeight: 300,
                letterSpacing: '-0.01em'
              }}
            />
          )}
          {job.department && (
            <Chip
              label={job.department}
              size="small"
              sx={{
                backgroundColor: '#ffffff',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#e0e0e0'
                },
                fontFamily: '"Space Grotesk Variable", "Space Grotesk", sans-serif',
                fontWeight: 300,
                letterSpacing: '-0.01em'
              }}
            />
          )}
          {job.employmentType && (
            <Chip
              label={job.employmentType.replace(/([A-Z])/g, ' $1').trim()}
              size="small"
              sx={{
                backgroundColor: '#ffffff',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#e0e0e0'
                },
                fontFamily: '"Space Grotesk Variable", "Space Grotesk", sans-serif',
                fontWeight: 300,
                letterSpacing: '-0.01em'
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobCard;

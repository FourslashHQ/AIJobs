import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  FormGroup,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  Button,
  Paper,
  IconButton,
  Drawer,
  useMediaQuery
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import PublicIcon from '@mui/icons-material/Public';
import PaidIcon from '@mui/icons-material/Paid';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

const FilterSection = ({ title, icon, children, defaultExpanded = false }) => (
  <Accordion defaultExpanded={defaultExpanded}>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon sx={{ color: '#ffffff' }} />}
      sx={{
        '& .MuiAccordionSummary-content': {
          alignItems: 'center',
          gap: 1
        },
        '& .MuiSvgIcon-root': {
          color: '#ffffff'
        }
      }}
    >
      {icon}
      <Typography variant="subtitle2" sx={{ color: '#ffffff' }}>{title}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      {children}
    </AccordionDetails>
  </Accordion>
);

const FilterSidebar = ({ jobs, selectedFilters, onFilterChange, width }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // Get unique values for filters from jobs
  const companies = [...new Set(jobs.map(job => job.companyName))].sort();
  const locations = [...new Set(jobs.map(job => job.location))].sort();
  const departments = [...new Set(jobs.filter(job => job.department).map(job => job.department))].sort();

  const formatSalary = (value) => `$${value.toLocaleString()}`;

  const handleFilterChange = (type, value) => {
    if (type === 'reset') {
      onFilterChange({
        companies: [],
        locations: [],
        departments: [],
        remote: false,
        salary: [0, 500000]
      });
      return;
    }

    const newFilters = { ...selectedFilters };

    if (type === 'remote') {
      newFilters.remote = value;
    } else if (type === 'salary') {
      newFilters.salary = value;
    } else {
      // Handle array-based filters
      const currentValues = newFilters[type] || [];
      if (currentValues.includes(value)) {
        newFilters[type] = currentValues.filter(item => item !== value);
      } else {
        newFilters[type] = [...currentValues, value];
      }
    }

    onFilterChange(newFilters);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const filterContent = (
    <Box sx={{ p: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2 
      }}>
        <Typography variant="h6" sx={{ color: '#ffffff' }}>Filters</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={() => handleFilterChange('reset')}
            sx={{
              color: '#c1ff72',
              '&:hover': {
                backgroundColor: 'rgba(193, 255, 114, 0.1)',
              }
            }}
          >
            Reset
          </Button>
          {isMobile && (
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ color: '#ffffff' }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      <FilterSection 
        title="Remote Work" 
        icon={<PublicIcon sx={{ color: '#c1ff72' }} />}
        defaultExpanded={true}
      >
        <FormControlLabel
          control={
            <Switch
              checked={selectedFilters.remote}
              onChange={(e) => handleFilterChange('remote', e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#c1ff72',
                  '& + .MuiSwitch-track': {
                    backgroundColor: '#c1ff72',
                  },
                },
              }}
            />
          }
          label={<Typography sx={{ color: '#ffffff' }}>Remote Only</Typography>}
        />
      </FilterSection>

      <FilterSection 
        title="Salary Range" 
        icon={<PaidIcon sx={{ color: '#c1ff72' }} />}
        defaultExpanded={true}
      >
        <Box sx={{ px: 2 }}>
          <Slider
            value={selectedFilters.salary || [0, 500000]}
            onChange={(_, newValue) => handleFilterChange('salary', newValue)}
            min={0}
            max={500000}
            step={10000}
            valueLabelDisplay="auto"
            valueLabelFormat={formatSalary}
          />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            mt: 1,
            color: 'text.secondary',
            fontSize: '0.75rem'
          }}>
            <span>{formatSalary(selectedFilters.salary?.[0] || 0)}</span>
            <span>{formatSalary(selectedFilters.salary?.[1] || 500000)}</span>
          </Box>
        </Box>
      </FilterSection>

      <FilterSection 
        title="Department" 
        icon={<CategoryIcon sx={{ color: '#c1ff72' }} />}
      >
        <FormGroup>
          {departments.map(department => (
            <FormControlLabel
              key={department}
              control={
                <Switch
                  checked={selectedFilters.departments?.includes(department)}
                  onChange={() => handleFilterChange('departments', department)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#c1ff72',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#c1ff72',
                      },
                    },
                  }}
                />
              }
              label={<Typography sx={{ color: '#ffffff' }}>{department}</Typography>}
            />
          ))}
        </FormGroup>
      </FilterSection>

      <FilterSection 
        title="Companies" 
        icon={<BusinessIcon sx={{ color: '#c1ff72' }} />}
      >
        <FormGroup>
          {companies.map(company => (
            <FormControlLabel
              key={company}
              control={
                <Switch
                  checked={selectedFilters.companies?.includes(company)}
                  onChange={() => handleFilterChange('companies', company)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#c1ff72',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#c1ff72',
                      },
                    },
                  }}
                />
              }
              label={<Typography sx={{ color: '#ffffff' }}>{company}</Typography>}
            />
          ))}
        </FormGroup>
      </FilterSection>

      <FilterSection 
        title="Locations" 
        icon={<LocationOnIcon sx={{ color: '#c1ff72' }} />}
      >
        <FormGroup>
          {locations.map(location => (
            <FormControlLabel
              key={location}
              control={
                <Switch
                  checked={selectedFilters.locations?.includes(location)}
                  onChange={() => handleFilterChange('locations', location)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#c1ff72',
                      '& + .MuiSwitch-track': {
                        backgroundColor: '#c1ff72',
                      },
                    },
                  }}
                />
              }
              label={<Typography sx={{ color: '#ffffff' }}>{location}</Typography>}
            />
          ))}
        </FormGroup>
      </FilterSection>
    </Box>
  );

  // Mobile filter button
  const filterButton = isMobile && (
    <Button
      variant="contained"
      startIcon={<FilterListIcon />}
      onClick={handleDrawerToggle}
      sx={{
        position: 'fixed',
        bottom: { xs: 80, sm: 16 },
        left: 16,
        zIndex: 1000,
        backgroundColor: '#c1ff72',
        color: '#000000',
        '&:hover': {
          backgroundColor: '#9ecc5c'
        }
      }}
    >
      Filters
    </Button>
  );

  if (isMobile) {
    return (
      <>
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: width || 280,
              bgcolor: 'background.default',
              zIndex: 1300,
            },
          }}
        >
          {filterContent}
        </Drawer>
        {filterButton}
      </>
    );
  }

  return (
    <Box
      sx={{
        width: width || 280,
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
        borderRight: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default',
        '&::-webkit-scrollbar': {
          width: '8px'
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.2)' 
            : 'rgba(0, 0, 0, 0.2)',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.3)'
              : 'rgba(0, 0, 0, 0.3)'
          }
        }
      }}
    >
      {filterContent}
    </Box>
  );
};

export default FilterSidebar;

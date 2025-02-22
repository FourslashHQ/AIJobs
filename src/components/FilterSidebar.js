import React from 'react';
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
  Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import PublicIcon from '@mui/icons-material/Public';
import PaidIcon from '@mui/icons-material/Paid';
import RefreshIcon from '@mui/icons-material/Refresh';

const FilterSection = ({ title, icon, children, defaultExpanded = false }) => (
  <Accordion defaultExpanded={defaultExpanded}>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      sx={{
        '& .MuiAccordionSummary-content': {
          alignItems: 'center',
          gap: 1
        }
      }}
    >
      {icon}
      <Typography variant="subtitle2">{title}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      {children}
    </AccordionDetails>
  </Accordion>
);

const FilterSidebar = ({ jobs, selectedFilters, onFilterChange, width }) => {
  const theme = useTheme();

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

  return (
    <Paper
      elevation={0}
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
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Filters
        </Typography>

        <FilterSection 
          title="Remote Work" 
          icon={<PublicIcon color="action" />}
          defaultExpanded={true}
        >
          <FormControlLabel
            control={
              <Switch
                checked={selectedFilters.remote}
                onChange={(e) => handleFilterChange('remote', e.target.checked)}
              />
            }
            label="Remote Only"
          />
        </FilterSection>

        <FilterSection 
          title="Salary Range" 
          icon={<PaidIcon color="action" />}
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
          icon={<CategoryIcon color="action" />}
        >
          <FormGroup>
            {departments.map(department => (
              <FormControlLabel
                key={department}
                control={
                  <Switch
                    checked={selectedFilters.departments?.includes(department)}
                    onChange={() => handleFilterChange('departments', department)}
                  />
                }
                label={department}
              />
            ))}
          </FormGroup>
        </FilterSection>

        <FilterSection 
          title="Companies" 
          icon={<BusinessIcon color="action" />}
        >
          <FormGroup>
            {companies.map(company => (
              <FormControlLabel
                key={company}
                control={
                  <Switch
                    checked={selectedFilters.companies?.includes(company)}
                    onChange={() => handleFilterChange('companies', company)}
                  />
                }
                label={company}
              />
            ))}
          </FormGroup>
        </FilterSection>

        <FilterSection 
          title="Locations" 
          icon={<LocationOnIcon color="action" />}
        >
          <FormGroup>
            {locations.map(location => (
              <FormControlLabel
                key={location}
                control={
                  <Switch
                    checked={selectedFilters.locations?.includes(location)}
                    onChange={() => handleFilterChange('locations', location)}
                  />
                }
                label={location}
              />
            ))}
          </FormGroup>
        </FilterSection>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => handleFilterChange('reset')}
            size="small"
            fullWidth
          >
            Reset Filters
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default FilterSidebar;

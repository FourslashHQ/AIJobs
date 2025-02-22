import React, { useState, useEffect } from 'react';
import { 
  Box, 
  ThemeProvider, 
  createTheme, 
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { fetchJobs } from './services/api';
import FilterSidebar from './components/FilterSidebar';
import JobList from './components/JobList';
import SearchBar from './components/SearchBar';
import SortIcon from '@mui/icons-material/Sort';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const DRAWER_WIDTH = 280;

function App() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    companies: [],
    locations: [],
    departments: [],
    employmentTypes: [],
    remote: false,
    salary: [0, 500000]
  });
  const [sortOption, setSortOption] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  const handleSortOptionSelect = (option) => {
    setSortOption(option);
    setAnchorEl(null);
  };

  const applyFiltersAndSort = (jobs, filters, searchQuery, sortOption) => {
    let filteredJobs = [...jobs];

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        (job.department && job.department.toLowerCase().includes(query))
      );
    }

    // Apply company filter
    if (filters.companies?.length > 0) {
      filteredJobs = filteredJobs.filter(job => filters.companies.includes(job.companyName));
    }

    // Apply location filter
    if (filters.locations?.length > 0) {
      filteredJobs = filteredJobs.filter(job => filters.locations.includes(job.location));
    }

    // Apply department filter
    if (filters.departments?.length > 0) {
      filteredJobs = filteredJobs.filter(job => job.department && filters.departments.includes(job.department));
    }

    // Apply employment type filter
    if (filters.employmentTypes?.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        job.employmentType && 
        filters.employmentTypes.includes(
          job.employmentType.replace(/([A-Z])/g, ' $1').trim()
        )
      );
    }

    // Apply remote filter
    if (filters.remote) {
      filteredJobs = filteredJobs.filter(job => job.remote);
    }

    // Apply salary filter
    if (filters.salary[0] > 0 || filters.salary[1] < 500000) {
      filteredJobs = filteredJobs.filter(job => {
        if (!job.salary) return false;
        
        // Extract numbers from salary string
        const numbers = job.salary.match(/\d+/g);
        if (!numbers) return false;
        
        // Get min and max salary
        const salaryNumbers = numbers.map(num => parseInt(num));
        const minSalary = Math.min(...salaryNumbers) * 1000;
        const maxSalary = Math.max(...salaryNumbers) * 1000;
        
        return minSalary >= filters.salary[0] && maxSalary <= filters.salary[1];
      });
    }

    // Apply sorting
    if (sortOption) {
      switch (sortOption) {
        case 'alphabetical':
          filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'salary-low-high':
          filteredJobs.sort((a, b) => {
            const getSalaryNumber = (salary) => {
              if (!salary) return 0;
              const match = salary.match(/\d+/g);
              return match ? parseInt(match[0]) * 1000 : 0;
            };
            return getSalaryNumber(a.salary) - getSalaryNumber(b.salary);
          });
          break;
        case 'salary-high-low':
          filteredJobs.sort((a, b) => {
            const getSalaryNumber = (salary) => {
              if (!salary) return 0;
              const match = salary.match(/\d+/g);
              return match ? parseInt(match[0]) * 1000 : 0;
            };
            return getSalaryNumber(b.salary) - getSalaryNumber(a.salary);
          });
          break;
        default:
          break;
      }
    }

    return filteredJobs;
  };

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const data = await fetchJobs();
        setJobs(data.jobs);
        setFilteredJobs(data.jobs);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        setError('Failed to fetch jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Apply filters whenever filters, search query, or sort option changes
  useEffect(() => {
    const filteredResults = applyFiltersAndSort(jobs, filters, searchQuery, sortOption);
    setFilteredJobs(filteredResults);
  }, [jobs, filters, searchQuery, sortOption]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <FilterSidebar
          jobs={jobs}
          filters={filters}
          onFilterChange={setFilters}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 500 }}>
                AI Jobs Portal
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary',
                  bgcolor: 'background.paper',
                  py: 0.5,
                  px: 1.5,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                {`${filteredJobs.length} jobs available`}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            alignItems: 'center',
            mb: 3,
            width: '100%'
          }}>
            <Box sx={{ flex: 1 }}>
              <SearchBar 
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Box>
            <IconButton
              onClick={handleSortClick}
              color="inherit"
              size="medium"
              aria-label="sort"
              aria-controls="sort-menu"
              aria-haspopup="true"
              sx={{ 
                ml: 1,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: '8px',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <SortIcon />
            </IconButton>
            <Menu
              id="sort-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleSortClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem 
                onClick={() => handleSortOptionSelect('alphabetical')}
                selected={sortOption === 'alphabetical'}
              >
                <ListItemIcon>
                  <SortByAlphaIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Alphabetical Order (A-Z)</ListItemText>
              </MenuItem>
              <MenuItem 
                onClick={() => handleSortOptionSelect('salary-low-high')}
                selected={sortOption === 'salary-low-high'}
              >
                <ListItemIcon>
                  <TrendingUpIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Salary Range (Low to High)</ListItemText>
              </MenuItem>
              <MenuItem 
                onClick={() => handleSortOptionSelect('salary-high-low')}
                selected={sortOption === 'salary-high-low'}
              >
                <ListItemIcon>
                  <TrendingDownIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Salary Range (High to Low)</ListItemText>
              </MenuItem>
            </Menu>
          </Box>

          <JobList 
            jobs={filteredJobs} 
            loading={loading} 
            error={error}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;

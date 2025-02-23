import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  useTheme,
  ListItemIcon,
  ListItemText,
  Link,
  Fab,
  Button
} from '@mui/material';
import {
  fetchJobs
} from './services/api';
import FilterSidebar from './components/FilterSidebar';
import SearchBar from './components/SearchBar';
import JobList from './components/JobList';
import SortIcon from '@mui/icons-material/Sort';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useColorMode } from './theme/ThemeContext';

const DRAWER_WIDTH = 280;

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    companies: [],
    locations: [],
    departments: [],
    remote: false,
    salary: [0, 500000]
  });
  const [sortOption, setSortOption] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const theme = useTheme();
  const { toggleColorMode, mode } = useColorMode();

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  const handleSortOptionSelect = (option) => {
    setSortOption(option);
    handleSortClose();
  };

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const response = await fetchJobs();
        if (response && response.jobs) {
          setJobs(response.jobs);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const getSearchScore = (job, query) => {
    if (!query) return 0;
    
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return 0;
    
    const words = normalizedQuery.split(/\s+/);
    let score = 0;

    // Cache lowercase values
    const titleLower = job.title.toLowerCase();
    const departmentLower = job.department?.toLowerCase() || '';
    const descriptionLower = job.description?.toLowerCase() || '';

    // Exact title match (highest priority)
    if (titleLower === normalizedQuery) {
      return 100; // Return immediately for exact matches
    }

    // Title contains exact query
    if (titleLower.includes(normalizedQuery)) {
      score += 50;
    }

    // Individual word matches in title (high priority)
    for (const word of words) {
      if (titleLower.includes(word)) {
        score += 30;
      }
    }

    // Department exact match
    if (departmentLower === normalizedQuery) {
      score += 25;
    }

    // Department contains query
    if (departmentLower.includes(normalizedQuery)) {
      score += 15;
    }

    // Description matches (lower priority)
    if (descriptionLower) {
      // Exact phrase match in description
      if (descriptionLower.includes(normalizedQuery)) {
        score += 10;
      }

      // Individual word matches in description (limit to first 1000 chars for performance)
      const truncatedDesc = descriptionLower.slice(0, 1000);
      for (const word of words) {
        if (truncatedDesc.includes(word)) {
          score += 5;
        }
      }
    }

    return score;
  };

  const extractSalaryValue = (salaryString, useHigherValue = false) => {
    if (!salaryString || typeof salaryString !== 'string') return 0;
    
    // First check if it's hourly rate
    if (salaryString.includes('per hour')) {
      return 0; // Skip hourly rates for now
    }
    
    // Extract numbers and their K suffixes together
    const matches = salaryString.match(/(\d+\.?\d*)K?/g);
    if (!matches) return 0;
    
    // Convert each match to a number, handling the K multiplier
    const salaryNumbers = matches.map(match => {
      const hasK = match.endsWith('K');
      const num = parseFloat(match.replace('K', ''));
      return hasK ? num * 1000 : num;
    });
    
    // For a salary range, use either the higher or lower value based on sort direction
    if (salaryNumbers.length > 1) {
      return useHigherValue ? Math.max(...salaryNumbers) : Math.min(...salaryNumbers);
    }
    
    return salaryNumbers[0] || 0;
  };

  const applyFiltersAndSort = (jobs, filters, searchQuery, sortOption) => {
    let filteredJobs = [...jobs];

    // Apply search filter with scoring
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      
      // Filter and score jobs
      filteredJobs = filteredJobs
        .map(job => ({
          ...job,
          searchScore: getSearchScore(job, query)
        }))
        .filter(job => job.searchScore > 0) // Only keep jobs with matches
        .sort((a, b) => b.searchScore - a.searchScore); // Sort by search relevance
    }

    // Apply company filter
    if (filters.companies?.length > 0) {
      filteredJobs = filteredJobs.filter(job => filters.companies.includes(job.companyName));
    }

    // Apply location filter
    if (filters.locations?.length > 0) {
      filteredJobs = filteredJobs.filter(job => {
        const jobLocation = job.location.toLowerCase();
        return filters.locations.some(filterLocation => {
          const normalizedFilter = filterLocation.toLowerCase();
          return jobLocation.includes(normalizedFilter);
        });
      });
    }

    // Apply department filter
    if (filters.departments?.length > 0) {
      filteredJobs = filteredJobs.filter(job => job.department && filters.departments.includes(job.department));
    }

    // Apply remote filter
    if (filters.remote) {
      filteredJobs = filteredJobs.filter(job => job.remote);
    }

    // Apply salary filter
    if (filters.salary && (filters.salary[0] > 0 || filters.salary[1] < 500000)) {
      const [minSalary, maxSalary] = filters.salary;
      filteredJobs = filteredJobs.filter(job => {
        const salary = extractSalaryValue(job.salary);
        return salary >= minSalary && salary <= maxSalary;
      });
    }

    // Apply sorting if specified
    if (sortOption) {
      switch (sortOption) {
        case 'salary-high-low':
          filteredJobs.sort((a, b) => {
            const salaryA = extractSalaryValue(a.salary, true);
            const salaryB = extractSalaryValue(b.salary, true);
            return salaryB - salaryA;
          });
          break;
        case 'salary-low-high':
          filteredJobs.sort((a, b) => {
            const salaryA = extractSalaryValue(a.salary, false);
            const salaryB = extractSalaryValue(b.salary, false);
            return salaryA - salaryB;
          });
          break;
        case 'alphabetical':
          filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          break;
      }
    }

    return filteredJobs;
  };

  const filteredAndSortedJobs = useMemo(() => {
    return applyFiltersAndSort(jobs, selectedFilters, searchQuery, sortOption);
  }, [jobs, selectedFilters, searchQuery, sortOption]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    // Clear sort option when searching
    if (query) {
      setSortOption('');
    }
  };

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <FilterSidebar
        jobs={jobs}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        width={DRAWER_WIDTH}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { xs: '100%', sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          pb: { xs: '100px', sm: 3 },
          position: 'relative'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          mb: 3,
          position: 'sticky',
          top: 0,
          bgcolor: 'background.default',
          zIndex: 1100,
          py: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
              <Link 
                href="/"
                sx={{ 
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    textDecoration: 'none'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h4" component="span" sx={{ 
                    fontWeight: 500, 
                    color: '#c1ff72',
                    '@media (max-width: 600px)': {
                      fontSize: '1.25rem'
                    }
                  }}>
                    AIJobsNow
                  </Typography>
                  <Typography variant="h4" component="span" sx={{ 
                    fontWeight: 500, 
                    color: '#ffffff',
                    '@media (max-width: 600px)': {
                      fontSize: '1.25rem'
                    }
                  }}>
                    by{' '}
                  </Typography>
                  <Link
                    href="https://fourslash.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    <Typography variant="h4" component="span" sx={{ 
                      fontWeight: 500, 
                      color: '#ffffff',
                      '@media (max-width: 600px)': {
                        fontSize: '1.25rem'
                      }
                    }}>
                      Fourslash
                    </Typography>
                  </Link>
                </Box>
              </Link>
            </Box>
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
              {`${filteredAndSortedJobs.length} jobs available`}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleSortClick}
              sx={{
                bgcolor: 'background.paper',
                color: sortOption ? '#c1ff72' : 'inherit',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <SortIcon />
            </IconButton>
          </Box>
        </Box>

        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <Menu
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
            onClick={() => handleSortOptionSelect(sortOption === 'alphabetical' ? '' : 'alphabetical')}
            sx={{ color: sortOption === 'alphabetical' ? '#c1ff72' : 'inherit' }}
          >
            <ListItemIcon>
              <SortByAlphaIcon sx={{ color: sortOption === 'alphabetical' ? '#c1ff72' : 'inherit' }} />
            </ListItemIcon>
            <ListItemText>Alphabetical</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleSortOptionSelect(sortOption === 'salary-low-high' ? '' : 'salary-low-high')}
            sx={{ color: sortOption === 'salary-low-high' ? '#c1ff72' : 'inherit' }}
          >
            <ListItemIcon>
              <TrendingUpIcon sx={{ color: sortOption === 'salary-low-high' ? '#c1ff72' : 'inherit' }} />
            </ListItemIcon>
            <ListItemText>Salary: Low to High</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleSortOptionSelect(sortOption === 'salary-high-low' ? '' : 'salary-high-low')}
            sx={{ color: sortOption === 'salary-high-low' ? '#c1ff72' : 'inherit' }}
          >
            <ListItemIcon>
              <TrendingDownIcon sx={{ color: sortOption === 'salary-high-low' ? '#c1ff72' : 'inherit' }} />
            </ListItemIcon>
            <ListItemText>Salary: High to Low</ListItemText>
          </MenuItem>
        </Menu>

        <JobList 
          jobs={filteredAndSortedJobs}
          loading={loading}
          error={error}
        />
      </Box>

      {/* Desktop scroll button */}
      {showScrollTop && (
        <Fab
          size="large"
          sx={{
            position: 'fixed',
            bottom: { xs: 100, sm: 16 }, 
            right: 16,
            bgcolor: '#c1ff72',
            zIndex: 1000,
            '&:hover': {
              bgcolor: '#9ecc5c'
            }
          }}
          onClick={scrollToTop}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}
    </Box>
  );
}

export default App;

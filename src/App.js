import React, { useState, useEffect } from 'react';
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
import { fetchJobs } from './services/api';
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
  const [filteredJobs, setFilteredJobs] = useState([]);
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
          setFilteredJobs(response.jobs);
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
    const normalizedQuery = query.toLowerCase().trim();
    const words = normalizedQuery.split(/\s+/);
    let score = 0;

    // Exact title match (highest priority)
    if (job.title.toLowerCase() === normalizedQuery) {
      score += 100;
    }

    // Title contains exact query
    if (job.title.toLowerCase().includes(normalizedQuery)) {
      score += 50;
    }

    // Individual word matches in title (high priority)
    words.forEach(word => {
      if (job.title.toLowerCase().includes(word)) {
        score += 30;
      }
    });

    // Department exact match
    if (job.department && job.department.toLowerCase() === normalizedQuery) {
      score += 25;
    }

    // Department contains query
    if (job.department && job.department.toLowerCase().includes(normalizedQuery)) {
      score += 15;
    }

    // Description matches (lower priority)
    if (job.description) {
      // Exact phrase match in description
      if (job.description.toLowerCase().includes(normalizedQuery)) {
        score += 10;
      }

      // Individual word matches in description
      words.forEach(word => {
        if (job.description.toLowerCase().includes(word)) {
          score += 5;
        }
      });
    }

    return score;
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
        const salary = job.salary ? parseInt(job.salary.replace(/[^0-9]/g, '')) : 0;
        return salary >= minSalary && salary <= maxSalary;
      });
    }

    // Apply sorting only if not already sorted by search relevance
    if (sortOption && !searchQuery) {
      switch (sortOption) {
        case 'alphabetical':
          filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'salary-high-low':
          filteredJobs.sort((a, b) => {
            const salaryA = a.salary ? parseInt(a.salary.replace(/[^0-9]/g, '')) : 0;
            const salaryB = b.salary ? parseInt(b.salary.replace(/[^0-9]/g, '')) : 0;
            return salaryB - salaryA;
          });
          break;
        case 'salary-low-high':
          filteredJobs.sort((a, b) => {
            const salaryA = a.salary ? parseInt(a.salary.replace(/[^0-9]/g, '')) : 0;
            const salaryB = b.salary ? parseInt(b.salary.replace(/[^0-9]/g, '')) : 0;
            return salaryA - salaryB;
          });
          break;
        default:
          break;
      }
    }

    return filteredJobs;
  };

  useEffect(() => {
    // Only apply filters if there are actual filters or search terms
    const hasActiveFilters = 
      selectedFilters.companies.length > 0 ||
      selectedFilters.locations.length > 0 ||
      selectedFilters.departments.length > 0 ||
      selectedFilters.remote ||
      selectedFilters.salary[0] > 0 ||
      selectedFilters.salary[1] < 500000 ||
      searchQuery ||
      sortOption;

    if (hasActiveFilters) {
      const filteredResults = applyFiltersAndSort(jobs, selectedFilters, searchQuery, sortOption);
      setFilteredJobs(filteredResults);
    } else {
      setFilteredJobs(jobs);
    }
  }, [jobs, selectedFilters, searchQuery, sortOption]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', flexDirection: { xs: 'column', sm: 'row' } }}>
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
              {`${filteredJobs.length} jobs available`}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleSortClick}
              color="inherit"
              aria-label="sort"
            >
              <SortIcon />
            </IconButton>
            {showScrollTop && (
              <IconButton
                onClick={scrollToTop}
                color="inherit"
                aria-label="scroll to top"
                sx={{ 
                  display: { xs: 'flex', sm: 'none' },
                  bgcolor: '#c1ff72',
                  color: '#000000',
                  padding: '8px',
                  '&:hover': {
                    bgcolor: '#9ecc5c'
                  }
                }}
              >
                <KeyboardArrowUpIcon />
              </IconButton>
            )}
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

        <JobList 
          jobs={filteredJobs}
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
            bottom: 16,
            right: 16,
            bgcolor: '#c1ff72',
            zIndex: 1000,
            display: { xs: 'none', sm: 'flex' }, // Hide on mobile since we have the header button
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

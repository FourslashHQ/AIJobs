import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Button,
  CircularProgress
} from '@mui/material';
import useInfiniteJobs from './hooks/useInfiniteJobs';
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
  const { jobs, loading, loadingMore, error } = useInfiniteJobs();
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

  // Handle scroll for "back to top" button
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
    const titleLower = (job.title || '').toLowerCase();
    const companyLower = (job.companyName || '').toLowerCase();
    const departmentLower = (job.department || '').toLowerCase();
    const descriptionLower = (job.description || '').toLowerCase();

    // Exact title match (highest priority)
    if (titleLower === normalizedQuery) {
      return 100;
    }

    // Title starts with query (very high priority)
    if (titleLower.startsWith(normalizedQuery)) {
      score += 80;
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

    // Company name matches
    if (companyLower.includes(normalizedQuery)) {
      score += 20;
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

      // Individual word matches in description
      for (const word of words) {
        if (descriptionLower.includes(word)) {
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

  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];

    // Apply search filter with scoring
    if (searchQuery) {
      filtered = filtered
        .map(job => ({
          job,
          score: getSearchScore(job, searchQuery)
        }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.job);
    }

    // Apply selected filters
    if (selectedFilters.companies.length > 0) {
      filtered = filtered.filter(job => selectedFilters.companies.includes(job.companyName));
    }
    if (selectedFilters.locations.length > 0) {
      filtered = filtered.filter(job => selectedFilters.locations.includes(job.location));
    }
    if (selectedFilters.departments.length > 0) {
      filtered = filtered.filter(job => selectedFilters.departments.includes(job.department));
    }
    if (selectedFilters.remote) {
      filtered = filtered.filter(job => job.remote);
    }

    // Apply salary filter
    if (selectedFilters.salary[0] > 0 || selectedFilters.salary[1] < 500000) {
      filtered = filtered.filter(job => {
        if (!job.salary) return false;
        const salaryValue = extractSalaryValue(job.salary);
        return salaryValue >= selectedFilters.salary[0] && salaryValue <= selectedFilters.salary[1];
      });
    }

    // Apply sorting
    if (sortOption) {
      filtered.sort((a, b) => {
        switch (sortOption) {
          case 'titleAsc': {
            const titleA = (a.title || '').toLowerCase().trim();
            const titleB = (b.title || '').toLowerCase().trim();
            return titleA.localeCompare(titleB);
          }
          case 'titleDesc': {
            const titleA = (a.title || '').toLowerCase().trim();
            const titleB = (b.title || '').toLowerCase().trim();
            return titleB.localeCompare(titleA);
          }
          case 'salaryAsc': {
            const salaryA = extractSalaryValue(a.salary || '');
            const salaryB = extractSalaryValue(b.salary || '');
            // Push jobs without salary to the end
            if (salaryA === 0 && salaryB !== 0) return 1;
            if (salaryB === 0 && salaryA !== 0) return -1;
            if (salaryA === 0 && salaryB === 0) return 0;
            return salaryA - salaryB;
          }
          case 'salaryDesc': {
            const salaryA = extractSalaryValue(a.salary || '');
            const salaryB = extractSalaryValue(b.salary || '');
            // Push jobs without salary to the end
            if (salaryA === 0 && salaryB !== 0) return 1;
            if (salaryB === 0 && salaryA !== 0) return -1;
            if (salaryA === 0 && salaryB === 0) return 0;
            return salaryB - salaryA;
          }
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [jobs, searchQuery, selectedFilters, sortOption]);

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
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            onClick={() => handleSortOptionSelect(sortOption === 'titleAsc' ? '' : 'titleAsc')}
            sx={{ color: sortOption === 'titleAsc' ? '#c1ff72' : 'inherit' }}
          >
            <ListItemIcon>
              <SortByAlphaIcon sx={{ color: sortOption === 'titleAsc' ? '#c1ff72' : 'inherit' }} />
            </ListItemIcon>
            <ListItemText>Alphabetical (A-Z)</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleSortOptionSelect(sortOption === 'titleDesc' ? '' : 'titleDesc')}
            sx={{ color: sortOption === 'titleDesc' ? '#c1ff72' : 'inherit' }}
          >
            <ListItemIcon>
              <SortByAlphaIcon sx={{ color: sortOption === 'titleDesc' ? '#c1ff72' : 'inherit' }} />
            </ListItemIcon>
            <ListItemText>Alphabetical (Z-A)</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleSortOptionSelect(sortOption === 'salaryAsc' ? '' : 'salaryAsc')}
            sx={{ color: sortOption === 'salaryAsc' ? '#c1ff72' : 'inherit' }}
          >
            <ListItemIcon>
              <TrendingUpIcon sx={{ color: sortOption === 'salaryAsc' ? '#c1ff72' : 'inherit' }} />
            </ListItemIcon>
            <ListItemText>Salary: Low to High</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleSortOptionSelect(sortOption === 'salaryDesc' ? '' : 'salaryDesc')}
            sx={{ color: sortOption === 'salaryDesc' ? '#c1ff72' : 'inherit' }}
          >
            <ListItemIcon>
              <TrendingDownIcon sx={{ color: sortOption === 'salaryDesc' ? '#c1ff72' : 'inherit' }} />
            </ListItemIcon>
            <ListItemText>Salary: High to Low</ListItemText>
          </MenuItem>
        </Menu>

        {jobs.length > 0 && (
          <>
            <JobList jobs={filteredJobs} />
          </>
        )}

        {loading && jobs.length === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && jobs.length === 0 && (
          <Typography color="error" align="center" sx={{ my: 4 }}>
            Error loading jobs: {error}
          </Typography>
        )}
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

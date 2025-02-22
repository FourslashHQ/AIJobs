import React from 'react';
import { Paper, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const SearchBar = ({ value, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <Paper
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: '100%',
        borderRadius: 1,
        bgcolor: 'background.paper',
        boxShadow: 'none',
        border: '1px solid',
        borderColor: 'divider',
        mb: 0
      }}
      elevation={0}
    >
      <IconButton sx={{ p: '10px', color: 'action.active' }}>
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ 
          ml: 1, 
          flex: 1,
          '& .MuiInputBase-input': {
            padding: '8px 0'
          }
        }}
        placeholder="Search jobs..."
        value={value}
        onChange={handleChange}
      />
      {value && (
        <IconButton 
          sx={{ p: '10px' }} 
          aria-label="clear"
          onClick={handleClear}
        >
          <ClearIcon />
        </IconButton>
      )}
    </Paper>
  );
};

export default SearchBar;

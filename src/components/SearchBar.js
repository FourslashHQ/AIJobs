import React, { useState, useCallback, useEffect } from 'react';
import { Paper, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { debounce } from 'lodash';

const SearchBar = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce the onChange callback
  const debouncedOnChange = useCallback(
    debounce((newValue) => {
      onChange(newValue);
    }, 300),
    [onChange]
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue); // Update local state immediately
    debouncedOnChange(newValue); // Debounce the parent update
  };

  const handleClear = () => {
    setLocalValue('');
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
        maxWidth: 600,
        mx: 'auto',
        mb: 3
      }}
    >
      <IconButton sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search jobs..."
        value={localValue}
        onChange={handleChange}
      />
      {localValue && (
        <IconButton sx={{ p: '10px' }} aria-label="clear" onClick={handleClear}>
          <ClearIcon />
        </IconButton>
      )}
    </Paper>
  );
};

export default SearchBar;

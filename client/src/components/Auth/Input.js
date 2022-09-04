import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import React from 'react';

const Input = ({ name, handleChange, label, half, autoFocus, type, handleShowPassword, error, helperText }) => (
  <Grid item xs={12} sm={half ? 6 : 12}>
    <TextField
      error={error}
      helperText={helperText}
      name={name}
      onChange={handleChange}
      variant="standard"
      required
      fullWidth
      label={label}
      autoFocus={autoFocus}
      type={type}
      InputProps={name === 'password' ? {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleShowPassword}>
              {type === 'password' ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ),
      } : null}
    />
  </Grid>
);

export default Input;

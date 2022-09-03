import { Grid, IconButton, InputAdornment, TextField } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
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
              {type === 'password' ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      } : null}
    />
  </Grid>
);

export default Input;

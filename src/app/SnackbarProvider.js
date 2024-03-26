"use client"
import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LoadingSpinner from './LoadingSpinner';

const SnackbarContext = createContext();
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const useSnackbar = () => useContext(SnackbarContext);

const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const [isLoading, setIsLoading] = useState(false);

  const openSnackbar = (message, severity = 'success') => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  const closeSnackbar = () => {
    setOpen(false);
    setMessage('')
    setSeverity('success')
  };

  return (
    <SnackbarContext.Provider value={{ openSnackbar, closeSnackbar }}>
      {isLoading ?
        <LoadingSpinner />
        :
        <>
          {children}
          <Snackbar open={open} autoHideDuration={2000} onClose={closeSnackbar}>
            <Alert severity={severity} sx={{ width: '100%' }} onClose={closeSnackbar}>
              {message}
            </Alert>
          </Snackbar>
        </>
      }
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#93759e'
        },
        secondary: {
            main: '#775e80'
        }
    }
});

const RiffPlatform = () => (
    <ThemeProvider theme = { darkTheme }>
        <Router basename = '/app'>
            <App />
        </Router>
    </ThemeProvider>
);

export default RiffPlatform;

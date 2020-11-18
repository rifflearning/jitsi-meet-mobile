import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { createBrowserHistory } from 'history';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';

export const customHistory = createBrowserHistory();
window.testH = customHistory;

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

export default () => (
    <ThemeProvider theme = { darkTheme }>
        <Router basename = '/app'>
            <App />
        </Router>
    </ThemeProvider>
);

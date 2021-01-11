import { Grid } from '@material-ui/core';
import React from 'react';

import { connect } from '../../../base/redux';
import StyledPaper from '../StyledPaper';

import SchedulerForm from './SchedulerForm';

const Scheduler = () => (
    <Grid
        container = { true }
        spacing = { 3 }>
        <Grid
            item = { true }
            xs = { 12 }>
            <StyledPaper title = 'Schedule a meeting'>
                <SchedulerForm />
            </StyledPaper>
        </Grid>
    </Grid>
);

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = () => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);

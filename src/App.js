import React, { Component } from 'react';
import './App.css';
import Menu from './menu/Menu';
import Live from './live/Live';
import Polls from './polls/Polls';
import { Route } from 'react-router-dom';
import TabContainer from './tabs/Tabs';
import Videos from './videos/Videos';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';

const drawerWidth = 280;

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3
    },
    paper: {
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginTop: theme.spacing.unit * 2,
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
    },
});

class App extends Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Drawer
                    variant="permanent"
                    classes={{paper: classes.drawerPaper}}
                >
                    <Menu />
                </Drawer>
                <Grid container spacing={24} className={classes.appBarShift}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Route exact path='/' component={Live} />
                            <Route path='/league/:leagueId' component={TabContainer} />
                            <Route path='/videos' component={Videos} />
                            <Route path='/polls' component={Polls} />
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
// import { Route } from 'react-router-dom';
import Standings from '../standings/Standings';
import Matches from '../matches/Matches';

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
});

class SimpleTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabValue: 'matches',
            leagueId: this.props.match.params.leagueId
        }
    }

    handleChange = (event, value) => {
        this.setState({ tabValue: value });
    };

    render() {
        const { classes } = this.props;
        const props = this.props;
        const value = this.state.tabValue;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Tabs value={value} onChange={this.handleChange}>
                        <Tab value="matches" label="Matches" />
                        <Tab value="standings" label="Standings" />
                    </Tabs>
                </AppBar>
                {value === "matches" && <Matches {...props} />}
                {value === "standings" && <Standings {...props} /> }
            </div>
        );
    }
}

SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTabs);

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import './Menu.css';

const styles = theme => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    expensionPanelDetails: {
        padding: 10,
    },
    leagueUrl: {
        textDecoration: 'none',
        color: theme.palette.primary.main,
        '&:hover': {
            color: theme.palette.secondary.main,
        },
    }
});

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leagueCountries: []
        };
    }

    componentDidMount() {
        this.getCountries();
    }

    getCountries() {
        axios.get('http://livescore-backend.test/api/leagues')
          .then(res => {
            const countries = res.data;

            this.setState((prevState) => ({
                leagueCountries: [...prevState.leagueCountries, ...countries]
            }));
        })
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Live scores</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.expensionPanelDetails}>
                        <Grid item xs={12} md={12}>
                            <List dense={true}>
                                <ListItem>
                                    <ListItemText>
                                        <Link className={classes.leagueUrl} to={`/`}>Live matches</Link>
                                    </ListItemText>
                                </ListItem>
                            </List>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                {this.state.leagueCountries.map( (country, index) => (
                    <ExpansionPanel key={country.country_id}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>{country.country_name}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className={classes.expensionPanelDetails}>
                            <Grid item xs={12} md={12}>
                                <List dense={true}>
                                    {country.leagues.map( (league, i) => (
                                        <ListItem key={i}>
                                            <ListItemText>
                                                <Link className={classes.leagueUrl} to={`/league/${league.league_id}`}>{league.league_name}</Link>
                                            </ListItemText>
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                ))}
            </div>
        );
    }
}

Menu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Menu);

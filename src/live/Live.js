import React, { Component } from 'react';
import axios from 'axios';
import './Live.css';
import Scores from '../scores/Scores'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const API_KEY = process.env.REACT_APP_API_KEY;

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        marginTop: theme.spacing.unit * 3,
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    table: {
        backgroundColor: 'inherit',
        padding: 0,
    },
    paper: {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        width: '100%',
    },
    teamHome: {
        width: '37%',
        textAlign: 'right',
    },
    teamAway: {
        width: '37%',
        textAlign: 'left',
    },
    numeric: {
        width: '5%'
    },
    score: {
        width: '21%',
        textAlign: 'center'
    },
    header: {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        width: '100%'
    },
    liveMatch: {
        width: '20px'
    }
});

class Live extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matches: {},
            loaded: false
        };
    }

    futureMatchesUrl(params) {
        return 'https://apifootball.com/api/' + params + '&APIkey=' + API_KEY;
    }

    componentDidMount() {
        this.getMatches();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({matches: {}});
        this.getMatches();
    }

    getTodayForApi() {
        let today = new Date();
        return (today.getFullYear()) + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    }

    getMatches() {
        let url = this.futureMatchesUrl('?action=get_events&from=' + this.getTodayForApi() + '&to=' + this.getTodayForApi());

        axios.get(url)
          .then(res => {
              if (res.data !== undefined && res.data.length !== 0) {
                  let matchesData = [];
                  if (res.data.error === undefined) {
                      matchesData = this.groupBy(res.data, 'league_name');
                  }

                  this.setState((prevState) => ({
                      matches: {...prevState.matches, ...matchesData},
                      loaded: true
                  }));
            }
        }).catch(error => {
            console.log(error);
        });
    }

    groupBy(xs, key) {
        return xs.reduce((rv, x) => {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, []);
    }

    renderLoading() {
        const { classes } = this.props;
        return (
            <div className="vcenter">
                <CircularProgress className={classes.progress} size={70} />
            </div>
        );
    }

    renderNoResults() {
        return (
            <div className="vcenter">
                No matches today
            </div>
        );
    }

    renderLiveMatch(match_live) {
        if (match_live === '1') {
            const { classes } = this.props;
            return <img className={classes.liveMatch} src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Soccer_ball_animated.svg" alt="live" />;
        }
    }

    render() {
        const { classes } = this.props;
        const { matches, loaded } = this.state;

        let keys = Object.keys(matches);
        let renderLiveMatch = (match_live) => this.renderLiveMatch(match_live);

        if (loaded) {
            if (keys.length > 0) {
                return (
                    <Paper className={classes.root} elevation={0}>
                        <Typography className={classes.header} variant="headline" component="h1">
                            SkyBet Championship
                        </Typography>

                        <Paper className={classes.paper} elevation={1}>
                            {keys.map( (league, index) => (
                                <Table className={classes.table} key={`round-day-${index}`}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={5}>{league}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {matches[league].map( (match, index) => (
                                            <TableRow key={`match-id-${match.match_id}`} hover={true} >
                                                <TableCell className={classes.numeric}>{match.match_status === '' ? match.match_time : match.match_status}</TableCell>
                                                <TableCell className={classes.teamHome}>{match.match_hometeam_name}</TableCell>
                                                <TableCell padding={'dense'} className={classes.score}>
                                                    <Scores match={match} />
                                                </TableCell>
                                                <TableCell className={classes.teamAway}>{match.match_awayteam_name}</TableCell>
                                                <TableCell className={classes.numeric}>
                                                    {renderLiveMatch(match.match_live)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ))}
                        </Paper>
                    </Paper>
                );
            } else {
                return this.renderNoResults();
            }
        }

        return this.renderLoading();
    }
}

Live.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Live);

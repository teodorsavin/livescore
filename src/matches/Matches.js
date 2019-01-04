import React, { Component } from 'react';
import Moment from 'react-moment';
import axios from 'axios';
import './Matches.css';
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
    },
    matchDate: {
        textAlign: 'right'
    }
});

class Matches extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matches: {},
            leagueId: props.match.params.leagueId
        };
    }

    pastMatchesUrl(leagueId) {
        return 'http://livescore-backend.test/api/completed-matches/' + leagueId;
    }

    futureMatchesUrl(params) {
        return 'https://apifootball.com/api/' + params + '&APIkey=' + API_KEY;
    }

    getTodayForApi() {
        let today = new Date();
        return (today.getFullYear()) + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    }

    getFourWeeksFromNowForApi() {
        let today = new Date();
        return (today.getFullYear()) + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 28);
    }

    componentDidMount() {
        this.getMatches(this.state.leagueId, 'BACKEND');
        this.getMatches(this.state.leagueId, 'API_FOOTBALL');
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.leagueId !== this.props.match.params.leagueId) {
            this.setState({matches: {}, leagueId: nextProps.match.params.leagueId});
            this.getMatches(nextProps.match.params.leagueId, 'BACKEND');
            this.getMatches(nextProps.match.params.leagueId, 'API_FOOTBALL');
        }
    }

    getMatches(leagueId, source = 'API_FOOTBALL') {
        let url = (source === 'API_FOOTBALL')
            ? this.futureMatchesUrl(
                '?action=get_events&from=' + this.getTodayForApi() + '&to=' + this.getFourWeeksFromNowForApi() + '&league_id=' + leagueId
            )
            : this.pastMatchesUrl(leagueId);

        axios.get(url)
          .then(res => {
              if (res.data !== undefined && res.data.length !== 0) {
                const matchesData = this.groupByDate(res.data, 'match_date');
                this.setState((prevState) => ({
                    matches: {...prevState.matches, ...matchesData}
                }));
            }
        }).catch(error => {
            console.log(error);
        });
    }

    groupByDate(xs, key) {
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

    render() {
        const { classes } = this.props;
        const { matches } = this.state;
        let keys = Object.keys(matches);

        if (keys.length > 0) {
            return (
                    <Paper className={classes.root} elevation={0}>
                        <Typography className={classes.header} variant="headline" component="h1">
                            SkyBet Championship
                        </Typography>

                        <Paper className={classes.paper} elevation={1}>
                            {keys.map( (date, index) => (
                                <Table className={classes.table} key={`round-day-${index}`}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.matchDate} colSpan={5}><Moment format={"DD MMMM YYYY"}>{date}</Moment></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {matches[date].map( (match, index) => (
                                            <TableRow key={`match-id-${match.match_id}`} hover={true} >
                                                <TableCell className={classes.numeric}>{match.match_status === '' ? match.match_time : match.match_status}</TableCell>
                                                <TableCell className={classes.teamHome}>{match.match_hometeam_name}</TableCell>
                                                <TableCell padding={'dense'} className={classes.score}>
                                                    <Scores match={match} />
                                                </TableCell>
                                                <TableCell className={classes.teamAway}>{match.match_awayteam_name}</TableCell>
                                                <TableCell className={classes.numeric}>
                                                    {match.match_live === 1 && <img className={classes.liveMatch} src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Soccer_ball_animated.svg" alt="live" />}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ))}
                        </Paper>
                    </Paper>
                );
        }

        return this.renderLoading();
    }
}

Matches.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Matches);

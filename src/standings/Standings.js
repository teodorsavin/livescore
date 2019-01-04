import React, { Component } from 'react';
import axios from 'axios';
import './Standings.css';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';

const API_KEY = process.env.REACT_APP_API_KEY;
const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 5,
    },
    table: {
        minWidth: 600,
        width: '100%'
    },
});

class Standings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            standings: [],
            leagueName: 'standings',
            leagueId: props.match.params.leagueId
        };
    }

    componentDidMount() {
        this.getStandings(this.state.leagueId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.leagueId !== this.props.match.params.leagueId) {
            this.setState({leagueId: nextProps.match.params.leagueId});
            this.getStandings(nextProps.match.params.leagueId);
        }
    }

    getStandings(leagueId) {
        axios.get(`https://apifootball.com/api/?action=get_standings&timestamp=${new Date().getTime()}&league_id=${leagueId}&APIkey=${API_KEY}`)
          .then(res => {
            const standings = this.sortByPosition(res.data);
            this.setState({standings: standings, leagueName: standings[0].league_name});
            document.title = standings[0].country_name + ' - ' + standings[0].league_name;
        });
    }

    sortByPosition(standings) {
        return standings.sort(function(a, b){
            var keyA = parseInt(a.overall_league_position, 0),
                keyB = parseInt(b.overall_league_position, 0);
            // Compare the 2
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });
    }

    render() {
        const { standings, leagueName } = this.state;
        const { classes } = this.props;
        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding={'dense'} colSpan={2}>{leagueName}</TableCell>
                            <TableCell padding={'dense'} numeric>P</TableCell>
                            <TableCell padding={'dense'} numeric>W</TableCell>
                            <TableCell padding={'dense'} numeric>D</TableCell>
                            <TableCell padding={'dense'} numeric>L</TableCell>
                            <TableCell padding={'dense'} numeric>GF</TableCell>
                            <TableCell padding={'dense'} numeric>GA</TableCell>
                            <TableCell padding={'dense'} numeric>P</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {standings.map( (team, index) => (
                            <TableRow key={index} hover={true} >
                                <TableCell padding={'dense'} numeric>{team.overall_league_position}</TableCell>
                                <TableCell padding={'dense'} >{team.team_name}</TableCell>
                                <TableCell padding={'dense'} numeric>{team.overall_league_payed}</TableCell>
                                <TableCell padding={'dense'} numeric>{team.overall_league_W}</TableCell>
                                <TableCell padding={'dense'} numeric>{team.overall_league_D}</TableCell>
                                <TableCell padding={'dense'} numeric>{team.overall_league_L}</TableCell>
                                <TableCell padding={'dense'} numeric>{team.overall_league_GF}</TableCell>
                                <TableCell padding={'dense'} numeric>{team.overall_league_GA}</TableCell>
                                <TableCell padding={'dense'} numeric>{team.overall_league_PTS}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

Standings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Standings);

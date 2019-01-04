import React, { Component } from 'react';
import './Scores.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const styles = theme => ({
    table: {
        backgroundColor: 'inherit',
        padding: 0,
    },
    dialog: {
        // width: '50vw'
    },
    teamHome: {
        width: '35%',
        textAlign: 'right',
    },
    teamAway: {
        width: '35%',
        textAlign: 'left',
    },
    score: {
        width: '20%',
        textAlign: 'center'
    },
    teamHomeScores: {
        textAlign: 'right',
        // width: '35%'
    },
    teamAwayScores: {
        textAlign: 'left',
        // width: '35%'
    },
    numeric: {
        width: '5%'
    },
    liveMatch: {
        width: '20px'
    }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Scores extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { match, classes } = this.props;
        let score;
        let goalscorers = [];
        let liveMatch = '';

        if (match.match_hometeam_score !== '') {
            score = <Button onClick={this.handleClickOpen}>{match.match_hometeam_score} - {match.match_awayteam_score}</Button>;
        } else {
            score = `${match.match_hometeam_score} - ${match.match_awayteam_score}`;
        }

        if (match.match_live) {
            liveMatch = <img className={classes.liveMatch} src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Soccer_ball_animated.svg" alt="live" />;
        }

        if (match.goalscorer !== undefined && match.goalscorer !== '') {
            if (match.goalscorer !== [] && match.goalscorer !== '') {
                if (Array.isArray(match.goalscorer)) {
                    goalscorers = match.goalscorer;
                } else {
                    goalscorers = JSON.parse(match.goalscorer);
                }
            }
        }

        return (
            <div>
                {score}
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    maxWidth="md"
                    >
                    <DialogContent className={classes.dialog}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding={'dense'} className={classes.numeric}>{match.match_status === '' ? match.match_time : match.match_status}</TableCell>
                                    <TableCell padding={'dense'} className={classes.teamHome}>{match.match_hometeam_name}</TableCell>
                                    <TableCell padding={'dense'} className={classes.score}>
                                        {match.match_hometeam_score} - {match.match_awayteam_score}
                                    </TableCell>
                                    <TableCell padding={'dense'} className={classes.teamAway}>{match.match_awayteam_name}</TableCell>
                                    <TableCell padding={'dense'} className={classes.numeric}>
                                        {liveMatch}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {goalscorers.map((goalscorer, index) => (
                                    <TableRow key={`goal-id-${index}`} hover={true} >
                                        <TableCell padding={'dense'} className={classes.numeric}>{goalscorer.time}</TableCell>
                                        <TableCell padding={'dense'} className={classes.teamHomeScores}>{goalscorer.home_scorer}</TableCell>
                                        <TableCell padding={'dense'} className={classes.score}>{goalscorer.score}</TableCell>
                                        <TableCell padding={'dense'} className={classes.teamAwayScores}>{goalscorer.away_scorer}</TableCell>
                                        <TableCell padding={'dense'} className={classes.numeric}></TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell padding={'dense'} className={classes.numeric}></TableCell>
                                    <TableCell padding={'dense'} className={classes.teamHomeScores}></TableCell>
                                    <TableCell padding={'dense'} className={classes.score}></TableCell>
                                    <TableCell padding={'dense'} className={classes.teamAwayScores}></TableCell>
                                    <TableCell padding={'dense'} className={classes.numeric}></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

Scores.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Scores);

import React, { Component } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import {Doughnut} from 'react-chartjs-2';

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3
    }
});

class Polls extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            data: [],
            labels: [],
            poll: null
        };
    }

    componentDidMount() {
        this.getPollResults();
    }

    backgroundColors() {
        return [
    		'#FF6384',
    		'#36A2EB',
    		'#FFCE56',
            '#00CE56',
            '#006384',
        ];
    }

    hoverBackgroundColors() {
        return [
    		'#FF6384',
    		'#36A2EB',
    		'#FFCE56',
            '#00CE56',
            '#006384',
		];
    }

    getPollResults() {
        const backgroundColor = this.backgroundColors();
        const hoverBackgroundColor = this.hoverBackgroundColors()

        let url = 'http://livescore-backend.test/api/poll/5';
        axios.get(url)
        .then(res => {
            const poll = res.data[0];
            const labels = Object.keys(res.data[1]);
            const results = Object.keys(res.data[1]).map((label) => (res.data[1][label]));
            const data = {
                labels: labels,
                datasets: [{
                    data: results,
                    backgroundColor: backgroundColor,
                    hoverBackgroundColor: hoverBackgroundColor
                }]
            };

            this.setState({
                labels: labels,
                results: results,
                data: data,
                poll: poll
            });
        });
    }

    render() {
        const { poll, data } = this.state;
        const { classes } = this.props;
        if (poll === null) {
            return (
                <Paper className={classes.root} elevation={0}>

                </Paper>
            )
        } else {
            return (
                <Paper className={classes.root} elevation={0}>
                    <h5>{poll.poll_question}</h5>
                    <Doughnut data={data} />
                </Paper>
            )
        }
    }
}

Polls.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Polls);

import React, { Component } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3
    },
    post: {
        margin: theme.spacing.unit,
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 2,
        PaddingRight: theme.spacing.unit * 2,
        textAlign: 'left'
    },
    postLink: {
        textDecoration: 'none',
        color: theme.palette.primary.main,
        '&:visited': {
            color: theme.palette.secondary.main,
        },
    }
});

class Videos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noPosts: 0,
            after: null,
            posts: [],
        };
    }

    componentDidMount() {
        this.getPosts();
    }

    handleClickLoad(after) {
        if (after !== null) {
            this.getPosts(after);
        }
    }

    getPosts(after = null) {
        let url = `https://www.reddit.com/r/soccer/new.json?limit=100`;
        if (after !== null ||  after !== '') {
            url += `&after=${after}`;
        }

        axios.get(url)
        .then(res => {
            const noAllPosts = res.data.data.children.length;
            const posts = res.data.data.children.filter(this.findGoals);
            const noPosts = posts.length;
            let after = null;
            if (res.data.data.children[noAllPosts -1] !== undefined) {
                after = res.data.data.children[noAllPosts -1].kind + '_' + res.data.data.children[noAllPosts -1].data.id;
            }

            this.setState((prevState) => ({
                noPosts: prevState.noPosts + noPosts,
                after: after,
                posts: [...prevState.posts, ...posts]
            }));
        });
    }

    findGoals(post) {
        let regex = /(\[\d\])+/g;
        let found = post.data.title.match(regex);
        return (found === null) ? false : true;
    }

    render() {
        const { noPosts, posts, after } = this.state;
        const { classes } = this.props;
        return (
            <Paper className={classes.root} elevation={0}>
                <h5>{noPosts} videos</h5>
                {posts.map( (post, index) => (
                    <Paper className={classes.post} key={index} elevation={1}>
                        <a className={classes.postLink} href={post.data.url} target="_blank" rel="noopener noreferrer">{post.data.title}</a>
                    </Paper>
                ))}
                <Button onClick={() => this.handleClickLoad(after)}>Load more</Button>
            </Paper>
        )
    }
}

Videos.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Videos);

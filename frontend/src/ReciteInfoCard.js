import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: theme.spacing.unit * 4,
        marginBottom: theme.spacing.unit * 4,
        marginLeft: theme.spacing.unit * 20,
        marginRight: theme.spacing.unit * 20,
    },
    container: {
        padding: theme.spacing.unit * 5,
    },

    button: {
        background: 'linear-gradient(45deg, #2196F3 30%, #64B5F6 90%)',
        borderRadius: 5,
        border: 0,
        color: 'white',
        height: 50,
        width: 176,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(135, 105, 255, .30)',
    },
    text1: {
        color: '#448AFF',
    },
    text2: {
        color: 'white',
    }
});

class ReciteInfoCard extends Component{
    render(){
        const { classes } = this.props;
        return (
            <div>
                <Paper className={classes.root}>
                    <Grid container alignItems='center' jusitfy='center' className={classes.container}>
                        <Grid item xs={3}>
                            <div>
                                <Typography variant="display3" className={classes.text1}>
                                    150
                                </Typography>
                                <Typography variant="title">
                                    今日单词
                                </Typography>
                            </div>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="display3" className={classes.text1}>
                                150
                            </Typography>
                            <Typography variant="title">
                                新词
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="raised" color="primary" size="large" className={classes.button}
                                onClick={this.props.onLearn}>
                                <Typography variant="title" className={classes.text2}>
                                    开始学习
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
        );
    }
}

ReciteInfoCard.protoTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReciteInfoCard);
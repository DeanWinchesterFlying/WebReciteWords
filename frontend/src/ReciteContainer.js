import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ReciteInfoCard from './ReciteInfoCard'

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: theme.spacing.unit * 8,
        paddingBottom: theme.spacing.unit * 8,
        marginTop: theme.spacing.unit * 1,
        width: '100%',
    }),
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.6)',
        color:'#BDBDBD',
    },
    head: theme.mixins.gutters({
        textAlign: 'center',
        color: '#448AFF',
    }),
});

function ReciteContainer(props) {
    const { classes } = props;
    const bull = <span className={classes.bullet}>•</span>;
    return (
        <div>
            <Paper className={classes.root} elevation={4}>
                <Typography variant="display1" component="h3" className={classes.head}>
                    {bull}{bull}{bull}{bull}{bull}{bull}{bull}{bull}{bull}{bull}
                    单词背诵
                    {bull}{bull}{bull}{bull}{bull}{bull}{bull}{bull}{bull}{bull}
                </Typography>
                <Typography variant="headline" component="h3" className={classes.head}>
                    <ReciteInfoCard/>
                </Typography>
            </Paper>
        </div>
    );
}

ReciteContainer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReciteContainer);
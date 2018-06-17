import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';

const styles = theme => ({
    root: {
        width: '100%',

        backgroundColor: theme.palette.background.paper,
    },
    container: {
        width: '60%',
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        marginLeft: theme.spacing.unit * 8,
        marginTop: theme.spacing.unit * 2,
    },
    avator: {
        backgroundColor: "#757de8",
    }
});

class VocabContainer extends React.Component{

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <List>
                    {[0, 1, 2, 3].map(value => {
                        return <Paper className={classes.container}>
                            <ListItem >
                                <ListItemText primary={`English ${value + 1}\t`} />
                                <ListItemText primary={`中文 ${value + 1}\t`} />
                                <ListItemSecondaryAction>
                                    <IconButton aria-label="Comments">
                                        <Avatar className={classes.avator}>
                                            <DeleteIcon/>
                                        </Avatar>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </Paper>
                    })}
                </List>
            </div>
        );
    }
}

VocabContainer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VocabContainer);
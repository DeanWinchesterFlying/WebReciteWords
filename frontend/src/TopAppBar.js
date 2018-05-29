import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = {
    root: {
        flexGrow: 1,
        width: '100%',
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

class TopAppBar extends Component {
    state = {
        auth: true,
    };

    render() {
        const { classes } = this.props;
        const { auth } = this.state;
        const open = true;
        return (
            <AppBar>
                <Toolbar>
                    <Typography variant="title" color="inherit" className={classes.flex}>
                        English
                    </Typography>
                    { auth && (
                        <div>
                            <IconButton
                                aria-owns={open ? 'menu-appbar' : null}
                                aria-haspopup="true"
                                color="inherit"
                            ><AccountCircle />
                            </IconButton>
                        </div>
                    ) }
                </Toolbar>
            </AppBar>
        );
    }
}

AppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopAppBar);
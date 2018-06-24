import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Redirect } from 'react-router-dom';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const styles = theme => (
    {
        root: {
            background: 'linear-gradient(45deg, #00B0FF 30%, #00B8D4 90%)',
        },
        flex: {
            flex: 1,
        },
        menuButton: {
            marginLeft: -12,
            marginRight: 20,
        },
        menuItem: {

        },
        primary: {},
        icon: {},
    }
);

class TopAppBar extends Component {
    state = {
        anchorEl: null,
        auth: false,
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleMenu = event => {
        console.log(event.currentTarget);
        this.setState({ anchorEl: event.currentTarget });
    };

    handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        this.handleClose();
    };

    render() {
        const { classes } = this.props;
        let auth = Boolean(localStorage.getItem('token'));
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        if(!auth)
            return <Redirect push to={'/login'}/>;
        return (
            <AppBar className={classes.root}>
                <Toolbar>
                    <Typography variant="title" color="inherit" className={classes.flex}>
                        {localStorage.getItem('username')}
                    </Typography>
                    { auth && (
                        <div>
                            <IconButton
                                aria-owns={open ? 'menu-appbar' : null}
                                aria-haspopup="true"
                                color="inherit"
                                onClick={this.handleMenu}
                            ><AccountCircle /></IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={this.handleClose}
                            >
                                <MenuItem onClick={this.handleLogout} className={classes.menuItem}>
                                    <ListItemIcon className={classes.icon}>
                                        <ExitToAppIcon color={'action'}/>
                                    </ListItemIcon>
                                    <ListItemText>
                                        退出登录
                                    </ListItemText>
                                </MenuItem>
                            </Menu>
                        </div>
                    ) }
                </Toolbar>
            </AppBar>
        );
    }
}

TopAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopAppBar);
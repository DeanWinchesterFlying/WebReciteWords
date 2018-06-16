import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import Lock from '@material-ui/icons/Lock'
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import {logo} from './image/logo.jpg'
import CardMedia from '@material-ui/core/CardMedia';
import { Redirect } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Email from '@material-ui/icons/Email';

const styles = theme => ({
    container:{

    },
    root: {
        maxWidth: 400,
        padding: 'auto',
        paddingTop: 10,
        marginTop: 120,
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow: '0 3px 20px 2px rgba(135, 105, 255, .30)',
        //background: '#ECEFF1',
    },
    button: {
        background: 'linear-gradient(45deg, #2196F3 30%, #64B5F6 90%)',
        borderRadius: 5,
        border: 0,
        color: 'white',
        height: 40,
        width: 240,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(135, 105, 255, .30)',
    },
    paper: theme.mixins.gutters({
        maxWidth: 356,
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 1,
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center',
        boxShadow: '0 3px 5px 2px rgba(135, 105, 255, .30)',
    }),
});

class LoginCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            password: '',
            login: false,
            register: true,
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const {account, password} = this.state;
        if(account.length < 6 || password.length < 6){

        }
        //TODO:
        this.setState({login: true})
    }

    render() {
        const {classes} = this.props;
        const dialog = (<Dialog open={this.state.register} style={{paddingTop: 20}}
                                onClose={() => this.setState({register: false})}>
            <DialogTitle id="form-dialog-title">注册</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    注册新的用户
                </DialogContentText>
                <Grid container spacing={16} alignItems="flex-end">
                    <Grid item>
                        <AccountCircle />
                    </Grid>
                    <Grid item>
                        <TextField autoFocus margin="dense" id="name"
                            label="Account" type="text" fullWidth />
                    </Grid>
                    <Grid item>
                        <Email />
                    </Grid>
                    <Grid item>
                        <TextField autoFocus margin="dense" id="name"
                                   label="Email Address" type="email" fullWidth/>
                    </Grid>
                </Grid>
                <br/>
                <Grid container spacing={16} alignItems="flex-end" fullWidth>
                    <Grid item>
                        <Lock/>
                    </Grid>
                    <Grid item>
                        <TextField autoFocus margin="dense" id="name"
                            label="Password" type="password" fullWidth/>
                    </Grid>
                    <Grid item>
                        <Lock/>
                    </Grid>
                    <Grid item>
                        <TextField autoFocus margin="dense" id="name" label="Confirm Password"
                            type="password" fullWidth />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => this.setState({register: false})} color="primary">
                    取消
                </Button>
                <Button onClick={() => this.setState({register: false})} color="primary">
                    注册
                </Button>
            </DialogActions>
        </Dialog>);
        if(this.state.login)
            return <Redirect push to={'/'}/>
        return (<div style={{ paddingTop: 70 }} className={classes.container} >
            {dialog}
            <Card className={classes.root}>
                <CardContent>
                    <Grid container direction={'column'} spacing={24}
                          alignItems={'center'}>
                        <Grid item>
                            <FormControl>
                                {<InputLabel htmlFor="input-with-icon-adornment">
                                    Email/Account
                                </InputLabel>}
                                <Input
                                    name={'account'}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    }
                                    onChange={(event) => this.setState({account: event.target.value})}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <FormControl>
                                {<InputLabel htmlFor="input-with-icon-adornment">
                                    Password
                                </InputLabel>}
                                <Input
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Lock/>
                                        </InputAdornment>
                                    }
                                    type="password"
                                    autoComplete="current-password"
                                    onChange={(event) => this.setState({password: event.target.value})}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <Button className={classes.button} onClick={this.handleClick}>
                                登陆
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <br/>
            <Paper className={classes.paper} elevation={4}>
                <Typography component="h3">
                    New to us?
                    <a href='#' onClick={() => this.setState({register: true})}>
                        Sign Up
                    </a>
                </Typography>
            </Paper>
        </div>);
    }
}

LoginCard.protoTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginCard);
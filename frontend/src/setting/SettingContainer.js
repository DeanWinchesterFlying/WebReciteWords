import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import {withAuthHeader} from "../utils/api";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const styles = theme => ({
    bootstrapRoot: {
        padding: 0,
        fontSize: 16,
        'label + &': {
            marginTop: theme.spacing.unit * 3,
        },
    },
    bootstrapInput: {
        borderRadius: 4,
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 12px',
        width: 'calc(100% - 24px)',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
    bootstrapFormLabel: {
        fontSize: 18,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    menu: {
        width: 200,
    },
    root: {
        flexGrow: 1,
        paddingLeft: theme.spacing.unit * 6,
    },
    button1: {
        background: 'linear-gradient(45deg, #2196F3 30%, #64B5F6 90%)',
        borderRadius: 5,
        border: 0,
        color: 'white',
        height: 30,
        width: 40,
        padding: '0 30px',
        marginBottom: theme.spacing.unit * 4,
        boxShadow: '0 3px 5px 2px rgba(135, 105, 255, .30)',
    },
});

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class SettingContainer extends React.Component {
    state = {
        currencyV: undefined,
        currencyQ: 150,
        open: false,
    };

    constructor(props){
        super(props);
        let self = this;
        this.handleSetting = this.handleSetting.bind(this);
        fetch(localStorage.getItem('prefix') + '/vocabularies/', {
            method: 'GET',
            headers: withAuthHeader(),
        }).then(function (response) {
           return response.json();
        }).then(function (response) {
            console.log(self.props.config);
            self.setState({vocabularies: response, currencyV: self.props.config['currVocab'],
                currencyQ: self.props.config['quantity'],
                currencyE: self.props.config['exam'],
                checkedC: self.props.config['showChinese'],
                checkedA: false});
        });
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleCheck = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    handleSetting() {
        let self = this;
        fetch(localStorage.getItem('prefix') + '/configuraion/' + this.props.config['id'] + '/', {
            method: 'PATCH',
            body: JSON.stringify({
                'quantity': this.state.currencyQ,
                'currVocab': this.state.currencyV,
                'showChinese': this.state.checkedC,
                'exam': this.state.currencyE,
            }),
            headers: withAuthHeader(),
        }).then(function (response) {
            return response.json();
        }).then(function (response) {
            console.log(response);
            self.props.onChangeConfig(self.state.currencyQ, self.state.checkedC,
                self.state.currencyV, self.state.currencyE);
        });
    }

    render() {
        const { classes } = this.props;
        const { vocabularies } = this.state;
        const checkedC = Boolean(this.state.checkedC);
        const dialog = (
            <Dialog
                open={this.state.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => this.setState({ open: false })}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {"更新设置"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        是否更新单词设置
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.setState({ open: false })} color="primary">
                        取消
                    </Button>
                    <Button onClick={() => {
                        this.setState({ open: false });
                        this.handleSetting();
                    }} color="primary">
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        );

        return (
            <Paper className={classes.root}>
                {dialog}
                <form className={classes.container} noValidate autoComplete="off">
                    <Grid container direction={'column'} justify={'center'} className={classes.root}
                          alignment={'flex-start'} spacing={8}>
                        <Grid item>
                            <Typography>
                                背单词设置
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Divider inset/>
                        </Grid>
                        <Grid item>
                            <TextField
                                id="select-vocabulary"
                                select
                                label="选择单词集"
                                className={classes.textField}
                                value={this.state.currencyV}
                                onChange={this.handleChange('currencyV')}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                InputProps={{
                                    disableUnderline: true,
                                    classes: {
                                        root: classes.bootstrapRoot,
                                        input: classes.bootstrapInput,
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                    className: classes.bootstrapFormLabel,
                                }}
                                margin="normal"
                            >
                                {vocabularies && vocabularies.map(vocabulary => (
                                    <MenuItem key={vocabulary['id']} value={vocabulary['id']}>
                                        {vocabulary['title'] + '(' + vocabulary['total_words']  + ')'}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item>
                            <TextField
                                id="select-number"
                                select
                                label="每日学习量"
                                className={classes.textField}
                                value={this.state.currencyQ}
                                onChange={this.handleChange('currencyQ')}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                InputProps={{
                                    disableUnderline: true,
                                    classes: {
                                        root: classes.bootstrapRoot,
                                        input: classes.bootstrapInput,
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                    className: classes.bootstrapFormLabel,
                                }}
                                margin="normal"
                            >
                                {[20, 50, 80, 100, 150, 200].map(value => (
                                    <MenuItem key={value} value={value}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item>
                            <TextField
                                id="select-number"
                                select
                                label="单次考核量"
                                className={classes.textField}
                                value={this.state.currencyE}
                                onChange={this.handleChange('currencyE')}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                InputProps={{
                                    disableUnderline: true,
                                    classes: {
                                        root: classes.bootstrapRoot,
                                        input: classes.bootstrapInput,
                                    },
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                    className: classes.bootstrapFormLabel,
                                }}
                                margin="normal"
                            >
                                {[10, 20, 30, 40].map(value => (
                                    <MenuItem key={value} value={value}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item>
                            <FormControl component="fieldset">
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={checkedC}
                                                onChange={this.handleCheck('checkedC')}
                                                value="checkedC"
                                                color="primary"
                                            />
                                        }
                                        label="中文解释"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={Boolean(this.state.checkedA)}
                                                onChange={this.handleCheck('checkedA')}
                                                value="checkedA"
                                                color="primary"
                                            />
                                        }
                                        label="自动发音"
                                    />
                                </FormGroup>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <Button variant="raised" color="primary" size="large"
                                    className={classes.button1} onClick={() => this.setState({ open: true })}>
                                <Typography variant="body" className={classes.text1}>
                                    提交
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        );
    }
}


SettingContainer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SettingContainer);
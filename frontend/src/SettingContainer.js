import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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

const currencies = [
    {
        value: 'USD',
        label: '$',
    },
    {
        value: 'EUR',
        label: '€',
    },
    {
        value: 'BTC',
        label: '฿',
    },
    {
        value: 'JPY',
        label: '¥',
    },
];


class SettingContainer extends React.Component {
    state = {
        name: 'Cat in the Hat',
        age: '',
        multiline: 'Controlled',
        currency: 'EUR',
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <form className={classes.container} noValidate autoComplete="off">
                    <Grid container direction={'column'} justify={'center'} className={classes.root}
                          alignment={'flex-start'} spacing={8}>
                        <Grid item>
                            <TextField
                                id="select-vocabulary"
                                select
                                label="选择单词集"
                                className={classes.textField}
                                value={this.state.currency}
                                onChange={this.handleChange('currency')}
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
                                {currencies.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
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
                                value={this.state.currency}
                                onChange={this.handleChange('currency')}
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
                                {currencies.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
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
                                                checked={this.state.checkedA}
                                                onChange={this.handleChange('checked1')}
                                                value="checked1"
                                                color="primary"
                                            />
                                        }
                                        label="中文解释"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={this.state.checkedB}
                                                onChange={this.handleChange('checked2')}
                                                value="checked2"
                                                color="primary"
                                            />
                                        }
                                        label="自动发音"
                                    />
                                </FormGroup>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <Button variant="raised" color="primary" size="large" className={classes.button1}>
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
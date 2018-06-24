import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import {withAuthHeader} from "../utils/api";

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        paddingTop: '6px',
        height: '100%',
        //backgroundColor: theme.palette.background.paper,
        backgroundColor: '#F5F5F5',
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
    },
    tabsRoot: {
        borderBottom: '1px solid #e8e8e8',
    },
    tabsIndicator: {
        backgroundColor: '#1890ff',
    },
    tabRoot: {
        textTransform: 'initial',
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
        marginRight: theme.spacing.unit * 4,
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
        '&:hover': {
            color: '#40a9ff',
            opacity: 1,
        },
        '&$tabSelected': {
            color: '#1890ff',
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: '#40a9ff',
        },
    },
    tabSelected: {},
    typography: {
        padding: theme.spacing.unit * 3,
    },
});

class VocabContainer extends React.Component{
    state = {
        value: 6,
    };

    getWords(self, value) {
        fetch(localStorage.getItem('prefix') + '/vocabularies/' + value + '/word/', {
            method: 'GET',
            headers: withAuthHeader(),
        }).then(function (response) {
            return response.json();
        }).then(function (response) {
            self.setState({myWords: response});
            console.log(response);
        });
        this.setState({ value });
    }

    handleChange = (event, value) => {
        let self = this;
        console.log(value);
        this.getWords(self, value);
        this.setState({ value });
    };

    constructor(props) {
        super(props);
        this.getMyVocabulary = this.getMyVocabulary.bind(this);
        this.getMyVocabulary();
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete(word) {
        let self = this;
        let {value} = this.state;
        fetch(localStorage.getItem('prefix') + '/vocabularies/' + value + '/word/?word=' + word, {
            method: 'DELETE',
            headers: withAuthHeader(),
        }).then(function (response) {
            return response.json();
        }).then(function (response) {
            self.getWords(self, value);
            console.log(response);
        });
    }

    getMyVocabulary() {
        let self = this;
        fetch(localStorage.getItem('prefix') + '/vocabularies/me/', {
            method: 'GET',
            headers: withAuthHeader(),
        }).then(function (response) {
            return response.json();
        }).then(function (response) {
            if(response.length > 0){
                self.getWords(self, response[0]['id']);
                self.setState({myVocab: response, value: response[0]['id']});
            }
            else
                self.setState({myVocab: response});
            console.log(response);
        });
    }

    render() {
        const { classes } = this.props;
        const { value, myVocab, myWords } = this.state;
        return (
            <div className={classes.root}>
                <AppBar position="static" color="default">
                    <Tabs value={value} onChange={this.handleChange}
                        classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
                    >
                        {
                            myVocab && myVocab.map((vocab) => (
                                <Tab
                                    disableRipple
                                    classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                                    label={vocab['title']}
                                    value={vocab['id']}
                                />
                            ))
                        }
                    </Tabs>
                </AppBar>
                {
                    myVocab && myVocab.map((vocab) => {
                        if(value === vocab['id']){
                            return (
                                <div className={classes.root}><List>
                                    {myWords && myWords.map(word => (
                                        <Paper className={classes.container}>
                                            <ListItem key={word['id']}>
                                                <ListItemText primary={word['word']} />
                                                <ListItemText primary={word['chinese']} />
                                                <ListItemSecondaryAction>
                                                    <IconButton aria-label="Comments"
                                                    onClick={() => this.handleDelete(word['id'])}>
                                                        <Avatar className={classes.avator}>
                                                            <DeleteIcon/>
                                                        </Avatar>
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        </Paper>
                                    ))}</List>
                                </div>
                            );
                        }
                    })
                }
            </div>
        );
    }
}

VocabContainer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VocabContainer);
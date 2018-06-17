import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PhoneIcon from '@material-ui/icons/Phone';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import SettingsIcon from '@material-ui/icons/Settings';
import ScheduleIcon from '@material-ui/icons/Schedule';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import HelpIcon from '@material-ui/icons/Help';
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import ThumbDown from '@material-ui/icons/ThumbDown';
import Typography from '@material-ui/core/Typography';
import ReciteContainer from './recite/ReciteContainer'
import SettingContainer from './setting/SettingContainer'
import VocabContainer from './vocabulary/VocabContainer'
import Grid from '@material-ui/core/Grid';
import {withAuthHeader} from './utils/api'

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 100 * 3 }}>
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
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },

    tabs: {
        flexGrow: 1,
        width: '100%',
    }
});

class ScrollableTabs extends React.Component {
    state = {
        value: 0,
        words: undefined,
        configure: undefined,
        vocab: undefined,
        ptr: 0,
        reciting: false,
        showChinese: false,
    };

    constructor(props) {
        super(props);
        let self = this;
        this.handleKnow = this.handleKnow.bind(this);
        this.handleUnKnow = this.handleUnKnow.bind(this);
        fetch(localStorage.getItem('prefix') + '/words/', {
            method: 'GET',
            headers: withAuthHeader(),
        }).then(function (response) {
            return response.json();
        }).then(function (response) {
            self.setState({words: response});
            console.log(response);
        });
        fetch(localStorage.getItem('prefix') + '/configuraion/', {
            method: 'GET',
            headers: withAuthHeader(),
        }).then(function (response) {
            return response.json();
        }).then(function (response) {
            self.setState({configure: response});
            console.log(response);
            fetch(localStorage.getItem('prefix') + '/vocabularies/' + response['currVocab'] + '/', {
                method: 'GET',
                headers: withAuthHeader(),
            }).then(function (response) {
                return response.json();
            }).then(function (response) {
                self.setState({vocab: response});
                console.log(response);
            });
        });
    }

    handleChange = (event, value) => {
        this.setState({ value });
        if(value !== 0)
            this.setState({reciting: false, ptr: 0})
    };

    handleKnow() {
        const { words, ptr } = this.state;
        this.setState({ptr: (ptr + 1) % words.length, showChinese: false});
    }

    handleUnKnow() {
        const { words, ptr } = this.state;
        this.setState({ptr: ptr, showChinese: true});
    }

    render() {
        const { classes } = this.props;
        const { value, words, reciting, ptr } = this.state;

        return (
            <div style={{ paddingTop: 70 }}>
                <div className={classes.root}>
                    <Grid direction={'column'} container  alignment={'center'} justify={'center'}>
                        <Grid item>
                            <AppBar position="static" color="default" className={classes.tabs}>
                                <Tabs
                                    value={value}
                                    onChange={this.handleChange}
                                    scrollable
                                    scrollButtons="on"
                                    indicatorColor="primary"
                                    textColor="primary"
                                >
                                    <Tab label="单词学习" icon={<LibraryBooksIcon />} />
                                    <Tab label="单词考核" icon={<DirectionsRunIcon />} />
                                    <Tab label="我的词库" icon={<PersonPinIcon />} />
                                    <Tab label="单词进度" icon={<ScheduleIcon />} />
                                    <Tab label="单词设置" icon={<SettingsIcon />} />
                                </Tabs>
                            </AppBar>
                        </Grid>
                        <Grid item>
                            {value === 0
                                && <ReciteContainer word={words && words[ptr]['word']}
                                totalWords={words && words.length} newWords={words && words.length}
                                symbol={words && words[ptr]['symbol']} showChinese={this.state.showChinese}
                                chinese={words && words[ptr]['chinese']} reciting={reciting}
                                onLearn={() => this.setState({reciting: true})}
                                onKnow={ this.handleKnow }
                                onUnKnow={ this.handleUnKnow }
                                progress={ words && (100 * ptr / words.length) }/>
                            }
                            {value === 1 && <TabContainer>Item Two</TabContainer>}
                            {value === 2 && <VocabContainer/>}
                            {value === 3 && <TabContainer>Item Four</TabContainer>}
                            {value === 4 && <SettingContainer config={this.state.configure}/>}
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

ScrollableTabs.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ScrollableTabs);

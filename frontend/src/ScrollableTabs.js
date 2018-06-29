import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import SettingsIcon from '@material-ui/icons/Settings';
import ScheduleIcon from '@material-ui/icons/Schedule';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import Typography from '@material-ui/core/Typography';
import ReciteContainer from './recite/ReciteContainer'
import SettingContainer from './setting/SettingContainer'
import VocabContainer from './vocabulary/VocabContainer'
import ProgressContainer from './progress/ProgressContainer'
import ExamContainer from './examine/ExamContainer'
import Grid from '@material-ui/core/Grid';
import {withAuthHeader} from './utils/api'

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
        newWords: undefined,
    };

    constructor(props) {
        super(props);
        let self = this;
        this.handleKnow = this.handleKnow.bind(this);
        this.handleUnKnow = this.handleUnKnow.bind(this);
        fetch(localStorage.getItem('prefix') + '/learn_records/', {
            method: 'GET',
            headers: withAuthHeader(),
        }).then(function (response) {
            return response.json();
        }).then(function (response) {
            let words = new Array(response['record'].length);
            for(let j = 0, len = response['record'].length; j < len; j++) {
                words[j] = response['record'][j]['word'];
            }
            self.setState({learnRecords: response['record'], words: words, newWords: response['new_words']});
            console.log(response);
            /*fetch(localStorage.getItem('prefix') + '/learn_records/new_words/', {
                method: 'GET',
                headers: withAuthHeader(),
            }).then(function (response) {
                return response.json();
            }).then(function (response) {
                self.setState({newWords: response['new_words']});
                console.log(response);
            });*/
        });
        fetch(localStorage.getItem('prefix') + '/configuraion/', {
            method: 'GET',
            headers: withAuthHeader(),
        }).then(function (response) {
            return response.json();
        }).then(function (response) {
            self.setState({configure: response});
            console.log(response);
            if(response['currVocab'] === undefined){
                localStorage.removeItem('token');
                localStorage.removeItem('username');
            }
            else{
                fetch(localStorage.getItem('prefix') + '/vocabularies/' + response['currVocab'] + '/', {
                    method: 'GET',
                    headers: withAuthHeader(),
                }).then(function (response) {
                    return response.json();
                }).then(function (response) {
                    self.setState({vocab: response});
                    console.log(response);
                });
            }
        });
    }

    handleChange = (event, value) => {
        this.setState({ value });
        if(value !== 0)
            this.setState({reciting: false, ptr: 0})
    };

    handleKnow(unknown) {
        const { words, ptr, learnRecords  } = this.state;
        if(!unknown){
            fetch(localStorage.getItem('prefix') + '/learn_records/' + learnRecords[ptr]['id'] + '/', {
                method: 'PATCH',
                body: JSON.stringify({
                    'iterations': learnRecords[ptr]['iterations'] + 1,
                }),
                headers: withAuthHeader(),
            }).then(function (response) {
                return response.json();
            }).then(function (response) {
                console.log(response);
            });
        }
        this.setState({ptr: (ptr + 1) % words.length, showChinese: false});
    }

    handleUnKnow() {
        const { ptr } = this.state;
        this.setState({ptr: ptr, showChinese: true});
    }

    render() {
        const { classes } = this.props;
        const { value, words, reciting, ptr, newWords, vocab, configure } = this.state;
        const reciteContainer = (
            <ReciteContainer word={words && words[ptr]['word']}
                             totalWords={words && words.length} newWords={newWords}
                             symbol={words && words[ptr]['symbol']} showChinese={this.state.showChinese}
                             chinese={words && words[ptr]['chinese']} reciting={reciting}
                             word_id={words && words[ptr]['id']}
                             onLearn={() => this.setState({reciting: true})}
                             onKnow={ this.handleKnow }
                             onUnKnow={ this.handleUnKnow }
                             progress={ words && (100 * ptr / words.length) }/>
        );
        const examContainer = (
            <ExamContainer numberWords={configure && configure['exam']}/>
        );
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
                            {value === 0 && reciteContainer }
                            {value === 1 && examContainer }
                            {value === 2 && <VocabContainer/>}
                            {value === 3 && <ProgressContainer totalWords={vocab && vocab['total_words']}
                                            todayWords={words && words.length} newWords={newWords}/>}
                            {value === 4 && <SettingContainer config={this.state.configure}
                                onChangeConfig={(q, c, v, e) => {
                                    this.setState({
                                        configure: {'quantity': q, 'currVocab': v, 'showChinese': c,
                                            'exam': e,
                                            'userConfig': this.state.configure['userConfig']
                                            , 'id': this.state.configure['id']}
                                    })
                                }}/>}
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


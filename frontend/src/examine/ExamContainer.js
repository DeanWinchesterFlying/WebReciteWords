import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import CheckCircle from '@material-ui/icons/CheckCircle';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import classnames from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';
import AddDialog from '../utils/AddDialog'
import blue from '@material-ui/core/colors/blue';
import {withAuthHeader} from "../utils/api";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import lightBlue from '@material-ui/core/colors/lightBlue';
import lightGreen from '@material-ui/core/colors/lightGreen';
import yellow from '@material-ui/core/colors/yellow';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';

const styles = theme => ({
    avatorA: {
        color: '#fff',
        backgroundColor: lightBlue[500],
    },
    avatorB: {
        color: '#fff',
        backgroundColor: lightGreen[500],
    },
    avatorC: {
        color: '#fff',
        backgroundColor: yellow[500],
    },
    avatorD: {
        color: '#fff',
        backgroundColor: orange[500],
    },
    avatorE: {
        color: '#fff',
        backgroundColor: red[600],
    },
    root: theme.mixins.gutters({
        paddingTop: theme.spacing.unit * 8,
        paddingBottom: theme.spacing.unit * 8,
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

    card: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '40%',
        flexDirection: 'column',
        textAlign: 'center',
        marginTop: theme.spacing.unit * 4,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        avatar: {
            backgroundColor: blue[100],
            color: blue[600],
        },
    },
    button: {
        margin: theme.spacing.unit,
        width: '95%'
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },

    root2: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: theme.spacing.unit * 4,
        marginBottom: theme.spacing.unit * 4,
        marginLeft: theme.spacing.unit * 48,
        marginRight: theme.spacing.unit * 48,
    },
    container: {
        padding: theme.spacing.unit * 5,
    },
    errorText: {
        color: '#E53935',
        fontFamily: [
            'Consolas',
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
    },
    button2: {
        background: 'linear-gradient(45deg, #2196F3 30%, #64B5F6 90%)',
        borderRadius: 5,
        border: 0,
        color: 'white',
        height: 50,
        width: 176,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(135, 105, 255, .30)',
    },
    text1: {
        color: '#448AFF',
    },
    text2: {
        color: 'white',
    }
});

class ExamContainer extends React.Component{
    state = { expanded: false,
        openAdd: false, achieved: false, test: false, wrong: 'E' };

    constructor(props){
        super(props);
        this.beginExam = this.beginExam.bind(this);
        this.handleAnswer = this.handleAnswer.bind(this);
        this.timeCount = this.timeCount.bind(this);
        this.stopCount = this.stopCount.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    timeCount() {
        let self = this;
        this.setState({
            timer: setInterval(() => {
                const { time } = self.state;
                self.setState({time: time + 1});
                //console.log(time + " " + self.state.achieved);
                //console.log(self);
            }, 1000)
        });
    }

    prefixInteger(num, length) {
        return ( "0000000000000000" + num ).substr( -length );
    }

    stopCount() {
        const { time, timer } = this.state;
        if(timer){
            clearInterval(timer);
        }
        this.setState({useTime: time});
        console.log(this.state.useTime + ' ' + time);
    }

    shuffle(array){
        let i,x,j;
        for(i = array.length; i > 0; i--){
            j = Math.floor(Math.random() * i);
            x = array[j];
            array[j] = array[i - 1];
            array[i - 1] = x;
        }
    }

    beginExam() {
        let self = this;
        fetch(localStorage.getItem('prefix') + '/learn_records/examination/', {
            method: 'GET',
            headers: withAuthHeader(),
        }).then(function (response) {
            return response.json();
        }).then(function (response) {
            console.log(response);
            let choices = [response[0]['chinese']];
            response[0]['fake_chinese'].forEach((v) => choices.push(v));
            self.shuffle(choices);
            self.setState({test: true, ptr: 0, examWords: response, choices: choices, correct: 0, time: 0});
            self.timeCount();
        });
    }

    handleAnswer(ans){
        const { ptr, examWords, choices } = this.state;
        const { numberWords } = this.props;
        let { correct } = this.state;
        const length = Math.min(this.props.numberWords, examWords.length);
        let c = 'A';
        if(examWords[ptr]['chinese'] === ans){
            correct += 1;
            c = 'E';
        }
        else{
            if(examWords[ptr]['chinese'] === choices[1])
                c = 'B';
            else if(examWords[ptr]['chinese'] === choices[2])
                c = 'C';
            else if(examWords[ptr]['chinese'] === choices[3])
                c = 'D';
        }
        console.log(length);
        console.log(examWords[ptr]['chinese'] + ' ' + ans + ' ' + (examWords[ptr]['chinese'] === ans));
        this.setState({correct: correct, wrong: c});
        if(ptr === length - 1)
            this.stopCount();
        if(c === 'E')
            this.handleNext();
    }

    handleNext() {
        const { ptr, examWords } = this.state;
        const length = Math.min(this.props.numberWords, examWords.length);
        if(ptr === length - 1){
            this.setState({achieved: true, wrong: 'E'});
        }
        else{
            let choices = [examWords[ptr + 1]['chinese']];
            examWords[ptr + 1]['fake_chinese'].forEach((v) => choices.push(v));
            this.shuffle(choices);
            this.setState({ptr: ptr + 1, choices: choices, wrong: 'E'});
        }
    }

    render() {
        const { classes, numberWords } = this.props;
        const { test, achieved, ptr, examWords, choices, correct, useTime, wrong } = this.state;
        let length;
        const css = (
            <div>
                <link rel="stylesheet" href="https://static.baydn.com/baydn/public/bay-components/v0.3.0/bay-components.min.css"/>
                <link rel="stylesheet" href="https://static.baydn.com/baydn/public/iconbay/v0.1.15/iconbay.css"/>
                <link rel="stylesheet" href="https://static.baydn.com/baydn/public/xbay/v1.9.15/client-ui.css"/>
                <link rel="stylesheet" href="https://static.baydn.com/bdc/public/client-vocabprogress-67ba664245cfab47.css"/>
            </div>
        );
        const error = (wrong !== 'E');
        const bull = <span className={classes.bullet}>•</span>;
        const examCard = (
            <div>
                <Card className={classes.card}>
                    <CardHeader
                        title={examWords && examWords[ptr]['word']}
                        subheader={examWords && examWords[ptr]['symbol']}
                    />
                    <CardContent>
                        {
                            choices &&
                            <List component="nav">
                                <ListItem button={!error} onClick={() => this.handleAnswer(choices[0])}>
                                    <ListItemIcon>
                                        <Avatar className={classes.avatorA}>A</Avatar>
                                    </ListItemIcon>
                                    <ListItemText primary={choices[0]} />
                                </ListItem>
                                <ListItem button={!error} onClick={() => this.handleAnswer(choices[1])}>
                                    <ListItemIcon>
                                        <Avatar className={classes.avatorB}>B</Avatar>
                                    </ListItemIcon>
                                    <ListItemText primary={choices[1]} />
                                </ListItem>
                                <ListItem button={!error} onClick={() => this.handleAnswer(choices[2])}>
                                    <ListItemIcon>
                                        <Avatar className={classes.avatorC}>C</Avatar>
                                    </ListItemIcon>
                                    <ListItemText primary={choices[2]} />
                                </ListItem>
                                <ListItem button={!error} onClick={() => this.handleAnswer(choices[3])}>
                                    <ListItemIcon>
                                        <Avatar className={classes.avatorD}>D</Avatar>
                                    </ListItemIcon>
                                    <ListItemText primary={choices[3]} />
                                </ListItem>
                                {
                                    error &&
                                    <ListItem button onClick={this.handleNext}>
                                        <ListItemText>
                                            <Typography variant="display1" className={classes.errorText}>{'The right answer is'}</Typography>
                                        </ListItemText>
                                        <ListItemIcon>
                                            <Avatar className={classes.avatorE}>{wrong}</Avatar>
                                        </ListItemIcon>
                                    </ListItem>
                                }
                            </List>
                        }
                    </CardContent>
                </Card>
            </div>
        );
        const examInfo = (
            <Typography variant="headline" component="h3" className={classes.head}>
                <div>
                    <Paper className={classes.root2}>
                        <Grid container alignItems='center' jusitfy='center' className={classes.container}
                        spacing={24}>
                            <Grid item xs={6}>
                                <div>
                                    <Typography variant="display3" className={classes.text1}>
                                        {numberWords}
                                    </Typography>
                                    <Typography variant="title">
                                        考核词数
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="raised" color="primary" size="large" className={classes.button2}
                                        onClick={this.beginExam}>
                                    <Typography variant="title" className={classes.text2}>
                                        开始考核
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </div>
            </Typography>
        );
        const examInfoHead = (
            <Typography variant="display1" component="h3" className={classes.head}>
                {bull}{bull}{bull}{bull}{bull}{bull}{bull}{bull}{bull}{bull}
                单词考核
                {bull}{bull}{bull}{bull}{bull}{bull}{bull}{bull}{bull}{bull}
            </Typography>
        );
        if(examWords){
            length = Math.min(numberWords, examWords.length);
        }
        else
            length = numberWords;
        if(achieved){
            console.log(`${this.prefixInteger(parseInt(useTime / 60), 2)}:${this.prefixInteger(useTime % 60, 2)}`);
        }
        return (
            <div className="header clearfix">
                {css}
                <AddDialog
                    open={this.state.openAdd}
                    onClose={(vocabId) => {
                        this.setState({ openAdd: false });
                        if(vocabId !== undefined){
                            //console.log('add to' + vocabId);
                            fetch(localStorage.getItem('prefix') + '/vocabularies/' + vocabId + '/word/', {
                                method: 'POST',
                                body: JSON.stringify({
                                    'word_id': parseInt(this.props.word_id, 10)
                                }),
                                headers: withAuthHeader(),
                            }).then(function (response) {
                                return response.json();
                            }).then(function (response) {
                                console.log(response);
                            });
                        }
                    }}
                />
                <Paper elevation={4} style={{paddingTop:'60px', paddingBottom:'60px', minHeight: '420px'}}>
                    { !achieved &&
                        <Grid container direction={'column'} alignment={'center'} justify={'center'}>
                            { !test && <Grid item>{ examInfoHead }</Grid> }
                            { !test && <Grid item>{ examInfo }</Grid> }
                            { test && <Grid item>{ examCard }</Grid> }
                        </Grid>
                    }
                    { achieved &&
                        <div>
                            <div className="statistics-container clearfix center-block" style={{marginTop: '40px'}}>
                                <div className="statistics-item word-total pull-left">
                                    <div className="value" style={{color:'#29B6F6'}}>{length}</div>
                                    <div className="name">考核数</div>
                                </div>
                                <div className="statistics-item word-master pull-left">
                                    <div className="value">{correct}</div>
                                    <div className="name">答对数</div>
                                </div>
                                <div className="statistics-item word-familiar pull-left">
                                    <div className="value" style={{color:'#29B6F6'}}>{`${(correct * 100 / length).toFixed(1)}%`}</div>
                                    <div className="name">正确率</div>
                                </div>
                                <div className="statistics-item word-fresh pull-left">
                                    <div className="value">
                                        {`${this.prefixInteger(parseInt(useTime / 60), 2)}
                                        :${this.prefixInteger(useTime % 60, 2)}`}
                                    </div>
                                    <div className="name">用时</div>
                                </div>
                                <Button variant="raised" color="primary" size="large" className={classes.button2}
                                    onClick={() => this.setState({achieved: false, test: false})}>
                                    <Typography variant="title" className={classes.text2}>
                                        我知道了
                                    </Typography>
                                </Button>
                            </div>
                        </div>
                    }
                </Paper>
            </div>
        );
    }
}

ExamContainer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExamContainer);
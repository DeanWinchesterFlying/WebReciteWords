import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AddIcon from '@material-ui/icons/Add';
import CheckCircle from '@material-ui/icons/CheckCircle';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import FileUpload from '@material-ui/icons/FileUpload';
import LinearProgress from '@material-ui/core/LinearProgress';
import classnames from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';
import AddDialog from '../utils/AddDialog'
import blue from '@material-ui/core/colors/blue';
import {withAuthHeader} from "../utils/api";


const styles = theme => ({
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
        marginLeft: theme.spacing.unit * 20,
        marginRight: theme.spacing.unit * 20,
    },
    container: {
        padding: theme.spacing.unit * 5,
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

class ReciteContainer extends React.Component{
    state = { reciting: false, expanded: false, openAdd: false };

    render() {
        const { classes, reciting } = this.props;
        const bull = <span className={classes.bullet}>•</span>;
        const reciteCard = (
            <div>
                <Card className={classes.card}>
                    <CardHeader
                        title={this.props.word}
                        subheader={this.props.symbol}
                    />
                    <CardContent>
                        {this.props.showChinese &&
                        <Typography paragraph variant="head">
                            {this.props.chinese}
                        </Typography>}
                        <Button variant="outlined" size="large" color="primary" className={classes.button}
                            onClick={() => this.props.onKnow(this.props.showChinese)}>
                            <CheckCircle className={classes.leftIcon} />
                            {this.props.showChinese && '学会了'}
                            {!this.props.showChinese && '认识'}
                        </Button>
                        <br/>
                        {
                            !this.props.showChinese &&
                            <Button variant="outlined" size="large" color="primary" className={classes.button}
                                    onClick={this.props.onUnKnow}>
                                <RemoveCircle className={classes.leftIcon} />
                                不认识
                            </Button>
                        }
                    </CardContent>
                    <CardActions className={classes.actions} disableActionSpacing>
                        <Tooltip title="添加到词库">
                            <IconButton aria-label="Add to favorites"
                                        onClick={() => this.setState({openAdd: true})}>
                                <Avatar><AddIcon /></Avatar>
                            </IconButton>
                        </Tooltip>
                        <IconButton
                            className={classnames(classes.expand, {
                                [classes.expandOpen]: this.state.expanded,
                            })}
                            onClick={() => this.setState({expanded: !this.state.expanded})}
                            aria-expanded={this.state.expanded}
                            aria-label="Show more"
                        >
                            <Tooltip title="查看例句"><ExpandMoreIcon /></Tooltip>
                        </IconButton>
                    </CardActions>
                    <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography paragraph variant="head">
                                He reduced his needs to the minimum by <b>simplifying</b> his life.
                            </Typography>
                        </CardContent>
                    </Collapse>
                    <LinearProgress variant="determinate" value={this.props.progress} />
                    <LinearProgress variant="determinate" value={this.props.progress} />
                </Card>
            </div>
        );
        const reciteInfo = (
            <Typography variant="headline" component="h3" className={classes.head}>
                <div>
                    <Paper className={classes.root2}>
                        <Grid container alignItems='center' jusitfy='center' className={classes.container}>
                            <Grid item xs={3}>
                                <div>
                                    <Typography variant="display3" className={classes.text1}>
                                        {this.props.totalWords}
                                    </Typography>
                                    <Typography variant="title">
                                        今日单词
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="display3" className={classes.text1}>
                                    {this.props.newWords}
                                </Typography>
                                <Typography variant="title">
                                    新词
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="raised" color="primary" size="large" className={classes.button2}
                                        onClick={this.props.onLearn}>
                                    <Typography variant="title" className={classes.text2}>
                                        开始学习
                                    </Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </div>
            </Typography>
        );
        const reciteInfoHead = (
            <Typography variant="display1" component="h3" className={classes.head}>
                {bull}{bull}{bull}{bull}{bull}{bull}{bull}{bull}{bull}{bull}
                单词背诵
                {bull}{bull}{bull}{bull}{bull}{bull}{bull}{bull}{bull}{bull}
            </Typography>
        );

        return (
            <div>
                <AddDialog
                    open={this.state.openAdd}
                    onClose={(vocabId) => {
                        this.setState({ openAdd: false });
                        if(vocabId !== undefined){
                            console.log('add to' + vocabId);
                            fetch(localStorage.getItem('prefix') + '/vocabularies/' + vocabId + '/word/', {
                                method: 'POST',
                                body: JSON.stringify({
                                    'word_id': parseInt(this.props.word_id)
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
                <Paper elevation={4}>
                    <Grid container direction={'column'} alignment={'center'} justify={'center'}
                          className={classes.root} >
                        { !reciting && <Grid item>{ reciteInfoHead }</Grid> }
                        { !reciting && <Grid item>{ reciteInfo }</Grid> }
                        { reciting && <Grid item>{ reciteCard }</Grid> }
                    </Grid>
                </Paper>
            </div>
        );
    }
}

ReciteContainer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReciteContainer);
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import FileUpload from '@material-ui/icons/FileUpload';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
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
        backgroundColor: red[500],
    },
    button: {
        margin: theme.spacing.unit,
        width: '95%'
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
});

class ReciteCard extends React.Component{
    state = { expanded: false };

    handleExpandClick = () => {
        this.setState({ expanded: !this.state.expanded });
    };
    render() {
        const { classes } = this.props;
        console.log(classnames({[classes.expandOpen]: this.state.expanded}));
        return (
            <div>
                <Card className={classes.card}>
                    <CardHeader
                        title="Simplify"
                        subheader="/ˈsɪmplɪfaɪ/"
                    />
                    <CardContent>
                        <Button variant="outlined" size="large" color="primary" className={classes.button}>
                            <FileUpload className={classes.leftIcon} />
                            认识
                        </Button>
                        <br/>
                        <Button variant="outlined" size="large" color="primary" className={classes.button}>
                            <FileUpload className={classes.leftIcon} />
                            不认识
                        </Button>
                    </CardContent>
                    <CardActions className={classes.actions} disableActionSpacing>
                        <IconButton
                            className={classnames(classes.expand, {
                                [classes.expandOpen]: this.state.expanded,
                            })}
                            onClick={this.handleExpandClick}
                            aria-expanded={this.state.expanded}
                            aria-label="Show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </CardActions>
                    <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography paragraph variant="head">
                                He reduced his needs to the minimum by <b>simplifying</b> his life.
                            </Typography>
                        </CardContent>
                    </Collapse>
                    <LinearProgress variant="determinate" value={80} />
                    <LinearProgress variant="determinate" value={80} />
                </Card>
            </div>
        );
    }
}

ReciteCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ReciteCard);
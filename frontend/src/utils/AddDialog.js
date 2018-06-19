import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Lock from '@material-ui/icons/Lock';
import Email from '@material-ui/icons/Email';
import {withAuthHeader} from "./api";

const emails = ['username@gmail.com', 'user02@gmail.com'];
const styles = {
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
};

class AddDialog extends React.Component {
    state = {
      addVocab: false,
    };

    constructor(props) {
        super(props);
        this.handleVocab = this.handleVocab.bind(this);
        this.getMyVocabulary = this.getMyVocabulary.bind(this);
    }

    getMyVocabulary() {
        let self = this;
        fetch(localStorage.getItem('prefix') + '/vocabularies/me/', {
            method: 'GET',
            headers: withAuthHeader(),
        }).then(function (response) {
            return response.json();
        }).then(function (response) {
            self.setState({myVocab: response});
            //console.log(response);
        });
    }

    handleVocab() {
        const {newVocab} = this.state;
        let self = this;
        if(newVocab.length > 0){
            fetch(localStorage.getItem('prefix') + '/vocabularies/', {
                method: 'POST',
                body: JSON.stringify({
                    'title': newVocab
                }),
                headers: withAuthHeader(),
            }).then(function (response) {
                return response.json();
            }).then(function (response) {
                console.log(response);
                self.setState({addVocab: false});
            });
        }
    }

    componentWillReceiveProps = function(nextProps) {
        this.getMyVocabulary();
    };

    render() {
        const { classes, onClose, selectedValue, ...other } = this.props;
        const { myVocab } = this.state;
        const dialog = (
            <Dialog open={this.state.addVocab} style={{paddingTop: 20}}
                    onClose={() => this.setState({addVocab: false})}>
                <DialogTitle id="form-dialog-title">词库</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        添加新的词库
                    </DialogContentText>
                    <Grid container spacing={16} alignItems="flex-end">
                        <Grid item> <LocalLibraryIcon /> </Grid>
                        <Grid item>
                            <TextField required autoFocus margin="dense" id="add_vocab"
                                       label="标题" type="text" fullWidth
                                       onChange={(event) => this.setState({newVocab: event.target.value})}/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.setState({addVocab: false})} color="primary">
                        取消
                    </Button>
                    <Button onClick={this.handleVocab} color="primary">
                        注册
                    </Button>
                </DialogActions>
            </Dialog>);

        return (
            <div>
                {dialog}
                <Dialog onClose={() => this.props.onClose()} aria-labelledby="simple-dialog-title" {...other}>
                    <DialogTitle id="simple-dialog-title">添加到我的词库</DialogTitle>
                    <div>
                        <List>
                            {myVocab && myVocab.map(vocab => (
                                <ListItem button key={vocab['id']} onClick={() => this.props.onClose(vocab['id'])}>
                                    <ListItemAvatar>
                                        <Avatar className={classes.avatar}>
                                            <LocalLibraryIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={vocab['title']} />
                                </ListItem>
                            ))}
                            <ListItem button onClick={() => {
                                this.props.onClose();
                                this.setState({addVocab: true});
                            }}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <AddIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="创建新的词库" />
                            </ListItem>
                        </List>
                    </div>
                </Dialog>
            </div>
        );
    }
}

AddDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    //selectedValue: PropTypes.string,
};

export default withStyles(styles)(AddDialog);
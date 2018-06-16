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
import ReciteContainer from './ReciteContainer'
import SettingContainer from './SettingContainer'
import VocabContainer from './VocabContainer'
import Grid from '@material-ui/core/Grid';

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
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { classes } = this.props;
        const { value } = this.state;

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
                            {value === 0 && <ReciteContainer/>}
                            {value === 1 && <TabContainer>Item Two</TabContainer>}
                            {value === 2 && <VocabContainer/>}
                            {value === 3 && <TabContainer>Item Four</TabContainer>}
                            {value === 4 && <SettingContainer/>}
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

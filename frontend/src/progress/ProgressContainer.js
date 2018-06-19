import React, { Component, PureComponent }from 'react';
import echarts from 'echarts';
import ReactEcharts from 'echarts-for-react';
import {withAuthHeader} from "../utils/api";
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: theme.spacing.unit * 8,
        paddingBottom: theme.spacing.unit * 8,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
    }),
});

class ProgressContainer extends Component{
    state = {
        data1: undefined,
    };

    constructor(props){
        super(props);
    }

    componentDidMount = () => {
        let self = this;
        fetch(localStorage.getItem('prefix') + '/learn_records/analysis1/', {
            method: 'GET',
            headers: withAuthHeader(),
        }).then(function (response) {
            return response.json();
        }).then(function (response) {
            self.setState({data1: {
                    title: {
                        text: '每日单词统计'
                    },
                    tooltip: {},
                    legend: {
                        data:['单词统计']
                    },
                    xAxis: {
                        data: response.map(data => (
                            data['date']
                        ))
                    },
                    yAxis: {},
                    series: [{
                        name: '学习新词',
                        type: 'bar',
                        data: response.map(data => (
                            data['number']
                        ))
                    }]
                }});
            console.log(response);
        });
        fetch(localStorage.getItem('prefix') + '/learn_records/analysis2/', {
            method: 'GET',
            headers: withAuthHeader(),
        }).then(function (response) {
            return response.json();
        }).then(function (response) {
            self.setState({data2: {

                    tooltip: {},
                    legend: {
                        data:['单词统计']
                    },
                    xAxis: {
                        data: response.map(data => (
                            data['date']
                        ))
                    },
                    yAxis: {},
                    series: [{
                        name: '总词汇量',
                        type: 'line',
                        data: response.map(data => (
                            data['number']
                        ))
                    }]
                }});
            console.log(response);
        });
    };

    render() {
        const charts = (
            <div className='parent'>
                {
                    data2 && <ReactEcharts
                        option={data2}
                        style={{height: '400px', width: '30%'}}
                        opts={{ renderer: 'svg' }}
                        className='react_for_echarts' />
                }
                {
                    data1 && <ReactEcharts
                        option={data1}
                        style={{height: '400px', width: '30%'}}
                        opts={{ renderer: 'svg' }}
                        className='react_for_echarts' />
                }
            </div>
        );
        const { data1, data2 } = this.state;
        const { classes } = this.props;
        console.log(data1);
        return (
            <div>
                <link rel="stylesheet" href="https://static.baydn.com/baydn/public/bay-components/v0.3.0/bay-components.min.css"/>
                <link rel="stylesheet" href="https://static.baydn.com/baydn/public/iconbay/v0.1.15/iconbay.css"/>
                <link rel="stylesheet" href="https://static.baydn.com/baydn/public/xbay/v1.9.15/client-ui.css"/>
                <link rel="stylesheet" href="https://static.baydn.com/bdc/public/client-vocabprogress-67ba664245cfab47.css"/>
                <div className="chart-section clearfix center-block">
                    <div className="chart-item chart-progress pull-left">
                        <div className="chart-header clearfix">
                            <div className="chart-title pull-left">进步曲线</div>
                            <div className="chart-legend pull-right">
                                <div className="pull-left">单词总数</div>
                                <div className="legend-icon pull-right">
                                </div>
                            </div>
                        </div>
                        <div className="chart-body" id="chartProgress">
                            {
                                data2 && <ReactEcharts
                                    showLoading={true}
                                    option={data2}
                                    opts={{ renderer: 'svg' }}
                                    className='react_for_echarts' />
                            }
                        </div>
                    </div>
                    <div className="chart-item chart-dailyWord pull-left">
                        <div className="chart-header clearfix">
                            <div className="chart-title pull-left">每日单词统计</div>
                            <div className="chart-legend pull-right">
                                <div className="pull-left">已学</div>
                                <div className="legend-icon legend-master pull-right"></div>
                            </div>
                            <div className="chart-legend pull-right">
                                <div className="pull-left">新词</div>
                                <div className="legend-icon legend-fresh pull-right">

                                </div>
                            </div>
                        </div>
                        <div className="chart-body" id="chartDailyWord">
                            {
                                data1 && <ReactEcharts
                                    option={data1}
                                    style={{height: '400px', width: '30%'}}
                                    opts={{ renderer: 'svg' }}
                                    className='react_for_echarts' />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ProgressContainer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProgressContainer);
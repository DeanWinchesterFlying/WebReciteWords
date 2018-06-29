import React, { Component }from 'react';
import ReactEcharts from 'echarts-for-react';
import {withAuthHeader} from "../utils/api";
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

    componentDidMount = () => {
        let self = this;
        fetch(localStorage.getItem('prefix') + '/learn_records/analysis1/', {
            method: 'GET',
            headers: withAuthHeader(),
        }).then(function (response) {
            return response.json();
        }).then(function (response) {
            self.setState({data1: {
                    grid: {
                        y: 15,
                    },
                    tooltip: {},
                    legend: {
                        data:['单词统计']
                    },
                    xAxis: { //#bfe497
                        data: response.map(data => (
                            data['date']
                        )),
                        axisLine: {
                            lineStyle: {
                                color: '#E0E0E0',
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#9E9E9E',
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#E0E0E0',
                                type: 'dashed',
                            }
                        }
                    },
                    yAxis: {
                        type : 'value',
                        axisLine: {
                            lineStyle: {
                                color: '#E0E0E0',
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#9E9E9E',
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                show: true,
                                color: '#E0E0E0',
                                type: 'dashed',
                            }
                        }
                    },
                    series: [{
                        name: '学习新词',
                        type: 'bar',
                        data: response.map(data => (
                            data['number']
                        )),
                        itemStyle: {
                            normal: {
                                barBorderColor: '#fce9b3',
                                color: '#fce9b3'
                            },
                            emphasis: {
                                barBorderColor: '#fce9b3',
                                color: '#fce9b3'
                            }
                        },
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
                    grid: {
                        y: 15,
                    },
                    tooltip: {},
                    legend: {
                        data:['单词统计']
                    },
                    xAxis: { //#bfe497
                        data: response.map(data => (
                            data['date']
                        )),
                        axisLine: {
                            lineStyle: {
                                color: '#E0E0E0',
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#9E9E9E',
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#E0E0E0',
                                type: 'dashed',
                            }
                        }
                    },
                    yAxis: {
                        type : 'value',
                        axisLine: {
                            lineStyle: {
                                color: '#E0E0E0',
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#9E9E9E',
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#E0E0E0',
                                type: 'dashed',
                            }
                        }
                    },
                    series: [{
                        name: '总词汇量',
                        type: 'line',
                        data: response.map(data => (
                            data['number']
                        )),
                        itemStyle: {
                            normal: {
                                color: '#bfe497',
                            },
                            emphasis: {
                                color: '#bfe497'
                            }
                        },
                    }]
                }, totalLearned: response[response.length - 1]['number']});
            console.log(response);
        });
    };

    render() {
        const { data1, data2, totalLearned } = this.state;
        const css = (
            <div>
                <link rel="stylesheet" href="https://static.baydn.com/baydn/public/bay-components/v0.3.0/bay-components.min.css"/>
                <link rel="stylesheet" href="https://static.baydn.com/baydn/public/iconbay/v0.1.15/iconbay.css"/>
                <link rel="stylesheet" href="https://static.baydn.com/baydn/public/xbay/v1.9.15/client-ui.css"/>
                <link rel="stylesheet" href="https://static.baydn.com/bdc/public/client-vocabprogress-67ba664245cfab47.css"/>
            </div>
        );
        console.log(data1);
        return (
            <div className="header clearfix">
                {css}
                <div className="statistics-container clearfix center-block" style={{marginTop:'0px'}}>
                    <div className="statistics-item word-total pull-left">
                        <div className="value" style={{color:'#29B6F6'}}>{this.props.totalWords}</div>
                        <div className="name">单词总数</div>
                    </div>
                    <div className="statistics-item word-master pull-left">
                        <div className="value">{totalLearned}</div>
                        <div className="name">已掌握</div>
                    </div>
                    <div className="statistics-item word-familiar pull-left">
                        <div className="value">{this.props.todayWords}</div>
                        <div className="name">今日待学</div>
                    </div>
                    <div className="statistics-item word-fresh pull-left">
                        <div className="value">{this.props.newWords}</div>
                        <div className="name">今日新词</div>
                    </div>
                </div>

                <div className="chart-section clearfix center-block" style={{marginTop:'160px'}}>
                    <div className="chart-item chart-progress pull-left" style={{marginTop:'2px'}}>
                        <div className="chart-header clearfix" style={{margin:"22px 44px 0 33px"}}>
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
                                    option={data2}
                                    style={{height: '240px', width:'480px'}}
                                    className='react_for_echarts' />
                            }
                        </div>
                    </div>
                    <div className="chart-item chart-dailyWord pull-left" style={{marginTop:'2px'}}>
                        <div className="chart-header clearfix">
                            <div className="chart-title pull-left">每日单词统计</div>
                            <div className="chart-legend pull-right">
                                <div className="pull-left">已学</div>
                                <div className="legend-icon legend-master pull-right"></div>
                            </div>

                        </div>
                        <div className="chart-body" id="chartDailyWord">
                            {
                                data1 && <ReactEcharts
                                    option={data1}
                                    style={{height: '240px', width:'480px'}}
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

let mapChart = echarts.init(document.getElementById('map_task1'));
let lineChart = echarts.init(document.getElementById('lineChart_task1'));
let barChart = echarts.init(document.getElementById('barChart_task1'));
let pieChart = echarts.init(document.getElementById('pieChart_task1'));
let overallDailyPieChart = echarts.init(document.getElementById('overallPieChart_task1'));
let liquidChart = echarts.init(document.getElementById('liquidChart_task1'));

// 基本方法
function mapDataInit() {
    confirmedMap.splice(0, confirmedMap.length);
    curedMap.splice(0, curedMap.length);
    deadMap.splice(0, deadMap.length);
    currentConfirmedMap.splice(0, currentConfirmedMap.length);
}

function overallDataInit() {
    confirmedOverall.splice(0, confirmedOverall.length);
    curedOverall.splice(0, curedOverall.length);
    deadOverall.splice(0, deadOverall.length);
    currentConfirmedOverall.splice(0, currentConfirmedOverall.length);
}

function rankDataInit() {
    provinceNames.splice(0, provinceNames.length);
    curedRank.splice(0, curedRank.length);
    confirmedRank.splice(0, confirmedRank.length);
    deadRank.splice(0, deadRank.length);
    currentConfirmedRank.splice(0, currentConfirmedRank.length);
    pieData.splice(0, pieData.length);
}

function pieInit() {
    allNames.splice(0, allNames.length);
    confirmedPie.splice(0, confirmedPie.length);
    curedPie.splice(0, curedPie.length);
    deadPie.splice(0, deadPie.length);
    currentConfirmedPie.splice(0, currentConfirmedPie.length);
}

function overallDailyInit() {
    overallDaily.splice(0, overallDaily.length);
}

function liquidInit() {
    confirmedRatio_Hubei.splice(0, confirmedRatio_Hubei.length);
}

// 字段定义
let step = 3;
const baseUrl = '/api/map';
let timeSeries = getTimeSeriesArray(step);      // timeSeries对象，包含两个属性:timeSeries（日期格式：yyyy/m/d）和timeViewSeries（日期格式：m/d）
let key = '累计确诊';

// map
let confirmedMap = [];
let curedMap = [];
let deadMap = [];
let currentConfirmedMap = [];
// linechart
let confirmedOverall = [];
let curedOverall = [];
let deadOverall = [];
let currentConfirmedOverall = [];
// barchart
let provinceNames = [];
let confirmedRank = [];
let curedRank = [];
let deadRank = [];
let currentConfirmedRank = [];
let pieData = [];
// piechart
let allNames = [];
let confirmedPie = [];
let curedPie = [];
let deadPie = [];
let currentConfirmedPie = [];
// overall daily data
let overallDaily = [];
// liquid
let confirmedRatio_Hubei = [];


// 业务逻辑

// 获取特定日期的各省数据并渲染
let getCertainDay = function (key = '累计确诊', dateIndex) {
    getMapAndPieData(key, dateIndex);       // 地图
    getTop10Data(key, dateIndex);    // 柱状图
    getOverallDataDaily(dateIndex);     // 全国疫情饼图
};

// 获取特定日期的地图数据
let getMapAndPieData = function (key, dateIndex) {
    // 地图
    let url = baseUrl + '/province/certainDay';
    url = url + '?date=' + timeSeries.timeSeries[dateIndex];

    // 调用后端web api
    axios.get(url)
        .then(function (response) {
            // 数据初始化
            mapDataInit();
            pieInit();
            liquidInit();

            // 将后端返回数据进行填充
            response.data.forEach(province => {
                let currentValue = 0;

                if (province.currentConfirmedCount === 0) {
                    currentValue = province.confirmedCount - province.deadCount - province.curedCount;
                } else {
                    currentValue = province.currentConfirmedCount;
                }

                // 填充map数据
                confirmedMap.push(new ProvinceDataUnit(province.provinceShortName, province.confirmedCount));
                deadMap.push(new ProvinceDataUnit(province.provinceShortName, province.deadCount));
                curedMap.push(new ProvinceDataUnit(province.provinceShortName, province.curedCount));
                currentConfirmedMap.push(new ProvinceDataUnit(province.provinceShortName, currentValue));
                // 填充pie数据
                if (province.provinceShortName !== '湖北') {
                    allNames.push(province.provinceShortName);
                    confirmedPie.push(province.confirmedCount);
                    deadPie.push(province.deadCount);
                    curedPie.push(province.curedCount);
                    currentConfirmedPie.push(currentValue);
                } else {
                    confirmedRatio_Hubei.push(province.confirmedCount / 59270000);
                }
            });

            mapOption.baseOption.timeline.currentIndex = dateIndex;
            mapChart.setOption(mapOption);
            pieChart.setOption(pieChartOption);
            liquidChart.setOption(liquidOption);
        });
};

// 获取全国的时间序列数据，用于渲染线状图
let getDataOverall = function (step = 3) {
    //lineChart.showLoading();

    let url = baseUrl + '/country/timeSeries';

    // 调用后端web api
    axios.get(url)
        .then(function (response) {
            overallDataInit();

            // 将后端返回数据进行填充
            let i = 0;
            response.data.forEach(s => {
                if (i % step === 0) {
                    confirmedOverall.push(s.confirmedCount);
                    curedOverall.push(s.curedCount);
                    deadOverall.push(s.deadCount);
                    if (s.currentConfirmedCount === 0) {
                        let count = s.confirmedCount - s.curedCount - s.deadCount;
                        currentConfirmedOverall.push(count);
                    } else {
                        currentConfirmedOverall.push(s.currentConfirmedCount);
                    }
                }
                i++;
            });

            lineChart.setOption(lineChartOption);
        })
};

// 获取特定日期前10省份数据，用于渲染bar chart
let getTop10Data = function (key, dateIndex) {
    //barChart.showLoading();

    let url = baseUrl + '/province/top10';
    url = url + '?key=' + key + '&&date=' + timeSeries.timeSeries[dateIndex];

    // 调用后端web api
    axios.get(url)
        .then(function (response) {
            rankDataInit();

            response.data.forEach(s => {
                provinceNames.push(s.provinceShortName);
                confirmedRank.push(s.confirmedCount);
                curedRank.push(s.curedCount);
                deadRank.push(s.deadCount);
                if (s.currentConfirmedCount === 0) {
                    let count = s.confirmedCount - s.curedCount - s.deadCount;
                    currentConfirmedRank.push(count);
                } else {
                    currentConfirmedRank.push(s.currentConfirmedCount);
                }

                let top_value = 0;

                switch (key) {
                    case ('累计确诊'):
                        top_value = s.confirmedCount;
                        break;
                    case('累计死亡'):
                        top_value = s.deadCount;
                        break;
                    case('累计治愈'):
                        top_value = s.curedCount;
                        break;
                    case('当前确诊'):
                        if (s.currentConfirmedCount === 0) {
                            top_value = s.confirmedCount - s.deadCount - s.curedCount;
                        } else {
                            top_value = s.currentConfirmedCount;
                        }
                        break;
                }

                pieData.push({name: s.provinceShortName, value: top_value});
            });

            barChart.setOption(barChartOption);
        })
};

// 获取特定日期的全国病例数据，用于渲染overall pie
let getOverallDataDaily = function (dateIndex) {
    let url = baseUrl + '/country/certainDay'
    url = url + '?date=' + timeSeries.timeSeries[dateIndex];

    // 调用后端web api
    axios.get(url)
        .then(function (response) {
            overallDailyInit();

            let confirmedOverallDaily = response.data.confirmedCount;
            let deadOverallDaily = response.data.deadCount;
            let curedOverallDaily = response.data.curedCount;
            let currentConfirmedOverallDaily = 0;
            if (response.data.currentConfirmedCount === 0) {
                currentConfirmedOverallDaily = confirmedOverallDaily - deadOverallDaily - curedOverallDaily;
            } else {
                currentConfirmedOverallDaily = response.data.currentConfirmedCount;
            }

            overallDaily.push({name: '当前确诊', value: currentConfirmedOverallDaily});
            overallDaily.push({name: '累计死亡', value: deadOverallDaily});
            overallDaily.push({name: '累计治愈', value: curedOverallDaily});

            overallDailyPieChart.setOption(overallDailyPieOption);
        })
};

// echarts options
let mapOption = {
    baseOption: {
        timeline: {
            axisType: 'category',
            data: timeSeries.timeSeriesView,
            playInterval: 500,
            loop: false,
            checkpointStyle: {
                symbol: 'diamond',
            }
        },
        title: {
            text: 'China COVID-19 Visualization, 25 January - 31 March, 2020',
            // subtext: "Provided by Zhong Y., Guo H.P., Yan H.T., He R.D. and Sheng G.M. (Outside help)",
            // sublink: 'https://github.com/ashyseer/COVID-19-Service-Website',
            left: 'right'
        },
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function (params) {
                var value = (params.value + '').split('.');
                value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
                return params.name + ': ' + value + '例';
            }
        },
        visualMap: {
            type: 'piecewise',
            splitNumber: 6,
            left: 'right',
            min: 0,
            max: 100000,
            pieces: [
                {gte: 10000, color: '#a50026'},       /*1-9*/
                {gte: 1000, lte: 9999, color: '#d73027'},     /*10-99*/
                {gte: 100, lte: 999, color: '#f46d43'},
                {gte: 10, lte: 99, color: '#fdae61'},
                {gte: 1, lte: 9, color: '#fee090'},
                {value: 0, color: '#ffffbf'}
            ],
            inRange: {
                color: ['#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            },
            calculable: true
        },
        label: {
            emphasis: {
                show: true, //对应的鼠标悬浮效果
                // textStyle:{color:"#800080"}
            }
        },
        series: [
            {
                name: '累计确诊',
                type: 'map',
                roam: true,
                mapType: 'china',
                aspectScale: 0.8,
                showLegendSymbol: false,
                itemStyle: {
                    normal: {
                        borderWidth: .5, //区域边框宽度
                        borderColor: '#827a82', //区域边框颜色
                        areaColor: '#fff', //区域颜色
                    },
                    emphasis: {
                        borderWidth: .5,
                        borderColor: '#827a82',
                        areaColor: "#fffe13",
                    }
                },
                data: confirmedMap
            },
            {
                name: '累计死亡',
                type: 'map',
                roam: true,
                mapType: 'china',
                showLegendSymbol: false,
                itemStyle: {
                    normal: {
                        borderWidth: .5, //区域边框宽度
                        borderColor: '#827a82', //区域边框颜色
                        areaColor: '#fff', //区域颜色
                    },
                    emphasis: {
                        borderWidth: .5,
                        borderColor: '#827a82',
                        areaColor: "#fffe13",
                    }
                },
                data: deadMap
            },
            {
                name: '累计治愈',
                type: 'map',
                roam: true,
                mapType: 'china',
                showLegendSymbol: false,
                itemStyle: {
                    normal: {
                        borderWidth: .5, //区域边框宽度
                        borderColor: '#827a82', //区域边框颜色
                        areaColor: '#fff', //区域颜色
                    },
                    emphasis: {
                        borderWidth: .5,
                        borderColor: '#827a82',
                        areaColor: "#fffe13",
                    }
                },
                data: curedMap
            },
            {
                name: '现存确诊',
                type: 'map',
                roam: true,
                mapType: 'china',
                showLegendSymbol: false,
                itemStyle: {
                    normal: {
                        borderWidth: .5, //区域边框宽度
                        borderColor: '#827a82', //区域边框颜色
                        areaColor: '#fff', //区域颜色
                    },
                    emphasis: {
                        borderWidth: .5,
                        borderColor: '#827a82',
                        areaColor: "#fffe13",
                    }
                },
                data: currentConfirmedMap
            },
        ],
        toolbox: {
            show: true,
            //orient: 'vertical',
            left: 'left',
            top: 'bottom',
            feature: {
                dataView: {readOnly: true},
                restore: {},
                saveAsImage: {}
            }
        },
        legend: {
            data: ['累计确诊', '累计死亡', '累计治愈', '现存确诊'],
            left: '0%',
            orient: 'vertical',
            selectedMode: 'single',
            emphasis: {
                selectorLabel: {
                    show: false,
                }
            }
        },
        color: ['#00CED1']
    }
};

let lineChartOption = {
    title: {
        text: '全国疫情趋势'
    },
    legend: {
        data: ['累计确诊', '累计死亡', '累计治愈', '现存确诊'],
    },
    tooltip: {
        trigger: 'axis',
        showContent: true,
    },
    xAxis: {
        type: 'category',
        data: timeSeries.timeSeriesView,
        splitLine: {
            show: false
        },
    },
    yAxis: {gridIndex: 0},
    series: [
        {name: '累计确诊', type: 'line', smooth: true, seriesLayoutBy: 'row', data: confirmedOverall},
        {name: '累计死亡', type: 'line', smooth: true, seriesLayoutBy: 'row', data: deadOverall},
        {name: '累计治愈', type: 'line', smooth: true, seriesLayoutBy: 'row', data: curedOverall},
        {name: '现存确诊', type: 'line', smooth: true, seriesLayoutBy: 'row', data: currentConfirmedOverall}
    ]
};

let barChartOption = {
    title: {
        text: '疫情排名Top10'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    xAxis: {
        type: 'value'
    },
    yAxis: {
        type: 'category',
        data: provinceNames,
        inverse: true,
    },
    series: [
        {
            type: 'bar',
            data: confirmedRank,
            name: '累计确诊',
            stack: 'a'
        },
        {
            type: 'bar',
            data: deadRank,
            name: '累计死亡',
            stack: 'a'
        },
        {
            type: 'bar',
            data: curedRank,
            name: '累计治愈',
            stack: 'a'
        },
        {
            type: 'pie',
            name: '各省市占比',
            center: ['60%', '65%'],
            radius: '30%',
            selectedMode: 'single',
            data: pieData,
            hoverAnimation: false,
            label: {
                alignTo: 'edge',
                formatter: '{b}: {d}%',
                bleedMargin: 5,
                margin: 12
            },
            minAngle: 8,
        }
    ],
    legend: {
        data: ['累计确诊', '累计死亡', '累计治愈'],
        top: '3%'
    }
};

let pieChartOption = {
    title: {
        text: '除湖北外各省疫情'
    },
    angleAxis: {
        show: true,
        type: 'category',
        data: allNames,
        splitLine: {
            show: true,
            lineStyle: {
                color: '#999',
                type: 'dashed'
            }
        },
        axisLine: {
            show: false
        },
        axisLabel: {
            interval: 0
        }
    },
    radiusAxis: {},
    polar: {
        radius: '70%'
    },
    tooltip: {
        show: true,
        formatter: function (params) {
            let id = params.dataIndex;
            return allNames[id] + '<br>累计确诊：' + confirmedPie[id] + '<br>累计治愈：' + curedPie[id] + '<br>累计死亡：' + deadPie[id] + '<br>当前确诊：' + currentConfirmedPie[id];
        }
    },
    series: [{
        type: 'bar',
        data: confirmedPie,
        coordinateSystem: 'polar',
        name: '累计确诊',
        stack: 'a'
    }, {
        type: 'bar',
        data: curedPie,
        coordinateSystem: 'polar',
        name: '累计治愈',
        stack: 'a'
    }, {
        type: 'bar',
        data: deadPie,
        coordinateSystem: 'polar',
        name: '累计死亡',
        stack: 'a',
    }],
    legend: {
        show: true,
        data: ['累计确诊', '累计治愈', '累计死亡'],
        bottom: '3%',
    },
    color: ['#c23531', '#61a0a8', '#2f4554']
};

let overallDailyPieOption = {
    title: {
        text: '全国疫情比例'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    series: [
        {
            name: '全国当日疫情',
            type: 'pie',
            radius: '55%',
            data: overallDaily,
            label: {
                show: true
            }
        }
    ]
};

let liquidOption = {
    title: {
        text: '湖北感染占比',
    },
    series: [{
        type: 'liquidFill',
        name: '武汉累计确诊比例',
        radius: '55%', // 水球图的半径
        center: ['50%', '50%'], // 水球图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标
        shape: 'circle',
        outline: {
            show: false,
            // borderDistance: 0, // 边框线与图表的距离 数字
            // itemStyle: {
            //     opacity: 1, // 边框的透明度   默认为 1
            //     borderWidth: 0, // 边框的宽度
            //     shadowBlur: 1, // 边框的阴影范围 一旦设置了内外都有阴影
            //     shadowColor: '#fff', // 边框的阴影颜色,
            //     borderColor: '#41dcd8' // 边框颜色
            // }
        },
        // 图形样式
        itemStyle: {
            color: '#008080', // 水球显示的背景颜色
            opacity: 0.5, // 波浪的透明度
            shadowBlur: 10 // 波浪的阴影范围
        },
        backgroundStyle: {
            color: '#00CED1', // 水球未到的背景颜色
            opacity: 0.5
        },
        // 图形的高亮样式
        emphasis: {
            itemStyle: {
                opacity: 0.8 // 鼠标经过波浪颜色的透明度
            }
        },
        // 图形上的文本标签
        label: {
            fontSize: 22,
            fontWeight: 400,
            color: '#fff',
            formatter: function (params) {
                return (params.value * 10000).toFixed(1) + '‱';
            }
        },
        data: confirmedRatio_Hubei,
    }]
};

// 事件
mapChart.on('timelinechanged', function (timelineIndex) {
    let arrIndex = parseInt(timelineIndex.currentIndex);
    getCertainDay(key, arrIndex);
});

lineChart.on('updateAxisPointer', function (event) {
    let xAxisInfo = event.axesInfo[0];
    if (xAxisInfo) {
        let dimension = xAxisInfo.value;
        getCertainDay(key, dimension);
    }
});

function covid_visualization_init() {
    getDataOverall(step);
    getCertainDay(key, 0);
}
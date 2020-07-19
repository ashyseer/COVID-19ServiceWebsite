let official_rank = echarts.init(document.getElementById('official_rank'));
let weibo_rank = echarts.init(document.getElementById('weibo_rank'));
let official_senIndex = echarts.init(document.getElementById('official_senIndex'));
let weibo_senIndex = echarts.init(document.getElementById('weibo_senIndex'));
let official_senWave = echarts.init(document.getElementById('official_senWave'));
let weibo_senWave = echarts.init(document.getElementById('weibo_senWave'));
let official_wordCloud = echarts.init(document.getElementById('official_wordCloud'));
let weibo_wordCloud = echarts.init(document.getElementById('weibo_wordCloud'));

// 数据
let localPath = '../public';
// 疫情防控平台官方数据
let official_rank_legend_data = [];
let official_rank_series_data = [];
let official_senIndex_series_data = [];
let official_senIndex_legend_data = [];
let official_senWave_series_positive_data = [];
let official_senWave_series_negative_data = [];
let official_senWave_legend_data = [];
let official_wordCloud_series_data = [];
// 微博数据
let weibo_rank_legend_data = [];
let weibo_rank_series_data = [];
let weibo_senIndex_series_data = [];
let weibo_senIndex_legend_data = [];
let weibo_senWave_series_positive_data = [];
let weibo_senWave_series_negative_data = [];
let weibo_senWave_legend_data = [];
let weibo_wordCloud_series_data = [];


let getOfficialData = function () {
    // 获取TD-IDF排行数据
    let url = localPath + '/official_rank_data.json';
    axios.get(url)
        .then(function (response) {
            let official_data = response.data;

            for (let i = 0; i < official_data.series_data.length; i++) {
                official_rank_legend_data.push(official_data.legend_data[i]);
                official_rank_series_data.push(official_data.series_data[i]);
            }

            official_rank.setOption(option_official_rank);
        });

    // 获取情感指数数据
    url = localPath + '/official_senIndex_data.json';
    axios.get(url)
        .then(function (response) {
            let data = response.data;

            for (let i = 0; i < data.series_data.length; i++) {
                official_senIndex_legend_data.push(data.legend_data[i]);
                official_senIndex_series_data.push(data.series_data[i]);
            }

            official_senIndex.setOption(option_official_senIndex);
        });

    // 获取情感波动数据
    url = localPath + '/official_senWave_data.json';
    axios.get(url)
        .then(function (response) {
            let data = response.data;

            for (let i = 0; i < data.series_data.length; i++) {
                official_senWave_legend_data.push(data.legend_data[i]);
                if (data.series_data[i] >= 0) {
                    official_senWave_series_positive_data.push(data.series_data[i]);
                    official_senWave_series_negative_data.push(0);
                } else {
                    official_senWave_series_positive_data.push(0);
                    official_senWave_series_negative_data.push(data.series_data[i]);
                }

            }

            official_senWave.setOption(option_official_senWave);
        });

    url = localPath + '/official_wordCloud_data.json';
    axios.get(url)
        .then(function (response) {
            let data = response.data;

            for (let i = 0; i < data.series_data.length; i++) {
                official_wordCloud_series_data.push(data.series_data[i]);
            }

            official_wordCloud.setOption(option_official_wordCloud);
        })
};

let getWeiboData = function () {
    // 获取TD-IDF排行数据
    let url = localPath + '/weibo_rank_data.json';
    axios.get(url)
        .then(function (response) {
            let weibo_data = response.data;

            for (let i = 0; i < weibo_data.series_data.length; i++) {
                weibo_rank_legend_data.push(weibo_data.legend_data[i]);
                weibo_rank_series_data.push(weibo_data.series_data[i]);
            }

            weibo_rank.setOption(option_weibo_rank);
        });

    // 获取情感指数数据
    url = localPath + '/weibo_senIndex_data.json';
    axios.get(url)
        .then(function (response) {
            let data = response.data;

            for (let i = 0; i < data.series_data.length; i++) {
                weibo_senIndex_legend_data.push(data.legend_data[i]);
                weibo_senIndex_series_data.push(data.series_data[i]);
            }

            weibo_senIndex.setOption(option_weibo_senIndex);
        });

    // 获取情感波动数据
    url = localPath + '/weibo_senWave_data.json';
    axios.get(url)
        .then(function (response) {
            let data = response.data;

            for (let i = 0; i < data.series_data.length; i++) {
                weibo_senWave_legend_data.push(data.legend_data[i]);
                if (data.series_data[i] >= 0) {
                    weibo_senWave_series_positive_data.push(data.series_data[i]);
                    weibo_senWave_series_negative_data.push(0);
                } else {
                    weibo_senWave_series_positive_data.push(0);
                    weibo_senWave_series_negative_data.push(data.series_data[i]);
                }
            }

            weibo_senWave.setOption(option_weibo_senWave);
        });

    url = localPath + '/weibo_wordCloud_data.json';
    axios.get(url)
        .then(function (response) {
            let data = response.data;

            for (let i = 0; i < data.series_data.length; i++) {
                weibo_wordCloud_series_data.push(data.series_data[i]);
            }

            weibo_wordCloud.setOption(option_weibo_wordCloud);
        })
};

let option_official_rank = {
    title: [
        {
            text: "疫情防控平台 TF-IDF Ranking",
            subtext: 'January 26 - February 20',
        }
    ],
    grid: {
        left: '12%'
    },
    tooltip: {
        trigger: 'item',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    xAxis: {
        name: 'TF-IDF',
        type: 'value',
        min: 0,
        max: 0.35,
    },
    yAxis: {
        type: 'category',
        data: official_rank_legend_data,
        inverse: true,
        axisTick: {
            alignWithLabel: true
        },
    },
    series: [
        {
            type: 'bar',
            data: official_rank_series_data,
            name: 'TF-IDF',
        },
    ],
    legend: {
        show: false,
        data: ['TF-IDF'],
        top: '3%'
    },
    dataZoom: [
        {
            type: 'slider',
            yAxisIndex: 0,
            left: '1%'
        },
    ],
    color: '#48D1CC'
};

let option_weibo_rank = {
    title: [
        {
            text: "新浪微博 TF-IDF Ranking",
            subtext: 'January 1 - February 20',
            left: 'right'
        }
    ],
    grid: {
        right: '12%'
    },
    tooltip: {
        trigger: 'item',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    xAxis: {
        name: 'TF-IDF',
        type: 'value',
        inverse: true,
        min: 0,
        max: 0.35
    },
    yAxis: {
        type: 'category',
        data: weibo_rank_legend_data,
        inverse: true,
        axisTick: {
            alignWithLabel: true
        },
        position: 'right',
    },
    series: [
        {
            type: 'bar',
            data: weibo_rank_series_data,
            name: 'TF-IDF',
        },
    ],
    legend: {
        show: false,
    },
    dataZoom: [
        {
            type: 'slider',
            yAxisIndex: 0,
            right: '1%',
        },
    ],
    color: '#F4A460'
};

let option_official_senIndex = {
    title: {
        text: '疫情防控平台关键词情感指数分布',
        subtext: 'January 26 - February 20'
    },
    tooltip: {
        trigger: 'item',
    },
    xAxis: {
        data: official_senIndex_legend_data,
        name: '情感指数',
        axisTick: {
            alignWithLabel: true
        },
    },
    yAxis: {
        name: '关键词个数',
        nameLocation: 'middle',
        nameGap: 40
    },
    series: [{
        type: 'bar',
        data: official_senIndex_series_data,
    }],
    color: '#48D1CC'
};

let option_weibo_senIndex = {
    title: {
        text: '微博关键词情感指数分布',
        subtext: 'January 1 - February 20',
        left: 'right'
    },
    tooltip: {
        trigger: 'item',
    },
    xAxis: {
        data: weibo_senIndex_legend_data,
        name: '情感指数',
        axisTick: {
            alignWithLabel: true
        },
        inverse: true,
    },
    yAxis: {
        name: '关键词个数',
        nameLocation: 'middle',
        nameGap: 40,
        position: 'right'
    },
    series: [{
        type: 'bar',
        data: weibo_senIndex_series_data,
    }],
    color: '#F4A460'
};

let option_official_senWave = {
    title: {
        text: '疫情防控平台情感波动',
        subtext: 'January 26 - February 20',
    },
    tooltip: {
        trigger: 'axis',
    },
    xAxis: {
        type: 'value',
        position: 'bottom',
        name: '情感数值'
    },
    yAxis: {
        type: 'category',
        axisLine: {show: false},
        axisLabel: {show: true},
        axisTick: {show: false},
        splitLine: {show: false},
        data: official_senWave_legend_data,

    },
    dataZoom: [
        {
            type: 'slider',
            yAxisIndex: 0,
            left: '1%'
        },
    ],
    series: [
        {
            name: '积极情感',
            type: 'bar',
            label: {
                show: false,
                formatter: '{b}'
            },
            data: official_senWave_series_positive_data,
            stack: '情感数值',
            large: true,
        },
        {
            name: '消极情感',
            type: 'bar',
            label: {
                show: false,
                formatter: '{b}'
            },
            data: official_senWave_series_negative_data,
            stack: '情感数值',
            large: true,
        }
    ],
    color: ['#48D1CC', '#A52A2A']
};

let option_weibo_senWave = {
    title: {
        text: '疫情防控平台情感波动',
        subtext: 'January 1 - February 20',
        left: 'right'
    },
    tooltip: {
        trigger: 'axis',
    },
    xAxis: {
        type: 'value',
        position: 'bottom',
        name: '情感数值',
        inverse: true,
    },
    yAxis: {
        type: 'category',
        axisLine: {show: false},
        axisLabel: {show: true},
        axisTick: {show: false},
        splitLine: {show: false},
        data: weibo_senWave_legend_data,
        position: 'right'
    },
    dataZoom: [
        {
            type: 'slider',
            yAxisIndex: 0,
            right: '1%'
        },
    ],
    series: [
        {
            name: '积极情感',
            type: 'bar',
            label: {
                show: false,
                formatter: '{b}'
            },
            data: weibo_senWave_series_positive_data,
            stack: '情感数值',
            large: true,
        },
        {
            name: '消极情感',
            type: 'bar',
            label: {
                show: false,
                formatter: '{b}'
            },
            data: weibo_senWave_series_negative_data,
            stack: '情感数值',
            large: true,
        },
    ],
    color: ['#F4A460', '#A52A2A']
};

let option_official_wordCloud = {
    title: {
        text: '疫情防控平台词云统计',
        subtext: 'January 26 - February 20',
        left: 'left'
    },
    series: {
        type: 'wordCloud',
        shape: 'circle',
        data: official_wordCloud_series_data,
        drawOutOfBound: false,
        gridSize: 10,
        sizeRange: [20, 80],
        rotationStep: 45,
        rotationRange: [-90, 90],
    },
    tooltip: {
        show: true,
        trigger: "item",
        triggerOn: "mousemove|click",
        axisPointer: {
            "type": "line"
        },
    },
};

let option_weibo_wordCloud = {
    title: {
        text: '微博词云统计',
        subtext: 'January 1 - February 20',
        left: 'right'
    },
    series: {
        type: 'wordCloud',
        shape: 'circle',
        data: weibo_wordCloud_series_data,
        drawOutOfBound: false,
        gridSize: 10,
        sizeRange: [20, 80],
        rotationStep: 45,
        rotationRange: [-90, 90],
    },
    tooltip: {
        show: true,
        trigger: "item",
        triggerOn: "mousemove|click",
        axisPointer: {
            "type": "line"
        },
    },
};


// 事件
official_rank.on('dataZoom', function (params) {
    let weibo_start = option_weibo_rank.dataZoom[0].start;
    let weibo_end = option_weibo_rank.dataZoom[0].end;

    if (!(weibo_start === params.start && weibo_end === params.end)) {
        option_weibo_rank.dataZoom[0].start = params.start;
        option_weibo_rank.dataZoom[0].end = params.end;

        weibo_rank.setOption(option_weibo_rank)
    }
});

weibo_rank.on('dataZoom', function (params) {
    let official_start = option_official_rank.dataZoom[0].start;
    let official_end = option_official_rank.dataZoom[0].end;

    if (!(official_start === params.start && official_end === params.end)) {
        option_official_rank.dataZoom[0].start = params.start;
        option_official_rank.dataZoom[0].end = params.end;

        official_rank.setOption(option_official_rank)
    }
});

official_senWave.on('dataZoom', function (params) {
    let weibo_start = option_official_senWave.dataZoom[0].start;
    let weibo_end = option_official_senWave.dataZoom[0].end;

    if (!(weibo_start === params.start && weibo_end === params.end)) {
        option_weibo_senWave.dataZoom[0].start = params.start;
        option_weibo_senWave.dataZoom[0].end = params.end;

        weibo_senWave.setOption(option_weibo_senWave)
    }
});

weibo_senWave.on('dataZoom', function (params) {
    let official_start = option_weibo_senWave.dataZoom[0].start;
    let official_end = option_weibo_senWave.dataZoom[0].end;

    if (!(official_start === params.start && official_end === params.end)) {
        option_official_senWave.dataZoom[0].start = params.start;
        option_official_senWave.dataZoom[0].end = params.end;

        official_senWave.setOption(option_official_senWave)
    }
});


function poa_init() {
    official_rank_legend_data.splice(0, official_rank_legend_data.length);
    official_rank_series_data.splice(0, official_rank_series_data.length);
    official_senIndex_series_data.splice(0, official_senIndex_series_data.length);
    official_senIndex_legend_data.splice(0, official_senIndex_legend_data.length);
    official_senWave_legend_data.splice(0, official_senWave_legend_data.length);
    official_senWave_series_positive_data.splice(0, official_senWave_series_positive_data.length);
    official_senWave_series_negative_data.splice(0, official_senWave_series_negative_data.length);
    official_wordCloud_series_data.splice(0, official_wordCloud_series_data.length);
    weibo_rank_legend_data.splice(0, weibo_rank_legend_data.length);
    weibo_rank_series_data.splice(0, weibo_rank_series_data.length);
    weibo_senIndex_legend_data.splice(0, weibo_senIndex_legend_data.length);
    weibo_senIndex_series_data.splice(0, weibo_senIndex_series_data.length);
    weibo_senWave_legend_data.splice(0, weibo_senWave_legend_data.length);
    weibo_senWave_series_positive_data.splice(0, weibo_senWave_series_positive_data.length);
    weibo_senWave_series_negative_data.splice(0, weibo_senWave_series_negative_data.length);
    weibo_wordCloud_series_data.splice(0, weibo_wordCloud_series_data.length);

    getOfficialData();
    getWeiboData();
}

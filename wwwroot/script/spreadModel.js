let model_vue = new Vue({
    el: '#task2',
});

let wuhan_control_prediction = echarts.init(document.getElementById('control_prediction'));
let wuhan_control_peak = echarts.init(document.getElementById('control_peak'));

let modelBasicPath = '../public/model';
let wuhanControlBasicPath = modelBasicPath + '/wuhan_control';
// 武汉城内管控数据
let wuhan_control_prediction_cases = [];
let wuhan_control_prediction_cases_oneday = [];
let wuhan_control_dates = [];
let wuhan_control_dates_timeline = [];
let wuhan_control_actual_cases = [];
let wuhan_control_peak_data = [];
let wuhan_control_subtitle = [];


let get_wuhan_control_data = async function () {
    let url = wuhanControlBasicPath + '/prediction_cases.json';
    await axios.get(url)
        .then(response => {
            wuhan_control_prediction_cases = response.data;
        });

    url = wuhanControlBasicPath + '/dates.json';
    await axios.get(url)
        .then(response => {
            response.data.forEach(s => {
                if (s === '1.23') {
                    wuhan_control_dates_timeline.push({
                        value: s,
                        tooltip: {formatter: '{b}: 实际封城时间'},
                        symbol: 'diamond',
                        symbolSize: 16
                    })
                } else {
                    wuhan_control_dates_timeline.push(s);
                }

                wuhan_control_dates.push(s);
            });
        });

    url = wuhanControlBasicPath + '/actual_cases.json';
    await axios.get(url)
        .then(response => {
            response.data.forEach(s => {
                wuhan_control_actual_cases.push(s);
            });
        });

    url = wuhanControlBasicPath + '/peak_cases.json';
    await axios.get(url)
        .then(response => {
            response.data.forEach(s => {
                wuhan_control_peak_data.push(s);
            });
        });

    wuhan_control_peak.setOption(option_wuhan_control_peak);
};

let get_wuhan_control_prediction_oneday = async function (dateIndex) {
    wuhan_control_prediction_cases_oneday.splice(0, wuhan_control_prediction_cases_oneday.length);
    wuhan_control_subtitle.splice(0, wuhan_control_subtitle.length);

    let data = wuhan_control_prediction_cases[dateIndex];

    data.forEach(s => {
        wuhan_control_prediction_cases_oneday.push(s);
    });

    wuhan_control_subtitle.push('模拟在' + wuhan_control_dates[dateIndex] + '日进行城市管控');
    option_wuhan_control_prediction.baseOption.timeline.currentIndex = dateIndex;

    wuhan_control_prediction.setOption(option_wuhan_control_prediction);
};


let option_wuhan_control_prediction = {
    baseOption: {
        title: {
            text: '武汉市内管控模拟及预测曲线',
            subtext: wuhan_control_subtitle,
        },
        xAxis: {
            type: 'category',
            data: wuhan_control_dates,
            axisTick: {
                alignWithLabel: true
            },
        },
        grid: {
            bottom: '14%'
        },
        yAxis: {
            type: 'value'
        },
        tooltip: {
            trigger: 'axis',
        },
        series: [
            {
                name: '实际感染',
                data: wuhan_control_actual_cases,
                type: 'line',
                smooth: true,
            },
            {
                name: '市内管控模拟',
                data: wuhan_control_prediction_cases_oneday,
                type: 'line',
                smooth: true,
            },
        ],
        legend: {
            data: ['实际感染', '市内管控模拟']
        },
        timeline: {
            axisType: 'category',
            data: wuhan_control_dates_timeline,
            playInterval: 100,
            loop: false,
            bottom: '0%'
        },
    }
};

let option_wuhan_control_peak = {
    title: {
        text: '模拟市内管控与感染峰值曲线'
    },
    xAxis: {
        type: 'category',
        data: wuhan_control_dates,
        axisTick: {
            alignWithLabel: true
        },
    },
    yAxis: {
        type: 'value'
    },
    tooltip: {
        trigger: 'axis'
    },
    series: [{
        name: '模拟武汉市内感染峰值',
        data: wuhan_control_peak_data,
        type: 'line'
    }],
    color: '#2f4554'
};

// 事件
wuhan_control_prediction.on('timelinechanged', function (timelineIndex) {
    let arrIndex = parseInt(timelineIndex.currentIndex);
    get_wuhan_control_prediction_oneday(arrIndex);
});

wuhan_control_peak.on('updateAxisPointer', function (event) {
    let xAxisInfo = event.axesInfo[0];
    if (xAxisInfo) {
        let dimension = xAxisInfo.value;

        get_wuhan_control_prediction_oneday(dimension);
    }
});


async function modelInit() {
    wuhan_control_dates.splice(0, wuhan_control_dates.length);
    wuhan_control_dates_timeline.splice(0, wuhan_control_dates_timeline.length);
    wuhan_control_actual_cases.splice(0, wuhan_control_actual_cases.length);
    wuhan_control_peak_data.splice(0, wuhan_control_peak_data.length);

    await get_wuhan_control_data();
    await get_wuhan_control_prediction_oneday(0);
}

modelInit();
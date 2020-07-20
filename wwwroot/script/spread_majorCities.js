let mock_overall_chart = echarts.init(document.getElementById('model_overall'));
let mock_city_chart = echarts.init(document.getElementById('model_city'));

let options = [];

//整体
let real_date = [];
let mock_date = [];
let mock_basic_path = '../public/model/mock';
let mock_subtitle = [];
let timeline_date = [];

let mock_timeline_index = 0;

//全国
let mock_overall_oneday = [];
let mock_overall = [];
let real_overall = [];

// 其他城市
let cities = ['孝感', '襄阳', '宜昌', '黄冈', '鄂州', '荆州', '随州', '北京', '上海', '广州', '深圳', '重庆', '长沙', '合肥', '杭州', '郑州', '成都'];
let cities_english = ['xiaogan', 'xiangyang', 'yichang', 'huanggang', 'ezhou', 'jingzhou', 'suizhou', 'beijing', 'shanghai', 'guangzhou', 'shenzhen', 'chongqing', 'changsha', 'hefei', 'hangzhou', 'zhengzhou', 'chengdu'];
let city_nums = cities.length;
let real_data = [];
let mock_data = [];
let mock_data_oneday = [];


let get_mock_data = async function () {
    let path = mock_basic_path + '/mocks';
    // 获取日期
    let url = path + '/date_model.json';
    await axios.get(url)
        .then(res => {
            res.data.forEach(s => {
                mock_date.push(s);
            });
        });

    // timeline日期
    url = path + '/date_timeline.json';
    await axios.get(url)
        .then(res => {
            res.data.forEach(s => {
                timeline_date.push(s);
            });
        });

    // 全国
    url = path + '/china_model.json';
    await axios.get(url)
        .then(res => {
            mock_overall = res.data;
        });

    // 其他城市
    for (let i = 0; i < city_nums; i++) {
        url = path + '/' + cities_english[i] + '_model.json';
        await axios.get(url)
            .then(res => {
                mock_data.push(res.data);
            });
    }
};

let get_mock_data_oneday = async function (dateIndex, cityIndex) {
    init_array(mock_subtitle);
    init_array(mock_overall_oneday);
    init_array(mock_data_oneday);

    // 标题
    mock_subtitle.push('模拟武汉于' + timeline_date[dateIndex] + '封城');

    // 全国数据
    let date_num = mock_date.length;
    for (let i = 0; i < date_num; i++) {
        mock_overall_oneday.push(parseInt(mock_overall[dateIndex][i]));
        mock_data_oneday.push(parseInt(mock_data[cityIndex][dateIndex][i]));
    }

    mock_overall_chart.setOption(option_mock_overall);
    //其他城市数据
    mock_city_chart.setOption(get_option(cities[cityIndex], real_data[cityIndex], mock_data_oneday));
};

let get_real_data = async function () {
    let path = mock_basic_path + '/reals';
    // 获取日期
    let url = path + '/date_real.json';
    await axios.get(url)
        .then(res => {
            res.data.forEach(s => {
                real_date.push(s);
            });
        });

    //全国
    url = path + '/china_real.json';
    await axios.get(url)
        .then(res => {
            res.data.forEach(s => {
                real_overall.push(s);
            });
        });

    //其他城市
    for (let i = 0; i < city_nums; i++) {
        url = path + '/' + cities_english[i] + '_real.json';
        real_data.push([]);

        await axios.get(url)
            .then(res => {
                res.data.forEach(s => {
                    real_data[i].push(s);
                })
            })
    }
};


let option_mock_overall = {
    baseOption: {
        title: {
            text: '全国预测曲线',
            subtext: mock_subtitle,
        },
        xAxis: {
            type: 'category',
            data: mock_date,
            axisTick: {
                alignWithLabel: true
            },
        },
        grid: {
            bottom: '17%'
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
                data: real_overall,
                type: 'line',
                smooth: true,
            },
            {
                name: '封城模拟',
                data: mock_overall_oneday,
                type: 'line',
                smooth: true,
            },
        ],
        legend: {
            data: ['实际感染', '封城模拟']
        },
        timeline: {
            axisType: 'category',
            data: timeline_date,
            playInterval: 100,
            loop: false,
            bottom: '0%'
        },
    }
};

function get_option(cityName, real_data, mock_data) {
    return {
        title: {
            text: cityName + '预测曲线',
            subtext: mock_subtitle,
        },
        xAxis: {
            type: 'category',
            data: mock_date,
            axisTick: {
                alignWithLabel: true
            },
        },
        grid: {
            bottom: '17%'
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
                data: real_data,
                type: 'line',
                smooth: true,
            },
            {
                name: '封城模拟',
                data: mock_data,
                type: 'line',
                smooth: true,
            },
        ],
        legend: {
            data: ['实际感染', '封城模拟']
        },
    };
}

// 事件
mock_overall_chart.on('timelinechanged', function (timelineIndex) {
    let arrIndex = parseInt(timelineIndex.currentIndex);
    mock_timeline_index = arrIndex;

    if (model_vue.value === '') {
        get_mock_data_oneday(arrIndex, 0);
    } else {
        get_mock_data_oneday(arrIndex, model_vue.value);
    }
});

function init_array(array) {
    array.splice(0, array.length);
}

async function init_mock() {
    init_array(options);
    init_array(mock_subtitle);
    init_array(real_date);
    init_array(real_data);
    init_array(real_overall);
    init_array(model_vue.options);
    init_array(mock_date);
    init_array(mock_data);
    init_array(mock_overall);
    init_array(timeline_date);

    model_vue.options = [{label: '湖北省内城市', options: []}, {label: '湖北省外城市', options: []}];

    // 向单选框中加入内容
    for (let i = 0; i < city_nums; i++) {
        if (i < 7) {
            model_vue.options[0].options.push({value: i, label: cities[i]});
        } else {
            model_vue.options[1].options.push({value: i, label: cities[i]});
        }
    }

    await get_real_data();
    await get_mock_data();

    // 初始化全国数据
    get_mock_data_oneday(0, 0);
}
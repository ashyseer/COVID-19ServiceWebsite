let mock_overall_chart = echarts.init(document.getElementById('model_overall'));
let mock_city_chart = echarts.init(document.getElementById('model_city'));

let options = [];

//整体
let real_date = [];
let mock_date = [];
let mock_basic_path = '../public/model/mock';
let mock_subtitle = [];

//全国
let mock_overall_oneday = [];
let mock_overall = [];
let real_overall = [];

// 其他城市
let cities = ['孝感', '襄阳', '宜昌', '黄冈', '鄂州', '荆州', '随州', '北京', '上海', '广州', '深圳', '重庆', '长沙', '合肥', '杭州', '郑州', '成都'];
let cities_english = ['xiaogan', 'xiangyang', 'yichang', 'huanggang', 'ezhou', 'jingzhou', 'suizhou', 'beijing', 'shanghai', 'guangzhou', 'shenzhen', 'chongqing', 'changsha', 'hefei', 'hangzhou', 'zhengzhou', 'chengdu'];
let city_nums = cities.length;
let real_data = [];


let get_mock_data = async function () {
    // 获取日期
};

let get_mock_data_oneday = async function (dateIndex) {

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
            data: real_date,
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
                data: [],
                type: 'line',
                smooth: true,
            },
        ],
        legend: {
            data: ['实际感染', '封城模拟']
        },
        timeline: {
            axisType: 'category',
            data: [],
            playInterval: 100,
            loop: false,
            bottom: '0%'
        },
    }
};

function get_option(cityName, real_data, mock_data, i) {
    return {
        title: {
            text: cityName + '预测曲线',
            subtext: mock_subtitle,
        },
        xAxis: {
            type: 'category',
            data: real_date,
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

function init_array(array) {
    array.splice(0, array.length);
}

async function init_mock() {
    init_array(options);
    init_array(mock_subtitle);
    init_array(real_date);
    init_array(real_overall);
    init_array(model_vue.options);

    model_vue.options = [{label: '湖北省内城市', options: []}, {label: '湖北省外城市', options: []}];

    // 向单选框中加入内容
    for (let i = 0; i < city_nums; i++) {
        if (i < 7) {
            model_vue.options[0].options.push({value: i, label: cities[i]});
        }
        else{
            model_vue.options[1].options.push({value: i, label: cities[i]});
        }
    }

    await get_real_data();

    // 初始化全国数据
    mock_overall_chart.setOption(option_mock_overall);
    mock_city_chart.setOption(get_option(cities[0], real_data[0], []));
}
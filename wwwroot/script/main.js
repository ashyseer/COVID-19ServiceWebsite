let Main = {
    data() {
        return {
            activeIndex: '1',
            virus_image_src:'resources/static/img/virus.png',
        };
    },
    methods: {
        handleSelect(key, keyPath) {
            hideAll();

            switch (key) {
                case("1"):
                    document.getElementById('task1').style.display = 'block';
                    covid_visualization_init();
                    break;
                case("2"):
                    document.getElementById('task2').style.display = 'block';
                    modelInit();
                    init_mock();
                    break;
                case("3"):
                    document.getElementById('task3').style.display = 'block';
                    poa_init();
                    break;
                case("4"):
                    document.getElementById('task4').style.display = 'block';
                    break;
                default:
                    document.getElementById('task1').style.display = 'block';
                    covid_visualization_init();
                    break;
            }
        },
    }
};
var Ctor = Vue.extend(Main);
new Ctor().$mount('#app');

function hideAll() {
    for (let i = 1; i <= 4; i++) {
        let task = document.getElementById('task' + i);
        task.style.display = 'none';
    }
}

function init_index() {
    hideAll();
    document.getElementById('task1').style.display = 'block';
    covid_visualization_init();
}

init_index();

let vue = new Vue({
        el: '#task4',
        data: {
            keyword: "",
            rumors: [],
            skip: 0,
            take: 30,
            basicPath: '/api/map/rumor',
            current: {},
            addVisible: false,
            editVisible: false,
            mode: '',
            rules: {
                title: [
                    {required: true, message: '请输入标题', trigger: 'blur'},
                ],
                rumorId: [
                    {required: true, message: 'ID 不能为空', trigger: 'blur'},
                    {type: 'number', message: 'ID 必须为数字值'}
                ],
                mainSummary: [
                    {required: true, message: '请输入摘要', trigger: 'blur'}
                ],
                date: [
                    {required: true, message: '请选择日期', trigger: 'blur'}
                ],
                body: [
                    {required: true, message: '内容不能为空', trigger: 'blur'}
                ],
            }
        },
        methods: {
            queryAllRumor: function () {
                let url = this.basicPath + '/all';
                url += '?skip=' + this.skip + '&&take=' + this.take;
                let self = this;

                axios.get(url)
                    .then(response => {
                        self.rumors = response.data;
                    })
                    .catch(e => self.$message.error(e.response.data));
            },
            queryByTitle: function () {
                let url = this.basicPath + '/bytitle';
                url += '?skip=' + this.skip + '&&take=' + this.take;
                url += '&&title=' + this.keyword;

                let self = this;
                if (this.keyword !== "") {
                    axios.get(url)
                        .then(response => {
                            self.rumors = response.data;
                        })
                        .catch(e => self.$message.error(e.response.data));
                } else {
                    this.queryAllRumor();
                }
            },
            rumorClass({row, rowIndex}) {
                if (row.rumorType === 0) {
                    return 'warning-row';
                } else if (row.rumorType === 1) {
                    return 'success-row';
                }
            },
            refresh: function () {
                this.queryAllRumor();
                this.keyword = "";
            },
            showAddRumor: function () {
                this.mode = 'add';
                this.current = {};
                this.addVisible = true;

                let newRumors = Object.assign([], this.rumors);
                let sort = newRumors.sort((a, b) => a.rumorId - b.rumorId);

                let i = 0;
                try {
                    sort.forEach(rumor => {
                        i++;
                        if (rumor.rumorId !== i) {
                            this.current.rumorId = i;
                            throw new Error("ending");  // 退出循环
                        }
                    });

                    this.current.rumorId = i + 1;
                } catch (e) {
                    return 0;
                }

            },
            showEditRumor: function (rumor) {
                this.mode = 'edit';
                this.current = Object.assign({}, rumor);
                this.editVisible = true;
            },
            submitRumor: function (current) {
                this.$refs[current].validate((valid) => {
                    if (valid) {

                        let url = this.basicPath;

                        if (this.mode === 'add') {
                            let date = new Date(this.current.date);
                            this.current.date = dateToString(date);

                            axios.post(url, this.current)
                                .then(response => {
                                    this.queryAllRumor();
                                    this.addVisible = false;
                                })
                                .catch(e => this.$message.error(e.response.data))
                        } else if (this.mode === 'edit') {
                            let pattern = new RegExp('[0-9]+/[0-9]+/[0-9]');
                            let dateStr = this.current.date;

                            url += '/' + this.current.rumorId;
                            if (!pattern.test(dateStr)) {
                                let date = new Date(this.current.date);
                                this.current.date = dateToString(date);
                            }
                            axios.put(url, this.current)
                                .then(response => {
                                    this.queryAllRumor();
                                    this.editVisible = false;
                                })
                                .catch(e => this.$message.error(e.response.data))
                        }
                    } else {
                        return false;
                    }
                });
            },
            deleteRumor: function (rumor) {
                let url = this.basicPath + '/delete';
                url += '/' + rumor.title;
                axios.delete(url)
                    .then(response => this.queryAllRumor())
                    .catch(e => this.$message.error(e.response.data))
            }
        }
    })
;

vue.queryAllRumor();
import pyecharts.options as opts
from pyecharts.charts import Line, Timeline
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import json
def evaluate(day):
    N = 9000000  # 人口数
    r = 4.1  # 感染者接触数量
    B = 0.6  # 传染概率
    a = 0.125  # 潜伏者转化为感染者的概率
    r2 = 8 # 潜伏者接触人数
    B2 = 0.025  # 潜伏者传染正常人的概率
    y = 0.125  # 康复概率
    k = 0.03  # 日致死率
    B3 = 0.1 # 转阴率
    E = np.zeros(140)
    D = np.zeros(140)
    I = np.zeros(140)
    S = np.zeros(140)
    R = np.zeros(140)
    E[0] = 0  # 潜伏者
    D[0] = 0  # 死亡患者人数
    I[0] = 1  # 感染人数
    S[0] = N - I[0]  # 易感人数
    R[0] = 0  # 康复者人数
    for i in range(139):
        if i >= 25 + day:
            r = 0.3
            r2 = 0.8
        if i < 7:
            S[i+1] = S[i] - r * B * S[i] * I[i] / N - r2 * B2 * S[i] * E[i] / N # 易感人群迭代
            E[i+1] = E[i] + r * B * S[i] * I[i] / N - a * E[i] + r2 * B2 * S[i] * E[i] / N # 潜伏者迭代
            I[i+1] = I[i] + a * E[i] - (k + y) * I[i] # 感染人数迭代
            R[i+1] = R[i] + y * I[i] # 康复人数迭代
            D[i+1] = D[i] + k * I[i] # 死亡患者人数迭代
        else: # 7天开始考虑转阴率
            S[i+1] = S[i] - r * B * S[i] * I[i] / N - r2 * B2 * S[i] * E[i] / N + B3 * E[i-6] # 易感人群迭代
            E[i+1] = E[i] + r * B * S[i] * I[i] / N - a * E[i] + r2 * B2 * S[i] * E[i] / N - B3 * E[i-6] # 潜伏者迭代
            I[i+1] = abs(int(I[i] + a * E[i] - (k + y) * I[i])) # 感染人数迭代
            R[i+1] = R[i] + y * I[i] # 康复人数迭代
            D[i+1] = D[i] + k * I[i] # 死亡患者人数迭代
    return I
cases = []
for i in range(140):
    cases.append(evaluate(i-24).tolist())
with open('number of cases according to different dates of closure.json','w') as file_object:
    json.dump(cases, file_object)
choose = eval((input("输入1，查看推迟封城天数对确诊病例变化的影响；输入2，查看不同推迟天数对应的确诊病例峰值")))
d = np.zeros(140)
date_1 = d.astype(np.str)
month_1 = '1'
month_2 = '2'
month_3 = '3'
month_4 = '4'
month_5 = '5'
date_1[0] = '12.30'
date_1[1] = '12.31'
tl = Timeline()
for i in range(2, 140):
    if i <= 32:
        x = i - 1
        date_1[i] = month_1 + '.' + str(x)
    elif i <= 61:
        x = i - 32
        date_1[i] = month_2 + '.' + str(x)
    elif i <= 92:
        x = i - 61
        date_1[i] = month_3 + '.' + str(x)
    elif i <= 122:
        x = i - 92
        date_1[i] = month_4 + '.' + str(x)
    else:
        x = i - 122
        date_1[i] = month_5 + '.' + str(x)

if choose == 1:
    I = evaluate(0)
    plt.plot(I,color = 'yellow',label = 'Infection:Shutdown on 1.23',marker = '.')
    day = input("输入推迟封城的天数")
    d = eval(day)
    I_1 = evaluate(d)
    plt.plot(I_1,color = 'red',label = 'Infection:Shutdown '+ day + ' days later',marker = '.')
    def excel_one_line_to_list(i):
        df = pd.read_excel("QueryCity.xlsx", usecols=[i], names=None)
        df_li = df.values.tolist()
        result = []
        for s_li in df_li:
           result.append(s_li[0])
        return result
    confirmed = excel_one_line_to_list(2)
    cured = excel_one_line_to_list(3)
    dead = excel_one_line_to_list(4)
    I_real = np.zeros(77)
    for i in range(77):
        I_real[i] = int(confirmed[i] - cured[i] - dead[i])
    plt.plot(I_real,color = 'blue',label = 'Infection number in actual',marker = '.')
    Date = ['12.30', '1.9', '1.19', '1.29', '2.8', '2.18', '2.28', '3.9', '3.19', '3.29', '4.8', '4.18', '4.28', '5.7']
    plt.xticks(range(0, 140, 10), Date)
    plt.xlabel('Day')
    plt.ylabel("Number")
    plt.legend()
    plt.title('SEIR_nCOV')
    plt.show()
    list_I = []
    for i in range(77):
        list_I.append(I_real[i])
    with open('Cases in actual.json', 'w') as file_object:
        json.dump(list_I, file_object)
    for i in range(140):
        c = (
            Line()
            .set_global_opts(
                tooltip_opts=opts.TooltipOpts(is_show=False),
                xaxis_opts=opts.AxisOpts(type_="category",
                                     name="日期",
                ),
                yaxis_opts=opts.AxisOpts(
                type_="value",
                name="人数（单位：人）",
                axistick_opts=opts.AxisTickOpts(is_show=False),
                splitline_opts=opts.SplitLineOpts(is_show=False),
                ),
            )
            .add_xaxis(xaxis_data = date_1)
            .add_yaxis(
                "实际确诊数量",
                y_axis = I_real,
                linestyle_opts=opts.LineStyleOpts(width=2),
            )
            .add_yaxis(
                date_1[i] + "日封城",
                y_axis = evaluate(i-24),
                linestyle_opts=opts.LineStyleOpts(width=2),
            )
            .set_global_opts(
                title_opts=opts.TitleOpts(title="患病数目模拟"),
            )
        )
        tl.add(c, "".format(date_1[i]))
    tl.render("timeline_bar.html")

if choose == 2:
    Max = np.zeros(140)
    for t in range(140):
        Max[t] = int(max(evaluate(t-24)))
    plt.plot(Max,color = 'cyan',label = 'Impact of postponement of the closure of the city on the peak number of diagnoses',marker = '.')
    Date = ['12.30', '1.9', '1.19', '1.29', '2.8', '2.18', '2.28', '3.9', '3.19', '3.29', '4.8', '4.18', '4.28', '5.7']
    plt.xticks(range(0, 140, 10), Date)
    plt.xlabel('Day')
    plt.ylabel("Number")
    plt.legend()
    plt.title('SEIR_nCOV')
    plt.show()
    (
        Line()
        .set_global_opts(
            tooltip_opts=opts.TooltipOpts(is_show=False),
            xaxis_opts=opts.AxisOpts(type_="category",
            name = "日期",
            ),
            yaxis_opts=opts.AxisOpts(
                type_="value",
                name = "人数（单位：人）",
                axistick_opts=opts.AxisTickOpts(is_show=False),
                splitline_opts=opts.SplitLineOpts(is_show=False),
            ),
        )
        .add_xaxis(xaxis_data= date_1)
        .add_yaxis(
            series_name="患病人数峰值（单位：人）",
            y_axis=Max,
            symbol="emptyCircle",
            is_symbol_show=True,
            label_opts=opts.LabelOpts(is_show=False),
        )
        .set_global_opts(
            title_opts=opts.TitleOpts(title="封城时间对患病人数峰值的影响"),
        )
        .render("Impact of postponement of the closure of the city on the peak number of diagnoses.html")
    )
    list_Max = []
    for i in range(140):
        list_Max.append(Max[i])
    with open('peak number of diagnoses according to different closure dates.json', 'w') as file_object:
        json.dump(list_Max, file_object)
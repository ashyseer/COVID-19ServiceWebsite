# -*- coding: utf-8 -*-
from snownlp import SnowNLP
import codecs
import os
import pandas as pd
import os
import time
import pandas as pd
import numpy as np
import jieba
import jieba.analyse

from PIL import Image
from datetime import datetime
from matplotlib.font_manager import FontProperties
from openpyxl.workbook import Workbook
from pyecharts import options as opts
from pyecharts.charts import Bar

#####################################疫情平台####################################
#获取情感分数
data = pd.read_csv('中国社会组织_疫情防控1_1-2_20.csv')
cut_words=[]
data_test=data.iloc[:300]
for line in data_test['正文内容']:
    line = str(line)
    seg_list = jieba.cut(line,cut_all=False)
    cut_word= (" ".join(seg_list))
    cut_words.append(cut_word)
#print(final_list)
print(cut_words)

sentimentslist = []
for line in cut_words:
    s = SnowNLP(line)
   # print(s.sentiments)
    sentimentslist.append(s.sentiments)

#区间转换为[-0.5, 0.5]
result = []
i = 0
while i<len(sentimentslist):
    result.append(sentimentslist[i]-0.5)
    i = i + 1

#可视化画图
# import matplotlib.pyplot as plt
# import numpy as np
# plt.plot(np.arange(0,len(linelist), 1), result, 'k-')
# plt.xlabel('Number')
# plt.ylabel('Sentiment')
# plt.title('Analysis of Sentiments')
# plt.savefig('Sentiments_wave.png')
# plt.show()

#pyecharts可视化
from pyecharts import options as opts
from pyecharts.charts import Bar
import numpy as np

c = Bar()
x_temp=np.arange(0,len(cut_words), 1)
y = result
# x轴
x=x_temp.tolist()
c.add_xaxis(x)
# y轴
c.add_yaxis('情感数值',y)

# reversal_axis方法是反转xy轴
# c.reversal_axis()
# False则不显示y轴的值，默认为显示
c.set_series_opts(label_opts=opts.LabelOpts(is_show=False),
                  #markpoint_opts指定类型
             #      markpoint_opts=opts.MarkPointOpts(
             #            data = [
             #                opts.MarkPointItem(type_="max", name="最大值"),
             #                opts.MarkPointItem(type_="min", name="最小值"),
             #                 ]
             # )
)
c.set_global_opts(title_opts=opts.TitleOpts(title="中国社会组织疫情防控平台新闻数据_情感波动图"),xaxis_opts=opts.AxisOpts(name='新闻序号')
                  # datazoom_opts水平显示，vertical垂直显示
                  # datazoom_opts=opts.DataZoomOpts(orient="vertical")
                  )
#c.render_notebook()
c.render('中国社会组织疫情防控平台数据_情感波动分析.html')

#####################################微博####################################
# #获取情感分数
# data = pd.read_csv('weibo_data.csv')
# cut_words=[]
# data_test=data.iloc[:300]
# for line in data_test['微博中文内容']:
#     line = str(line)
#     seg_list = jieba.cut(line,cut_all=False)
#     cut_word= (" ".join(seg_list))
#     cut_words.append(cut_word)
# #print(final_list)
# print(cut_words)
#
# sentimentslist = []
# for line in cut_words:
#     s = SnowNLP(line)
#    # print(s.sentiments)
#     sentimentslist.append(s.sentiments)
#
# #区间转换为[-0.5, 0.5]
# result = []
# i = 0
# while i<len(sentimentslist):
#     result.append(sentimentslist[i]-0.5)
#     i = i + 1
#
# #可视化画图
# # import matplotlib.pyplot as plt
# # import numpy as np
# # plt.plot(np.arange(0,len(linelist), 1), result, 'k-')
# # plt.xlabel('Number')
# # plt.ylabel('Sentiment')
# # plt.title('Analysis of Sentiments')
# # plt.savefig('Sentiments_wave.png')
# # plt.show()
#
# #pyecharts可视化
# from pyecharts import options as opts
# from pyecharts.charts import Bar
# import numpy as np
#
# c = Bar()
# x_temp=np.arange(0,len(cut_words), 1)
# y = result
# # x轴
# x=x_temp.tolist()
# c.add_xaxis(x)
# # y轴
# c.add_yaxis('情感数值',y)
#
# # reversal_axis方法是反转xy轴
# # c.reversal_axis()
# # False则不显示y轴的值，默认为显示
# c.set_series_opts(label_opts=opts.LabelOpts(is_show=False),
#                   #markpoint_opts指定类型
#              #      markpoint_opts=opts.MarkPointOpts(
#              #            data = [
#              #                opts.MarkPointItem(type_="max", name="最大值"),
#              #                opts.MarkPointItem(type_="min", name="最小值"),
#              #                 ]
#              # )
# )
# c.set_global_opts(title_opts=opts.TitleOpts(title="微博数据_情感波动图"),xaxis_opts=opts.AxisOpts(name='微博序号')
#                   # datazoom_opts水平显示，vertical垂直显示
#                   # datazoom_opts=opts.DataZoomOpts(orient="vertical")
#                   )
# #c.render_notebook()
# c.render('微博数据情感波动分析.html')
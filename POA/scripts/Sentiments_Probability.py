# -*- coding: utf-8 -*-
from snownlp import SnowNLP
import codecs
import os
import pandas as pd
import numpy as np
import jieba
import jieba.analyse
from pyecharts import options as opts
from pyecharts.charts import Bar

#####################################疫情平台####################################
cut_words=""
data = pd.read_csv('中国社会组织_疫情防控1_1-2_20.csv')

for line in data['正文内容']:
    line = str(line)
    seg_list = jieba.cut(line,cut_all=False)
    cut_words+= (" ".join(seg_list))

keywords = jieba.analyse.extract_tags(cut_words,
                                      topK=1500,
                                      withWeight=True,
                                     # allowPOS=('a','e','n','nr','ns', 'v')#词性 形容词 叹词 名词 动词
)
ss = pd.DataFrame(keywords,columns = ['词语','重要性'])
words = np.array(ss.词语) #先将数据框转换为数组

sentimentslist = []
for i in words:
    s = SnowNLP(i)
    print(s.sentiments)
    sentimentslist.append(s.sentiments)

#matplotlib可视化
# import matplotlib.pyplot as plt
# import numpy as np
# plt.hist(sentimentslist, bins = np.arange(0, 1, 0.01), facecolor = 'g')
# plt.xlabel('Sentiments score')
# plt.ylabel('Quantity')
# plt.title('Analysis of Sentiments')
# plt.savefig('Sentiments Probability.png')
# plt.show()

#pyecharts可视化
from pyecharts import options as opts
from pyecharts.charts import Bar
import numpy as np


(n,bins)=np.histogram(sentimentslist,50,range=(0,1))
c = Bar()
y = n.tolist()
x=bins.tolist()
# x轴
c.add_xaxis(x)
# y轴
c.add_yaxis('Quantity',y)

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
c.set_global_opts(title_opts=opts.TitleOpts(title="疫情防控平台情感数值分布图"),xaxis_opts=opts.AxisOpts(name='情感数值')
                  # datazoom_opts水平显示，vertical垂直显示
                  # datazoom_opts=opts.DataZoomOpts(orient="vertical")
                  )
#c.render_notebook()
c.render('疫情防控平台情感数值分布图.html')

#####################################微博####################################
#
# data = pd.read_csv('weibo_data.csv')
# lines=""
# for line in data['keyword1']:
#     line = str(line)
#     lines=lines+line
# #print(final_list)
#
# keywords = jieba.analyse.extract_tags(lines,
#                                       topK=1200,
#                                       withWeight=True,
#                                      # allowPOS=('a','e','n','nr','ns', 'v')#词性 形容词 叹词 名词 动词
# )
# ss = pd.DataFrame(keywords,columns = ['词语','重要性'])
# words = np.array(ss.词语) #先将数据框转换为数组
#
# sentimentslist = []
# for i in words:
#     i=str(i)
#     s = SnowNLP(i)
#    # print(s.sentiments)
#     sentimentslist.append(s.sentiments)
#
# #matplotlib可视化
# # import matplotlib.pyplot as plt
# # import numpy as np
# # plt.hist(sentimentslist, bins = np.arange(0, 1, 0.01), facecolor = 'g')
# # plt.xlabel('Sentiments score')
# # plt.ylabel('Quantity')
# # plt.title('Analysis of Sentiments')
# # plt.savefig('Sentiments Probability.png')
# # plt.show()
#
# #pyecharts可视化
# from pyecharts import options as opts
# from pyecharts.charts import Bar
# import numpy as np
#
#
# (n,bins)=np.histogram(sentimentslist,50,range=(0,1))
#
# c = Bar()
# y = n.tolist()
# x=bins.tolist()
# # x轴
# c.add_xaxis(x)
# # y轴
# c.add_yaxis('Quantity',y)
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
# c.set_global_opts(title_opts=opts.TitleOpts(title="微博数据情感数值分布图"),xaxis_opts=opts.AxisOpts(name='情感数值')
#                   # datazoom_opts水平显示，vertical垂直显示
#                   # datazoom_opts=opts.DataZoomOpts(orient="vertical")
#                   )
#
#c.render('微博数据情感数值分布图.html')
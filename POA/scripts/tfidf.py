# coding=utf-8
import os
import time
import pandas as pd
import numpy as np
import jieba
import jieba.analyse
import matplotlib.pyplot as plt
from PIL import Image
from datetime import datetime
from matplotlib.font_manager import FontProperties
from openpyxl.workbook import Workbook
from pyecharts import options as opts
from pyecharts.charts import Bar

#####################################疫情平台####################################
#------------------------------------中文分词------------------------------------
cut_words = ""
data = pd.read_csv('中国社会组织_疫情防控1_1-2_20.csv')

for line in data['正文内容']:
    line = str(line)
    seg_list = jieba.cut(line,cut_all=False)
    cut_words += (" ".join(seg_list))
# jieba.load_userdict("userdict.txt")              # 自定义词典
# jieba.analyse.set_stop_words('stop_words.txt')   # 停用词词典

# 提取主题词 返回的词频其实就是TF-IDF
keywords = jieba.analyse.extract_tags(cut_words,
                                      topK=50,
                                      withWeight=True,
                                      allowPOS=('a','e','n','nr','ns', 'v')) #词性 形容词 叹词 名词 动词
# 以列表形式返回
print(keywords)
# 数据存储
pd.DataFrame(keywords, columns=['词语','重要性']).to_excel('TF_IDF关键词前50.xlsx')
# keyword本身包含两列数据
ss = pd.DataFrame(keywords,columns = ['词语','重要性'])
print(ss)

#------------------------------------matplotlib数据可视化------------------------------------
# plt.figure(figsize=(10,6))
# plt.title('TF-IDF Ranking')
# fig = plt.axes()
# plt.barh(range(len(ss.重要性[:25][::-1])),ss.重要性[:25][::-1])
# fig.set_yticks(np.arange(len(ss.重要性[:25][::-1])))
# font = FontProperties(fname=r'c:\windows\fonts\simsun.ttc')
# fig.set_yticklabels(ss.词语[:25][::-1],fontproperties=font)
# fig.set_xlabel('Importance')
# plt.savefig('TF-IDF Ranking.png')
# plt.show()
# #print('over')
#------------------------------------pyecharts数据可视化------------------------------------
data_x = np.array(ss.词语) #先将数据框转换为数组
data_x_list = data_x.tolist()  #其次转换为列表
#print(data_x_list)
data_y = np.array(ss.重要性) #先将数据框转换为数组
data_y_list = data_y.tolist()  #其次转换为列表

c = Bar()
# x轴
c.add_xaxis(data_x_list)
# y轴
c.add_yaxis('TF-IDF值',data_y_list)

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
c.set_global_opts(title_opts=opts.TitleOpts(title="疫情防控平台数据_TF-IDF _Ranking"),xaxis_opts=opts.AxisOpts(name='词语')
                  # datazoom_opts水平显示，vertical垂直显示
                  # datazoom_opts=opts.DataZoomOpts(orient="vertical")
                  )
c.render('疫情防控平台数据_TF-IDF _Ranking.html')

#####################################微博####################################
# #------------------------------------中文分词------------------------------------
# cut_words = ""
# data = pd.read_csv('weibo_data.csv')
#
# for line in data['微博中文内容']:
#     line = str(line)
#     seg_list = jieba.cut(line,cut_all=False)
#     cut_words += (" ".join(seg_list))
#
#
# # jieba.load_userdict("userdict.txt")              # 自定义词典
# # jieba.analyse.set_stop_words('stop_words.txt')   # 停用词词典
#
# # 提取主题词 返回的词频其实就是TF-IDF
# keywords = jieba.analyse.extract_tags(cut_words,
#                                       topK=50,
#                                       withWeight=True,
#                                       allowPOS=('a','e','n','nr','ns', 'v')) #词性 形容词 叹词 名词 动词
#
# # 以列表形式返回
# print(keywords)
#
# # 数据存储
# pd.DataFrame(keywords, columns=['词语','重要性']).to_excel('TF_IDF关键词前50.xlsx')
#
# # keyword本身包含两列数据
# ss = pd.DataFrame(keywords,columns = ['词语','重要性'])
# #print(ss)
#
# #------------------------------------数据可视化------------------------------------
# # plt.figure(figsize=(10,6))
# # plt.title('TF-IDF Ranking')
# # fig = plt.axes()
# # plt.barh(range(len(ss.重要性[:25][::-1])),ss.重要性[:25][::-1])
# # fig.set_yticks(np.arange(len(ss.重要性[:25][::-1])))
# # font = FontProperties(fname=r'c:\windows\fonts\simsun.ttc')
# # fig.set_yticklabels(ss.词语[:25][::-1],fontproperties=font)
# # fig.set_xlabel('Importance')
# # plt.savefig('TF-IDF Ranking.png')
# # plt.show()
# # #print('over')
# #------------------------------------数据可视化------------------------------------
# data_x = np.array(ss.词语) #先将数据框转换为数组
# data_x_list = data_x.tolist()  #其次转换为列表
# #print(data_x_list)
# data_y = np.array(ss.重要性) #先将数据框转换为数组
# data_y_list = data_y.tolist()  #其次转换为列表
#
# c = Bar()
# # x轴
# c.add_xaxis(data_x_list)
# # y轴
# c.add_yaxis('TF-IDF值',data_y_list)
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
# c.set_global_opts(title_opts=opts.TitleOpts(title="微博数据_TF-IDF _Ranking"),xaxis_opts=opts.AxisOpts(name='词语')
#                   # datazoom_opts水平显示，vertical垂直显示
#                   # datazoom_opts=opts.DataZoomOpts(orient="vertical")
#                   )
# #c.render_notebook()
# c.render('微博数据_TF-IDF _Ranking.html')
#
#
#

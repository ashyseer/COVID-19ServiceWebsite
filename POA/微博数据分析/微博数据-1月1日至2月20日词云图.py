# coding=utf-8
import jieba
import re
import time
from collections import Counter
import pandas as pd
import datetime
from pyecharts  import options as opts
from pyecharts.charts import WordCloud
from pyecharts.globals import SymbolType
from pyecharts.charts import  Timeline
from pyecharts.faker import Faker
#------------------------------------中文分词------------------------------------

#percent = 0-90
def generatewordData():
    cut_words = ""
    all_words = ""

    data = pd.read_csv('weibo_data.csv')

    for line in data['微博中文内容']:
        line = str(line)
        seg_list = jieba.cut(line,cut_all=False)
        cut_words = (" ".join(seg_list))
        all_words += cut_words


    # 输出结果
    all_words = all_words.split()

    # 词频统计
    c = Counter()
    for x in all_words:
        if len(x)>1 and x != '\r\n':
            c[x] += 1
    c.render()
    words = []
    for (k,v) in c.most_common(50):
        # print(k, v)
        words.append((k,v))
    words = words[1:]
    return words

# 生成图
if __name__ == "__main__":
    #生成词云
    # words= generatewordData()
    # with open("weibociyun.py",'w',encoding='utf-8') as f:
    #     f.write("date_data="+str(words))
    #     f.close()
    #显示1月1日至2月20日词云图
    #from weibociyun import date_data
    from data_ranking_50 import date_data

    print(len(date_data))

    words = date_data
    print(words)

    c = (
        WordCloud()
        .add("", words, word_size_range=[20, 100], shape=SymbolType.ROUND_RECT)
        .set_global_opts(title_opts=opts.TitleOpts(pos_left='center',title='微博数据-1月1日至2月20日词云图 '))
    )

    c.render("微博数据-1月1日至2月20日词云图.html")

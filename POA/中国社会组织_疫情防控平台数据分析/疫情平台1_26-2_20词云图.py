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

    data = pd.read_csv('中国社会组织_疫情防控1_1-2_20.csv')

    for line in data['正文内容']:
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

    words = []
    for (k,v) in c.most_common(50):
        # print(k, v)
        words.append((k,v))
    words = words[1:]
    return words

# 生成图
if __name__ == "__main__":
    #生成词云
    words= generatewordData()
    with open("xinwenciyun.py",'w',encoding='utf-8') as f:
        f.write("date_data="+str(words))
        f.close()
    #显示1月1日至2月20日词云图
    from xinwenciyun import date_data

    print(len(date_data))

    words = date_data
    print(words)

    c = (
        WordCloud()
        .add("", words, word_size_range=[20, 100], shape=SymbolType.ROUND_RECT)
        .set_global_opts(title_opts=opts.TitleOpts(pos_left='center',title='疫情防疫组织平台新闻数据-1月26日至2月20日词云图 '))
    )

    c.render("疫情防疫组织平台新闻数据-1月26日至2月20日词云图.html")

一、数据集
中国社会组织_疫情防控.csv：从中国社会组织公共服务平台爬取的数据（http://www.chinanpo.gov.cn/index.html
weiboComments.csv：从微博战疫情页面爬取的数据（https://m.weibo.cn/?display=0&retcode=6102）
二、脚本
spider-社会组织.py ---- 爬取数据
weibo_战疫情爬虫_spider.py ---- 爬取数据
wordcould_timeline.py ----每一天或一段时间内 jieba分词及词云图
wordcould_1_01-2_20.py ----1_01-2_20时间内 jieba分词及词云图
tfidf.py ---- tfidf值可视化
Sentiments_Probability.py ---- 统计关键词各情感分数段出现的频率并绘制对应的柱状图
Sentiments_wave.py ---- 计算评论的情感分数并可视化
三、结果
1、疫情防疫组织平台
疫情防疫组织平台新闻数据-1月26日至2月20日词云图
1-26-7_10中国社会组织疫情防控平台_wordcloud
1_26-2_20疫情防控平台数据_TF-IDF _Ranking
1_26-2_20疫情防控平台情感分值分布图
1_26-2_20疫情防控平台新闻数据_情感波动分析
2、微博
微博数据-1月1日至2月20日词云图
 1_01-2_20weiboWordcloud
1_01-2_20微博数据_TF-IDF _Ranking
1_01-2_20微博数据情感数值分布图
1_01-2_20微博数据情感波动分析
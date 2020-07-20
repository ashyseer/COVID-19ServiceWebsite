import numpy as np
import json
import pandas as pd
N = [30000000, 13000000, 20000000, 15000000, 24000000, 8000000, 8000000, 10000000, 10000000, 16000000, 5000000, 7500000, 6000000, 2000000, 4000000, 6000000, 1000000, 140000000]

E = np.zeros(200)
I = np.zeros(200)
S = np.zeros(200)
R = np.zeros(200)
r1 = 8
r2 = 5
I[0] = 1

B1 = 0.15
y = 0.285
k = 0.03
a = 0.07
Y = 0.255
def excel_one_line_to_list(i):
    df = pd.read_excel('move_China.xlsx', usecols=[i], names=None)
    df_li = df.values.tolist()
    result = []
    for s_li in df_li:
        result.append(s_li[0])
    return result
C = np.zeros(200)
O = 429463
P = 0
def closure(day, t):
    C = excel_one_line_to_list(t+1)
    S[0] = N[t] - 1
    for i in range(day):
        S[i+1] = S[i] - r1*B1*S[i]*I[i]/N[t]+C[i]*0.8
        E[i+1] = E[i] + r1*B1*S[i]*I[i]/N[t]-a*E[i] + C[i]*0.0013
        I[i+1] = I[i] + a*E[i] - y*I[i]
        R[i+1] = R[i] + y*I[i]

    for i in range(day, 199):
        S[i+1] = S[i] - r2*B1*S[i]*I[i]/N[t]+0.8*P
        E[i+1] = E[i] + r2*B1*S[i]*I[i]/N[t]+0.0013*P - a*E[i]
        I[i+1] = I[i] + a*E[i] - Y*I[i]
        R[i+1] = R[i] + y*I[i]
    I_1 = []
    for t in range(14, 199):
        I_1.append(I[t])
    return I_1
cases_0 = []
cases_1 = []
cases_2 = []
cases_3 = []
cases_4 = []
cases_5 = []
cases_6 = []
cases_7 = []
cases_8 = []
cases_9 = []
cases_10 = []
cases_11 = []
cases_12 = []
cases_13 = []
cases_14 = []
cases_15 = []
cases_16 = []
cases_17 = []

for day in range(199):
    X = closure(day, 0)
    cases_0.append(X)
for day in range(199):
    X = closure(day, 1)
    cases_1.append(X)
for day in range(199):
    X = closure(day, 2)
    cases_2.append(X)
for day in range(199):
    X = closure(day, 3)
    cases_3.append(X)
for day in range(199):
    X = closure(day, 4)
    cases_4.append(X)
for day in range(199):
    X = closure(day, 5)
    cases_5.append(X)
for day in range(199):
    X = closure(day, 6)
    cases_6.append(X)
for day in range(199):
    X = closure(day, 7)
    cases_7.append(X)
for day in range(199):
    X = closure(day, 0)
    cases_8.append(X)
for day in range(199):
    X = closure(day, 0)
    cases_9.append(X)
for day in range(199):
    X = closure(day, 0)
    cases_10.append(X)
for day in range(199):
    X = closure(day, 0)
    cases_11.append(X)
for day in range(199):
    X = closure(day, 0)
    cases_12.append(X)
for day in range(199):
    X = closure(day, 0)
    cases_13.append(X)
for day in range(199):
    X = closure(day, 0)
    cases_14.append(X)
for day in range(199):
    X = closure(day, 0)
    cases_15.append(X)
for day in range(199):
    X = closure(day, 0)
    cases_16.append(X)
for day in range(199):
    X = closure(day, 0)
    cases_17.append(X)
with open('Chongqing_model.json','w') as file_object:
    json.dump(cases_0, file_object)
with open('Shenzhen_model.json','w') as file_object:
    json.dump(cases_1, file_object)
with open('Beijing_model.json','w') as file_object:
    json.dump(cases_2, file_object)
with open('Guangzhou_model.json','w') as file_object:
    json.dump(cases_3, file_object)
with open('Shanghai_model.json','w') as file_object:
    json.dump(cases_4, file_object)
with open('Changsha_model.json','w') as file_object:
    json.dump(cases_5, file_object)
with open('Hefei_model.json','w') as file_object:
    json.dump(cases_6, file_object)
with open('Hangzhou_model.json','w') as file_object:
    json.dump(cases_7, file_object)
with open('Zhengzhou_model.json','w') as file_object:
    json.dump(cases_8, file_object)
with open('Chengdu_model.json','w') as file_object:
    json.dump(cases_9, file_object)
with open('Xiaogan_model.json','w') as file_object:
    json.dump(cases_10, file_object)
with open('Huanggang_model.json','w') as file_object:
    json.dump(cases_11, file_object)
with open('Xiangyang_model.json','w') as file_object:
    json.dump(cases_12, file_object)
with open('Suizhou_model.json','w') as file_object:
    json.dump(cases_13, file_object)
with open('Yichang_model.json','w') as file_object:
    json.dump(cases_14, file_object)
with open('Jingzhou_model.json','w') as file_object:
    json.dump(cases_15, file_object)
with open('Ezhou_model.json','w') as file_object:
    json.dump(cases_16, file_object)
with open('China_model.json', 'w') as file_object:
    json.dump(cases_17, file_object)
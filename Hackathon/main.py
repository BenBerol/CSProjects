import tkinter as tk
from Data import Data
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import numpy as np
import json

def load_data():
    try:
        with open('data.json', 'r') as f:
            loaded_data = json.load(f)
            data = []
            for x in loaded_data:
                data.append(Data.from_dict(x))
    except FileNotFoundError:
        data = []
    return data

def addData(data, newData):
    data.append(newData.to_dict())
    try: 
        with open('data.json', 'w') as f:
            json.dump(data, f)
    except FileNotFoundError:
        print("File not found")
    return data

def submit():
    entries = [entry1, entry2, entry3, entry4, entry5, entry6, entry7]
    if all(entry.get() for entry in entries):
        new_data = Data(*[entry.get() for entry in entries])
        data = load_data()
        data = addData(data, new_data)
        label.config(text="Data submitted.")
    else:
        label.config(text="Please fill in all entries.")


def fitData():
    data = load_data()
    X = []
    y = []
    for x in data:
        X.append([float(x.medianIncome), float(x.medianHousePrice), float(x.interestRates), float(x.population), float(x.unemploymentRate)])
        y.append(float(x.hai)) 

    X = np.array(X)
    y = np.array(y)

    reg = LinearRegression().fit(X, y)

    print('Coefficients: \n', reg.coef_)
    print('Intercept: \n', reg.intercept_)

    label2.config(text="Coefficients: " + str(reg.coef_) + "\nIntercept: " + str(reg.intercept_))

    return reg

def solve():
    entries = [entry3, entry4, entry5, entry6, entry7]
    if all(entry.get() for entry in entries):
        reg = fitData()
        X = np.array([float(entry.get()) for entry in entries])

        X = X.reshape(1, -1)

        prediction = reg.predict(X)
        label.config(text="Predicted HAI: " + str(prediction))
    else:
        label.config(text="Please fill in all entries.")

window = tk.Tk()

title_label = tk.Label(window, text="Linear Regression Modelling for Housing Affordability Index", font=("Arial", 34))
title_label.pack()

blank_label = tk.Label(window, text="")
blank_label.pack()

label = tk.Label(window, text="Enter your input:")
label.pack()

entry1_label = tk.Label(window, text="Date:")
entry1_label.pack()
entry1 = tk.Entry(window)
entry1.pack()

entry2_label = tk.Label(window, text="HAI:")
entry2_label.pack()
entry2 = tk.Entry(window)
entry2.pack()

entry3_label = tk.Label(window, text="Median Income:")
entry3_label.pack()
entry3 = tk.Entry(window)
entry3.pack()

entry4_label = tk.Label(window, text="Median House Price:")
entry4_label.pack()
entry4 = tk.Entry(window)
entry4.pack()

entry5_label = tk.Label(window, text="Interest Rates:")
entry5_label.pack()
entry5 = tk.Entry(window)
entry5.pack()

entry6_label = tk.Label(window, text="Population (Thousands):")
entry6_label.pack()
entry6 = tk.Entry(window)
entry6.pack()

entry7_label = tk.Label(window, text="Unemployment Rate:")
entry7_label.pack()
entry7 = tk.Entry(window)
entry7.pack()

button = tk.Button(window, text="Submit Data", command=submit)
button.pack()

button3 = tk.Button(window, text="Train Off Data", command=fitData)
button3.pack()

button2 = tk.Button(window, text="Solve for HAI", command=solve)
button2.pack()

button4 = tk.Button(window, text="Quit", command=window.quit)
button4.pack()

label2 = tk.Label(window, text="")
label2.pack()
window.attributes('-fullscreen', True)  # Make the window full screen



window.mainloop()

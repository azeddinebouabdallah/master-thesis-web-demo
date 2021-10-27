from datetime import date
from flask import Flask
from flask import jsonify
from flask_restful import Api, Resource
from flask_cors import CORS

import numpy as np
import pickle5 as pickle
import random
import pandas as pd
import json

app = Flask(__name__)
api = Api(app)

cors = CORS(app, resources={r"/*": {"origins": "*"}})

class Prediction(Resource):
    def get(self, date, price):
        randI = random.randint(1, 10)
        print(randI)
        with open("./output/data_predict_{}.pkl".format(randI), 'rb') as f:
            prediction = pickle.load(f)
        with open("./real/data_real_{}.pkl".format(randI), 'rb') as f:
            real = pickle.load(f)
        with open("./dates/dates.pkl", 'rb') as f:
            dates = pickle.load(f)

        dateIndexes = np.where(dates == date)

        if (len(dateIndexes) == 0) :
            return {
                "Error": "No date"
            }
        else:
            index = dateIndexes[0]
            predictedPrice = prediction[index][0][0]
            realPrice = real[index][0][0]

            yesterdayPrice = real[index-1][0][0]
            
            realDiffPercentage = (realPrice - yesterdayPrice) / yesterdayPrice
            predictedDiffPercentage = ( predictedPrice- yesterdayPrice) / yesterdayPrice
            

            realBenifit = (float(price) * (realDiffPercentage))/100
            predictedBenifit = (float(price) * (predictedDiffPercentage))/100

            realTrend = "up" if (realPrice - yesterdayPrice) > 0 else "down"
            predictedTrend = "up" if (predictedPrice - yesterdayPrice) > 0 else "down"

            return {
                "date": str(date),
                "invested_price": price,
                "yesterday_price": "{:.2f}".format(yesterdayPrice),
                "predicted_price": "{:.2f}".format(predictedPrice),
                "real_price": "{:.2f}".format(realPrice),
                "predicted_trend": predictedTrend,
                "real_trend": realTrend,
                "predicted_benifit": "{:.4f}".format(predictedBenifit),
                "real_benifit": "{:.4f}".format(realBenifit),
                "predicted_percentage_increase": "{:.4f}".format(predictedDiffPercentage),
                "real_percentage_increase": "{:.4f}".format(realDiffPercentage),
            }

class ChartData(Resource):

    def get(self, date):
        df = pd.read_csv("./dataframe/data.csv")

        with open("./dates/dates.pkl", 'rb') as f:
            dates = pickle.load(f)

        dateIndex = np.where(dates == date)[0][0]

        ranges = dates[dateIndex-11:dateIndex+11]
        openPrices = df.iloc[dateIndex-11:dateIndex+11, 1].values
        closePrices = df.iloc[dateIndex-11:dateIndex+11, 2].values
        lowPrices = df.iloc[dateIndex-11:dateIndex+11, 3].values
        highPrices = df.iloc[dateIndex-11:dateIndex+11, 4].values
        
        header = np.array(['day', 'Price', 'b', 'c', 'd'])
        chartData = np.concatenate((ranges.reshape(22, 1), lowPrices.reshape(22, 1), openPrices.reshape(22, 1), closePrices.reshape(22, 1), highPrices.reshape(22, 1)), axis=1)
        chartData = np.vstack((header, chartData)).tolist()
        return jsonify(data = chartData)
        

api.add_resource(Prediction, "/prediction/<string:date>/<string:price>")
api.add_resource(ChartData, "/data/<string:date>")

if __name__ == "__main__":
    # change this to False in production.
    app.run(host='0.0.0.0', debug=True)
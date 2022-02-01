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
        with open("./output/adaboostlstmall.pkl".format(randI), 'rb') as f:
            prediction = pickle.load(f)
        with open("./output/data_predict_model_1.pkl", 'rb') as f:
            prediction_model_1 = pickle.load(f)
        with open("./output/data_predict_model_2.pkl", 'rb') as f:
            prediction_model_2 = pickle.load(f)
        with open("./real/data_real_{}.pkl".format(randI), 'rb') as f:
            real = pickle.load(f)
        with open("./dates/dates.pkl", 'rb') as f:
            dates = pickle.load(f)

        dateIndexes = np.where(dates == date) 

        if (len(dateIndexes) == 0):
            return {
                "Error": "No date"
            }
        else:
            index = dateIndexes[0] + 1
            predictedPrice = prediction[index][0][0]
            realPrice = real[index][0][0]
            predictedPrice_model_1 = prediction_model_1[index][0][0]
            predictedPrice_model_2 = prediction_model_2[index][0][0]


            yesterdayPrice = real[index-1][0][0]
            
            # today's price * 100 / yesterday's price = new percentage
            realDiffPercentage = ((realPrice * 100) / yesterdayPrice) - 100 
            #realDiffPercentage = (realPrice - yesterdayPrice) / yesterdayPrice
            predictedDiffPercentage = ((predictedPrice * 100) / yesterdayPrice) - 100
            #predictedDiffPercentage = ( predictedPrice- yesterdayPrice) / yesterdayPrice
            

            realBenifit = (float(price) * (realDiffPercentage))/100
            predictedBenifit = (float(price) * (predictedDiffPercentage))/100

            realTrend = "up" if (realPrice - yesterdayPrice) > 0 else "down"
            predictedTrend = "up" if (predictedPrice - yesterdayPrice) > 0 else "down"


            ## Model 2
            realDiffPercentage_model_1 = ((realPrice * 100) / yesterdayPrice) - 100 
            #realDiffPercentage = (realPrice - yesterdayPrice) / yesterdayPrice
            predictedDiffPercentage_model_1 = ((predictedPrice_model_1 * 100) / yesterdayPrice) - 100
            #predictedDiffPercentage = ( predictedPrice- yesterdayPrice) / yesterdayPrice
            

            realBenifit_model_1 = (float(price) * (realDiffPercentage_model_1))/100
            predictedBenifit_model_1 = (float(price) * (predictedDiffPercentage_model_1))/100

            realTrend_model_1 = "up" if (realPrice - yesterdayPrice) > 0 else "down"
            predictedTrend_model_1 = "up" if (predictedPrice_model_1 - yesterdayPrice) > 0 else "down"

            ## Model 3
            realDiffPercentage_model_2 = ((realPrice * 100) / yesterdayPrice) - 100 
            #realDiffPercentage = (realPrice - yesterdayPrice) / yesterdayPrice
            predictedDiffPercentage_model_2 = ((predictedPrice_model_2 * 100) / yesterdayPrice) - 100
            #predictedDiffPercentage = ( predictedPrice- yesterdayPrice) / yesterdayPrice
            

            realBenifit_model_2 = (float(price) * (realDiffPercentage_model_2))/100
            predictedBenifit_model_2 = (float(price) * (predictedDiffPercentage_model_2))/100

            realTrend_model_2 = "up" if (realPrice - yesterdayPrice) > 0 else "down"
            predictedTrend_model_2 = "up" if (predictedPrice_model_2 - yesterdayPrice) > 0 else "down"

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
                "predicted_price_model2": "{:.2f}".format(predictedPrice_model_1),
                "predicted_trend_model2": predictedTrend_model_1,
                "predicted_benifit_model2": "{:.4f}".format(predictedBenifit_model_1),
                "predicted_percentage_increase_model2": "{:.4f}".format(predictedDiffPercentage_model_1),
                "predicted_price_model3": "{:.2f}".format(predictedPrice_model_2),
                "predicted_trend_model3": predictedTrend_model_2,
                "predicted_benifit_model3": "{:.4f}".format(predictedBenifit_model_2),
                "predicted_percentage_increase_model3": "{:.4f}".format(predictedDiffPercentage_model_2),
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
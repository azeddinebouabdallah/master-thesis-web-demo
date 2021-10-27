from flask import Flask
from flask_restful import Api, Resource
from flask_cors import CORS

import numpy as np
import pickle5 as pickle
import random

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
        
api.add_resource(Prediction, "/prediction/<string:date>/<string:price>")

if __name__ == "__main__":
    # change this to False in production.
    app.run(debug=True)
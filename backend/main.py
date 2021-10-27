from flask import Flask
from flask_restful import Api, Resource

import numpy as np
import pickle5 as pickle


app = Flask(__name__)
api = Api(app)


class Prediction(Resource):
    def get(self, name):
        with open("./output/data_predict_1.pkl", 'rb') as f:
            prediction = pickle.load(f)
        with open("./real/data_real_1.pkl", 'rb') as f:
            real = pickle.load(f)
        with open("./dates/dates.pkl", 'rb') as f:
            dates = pickle.load(f)

        
        
        return {"predictedPrice": name}

api.add_resource(Prediction, "/prediction/<string:name>")

if __name__ == "__main__":
    # change this to False in production.
    app.run(debug=True)
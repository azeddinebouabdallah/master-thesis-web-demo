from flask import Flask
from flask_restful import Api, Resource

app = Flask(__name__)
api = Api(app)

class Prediction(Resource):
    def get(self, name):
        return {"hello": name}

api.add_resource(Prediction, "/prediction/<string:name>")

if __name__ == "__main__":
    # change this to False in production.
    app.run(debug=True)
from pipe import * 
import json
# import pandas as pd
import numpy as np
import joblib
from flask import Flask

# maybe just use its function
# def decode_json(data):
#     return json.loads(data)

# convert this to a run concurrently friendly format later
outlierPredictorPM10 = joblib.load("outlierDetectorPM10.pkl")
outlierPredictorPM2_5 = joblib.load("outlierDetectorPM2_5.pkl")
PM10Model = joblib.load("PM10Model.pkl")
PM2_5Model = joblib.load("PM2_5Model.pkl")

def decode_json(data):
    # print(data.json)
    return json.loads(data.json)["data"]
    # return json.loads(data)["data"]


def is_not_outlier(data):
    isvalid = outlierPredictorPM10.predict(data["PM10"])[0] != 1 and outlierPredictorPM2_5.predict(data["PM2_5"])[0] != 1
    return isvalid

def correct_data(data):
    if(data != None):
        data["PM10"] = PM10Model.predict(np.reshape([data["PM10"], data["PM10_diff"]], (1, -1)))[0]
        data["PM2_5"] = PM2_5Model.predict(np.reshape([data["PM2_5"], data["PM2_5_diff"]], (1, -1)))[0]
    return data

dust_cleaner = Pipe(
    decode_json,
    stream(
        validate(is_not_outlier),
        correct_data,
    )
    
)

from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/", methods=["POST"])
def recieve_data():
    data_response = jsonify(dust_cleaner.open(request))
    # print(data_response.get_data())
    return data_response

app.run(port = 9999)
# make flask server here and feed requests into pipe

# make sure it accepts post requests change nodejs server to send post requests
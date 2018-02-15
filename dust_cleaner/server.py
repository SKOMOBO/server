from pipe import * 
import json
# import pandas as pd
import numpy as np
import joblib
from flask import Flask

# maybe just use its function
# def decode_json(data):
#     return json.loads(data)

load_model = lambda name : joblib.load("pickles/" + name + ".pkl")

# convert this to a run concurrently friendly format later
outlierPredictorPM10 = load_model("outlierDetectorPM10")
outlierPredictorPM2_5 = load_model("outlierDetectorPM2_5")
PM10Model = load_model("PM10Model")
PM2_5Model = load_model("PM2_5Model")

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

# consider load balancing here to speed things up, will chew through more resources though 
# add a thread limiter

# try progress bar first cus its good to have, then do parralisation later, means I won't need thread
# limiter cus I can chunk it on the client side
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
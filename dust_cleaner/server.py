from __future__ import print_function
from pipe import * 
import numpy as np
from server_lib import *
import sys

def check_value(pm, value):
    if(pm == "10"):
        return outlierPredictorPM10.predict(value)[0] != 1
    elif(pm == "2.5"):
        return outlierPredictorPM2_5.predict(value)[0] != 1

def is_not_outlier(data):
    return check_value("10", data["PM10"]) and check_value("2.5", data["PM2_5"])

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
    validate(is_not_outlier),
    correct_data
)

from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/", methods=["POST"])
def recieve_data():
    data_response = jsonify(dust_cleaner.open(request))
    return data_response

app.run(port = 9999, debug = True)
# make flask server here and feed requests into pipe

# make sure it accepts post requests change nodejs server to send post requests
from pipe import * 
import json
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
    return json.loads(data)["data"]


def is_not_outlier(data):
    print(data)
    # outlierPredictorPM10.predict(data["PM10"])[0] != 1 and outlierPredictorPM2_5.predict(data["PM2_5"])[0] != 1

dust_cleaner = Pipe(
    decode_json,
    stream(
        validate(is_not_outlier),
        correct_data,
    )
    
)

# make flask server here and feed requests into pipe

# make sure it accepts post requests change nodejs server to send post requests
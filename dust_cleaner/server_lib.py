import joblib
import json

load_model = lambda name : joblib.load("./dust_cleaner/pickles/" + name + ".pkl")

# convert this to a run concurrently friendly format later
outlierPredictorPM10 = load_model("outlierDetectorPM10")
outlierPredictorPM2_5 = load_model("outlierDetectorPM2_5")
PM10Model = load_model("PM10Model")
PM2_5Model = load_model("PM2_5Model")

def decode_json(data):
    return json.loads(data.json)["data"]
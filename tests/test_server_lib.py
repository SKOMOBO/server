from dust_cleaner.server_lib import *

def test_models_defined():
    assert PM10Model != None
    assert PM2_5Model != None
    assert outlierPredictorPM10 != None
    assert outlierPredictorPM2_5 != None

class fake_data:
    json = {'data': {'Dust1':232232, 'Dust2_5':232323}}

def test_decodes_json():
    data = fake_data()

    data.json = str(data.json)
    assert decode_json(data) == fake_data().json
import SocketServer
import json
import joblib

outlierPredictorPM10 = joblib.load("outlierDetectorPM10.pkl")
outlierPredictorPM2_5 = joblib.load("outlierDetectorPM2_5.pkl")
PM10Model = joblib.load("PM10Model.pkl")
PM2_5Model = joblib.load("PM2_5Model.pkl")

class MyTCPHandler(SocketServer.BaseRequestHandler):
    """
    The request handler class for our server.

    It is instantiated once per connection to the server, and must
    override the handle() method to implement communication to the
    client.
    """

    # rewrite this as a pipe and use flask

    def handle(self):
        # self.request is the TCP socket connected to the client
        request = self.request.recv().strip()
        print(request)
        self.data = json.loads(request)
        print(self.data)

        results = []
        for item in self.data:
            # if it is not a outlier make a prediction
            if(outlierPredictorPM10.predict(item["PM10"])[0] == 1 and outlierPredictorPM2_5.predict(item["PM2_5"])[0] == 1):
                result = {}
                result["PM10"] = PM10Model.predict([[item["PM10"], item["PM10_diff"]]]).tolist()
                result["PM2_5"] = PM2_5Model.predict([[item["PM2_5"], item["PM2_5_diff"]]]).tolist()
                results.append(result)
            else:
                result = None

        self.request.sendall(json.dumps(results))

# Create the server, binding to localhost on port 9999

SocketServer.TCPServer(("localhost", 9999), MyTCPHandler).serve_forever()
# Activate the server; this will keep running until you
# interrupt the program with Ctrl-C

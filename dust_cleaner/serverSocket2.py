import SocketServer
# import msgpack
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

    def handle(self):
        # self.request is the TCP socket connected to the client
        self.data = json.loads(self.request.recv(1024).strip())
        # self.data = msgpack.unpack(self.request.recv(1024).strip())
        # self.data 
        # self.data = msgpack.unpack(self.data)

        # if it is not a outlier make a prediction
        if(outlierPredictorPM10.predict(self.data["PM10"])[0] == 1 and outlierPredictorPM2_5.predict(self.data["PM2_5"])[0] == 1):
            result = {}
            result["PM10"] = PM10Model.predict([[self.data["PM10"], self.data["PM10_diff"]]]).tolist()
            result["PM2_5"] = PM2_5Model.predict([[self.data["PM2_5"], self.data["PM2_5_diff"]]]).tolist()
        else:
            result = None

        # make predictions
        # print "{} wrote:".format(self.client_address[0])
        # print self.data
        # just send back the same data, but upper-cased
        # self.request.sendall(self.data.upper())
        self.request.sendall(json.dumps(result))
        # self.request.sendall(msgpack.pack(result))

# if __name__ == "__main__":
    # HOST, PORT = "localhost", 9999

# Create the server, binding to localhost on port 9999
# server = SocketServer.TCPServer(("localhost", 9999), MyTCPHandler)

SocketServer.TCPServer(("localhost", 9999), MyTCPHandler).serve_forever()
# Activate the server; this will keep running until you
# interrupt the program with Ctrl-C
# server.serve_forever()
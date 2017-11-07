package;
import js.node.net.Socket;
import haxe.Json;

// rewrite this so that it becomes function call instead

@:keep @:expose
class DustCleanerClient {
    private var socket = new Socket();
    public var result: Any;
    public function new(){}

    private var prev_PM10:Float = 0.0;
    private  var prev_PM2_5:Float= 0.0;

    public function prep_data(pm10:Float, pm2_5:Float):Any{
        pm10 = pm10 / 1000;
        pm2_5 = pm2_5 / 1000;
                
        var result = {"PM10": pm10, "PM2_5": pm2_5, "PM10_diff": pm10 - prev_PM10, "PM2_5_diff": pm2_5 - prev_PM2_5};
        prev_PM10 = pm10;
        prev_PM2_5 = pm2_5;
        return result;
    }

    public function clean(pm10:Float, pm2_5:Float){ 
        trace(Socket);
        socket.connect(9999, function(){
            var data = prep_data(pm10, pm2_5);
            socket.write(Json.stringify(data));
        });

        socket.on('data', function(data){
            result = Json.parse(data.toString('utf8'));
        });
    }
}
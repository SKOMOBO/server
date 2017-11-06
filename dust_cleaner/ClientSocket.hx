package;
import js.node.net.Socket;
import haxe.Json;

// rewrite this so that it becomes function call instead


@:keep @:expose
class ClientSocket {
    private var socket = new Socket();
    public var result: Any;
    public function new(){}

    public function clean(data){
        // var socket =  
        socket.connect(9999, 'localhost', function(){
            // var data = {'PM10': 1, 'PM10_diff': 1,'PM2_5': 1, 'PM2_5_diff': 1 };
            socket.write(Json.stringify(data));
        });

        socket.on('data', function(data){
            result = Json.parse(data.toString('utf8'));

            // var result =Json.parse(data.toString('utf8'));
             
            // if(result == null){
            //     trace("Outlier, exclude it!");
            // }else{
            //     // trace(result);
            //     return result;
            // }
        });
    }
}
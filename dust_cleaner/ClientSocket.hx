package;
import js.node.net.Socket;
import haxe.Json;

class ClientSocket {
    static function main() {
        var socket =  new Socket();
        socket.connect(9999, 'localhost', function(){
            var data = {'PM10': 1, 'PM10_diff': 1,'PM2_5': 1, 'PM2_5_diff': 1 };
            socket.write(Json.stringify(data));
        });

        socket.on('data', function(data){
            var result = Json.parse(data.toString('utf8'));
            
            if(result == null){
                trace("Outlier, exclude it!");
            }else{
                trace(result);
            }
            
        });
    }
}
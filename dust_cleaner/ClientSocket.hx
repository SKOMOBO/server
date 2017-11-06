package;
import js.node.net.Socket;
// import org.msgpack.MsgPack;
import haxe.Json;

class ClientSocket {
    static function main() {
        var socket =  new Socket();
        socket.connect(9999, 'localhost', function(){
            // trace("going to send :)");
            // socket.write("Hi there!");
            // socket.write(MsgPack.encode([1,2,3]));
            // socket.write(MsgPack.encode([[1,2]]));
            // socket.write(Json.stringify([[1,1]]));
            var data = {'PM10': 1, 'PM10_diff': 1,'PM2_5': 1, 'PM2_5_diff': 1 };
            socket.write(Json.stringify(data));
        });

        socket.on('data', function(data){
            // trace(MsgPack.decode(data.toString('utf8')));
            // trace(data.toString('utf8'));
            var result = Json.parse(data.toString('utf8'));
            
            if(result == null){
                trace("Outlier, exclude it!");
            }else{
                trace(result);
            }
            
        });
    }
}
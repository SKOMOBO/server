package;
import js.node.net.Socket;

class ClientSocket {
    static function main() {
        var socket =  new Socket();
        socket.connect(9999, '127.0.0.1', function(){
            socket.write("Hi there!");
        });

        socket.on('data', function(data){
            trace(data.toString('utf8'));
        });
    }
}

import js.node.net.Socket;
class ClientSocket {
    static function main() {
        var socket =  new Socket();
        socket.connect(3000, '127.0.0.1', function(){
            socket.write("Hi there!");
        });
        // var sock = new Socket();
        // var modelHost = new Host("127.0.0.1:3000");
        // sock.bind(modelHost, 2000);
        // modelHost.write("Hi there!");


    }
}

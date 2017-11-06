import sys.net.Host;
import sys.net.Socket;

class ServerSocket {
     static function main() {
        var sock = new Socket();
        // var server = new Host("127.0.0.1");
        var server = new Host("localhost");
        var port = 9999;

        sock.bind(server, port);
        sock.listen(2);
        // sock.connect(server, port);
        while(true){
            sock.accept();
            trace("connected");
            // wait until we get a message
            sock.waitForRead();
            trace("ready!");
        
        // trace(sock.host().host.toString());
            trace(sock.read());

        }
       
    }
}
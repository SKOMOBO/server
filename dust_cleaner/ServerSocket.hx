import sys.net.Host;
import sys.net.Socket;

class ServerSocket {
     static function main() {
        var sock = new Socket();
        var server = new Host("127.0.0.1");
        sock.bind(server, 3000);

        // wait until we get a message
        sock.waitForRead();

        trace(sock.read());
    }
}
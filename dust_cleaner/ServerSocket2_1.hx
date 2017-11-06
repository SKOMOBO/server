// import python.Tuple;

// @:pythonImport("ServerSocket.BaseRequestHandler")
// extern class BaseRequestHandler{
//     private function handle():Void;
// }

// @:pythonImport("ServerSocket.TCPServer")
// extern class TCPServer{
//     public function new(address:Tuple<Int>, handler: BaseRequestHandler);
//     public function serve_forever():Void;
// }

// extern class Socket{
//     public static function recv(ByteLen: Int):String;
// }

// class Handler extends BaseRequestHandler{
//     private data: String;
//     private request: Socket;
// // class ServerSocket2_1{
//     private override function handle():Void{
//         // self.request is the TCP socket connected to the client
//         data = request.recv(1024).strip()
//         // print "{} wrote:".format(self.client_address[0])
//         // print self.data
//         // just send back the same data, but upper-cased
//         request.sendall(self.data.upper())
//     }
// }


// class ServerSocket2_1{
//     public static function main(){
//         TCPServer(new Tuple(["localhost", 9999]), Handler).serve_forever();
//     }
// }
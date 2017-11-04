// package dust_cleaner;

class Client {
  static function display(v) {
    trace(v);
  }
  static function main() {
    var URL = "http://localhost:2000/remoting.py";
    var cnx = haxe.remoting.HttpAsyncConnection.urlConnect(URL);
    cnx.setErrorHandler( function(err) { trace("Error : "+Std.string(err)); } );
    cnx.Server.foo.call([1,2],display);
  }
}
package;

import js.Lib;
import js.node.net.Socket;
/**
 * ...
 * @author Ryan Weyers
 */
class Main 
{
	
	static function main() 
	{
		var socket =  new Socket();
        socket.connect(9999, '127.0.0.1', function(){
            socket.write("Hi there!");
        });

        socket.on('data', function(data){
            trace(data.toString('utf8'));
        });
	}
	
}


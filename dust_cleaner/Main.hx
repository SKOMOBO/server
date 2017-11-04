
import haxe.Http;

// import the depickling library ! there must be no new line after 
// the import macro
@:pythonImport("joblib")
extern class Joblib {
    static function load(filename: String):Model;
}

extern class Model{
    function predict(features:Array<Array<Int>>):Array<Int>;
}

class Main {

    static public function main()
    {
        // import the models from the pickles
        var pm10Model = Joblib.load('PM10Model.pkl');
        var outlierDetectorPM10 = Joblib.load('outlierDetectorPM10.pkl');
        var pm2_5Model = Joblib.load('PM2_5Model.pkl');
        var outlierDetectorPM2_5 = Joblib.load('outlierDetectorPM2_5.pkl');

        var entry = new Http("")
        var dust_vals = [[2, 1]];
        trace(pm10Model.predict(dust_vals)[0]);
    }
}

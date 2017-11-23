//var csv is the CSV file with headers
function csvJSON(csv){
    
      var lines=csv.split("\n");
    
      var result = [];
    
      var headers=lines[0].split(",");
    
      for(var i=1;i<lines.length;i++){
    
          var obj = {};
          var currentline=lines[i].split(",");
    
          for(var j=0;j<headers.length;j++){
              obj[headers[j]] = currentline[j];
          }
    
          result.push(obj);
    
      }
      
      //return result; //JavaScript object
      return JSON.stringify(result); //JSON
    }

    /**
 * this function will correct the dust data using our models
 * @todo finish this function has to return JSON like original with outliers removed
 *       and values adjusted
 * 
 * @export
 * @param {any} data 
 */

 //! rewrite dust cleaner client in typescript for now to fix issue convert haxe later
export function clean_data(pm10, pm2_5){
    
    // let client = new dust_cleaner.DustCleanerClient

    // client.clean(pm10, pm2_5)
    // let data = client.result

    // make thing to talk to python and get responses 

    if(data != undefined){
        data.PM10 = data.PM10[0]
        data.PM2_5 = data.PM2_5[0]
    }
    else{
        data = {}
        // just zero out invalid data for now
        data.PM10 = 0
        data.PM2_5 = 0
    }
    
    // console.log(client.result)
    return data
}

no_box = (id) ->
    return "No box with ID " + id

no_zip = "This will send a zip file with both raspberry pi and arduino data in the near future"

please_send_type = "Please set board type by adding &type= to your URL. \n eg: http://seat-skomobo.massey.ac.nz/get?pass=8888888888&type=arduino"

please_send_id = """Please specify a box ID by adding <b>&id=yourID</b> to the end of your URL <br>
    EG: <b>http://seat-skomobo.massey.ac.nz/get?type=arduino&pass=8888888888&id=0</b><br>
    Please note using this example link only has dummy data"""

# replace with lodash merge later?

module.exports = 
    no_box: no_box
    no_zip: no_zip
    please_send_id: please_send_id
    please_send_type: please_send_type
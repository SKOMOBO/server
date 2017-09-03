export function no_box(resp, id){
    resp.send("No box with ID " + id)
}

export function no_zip(resp){
    resp.send("This will send a zip file with both raspberry pi and arduino data in the near future")
}

export function please_send_type(resp){
    resp.send("Please set board type by adding &type= to your URL. \n eg: http://seat-skomobo.massey.ac.nz/get?pass=8888888888&type=arduino")
}
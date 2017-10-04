import urllib2

import firmware

firmware.main()

while(1):
    # update the version so that it won't always download
    current_version = str(firmware.version)

    try:
        response = urllib2.urlopen('http://172.28.128.1:81/update?v=' + current_version)
        text = response.read()
    
        if(text != "No update available"):
            open("firmware.py", 'w').write(text)
            reload(firmware)

            # now restart main script again
            firmware.main()
        response.close()
    except Exception:
        print("Server connection closed")
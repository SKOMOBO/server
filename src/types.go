package main

import (
	"time"
)

type SKOMOBO struct {
	ID           int       // primary key in the Mariadb database
	BoxID        string    // the actual ID we send in a the data from the boxes
	TimeReceived time.Time // the Date and time the data was received FROM the unit BY THE DATABASE
	TimeSent     time.Time // the date and time recorded on the sensor package before sending to the server
	PM1          float64   // The smallest granularity dust reading
	PM25         float64   // The middlemost dust granularity ie PM2.5
	PM10         float64   // The largest granularity dust reading
	PIR          bool      // Whether or not motion was detected in the room during the sensors measurement
	Temp         float64   // The temperature of the room
	Humidity     float64   // The humidity of the room
	CO2          float64   // The amount of CO2 in the room
}

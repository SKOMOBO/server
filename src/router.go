package main

import "github.com/grog"

func ping(w grog.Writer, r grog.Request) {
	w.Send("I am still alive!")
}

func dash(w grog.Writer, r grog.Request) {
	w.Send("A awesome dashboard is coming here soon stay tuned.")
}

func get(w grog.Writer, r grog.Request) {
	// sends data back as CSV by default, can specify JSON as well in format query
}

func exists(w grog.Writer, r grog.Request) {

}

func latest(w grog.Writer, r grog.Request) {

}

func processor(w grog.Writer, r grog.Request) {

}

func getWindow(w grog.Writer, r grog.Request) {

}

// all the above except for the first two at the top are password protected

// POST request
func windowMoved(w grog.Writer, r grog.Request) {

}

// get data on index route stores as CSV for the Arduino. Could change for proxy
// it sends its data as a underscore seperated packet in the URL not as a query paramater

package main

import "github.com/grog"

func ping(w grog.Writer, r grog.Request) {
	w.Send("I am still alive!")
}

func dash(w grog.Writer, r grog.Request) {
	w.Send("A awesome dashboard is coming here soon stay tuned.")
}

package main

import (
	"log"
	"net/http"
	_ "net/http/pprof"

	pprof "net/http/pprof"

	"github.com/julienschmidt/httprouter"
)

func main() {

	r := httprouter.New()

	g := NewGrogRouter(r)

	// pprof for performance debugging
	r.HandlerFunc(http.MethodGet, "/debug/pprof/", pprof.Index)
	r.Handler(http.MethodGet, "/debug/pprof/:item", http.DefaultServeMux)

	g.GET("/ping", ping)

	log.Println("Listening....")

	log.Fatal(http.ListenAndServe(":80", r))

}

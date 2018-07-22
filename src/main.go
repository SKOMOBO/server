package main

import (
	"log"
	"net/http"
	_ "net/http/pprof"

	pprof "net/http/pprof"

	bugsnag "github.com/bugsnag/bugsnag-go"
	"github.com/grog"
	"github.com/julienschmidt/httprouter"
)

// var stage string

func main() {
	// stage = os.Getenv("APP_ENV")

	//todo fix this
	stage := "dev"

	r := httprouter.New()

	g := grog.New(r)

	// todo change this

	if stage == "production" {
		bugsnag.Configure(bugsnag.Configuration{
			APIKey:          "52c4a34213bf48d9efda49265cc43312",
			ProjectPackages: []string{"main", "github.com/TechemyLtd/taxonomy_server/client_api"},
		})
	}

	// prefix := "/taxonomy"

	// pprof for performance debugging
	r.HandlerFunc(http.MethodGet, "/debug/pprof/", pprof.Index)
	r.Handler(http.MethodGet, "/debug/pprof/:item", http.DefaultServeMux)

	g.GET("/ping", ping)
	g.GET("/dash", dash)
	// g.GET(prefix+"/ping", ping)
	// g.GET(prefix+"/general", generalTax)
	// g.GET(prefix+"/filters", sendFilters)

	// r.HandleFunc(prefix+"/store_lookup_list", receiveLookupList).Methods("POST")
	// r.HandleFunc(prefix+"/store_lookup_lists", receiveLookupLists).Methods("POST")

	log.Println("Listening....")
	// todo fix the routes so that when data is null it sends back error saying nothing found

	if stage == "production" {

		log.Fatal(http.ListenAndServe(":80", bugsnag.Handler(r)))
	} else {
		log.Fatal(http.ListenAndServe(":80", r))
	}
}

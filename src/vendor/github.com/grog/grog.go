package grog

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"github.com/julienschmidt/httprouter"
)

// Writer just call the framework  for now cus why not
type Writer struct {
	W http.ResponseWriter
}

// todo port send result, json, error and stuff here, move resolve args to request too

// Request a request to our framework
type Request struct {
	r *http.Request
}

// Router a routing instance to keep routing clean
type Router struct {
	r *httprouter.Router
}

// Handler a handler function
type Handler func(Writer, Request)

// GET a routers get route
func (r Router) GET(path string, handle Handler) {
	r.r.GET(path, Route(handle))
}

// Route http route
func Route(callback func(Writer, Request)) httprouter.Handle {

	return httprouter.Handle(func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
		callback(Writer{W: w}, Request{r: r})
	})

}

// Send writes a string out to the client
func (w Writer) Send(msg string) {
	w.W.Write([]byte(msg))
}

// New create a new grog router
func New(r *httprouter.Router) *Router {
	return &Router{r: r}
}

// SendJSON Sets the JSON header properly and then transmits the JSON object
func (w Writer) SendJSON(obj interface{}) {

	objJSON, jsonERR := json.Marshal(obj)

	if jsonERR != nil {
		log.Fatal(jsonERR)
	}

	w.W.Header().Set("Content-Type", "application/json")
	w.W.Write(objJSON)
}

// JSONResponse is used for a typical API response
type JSONResponse struct {
	Success   bool        `json:"success"`
	Source    string      `json:"source"`
	TimeStamp int64       `json:"time_stamp"`
	Data      interface{} `json:"data"`
}

// Error contains API error content
// todo inline jsonresponse maybe
type Error struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// todo hook bugnsag error reporting in here and xray?
// SendError Sends error as JSON with success set
func (w Writer) SendError(msg string) {
	w.SendJSON(Error{false, msg})
}

// Args returns the URL query parameters with the correct types as a map
func (r Request) Args() map[string]interface{} {
	args := r.r.URL.Query()
	search := make(map[string]interface{})

	isInt, err := regexp.Compile(`[0-9]+`)

	if err != nil {
		fmt.Println(err)
	}

	if len(args) > 0 {
		for key, vals := range args {

			cleanVal := strings.ToLower(vals[0])

			if cleanVal == "true" {
				search[key] = true
			} else if cleanVal == "false" {
				search[key] = false
			} else if isInt.MatchString(vals[0]) {
				i, err := strconv.Atoi(vals[0])

				if err != nil {
					fmt.Println(err)
				} else {
					search[key] = i
				}

			} else {
				// assume its a string
				search[key] = vals[0]
			}
		}
	}

	return search

}

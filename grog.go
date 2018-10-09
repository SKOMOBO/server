package grog

// author Ryan Weyers

import (
	"bytes"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"net/http"
	"reflect"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/Fatih/structs"
	"github.com/julienschmidt/httprouter"
)

// Writer just call the framework  for now cus why not
type Writer struct {
	W http.ResponseWriter
}

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

// SetHeader is a shorthand for setting headers on a response
func (w Writer) SetHeader(key string, value string) {
	w.W.Header().Set(key, value)
}

// GET a routers get route
func (r Router) GET(path string, handle Handler) {
	r.r.GET(path, Route(handle))

	// autohandling OPTIONS as well
	r.r.OPTIONS(path, Route(func(w Writer, _ Request) {
		w.W.Header().Set("Access-Control-Allow-Origin", "*")
		w.W.Header().Set("Access-Control-Allow-Methods", "GET,OPTIONS")
		w.W.Header().Set("Access-Control-Allow-Headers", "Cache-Control,Postman-Token")
		// w.W.Header().Set("Access-Control-Allow-Credentials", "true")

		w.W.WriteHeader(http.StatusOK)
		w.Send("")
	}))
}

// HEAD a routers head route
func (r Router) HEAD(path string, handle Handler) {
	r.r.HEAD(path, Route(handle))
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
		fmt.Println(jsonERR)
	}

	w.W.Header().Set("Content-Type", "application/json")
	w.W.Header().Set("Access-Control-Allow-Origin", "*")

	w.W.Write(objJSON)
	// fmt.Println(w.W.Header().Get("Content-Type"))
}

var matchFirstCap = regexp.MustCompile("(.)([A-Z][a-z]+)")
var matchAllCap = regexp.MustCompile("([a-z0-9])([A-Z])")

// ToSnakeCase converts camelcase to snakecase
// stolen shamelessly from https://gist.github.com/stoewer/fbe273b711e6a06315d19552dd4d33e6
func ToSnakeCase(str string) string {
	snake := matchFirstCap.ReplaceAllString(str, "${1}_${2}")
	snake = matchAllCap.ReplaceAllString(snake, "${1}_${2}")
	return strings.ToLower(snake)
}

// EmulateLastModified allows the HTTP server to pretend that the file is static and that it was only modified once today
// by mimicking the standard HTTP last modified header
func EmulateLastModified() string {
	return time.Now().Format("Mon, 2 Jan 2006 00:00:00 GMT")
}

// SetCSVHeaders puts in HTTP response headers to make it look like a static CSV file
func (w Writer) SetCSVHeaders(fname string) {
	w.W.Header().Set("Content-Type", "text/csv")
	w.W.Header().Set("Content-Disposition", "attachment;filename="+fname)
	w.W.Header().Set("Last-Modified", EmulateLastModified())
}

// SendCSV Sets the CSV header properly and then transmits the CSV file
// based on https://gist.github.com/DavidVaini/690591
func (w Writer) SendCSV(fname string, sep rune, data []interface{}) {
	colStruct := structs.New(data[0])

	// potential bug if the first bug doesn't have the fields declared then it might omit them? assuming golang doesn't fill it in
	cols := colStruct.Names()

	fixedNames := []string{}

	mappedCols := map[string]string{
		"capital_asset":                   "economic_properties_capital_asset",
		"us_securirty_overall_risk_score": "economic_properties_us_securirty_overall_risk_score",
		"commodity":                       "economic_properties_commodity",
		"store_of_value":                  "economic_properties_store_of_value",
	}

	for _, name := range cols {

		fixedName := ToSnakeCase(name)

		if val, ok := mappedCols[fixedName]; ok {
			fixedName = val
		}

		fixedNames = append(fixedNames, fixedName)

	}

	// insert columns at top of file
	table := [][]string{fixedNames}

	for _, item := range data {
		s := structs.New(item)
		vals := s.Map()

		row := []string{}
		for _, col := range cols {

			val := ""

			// handle if the data is a null v3 type
			if reflect.ValueOf(vals[col]).Kind() == reflect.Map {

				nulledVal := vals[col].(map[string]interface{})
				for k := range nulledVal {

					v := nulledVal[k].(map[string]interface{})

					if k == "NullString" {

						if v["Valid"].(bool) {
							val = v["String"].(string)
						} else {
							val = ""
						}
					} else if k == "NullBool" {

						if v["Valid"].(bool) {
							val = fmt.Sprintf("%v", v["Bool"].(bool))
						} else {
							val = ""
						}
					} else if k == "NullInt64" {
						if v["Valid"].(bool) {
							val = fmt.Sprintf("%v", v["Int64"].(int64))
						} else {
							val = ""
						}
					} else if k == "NullFloat64" {
						if v["Valid"].(bool) {
							val = fmt.Sprintf("%v", v["Float64"].(float64))
						} else {
							val = ""
						}
					}
				}

			} else if reflect.ValueOf(vals[col]).Kind() == reflect.Ptr {

				// handle when the data is a pointer instead of a concrete type
				if vals[col] != nil {
					realVal := reflect.Indirect(reflect.ValueOf(vals[col]))
					if realVal.IsValid() {
						val = fmt.Sprintf("%v", realVal)
					}
				}
			} else {

				if vals[col] != nil {

					val = fmt.Sprintf("%v", vals[col])
				} else {
					val = ""
				}
			}

			row = append(row, val)
		}

		table = append(table, row)
	}

	// fmt.Println(table[1])
	buff := &bytes.Buffer{}

	wr := csv.NewWriter(buff)
	wr.Comma = sep

	wrError := wr.WriteAll(table)

	if wrError != nil {
		fmt.Println(wrError)
	}

	// objJSON, jsonERR := json.Marshal(obj)

	// if jsonERR != nil {
	// 	fmt.Println(jsonERR)
	// }
	w.SetCSVHeaders(fname)
	w.W.Write(buff.Bytes())
	// fmt.Println(w.W.Header().Get("Content-Type"))
}

// SendErrorWithStatus Sends the error message with a better HTTP status code than 200
func (w Writer) SendErrorWithStatus(msg string, status int) {
	w.W.Header().Set("Content-Type", "application/json")
	w.W.WriteHeader(status)
	w.SendError(msg)
}

// JSONResponse is used for a typical API response
type JSONResponse struct {
	Success   bool        `json:"success"`
	Source    string      `json:"source"`
	TimeStamp int64       `json:"time_stamp"`
	Data      interface{} `json:"data"`
}

// JSONResponseBasic is used to return a flat JSON response
type JSONResponseBasic struct {
	Success   bool   `json:"success"`
	Source    string `json:"source"`
	TimeStamp int64  `json:"time_stamp"`
	// Data      interface{} `json:",inline"`
}

// NewMeta prepoluates the "header" of a response
func NewMeta(success bool) *JSONResponseBasic {
	return &JSONResponseBasic{
		Success:   success,
		Source:    "BraveNewCoin",
		TimeStamp: time.Now().Unix(),
	}
}

// Error contains API error content
type Error struct {
	*JSONResponseBasic
	Message string `json:"message"`
}

// SendError Sends error as JSON with success set
func (w Writer) SendError(msg string) {
	res := Error{
		JSONResponseBasic: NewMeta(false),
		Message:           msg,
	}

	w.SendJSON(res)
}

// SendResult is a useful helper function that sends out a standard JSON response with the data
func (w Writer) SendResult(data interface{}) {
	result := JSONResponse{
		Success:   true,
		Source:    "BraveNewCoin",
		TimeStamp: time.Now().Unix(),
		Data:      data,
	}
	w.W.Header().Set("Cache-Control", "max-age=180")
	w.SendJSON(result)

}

// SendResultBasic sends a flat JSON response of different types
func (w Writer) SendResultBasic(data interface{}) {

	w.W.Header().Set("Cache-Control", "max-age=180")
	w.SendJSON(data)

}

// Args returns the URL query parameters with the correct types as a map
func (r Request) Args() map[string]interface{} {
	args := r.r.URL.Query()
	search := make(map[string]interface{})

	isInt, err := regexp.Compile(`^[0-9]*$`)

	if err != nil {
		fmt.Println(err)
	}

	if len(args) > 0 {
		for key, vals := range args {

			cleanVal := strings.ToLower(vals[0])

			if cleanVal == "true" && key != "ticker_symbol" && key != "asset_name" {
				search[key] = true
			} else if cleanVal == "false" && key != "ticker_symbol" && key != "asset_name" {
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

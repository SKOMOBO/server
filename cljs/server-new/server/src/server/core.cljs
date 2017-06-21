(ns server.core
  (:require [cljs.nodejs :as nodejs]))

(nodejs/enable-util-print!)

; (defn -main []
;   (println "Hello world!")

(def http
  (nodejs/require "http"))

(defn handler [_ res]
;try return just the string instead?
  (.writeHead res 200 (.js-obj "Content-Type" "text/plain"))
  (.end res "Hello World!\n"))

(defn -main []
  (let [server (.createServer http handler)]
    (.listen server 1337 "127.0.0.1")
    (println "Server running at http://127.0.0.1:1337/")))

(set! *main-cli-fn* -main)

(ns server.core
  (:require [cljs.nodejs :as node]))

(enable-console-print!)

(println "This text is printed from src/server/core.cljs. Go ahead and edit it and see reloading in action. Hello John")

;; define your app data so that it doesn't get over-written on reload

(defonce app-state (atom {:text "Hello world!"}))

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
)

(def http
  (node/require "http"))

(defn handler [_ res]
  (.writeHead res 200 (.strobj {"Content-Type" "text/plain"}))
  (.end res "Hello World!\n"))

(defn start [& _]
  (let [server (.createServer http handler)]
    (.listen server 1337 "127.0.0.1")
    (println "Server running at http://127.0.0.1:1337/")))

(set! *main-cli-fn* start)



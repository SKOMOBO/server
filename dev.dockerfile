# Based on https://medium.com/statuscode/golang-docker-for-development-and-production-ce3ad4e69673
FROM golang:1.10.3-alpine3.8

RUN apk update
RUN apk add git

ARG app_env
ENV APP_ENV $app_env

# this is stupid and really weird but it only runs if it is in a folder called app??
COPY ./src /go/src/github.com/Ulfassar/skomobo_server/app

WORKDIR /go/src/github.com/Ulfassar/skomobo_server/app

RUN go build -o api.exe

CMD if [ ${APP_ENV} = production ]; \
	then \
	./api.exe; \
	else \
	go get github.com/pilu/fresh && \
	fresh; \
	fi

FROM golang:1.10.3-alpine3.8 AS build-env
RUN apk --update add ca-certificates

COPY src /go/src/github.com/TechemyLtd/taxonomy_server/src
WORKDIR /go/src/github.com/TechemyLtd/taxonomy_server/src
# ADD . .
RUN CGO_ENABLED=0 GOOS=linux
RUN CGO_ENABLED=0 GOOS=linux go build -a -o api .

FROM scratch
COPY --from=build-env /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=build-env /go/src/github.com/TechemyLtd/taxonomy_server/src/api /api
ENTRYPOINT ["/api"]

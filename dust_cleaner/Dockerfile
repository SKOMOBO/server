FROM python:2.7.14-alpine

# ADD . ./code
RUN pip install joblib
EXPOSE 9999
WORKDIR /code
RUN ls -a
ENTRYPOINT [ "python", "server.py" ]
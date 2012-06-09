[![Build Status](https://secure.travis-ci.org/robertkowalski/node-shortener.png?branch=master)](http://travis-ci.org/robertkowalski/node-shortener)

Fun project to get used with node and to test travis ci


JSON Api

```bash
curl -i -H "Content-Type: application/json" -H "Accept: application/json" -X POST -d '{"url": "http://kowalski.gd"}' http://localhost:3000/api/
# {"url":"http://kowalski.gd","shorturl":"7","date":"2012-06-09T21:34:14.103Z"}


curl -i -H "Content-Type: application/json" -H "Accept: application/json" -X GET http://localhost:3000/api/MYSHORTURL
# {"url":"http://kowalski.gd","shorturl":"7","date":"2012-06-09T21:34:14.103Z"}


curl -i -H "Content-Type: application/json" -H "Accept: application/json" -X GET http://localhost:3000/api/random
# {"url":"http://google.de","shorturl":"7","date":"2012-06-09T21:34:14.103Z"}

```

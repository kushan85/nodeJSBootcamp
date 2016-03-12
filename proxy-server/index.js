var http = require('http')
var request = require('request')
var argv = require('yargs').argv
var fs = require('fs')
var path = require('path')

var localhost = '127.0.0.1'
var scheme = 'http://'
var port = argv.port || (host === localhost ? 8000 : 80)
var host = argv.host || '127.0.0.1'
var destinationUrl = scheme + host  + ':' + port

var logPath = argv.log && path.join(__dirname, argv.log)
var logStream = logPath ? fs.createWriteStream(logPath) : process.stdout

var echoServer = http.createServer((req, res) => {

	logStream.write("echoServer" + '\n')

	for (var header in req.headers) {
    	res.setHeader(header, req.headers[header])
	}
	logStream.write(JSON.stringify(req.headers) + '\n')

	req.pipe(res)
})

echoServer.listen(8000)
logStream.write('echoServer listening at http://127.0.0.1:8000' + '\n')

var proxyServer = http.createServer((req, res) => {
	logStream.write("proxyServer" + '\n')
	logStream.write(JSON.stringify(req.headers) + '\n')

	var url = destinationUrl
	if(req.headers['x-destination-url']) {
		url = 'http://' + req.headers['x-destination-url']
	}

	var options = {
		url: url + req.url
	}

	req.pipe(request(options)).pipe(res)
})

proxyServer.listen(9000)
logStream.write('proxyServer listening at http://127.0.0.1:9000' + '\n')
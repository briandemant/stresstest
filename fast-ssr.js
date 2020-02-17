const http = require('http')

let server = http.Server((req, res) => {
	res.writeHead(200, {
		'Cache-Control': 'max-age=31536000',
		'Content-type': 'application/json; charset=utf-8',
	})
	res.end(
		JSON.stringify({
			url: req.url,
			now: new Date().toISOString(),
			headers: req.headers,
		})
	)
})
server.listen(2100, () => {
	console.log('server is ready')
})

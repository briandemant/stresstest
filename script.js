import { check } from 'k6'
import http from 'k6/http'

function debug(r) {
	console.log(`status : ${r.status}
	${r.url}
	${r.headers['Request-Id']}
	${r.headers['X-Cloud-Trace-Context']}
	${JSON.stringify(r.headers, null, 2)}`)
}
const isOkAndUncached = {
	'is status 200 or 404': r => r.status === 200 || r.status === 404 || debug(r),
	// 'has ids': r => r.headers["Request-Id"]  && r.headers["X-Cloud-Trace-Context"]|| debug(r) ,
	// 'has content': r =>  r.body.length === 112817 ,
	// 'is uncached': r => r.headers['X-Varnish-Cache'] === 'MISS',
	// 'is uncached': r => r.headers['X-Cache'] === 'MISS' || console.log(JSON.stringify(r.headers)),
}

// const host = "http://127.0.0.1:2100/"
// const host = "https://rw.gg-stage.dk/"
// const host = "https://rw.gg-demo.dk/"
const host = 'https://rw.brde.gg-dev.dk/'

const bypass =   "&refreshcache"
// const bypass =  ""

// const paths = [''].map(path =>
const paths = [
	'',
	'biler/',
	'ude/',
	'sider/sitemap',
	'sider/nemid',
	's/q-bil/?n=60',
	'min-side/annoncer',
	'min-side/profil',
	'not-found',
	'healthz',
].map(path => (path.indexOf('?') !== -1 ? path : path + '?'))

export default function() {
	paths.forEach(path => {
		let res = http.get(`${host}${path}${bypass}`)
		check(res, isOkAndUncached)
	})
}

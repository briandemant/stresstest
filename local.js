import { check } from 'k6'
import http from 'k6/http'

const isOkAndUncached = {
	'is status 200': r => r.status === 200,
	// 'is uncached': r => r.headers['X-Varnish-Cache'] === 'MISS',
	// 'is uncached': r => r.headers['X-Cache'] === 'MISS' || console.log(JSON.stringify(r.headers)),
}

const paths = [''].map(path =>
// const paths = ['', 'biler/', 'ude/', 'sider/nemid', '/s/q-bil/?n=60'].map(path =>
	path.indexOf('?') !== -1 ? path : path + '?'
)
export default function() {
	paths.forEach(path => {
		let res = http.get(`http://127.0.0.1:8080/${path}&refreshcache`)
		check(res, isOkAndUncached)
	})
}

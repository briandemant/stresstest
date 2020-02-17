import { check, sleep } from 'k6'
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
}

// const host = "http://127.0.0.1:2100/"
// const host = "https://rw.gg-stage.dk/"
// const host = "https://rw.gg-demo.dk/"
const host = 'https://rw.brde.gg-dev.dk/'

const bypass = '&refreshcache'
// const bypass =  ""

const { categories, words } = JSON.parse(open('./random-search.json'))

//console.log(data)
// https://www.brde.gg-dev.dk/modules/gg_integration/category/get_first_two_levels?public_key=da05841b-edee-4e3c-985f-4ec6d25e5064
export function setup() {
	// 2. setup code
	console.log('word count', words.length)
	console.log('category count', categories.length)
}

export function teardown(data) {
	// 4. teardown code
	console.log('teardown 1')
	console.log('teardown 2')
}

export default function() {
	let cat = false
	let word = false
	if (Math.random() > 0.3) {
		cat = categories[Math.round(categories.length * Math.random())]
	}

	if (!cat || Math.random() > 0.5) {
		if (cat && cat.words.length > 0 && Math.random() > 0.2) {
			if (Math.random() > 0.3) {
				word = cat.words[Math.round(cat.words.length * Math.random())]
			}
		} else {
			word = words[Math.round(words.length * Math.random())]
		}
	}
	let path = ''
	if (!cat) {
		path = `s/q-${word}/`
	} else {
        if (word) path = `${cat.slug}q-${word}/`
        else path = `${cat.slug}`
	}
	const url = `${host}${path}?${bypass}`

	console.log(JSON.stringify(url))
	// console.log(JSON.stringify({ url, cat, word }))
	let res = http.get(url)
	check(res, isOkAndUncached)
}

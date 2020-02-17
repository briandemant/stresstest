#!/usr/bin/env node
const https = require('https')
const http = require('http')
const util = require('util')
const fs = require('fs')

const write = util.promisify(fs.writeFile)

function get(url) {
	const client = url.match(/^https/) ? https : http
	return new Promise((resolve, reject) => {
		client.get(url, resp => {
			let data = ''
			resp.on('data', chunk => (data += chunk))
			resp.on('end', () => {
				try {
					resolve(JSON.parse(data))
				} catch (e) {
					reject(e)
				}
			})
			resp.on('error', reject)
		})
	})
}

async function doit() {
	try {
		const words = []
		const categories = await get(
			'https://www.brde.gg-dev.dk/modules/gg_integration/category/get_first_two_levels?public_key=da05841b-edee-4e3c-985f-4ec6d25e5064'
		)
			.then(res => {
				const list = []
				Object.keys(res.data).forEach(primId => {
					const info = res.data[primId]
					list.push({ id: primId | 0, slug: info.link.replace(/https:..www.brde.gg-dev.dk./, '') })
					Object.keys(info.sub_categories).forEach(subId => {
						const subInfo = info.sub_categories[subId]
						list.push({ id: subId | 0, slug: subInfo.link.replace(/https:..www.brde.gg-dev.dk./, '') })
					})
				})
				return list
			})
			.then(list =>
				Promise.all(
					list.map(async cat => {
						cat.words = await get(
							'http://ggcloud1.fynskemedier.dk/gulgratis/gg_popular_searches/show?num_results=20&cat_id=' + cat.id
						).then(wres => wres.result.map(x => JSON.parse(`"${x}"`)))

						cat.words.forEach(w => words.push(w))
						console.log(cat.words)
						return cat
					})
				)
			)

		write(
			'random-search.json',
			JSON.stringify(
				{
					categories,
					words,
				},
				null,
				2
			)
		)
	} catch (x) {
		console.log('x', x)
	}
}

doit()

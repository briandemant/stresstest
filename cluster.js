const cluster = require("cluster")
const os = require("os")

console.log("I am " + process.pid)


if (cluster.isMaster) {
    console.log("I am master "+process.pid)
    let wrk = cluster.fork()
    console.log("i now have a child " + wrk.process.pid)
      wrk = cluster.fork()
    console.log("i now have a child " + wrk.process.pid)
} else {
	console.log("I am worker "+process.pid)
}
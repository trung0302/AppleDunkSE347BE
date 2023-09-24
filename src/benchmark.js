// var apiBenchmark = require("api-benchmark");
// import Benchmark from "benchmark";
import Benchmark from "api-benchmark";
import fs from "fs";
// const fs = require("fs");

var services = {
    server1: "http://localhost:3001/",
};
var options = {
    minSamples: 100,
};

var routeWithoutCache = { route1: "/api/tin-tuc" };
var routeWithCache = { route1: "/api/tin-tuc/cached" };

Benchmark.measure(
    services,
    routeWithoutCache,
    options,
    function (err, results) {
        Benchmark.getHtml(results, function (error, html) {
            fs.writeFile("no-cache-results.html", html, function (err) {
                if (err) return console.log(err);
            });
        });
    }
);

// Benchmark.measure(services, routeWithCache, options, function (err, results) {
//     Benchmark.getHtml(results, function (error, html) {
//         fs.writeFile("cache-results.html", html, function (err) {
//             if (err) return console.log(err);
//         });
//     });
// });

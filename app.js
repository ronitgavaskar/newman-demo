var newman = require('newman'); // require Newman in your project
var fs = require('fs');

newman.run({
    collection: require('./newman.json'),
    globalVar:[
        { "key":"url", "value":`${process.env.URL}`}
    ],
    reporters: 'cli',
    insecure: true,
    timeout: 180000
}).on('start', function (err, args) {
    console.log('running a collection...');
}).on('done', function(err, summary) {
    summary.run.executions.forEach(exec => {
        const reqName = exec.item.name;
        const requestInfo = JSON.stringify({request: reqName, response: JSON.parse(exec.response.stream)});
        const path = `./${reqName}.json`

        fs.stat(path, function(err, stat) {
            if(err == null) {
                fs.unlinkSync(path);
                fs.writeFile(path, requestInfo, { flag: 'wx' }, function (err) {
                    if (err) throw err;
                    console.log("It's saved!");
                });
            } else if(err.code === 'ENOENT') {
                fs.writeFile(path, requestInfo, { flag: 'wx' }, function (err) {
                    if (err) throw err;
                    console.log("It's saved!");
                });
                //file written successfully
            } else {
                console.log('Some other error: ', err.code);
            }
        });

    });
});

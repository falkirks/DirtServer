process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) process.stdout.write('Console issued: ' + chunk);
});

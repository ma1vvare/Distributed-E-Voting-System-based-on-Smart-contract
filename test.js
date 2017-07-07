
var spawn = require('child_process').spawn,
    py    = spawn('python', ['secretsharing.py']),
    data = 5,
    //data=["A128373696"],
    dataString = '';

py.stdin.write(JSON.stringify(data));
py.stdin.end();
py.stdout.on('data', function(data){
  dataString = data.toString();
  console.log("datastring:"+data);
});
py.stdout.on('end', function(){
  console.log('Sum of numbers=',dataString);
});

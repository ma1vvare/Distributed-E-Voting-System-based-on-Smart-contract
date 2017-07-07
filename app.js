var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var PythonShell = require('python-shell');
var fs=require('fs');
var Web3=require('web3');


var abi=fs.readFileSync('/Users/peter087744982/Desktop/InterBankPayment-etherrum-new/frontend_abi_address/abi_2.js','utf-8');
var address=fs.readFileSync('/Users/peter087744982/Desktop/InterBankPayment-etherrum-new/frontend_abi_address/addr.js','utf-8');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
var eth = web3.eth;

var MyContract = web3.eth.contract(JSON.parse(abi));
var EVoting = MyContract.at(address);

var account = web3.eth.accounts[0];

console.log('Finish Getting Bank2 Instance');
app.use(bodyParser.urlencoded({ extended: false}));

//function run_py_script(callback)
function run_py_script(callback){
  console.log("function start!");
  pyshell.on('message', function(message){
    console.log("message:"+message);
    console.log(typeof(message));
    return callback(message);
    //callback(ret_val.toString());

  });
  pyshell.end(function(err){
     return err;
  });
}
// key generation by executing keyGenerator.py
app.post('/test0', function (req, res) {
  res.setHeader('Connection', 'Transfer-Encoding');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  console.log('initial step')

  var spawn = require('child_process').spawn,
      py    = spawn('python', ['keyGenerator.py']),
      //data = [1,2,3,4,5,6,7,8,9],
      data='',
      dataString = '';


  py.stdout.on('data', function(data){
    console.log("PID : "+data);
    dataString = data;
    res.send(data);
  });
  py.stdin.write(JSON.stringify(data));
  py.stdin.end();
});
// get pid by executing pidGenerator.py
app.post('/test1', function (req, res) {
  res.setHeader('Connection', 'Transfer-Encoding');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  console.log('PID')
  console.log(req.body.ssn)
  var SSN=req.body.ssn
  var spawn = require('child_process').spawn,
      py    = spawn('python', ['pidGenerator.py']),
      //data = [1,2,3,4,5,6,7,8,9],
      data=[SSN],
      dataString = '';
  py.stdout.on('data', function(data){
    console.log("PID : "+data);
    var re=EVoting.setPID(data.toString(),{from:account,gas:"4700000"});
    console.log("Contract PID: "+EVoting.getPID());
    dataString = data;
    res.send(data);
  });
  py.stdin.write(JSON.stringify(data));
  py.stdin.end();

  /*
  myPythonScriptPath='pidGenerator.py';
  var pyshell = new PythonShell(myPythonScriptPath);
  pyshell.on('message', function(message){
    console.log("message:"+message);
    res.send(message);
  });
  pyshell.end(function (err) {
    if (err){
      throw err;
    };
    console.log('finished');

    res.end();
  });*/
});
var PID_array=[];
//get certificate via certGenerator.py
app.post('/test2', function (req, res) {
  res.setHeader('Connection', 'Transfer-Encoding');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  console.log('PID')
  console.log(req.body.pid)
  var PID= req.body.pid;
  PID_array.forEach(function(value){
    if(value.toString()==PID.toString()){
      console.log("您已取過憑證");
      res.send("您已取過憑證");
      py.stdin.end();
      //res.end("double");
      //return next(new Error([error]));
    }
  });
  PID_array.push(PID.toString());
  var spawn = require('child_process').spawn,
      py    = spawn('python', ['certGenerator.py']),
      //data = [1,2,3,4,5,6,7,8,9],
      data=[PID],
      dataString = '';

  py.stdout.on('data', function(data){
    console.log("Cert : "+data);
    dataString = data;
    res.send(data);
  });
  py.stdin.write(JSON.stringify(data));
  py.stdin.end();

});
var Cert_array=[];
app.post('/test3', function (req, res) {
  console.log('test3')
  console.log(req.body.cert)
  console.log(req.body.lamb)

  var Cert=req.body.cert;
  Cert_array.forEach(function(value){
    if(value.toString()==Cert.toString()){
      console.log("您已取過選票簽章");
      res.send("您已取過選票簽章");
      py.stdin.end();
      //res.end("double");
      //return next(new Error([error]));
    }
  });
  Cert_array.push(Cert.toString());
  var spawn = require('child_process').spawn,
      py    = spawn('python', ['ballotsignature.py']),
      //data = [1,2,3,4,5,6,7,8,9],
      data=req.body.lamb,
      dataString = '';
  var fs = require("fs"),
      pkfilename = "./pk.pem",
      skfilename = "./sk.pem",
      pk='',
      sk='';

  var pub=fs.readFileSync(pkfilename);
  pk=pub.toString();
  var priv=fs.readFileSync(skfilename);
  sk=priv.toString();
  pk=pk.replace(/<PublicKey:/,"");
  pk=pk.replace(/>/,"");
  sk=sk.replace(/<PrivateKey:/,"");
  sk=sk.replace(/>/,"");
  //pk=pk.replace(/<PublicKey:/,"");
  //res.send(pub)
  //console.log("pub : "+pub);
  //console.log("priv : "+priv);
  py.stdout.on('data', function(data){
    console.log("Ballot Signature : "+data);
    console.log(pk);
    console.log(sk);
    dataString = data;
    //pub.toString()
    res.send("選票簽章"+"\n"+data+"\n"+"選民公鑰"+pk+"\n"+"選民私鑰"+sk);

  });
  py.stdin.write(JSON.stringify(data));
  py.stdin.end();

});
app.post('/test4', function (req, res) {
  console.log('test4');
  console.log(req.body.pid);
  console.log(req.body.bs);
  console.log(req.body.lamb);
  var spawn = require('child_process').spawn,
      py    = spawn('python', ['secretsharing.py']),
      //data = [1,2,3,4,5,6,7,8,9],
      data=req.body.lamb,
      dataString = '';
  var pid=req.body.pid;
  var bs=req.body.bs;
  //EVoting.setCert(cert,{from:account,gas:"4700000"});
  //var checkCertList=EVoting.getCertList(cert);
  //console.log("checkCertList : ",checkCertList);
  py.stdout.on('data', function(data){
    console.log("Ballot Coordinate : "+data);
    dataString = data;
    //ballotDetails=PID||bs||ss
    var ballotInfo=pid.toString()+","+bs.toString()+"|"+data.toString();
    EVoting.setVotingInfo(ballotInfo,{from:account,gas:"4700000"});
    var result='';
    var i=0;
    while(true){
      if(EVoting.getVotingInfo(i)!=''){
        result+=EVoting.getVotingInfo(i);
        i++;
      }else{
        break;
      }
    }
    console.log("ShowBallotInfo: "+result);

    res.send("選票密文資訊" + "\n" + data);
  });
  py.stdin.write(JSON.stringify(data));
  py.stdin.end();

});
app.post('/test5', function (req, res) {
  console.log('post');
  console.log(req.body.num);
  var result='';
  console.log("result: "+result);
  var queryNum=req.body.num;
  queryNum=parseInt(queryNum);
  console.log("queryNum: "+queryNum);
  if(queryNum==0||queryNum<0){
    res.send("輸入值錯誤");
  }
  else{
    console.log("else condition!");
    for (var i=0;i<queryNum;i++){
      console.log("i : "+i);
      result+=EVoting.getPID(i);
      console.log("ResultChange : "+result);
      result+="\n"
    }
    res.send("已投完票之PID清單" + "\n" + result);
  }
});
//get number of vote
app.post('/test6', function (req, res) {

  var result='';

  console.log("test6!");
  result=EVoting.getNumOfVote();
  console.log("ResultNum : "+result.toString());
  res.send("投票人數" + "\n" + result.toString());

});

//get ballot information
app.post('/test7', function (req, res) {

  var result='';
  var i=0;
  while(true){
    if(EVoting.getVotingInfo(i)!=''){
      result+=EVoting.getVotingInfo(i);
      i++;
    }else{
      break;
    }
  }
  res.send(result);

});
//Openning phase
app.post('/test8', function (req, res) {

  var result='';
  console.log("test8!");
  var raw_info=req.body.raw_data;
  console.log("rawdata : "+raw_info+typeof(raw_info));
  var sp1=raw_info.split("|");
  console.log("split[0] : "+sp1[0]);
  console.log("split[1] : "+sp1[1]);
  console.log("split[2] : "+sp1[2]);
  console.log("Array length: "+sp1.length);
  var cipher=[];
  for(var i=1;i<sp1.length;i++){
    tmp=sp1[i].split('$');
    cipher.push(tmp[0]);
    cipher.push(tmp[1]);
  }
  console.log("cipher[0]: "+cipher[0]);
  console.log("cipher[1]: "+cipher[1]);
  console.log("cipher[2]: "+cipher[2]);
  console.log("cipher[3]: "+cipher[3]);
  //console.log("rawdata : "+raw_info);
  var paillier_cipher=[];
  for(var i=0;i<cipher.length;){
    paillier_cipher.push(cipher[i]);
    i=i+2;
  }
  console.log("paillier_cipher[0] : "+paillier_cipher[0]);
  console.log("paillier_cipher[1] : "+paillier_cipher[1]);
  var spawn = require('child_process').spawn,
      py    = spawn('python', ['recoversecret.py']),
      //data = [1,2,3,4,5,6,7,8,9],
      data=paillier_cipher,
      dataString = '';
  py.stdout.on('data', function(data){
    console.log("Openning : "+data);
    dataString = data;
        //pub.toString()
    res.send(data);

  });
  py.stdin.write(JSON.stringify(data));
  py.stdin.end();
});




app.get('/', function (req, res) { // 網頁上顯示的目錄為/login
   res.sendFile(path.resolve(__dirname+'/public/index.html')); //實際上存放在server上的目錄資料/login.html
})

// viewed at http://localhost:3000
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

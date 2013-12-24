var bc=require('./bc_lib.js').bc;
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '12345678',
  database : 'test'
});
var main=function(){
  var args= bc.getUserInput(process.argv.slice(2,process.argv.length));
if(args.help)
	return fs.readFileSync('help.txt','utf-8');
if(args.err)
	return args.msg;
if(['add','remove','search','list','update','tags'].indexOf(args.modeofOperation)==-1)
	return 'wrong input';
return bc.processUserInput(args,connection);
};
main();
connection.end();

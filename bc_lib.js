bc ={};
exports.bc = bc;
var Table =require('cli-table');
var table = new Table({
    head: ['isbn', 'price', 'author','title','publisher','pages']
  , colWidths: [8, 8, 10, 15, 15]
});

//--------------------------------------------------------------------------------------------------

var book_record_in_object ={};
var convertBookRecordIntoObject=function(book_record_in_string){
	var array_of_book_data = book_record_in_string.split(';');
	book_record_in_object  = {isbn:'',title:'',price:0,author:'',publisher:'',pages:0};
	array_of_book_data.forEach(function(book_info){
	key=book_info.split(':');
		if(key[0].trim() == 'isbn')	 	book_record_in_object.isbn = key[1].trim();
		if(key[0].trim() == 'price') 	book_record_in_object.price = +key[1].trim();
		if(key[0].trim() == 'author')	book_record_in_object.author = key[1].trim();
		if(key[0].trim() == 'title') 	book_record_in_object.title = key[1].trim();
		if(key[0].trim() == 'publisher')book_record_in_object.publisher = key[1].trim();
		if(key[0].trim() == 'pages') 	book_record_in_object.pages = key[1].trim();
	});
	return book_record_in_object;
};

//--------------------------------------------------------------------------------------------------

var getQuery =function(book_record_in_object,connection){
		var Query = 'insert into test.bookcatalog(isbn,price,title,author,publisher,pages) values("'
	+book_record_in_object.isbn+'","'+book_record_in_object.price+'","'+book_record_in_object.title+'","'
	+book_record_in_object.author+'","'+book_record_in_object.publisher+'","'+book_record_in_object.pages+'");';
	return Query;
};

//--------------------------------------------------------------------------------------------------

var addBookIntoCatalog = function(booKToAdd,connection){
	var book_record_in_object= convertBookRecordIntoObject(booKToAdd);
	var Query=getQuery(book_record_in_object);
		connection.query(Query,function(err, res){
		if (err) console.log(err);
		else
			console.log(book_record_in_object.isbn + '   Book has been added');
	});
};

//---------------------------------------------------------------------------------------------------

var displayBookRecord = function(connection){
	connection.query('select * from test.bookcatalog',function(err,rows,fields){
	if(err) throw err;
	rows.forEach(function(record){
		table.push([record.isbn,record.price,record.author,record.title,record.publisher,record.pages]);
		});
	displayBook();
	});
};

//--------------------------------------------------------------------------------------------------

var removeBookFromCatalog = function(isbn,connection){
	connection.query('delete from test.bookcatalog where isbn = "'+isbn+'";',function(err,res){
		if(err) console.log("book not exists");
		else
		console.log("book deleted");
	});
};

var displayBook = function(){
 	console.log(table.toString());
};

//	-----------------------------------------------------------------------------------------------------------

var searchBookFromInventory = function(field,recordToSearch,connection){
	field =field.substr(1,field.length);
	var query = "select * from test.bookcatalog where "+field+" like \"%"+recordToSearch+"%\";";
	connection.query(query,function(err,result){
		if(err) console.log("book record is not present");
		console.log(result);
		result.forEach(function(record){
			table.push([record.isbn,record.price,record.author,record.title,record.publisher,record.pages]);
 		});
 		displayBook();
	});
};

//	-----------------------------------------------------------------------------------------------------------

var searchSpecificBookRecord = function(valueToSearch,connection){
	var query = "Select * from test.bookcatalog where Concat(ISBN,PRICE,AUTHOR,TITLE,PUBLISHER) like \"%"+valueToSearch+"%\";"
	connection.query(query,function(err,result){
	if(err) console.log("book record is not present");
	console.log(record);
		result.forEach(function(record){
			table.push([record.isbn,record.price,record.author,record.title,record.publisher,record.pages]);
 		});
 		displayBook();
	});
};
	

bc.getUserInput=function(args){
var result ={	modeofOperation:false,
				bookDetail:false,
				isbn:false,
				valueToSearch:false
			};

	if(args.length==0){
		result.msg = 'bookcatalog needs arguments';
		result.err=true;
	return result; 
	};
	result.modeofOperation=args[0];
		if(result.modeofOperation.toLowerCase()=='add'){
			if(!args[1]||args[1].indexOf('isbn')==-1){
				result.err=true;
				result.msg='add needs book detail to add'; 
				return result;
			};
			result.bookDetail=args[1];
		};
	if(result.modeofOperation=='remove'&&args[1]!='-isbn'){
		result.err=true;
		result.msg="remove needs isbn option"
		return result;
	};
		if(result.modeofOperation=='remove'&&args[1]=='-isbn'){
			if(!args[2]){
				result.err=true;
				result.msg="remove needs isbn value to remove";
				return result;
			};
		result.isbn=args[2];
		};
		if(result.modeofOperation=='list')
			if(args.length>1){
				result.err=true;
				result.msg='wrong input'; 
				return result;
			};
		result.list;
		if(args.length<3){
			if(result.modeofOperation=='search'){
				if(!args[1]){
					result.err=true;
					result.msg='need value to search';
					return result;
				};
			result.valueToSearch=args[1];
			};
		};
		if(args.length>2 && result.modeofOperation=='search'){
				if(args[1]=='-title'||args[1]=='-isbn'||args[1]=='-author'||args[1]=='-publisher'||args[1]=='-tag'){
					result.field=args[1];
					result.valueToSearch=args[2];
				}
				else{
					result.err=true;
					result.msg='please use (-) with field and give correct field';
					return result;
				};
		};
	return result;
};
bc.processUserInput=function(input,connection){
	if(input.modeofOperation=='add'&& input.bookDetail)
		return addBookIntoCatalog(input.bookDetail,connection);
	if(input.modeofOperation&& input.isbn)
		return removeBookFromCatalog(input.isbn,connection);
	if(input.modeofOperation=='list')
		return displayBookRecord(connection);
	if(input.modeofOperation&&input.field && input.valueToSearch)
		return searchBookFromInventory(input.field,input.valueToSearch,connection);
	if(input.modeofOperation&&input.valueToSearch)
		return searchSpecificBookRecord(input.valueToSearch,connection);
	if(input.modeofOperation=='update'&&input.bookDetail)
		return updateInventory(input.bookDetail,connection);
};
bc.updateBookCatalog = function(connection){
	console.log("coming");
	isbn = "45";
	value = "hello world";
	field = "author";
	var query = 'update test.bookcatalog set '+field+' = "'+value+'" where isbn = "'+isbn+'";';
	console.log(query);
	connection.query(query,function(err,res){
	if(err) throw err;
	console.log(isbn+ " updated");
	});
};

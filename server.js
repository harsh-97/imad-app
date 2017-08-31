var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool
var app = express();

app.use(morgan('combined'));

var config = {
	user: 'postgres',
	database: 'postgres',
	host: 'localhost',
	port: '5432',
	password: 'seth.1'
};

var articles = {
	'article-one' : {
		title : "Article One | Harsh",
		heading : "Article 1",
		content : 
		`<p>
			Welcome to article one. 
			What goes Baaaaa?
		</p>` 
	},

	'article-two' : {
		title : "Article Two | Harsh",
		heading : "Article 2",
		content : 
		`<p>
			Welcome to article two.
			Not mice. But...
		</p>` 
	},

	'article-three' : {
		title : "Article Three | Harsh",
		heading : "Article 3",
		content : 
		`<p>
			Welcome to article three.
			COWS!
		</p>` 
	}
};

function createTemplate (data){
	var title = data.title;
	var heading = data.heading;
	var content = data.content;

	var template = `
		<!doctype html>
	<html>
		<head>
		<meta name="viewport" content="width=device-width, initial-scale=1"/>
			<title>${title}</title>
		
		<link href="/ui/style.css" rel="stylesheet" />
		</head>

		<body>
			<div class="container">
				<div>
					<a href="/">Home</a>
				</div>
				<hr>

				<h3>${heading}</h3>
				<div>
					${content}
				</div>
			</div>
		</body>
	</html>`;
	return(template);
}


app.get('/ui/main.js', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var  pool = new Pool(config);
app.get('/test-db', function(req, res){
	pool.query('select * from test', function(err, result){
		if(err)
		{
			res.status(500).send(err.toString());
		}
		else
		{
			res.send(JSON.stringify(result));
		}
	});
});

cnt = 0;
app.get('/counter', function(req, res){
	cnt = cnt + 1;
	res.send(cnt.toString());
});

app.get('/ui/style.css', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var names =[];
app.get('/submit-name', function(req, res){
	var name = req.query.name;
	names.push(name);
	res.send(JSON.stringify(names));
});

app.get('/:articleName', function(req, res){
	var articleName = req.params.articleName
	res.send(createTemplate(articles[articleName]));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
	console.log(`IMAD course app listening on port ${port}!`);
});

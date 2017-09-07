var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
	secret: "nakku-is-my-gf",
	cookie: { maxage: 1000 * 60 * 60 * 24 * 30 }
}));

var config = {
	user: 'postgres',
	database: 'postgres',
	host: 'localhost',
	port: '5432',
	password: '0000'
};
var pool = new Pool(config);

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

app.get('/ui/style.css', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

cnt = 0;
app.get('/counter', function(req, res){
	cnt = cnt + 1;
	res.send(cnt.toString());
});

var names =[];
app.get('/submit-name', function(req, res){
	var name = req.query.name;
	names.push(name);
	res.send(JSON.stringify(names));
});

app.get('/test-db', function(req, res){
	pool.query('select * from test', function(err, result){
		if(err)
		{
			res.status(500).send(err.toString());
		}
		else
		{
			res.send(JSON.stringify(result.rows));
		}
	});
});

app.get('/articles/:articleName', function(req, res){
	var articleName = req.params.articleName
	pool.query("select * from articles where articlename = $1",  [articleName], function(err, result){
		if(err)
		{
			res.status(500).send(err.toString());
		}
		else
		{
			if(result.rows.length === 0)
			{
				res.status(404).send("Article does not exist!")
			}
			else
			{
				res.send(createTemplate(result.rows[0]));
			}
		}
	});
});

function hash(input, salt)
{
	var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
	return ['pbkdf2', 10000, salt, hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function(req, res){
	var hashedString = hash(req.params.input, 'nakku-is-my-gf');
	res.send(hashedString);
});

app.post('/create-user', function(req, res){
	username = req.body.username;
	password = req.body.password;

	salt = crypto.randomBytes(128).toString('hex');
	hashed = hash(password, salt);

	pool.query('select * from "user" where username = $1', [username], function(err, result){
		if(err)
		{
			res.status(500).send(err.toString());
		}
		else
		{
			if(result.rows.length === 0)
			{
				pool.query('insert into "user" (username, password) values ($1, $2)', [username, hashed], function(err, result){
					if(err)
					{
						res.status(500).send(err.toString());
					}
					else
					{
						res.send("User successfully created: " + username);
					}
				});
			}	
			else
			{
				res.status(403).send("User already exists!");
			}
		}
	});
});

app.post('/login', function(req, res){
	username = req.body.username;
	password = req.body.password;

	pool.query('select * from "user" where username = $1', [username], function(err, result) {
		if(err)
		{
			res.status(500).send(err.toString());
		}
		else
		{
			if(result.rows.length === 0)
			{
				res.status(403).send("Invalid Login Credentials!");
			}
			else
			{
				var pwd = result.rows[0].password;
				var salt = pwd.split('$')[2];
				var hashed = hash(password, salt);
				console.log("****");
				console.log(pwd);
				console.log("****");
				console.log(hashed);
				if (hashed === pwd)
				{
					req.session.auth = {userId: result.rows[0].id};

					res.send("Logged In!");
				}
				else
				{
					res.status(403).send("Invalid Login Credentials!");
				}
			}
		}
	});
});

app.get('/check-login', function(req, res){
	if(req.session && req.session.auth && req.session.auth.userId)
	{
		res.send("You are logged in: " + req.session.auth.userId.toString());
	}
	else
	{
		res.send("Not logged in!");
	}
});

app.get('/logout', function(req, res){
	delete req.session.auth;
	res.send("You have been logged out!");
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80
var port = 2345;
app.listen(port, function () {
	console.log(`IMAD course app listening on port ${port}!`);
});

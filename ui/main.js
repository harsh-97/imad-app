console.log('Loaded!');

//To Move madi!
var img = document.getElementById('madi');
var marginLeft = 0;
function moveRight(){
	if(marginLeft<1000)
	{
		marginLeft = marginLeft + 1;
		img.style.marginLeft = marginLeft + 'px';
	}
};

img.onclick = function(){
	var interval = setInterval(moveRight, 10);
};

//To increment counter
var button = document.getElementById('counter');
button.onclick = function() {
	var req = new XMLHttpRequest();

	req.onreadystatechange = function() {
		if(req.readyState === XMLHttpRequest.DONE)
		{
			if(req.status === 200)
			{
				var cnt = req.responseText;
				var span = document.getElementById('count');
				span.innerHTML = cnt.toString();
			}
		}
	};

	req.open('GET', 'http://localhost:2345/counter', true);
	req.send(null);
};


//To show list of names
var submitBtn = document.getElementById('submit_btn');

submitBtn.onclick = function() {
	var name = document.getElementById('name').value;
	var req = new XMLHttpRequest();

	req.onreadystatechange = function() {
		if(req.readyState === XMLHttpRequest.DONE)
		{
			if(req.status === 200)
			{
					var list=``;
					var names = JSON.parse(req.responseText);
					for (var i=0; i<names.length; i++)
						{
							list =  list + '<li>' + names[i] + '</li>';
						}

					ul = document.getElementById('nameList');
					ul.innerHTML = list;
			}
		}
	};

	req.open('GET', 'http://localhost:2345/submit-name?name=' + name, true);
	req.send(null);
};
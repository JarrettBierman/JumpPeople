var socket;
var p;
var plat;
var others = [];
var plats = [];
var winnerName = "";
var ready = false;
var gameStart = false;

function setup() {
	socket = io.connect("localhost:3000");
	createCanvas(windowWidth, windowHeight);


	plat = new Platform(0, 600, 1000);

	plats[0] = new Platform(0, 0, 200);
	plats[1] = new Platform(0, 0, 200);
	plats[2] = new Platform(0, 0, 200);
	plats[3] = new Platform(0, 0, 200);
	plats[4] = new Platform(0, 0, 200);
	plats[5] = new Platform(0, 0, 200);

	setTimeout(function(){
		
		p = new Player(50, 50, 50, socket.id, prompt("What is your name?"), false);
	
		var data = {
			x: p.x,
			y: p.y,
			s: p.s,
			id: p.id,
			name: p.name,
			ready: p.ready
		};
		socket.emit('start', data);
	
	}, 500);

	//the sent player data
	socket.on('message', function(data){
		others = data;
	});

	//the sent platform data
	socket.on('platforms', function(data){
		for(var i = 0; i < plats.length; i++)
		{
			if(gameStart)
			{
				plats[i].x = data[i].x;
				plats[i].y = data[i].y;
			}
		}	
	});

	socket.on('winner', function(data){
		winnerName = data;
		setTimeout(function(){
			restart();
		}, 3000);
	});


}

function draw() {
	background(20);

	if(gameStart)
	{
		if(p != null){
			p.draw();
			p.move();
			for(var i = 0; i < plats.length; i++)
				p.intersects(plats[i]);
			doServerStuff();
			p.intersects(plat);
		}
		drawOthers();
		
		plat.draw();
		for(var i = 0; i < plats.length; i++)
		{
			plats[i].draw();
		}

		if(winnerName != "")
		{
			fill(255);
			textSize(75);
			textAlign(CENTER)
			text(winnerName + " wins!!!", windowWidth/2, windowHeight/2);
		}
	}
	else if(p != null)
	{
		var readyButton = createButton('Ready Up');
		readyButton.position(100, 100);
		readyButton.style("background-color","red");
		readyButton.style("border","none");
		readyButton.style("color","black");
		readyButton.style("padding","10px 10px");
		readyButton.style("font-size","40px");
		readyButton.style("align", "center");
		readyButton.mousePressed(function(){
			p.ready = true;
			socket.emit('ready', {id: p.id, ready: p.ready});
		});
		
		textSize(100);
		fill(255);
		textAlign(CENTER);
		text("JUMP PEOPLE", windowWidth/2, 100);
		textSize(50);
		for(var i = 0 ; i < others.length; i++)
		{
			fill(255);
			textAlign(LEFT);
			text(others[i].name + "", windowWidth/2, 200 + 50*i);
			if(others[i].ready == true)
			fill('green');
			else
			fill('red')
			ellipse(windowWidth/2 - 50, 190 + 50*i, 30);
		}
		
		socket.on('go', function(data){
			readyButton.remove();
			gameStart = true;
		});
	}
}

function doServerStuff()
{
	if(p.id == null)
		p.id = socket.id;

	var data = {
		x: p.x,
		y: p.y,
		id: p.id,
		name: p.name,
		ready: p.ready
	};
	socket.emit('update', data);

	if(p.dead == true)
	{
		socket.emit('death', p.id);
	}
}

function drawOthers()
{
	fill(255, 255, 0);
	for(var i = 0 ; i < others.length; i++)
	{	
		if(p != null && others[i].id != p.id)
		{
			rect(others[i].x, others[i].y, others[i].s, others[i].s);
			textAlign(CENTER);
			text(others[i].name + "", others[i].x + (others[i].s / 2), others[i].y - 10);
		}
	}
}

function restart()
{
	gameStart = false;
	p.x = 50;
	p.y = 50;
	p.ready = false;
}
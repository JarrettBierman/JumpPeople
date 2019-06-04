var express = require('express');
var socket = require('socket.io');
var players = [];
var inGame = [];
var plats = [];
plats[0] = {x: 0, y: 0};
plats[1] = {x: 233, y: 200};
plats[2] = {x: 466, y: 400};
plats[3] = {x: 699, y: 600};
plats[4] = {x: 932, y: 800};
plats[5] = {x: 1165, y: 700};

function Player(x, y, s, id, name, ready)
{
    this.x = x;
    this.y = y;
    this.s = s;
    this.id = id;
    this.name = name;
    this.ready = ready;
}

//setup
var app = express();
var server = app.listen((process.env.PORT || 3000), '0.0.0.0', function(){
    console.log("listening now.")
});

//static files / middleware setup
app.use(express.static('public'));

//set up the socket
var io = socket(server);                        //we want this socket to work with this server.

setInterval(heartBeat, 10);

function heartBeat()
{
    if(inGame != null)
        console.log("Players: " + players.length + "  InGame: " + inGame.length);

    //remove players who hav left
    for(var i = 0; i < players.length; i++)
    {
        if(personStillThere(players[i].id) == false)
        players.splice(i, 1);
    }

    //give players info back to the client
    io.sockets.emit('message', players);

    //update the plats
    for(var i = 0; i < plats.length; i++)
    {
        plats[i].x -= 4;
        if(plats[i].x <= - 200)
        {
            plats[i].x = 1400;
            plats[i].y = Math.floor(Math.random() * 800);
        }
    }
    //send plats data back to the client
    io.sockets.emit('platforms', plats);

}

io.on('connection', function(socket)        //when a client connects, this code runs
{           
    // console.log("new connection: " + socket.id);

    socket.on('start', function(data){
        var temp = new Player(data.x, data.y, data.s, data.id, data.name, data.ready);
        players.push(temp);
    });

    socket.on


    socket.on('update', function(data){
        var temp;
        for(var i = 0; i < players.length; i++)
        {
            if(socket.id == players[i].id)
                temp = players[i];
        }
        if(temp != null)
        {
            temp.x = data.x;
            temp.y = data.y;
        }
    });

    socket.on('death', function(data){
        if(inGame != null)
        {
            for(var i = 0; i < inGame.length; i++)
            {
                if(data == inGame[i].id)
                {
                    inGame.splice(i, 1);
                    break;
                }
            }
            if(inGame.length == 1)
                io.sockets.emit('winner', inGame[0].name);
        }
    });

    socket.on('ready', function(data){
        for(var i = 0; i < players.length; i++)
        {
            if(players[i].id == data.id)
            {
                players[i].ready = true;
            }
        }

        //send to the clinets to start the game
        if(players.length >= 1 && allPlayersReady())
        {
            //make an array of all of the players in the game to die
            for(var player in players)
                inGame.push(player);
            io.sockets.emit('go', null);
        }

    });
});

function personStillThere(key)
{
    var connected = Object.keys(io.sockets.sockets);
    for (var id of connected)
    {
        if(key == id)
            return true;
    }
    return false;
}

function allPlayersReady()
{
    for(var i = 0; i < players.length; i++)
    {
        if(players[i].ready == false)
            return false;
    }
    return true;
}

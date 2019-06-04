var speed = 4;
var gravity = 0.3;
var spaceDown = false;
var numJumps = 0;

function Player(x, y, s, id, name, ready) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.id = id;
    this.name = name;
    this.dx = 0;
    this.dy = 0;
    this.ready = false;
    this.dead = false;
    this.draw = function () {
        background(20);
        fill(255);
        rect(this.x, this.y, this.s, this.s);
        textAlign(CENTER);
        text(this.name + "", this.x + (this.s/2), this.y - 10);
    };
    this.move = function(){

        //LEFT RIGHT
        if(keyIsDown(37)) //left arrow
        {
            this.dx = -speed;
        }
        else if(keyIsDown(39)) //right arrow
            this.dx = speed;
        else
            this.dx = 0;
        
        //UP DOWN
        this.dy += gravity;
        if(keyIsDown(32) && !spaceDown && numJumps < 2 && !this.dead)
        {
            this.dy = -12;
            spaceDown = true;
            numJumps++;
        }

        this.x += this.dx;
        this.y += this.dy;

        if(this.y >= 900)
        {
            this.dead = true;
            this.y = 900;
        }
    };

    this.intersects = function(plat)
    {
        if(this.x + this.s > plat.x &&
            this.x < plat.x + plat.w &&
            this.y + this.s >= plat.y &&
            this.y + this.s < plat.y + plat.h*2 &&
            this.dy > 0)
                {
                    this.dy = 0;
                    this.y = plat.y - this.s;
                    numJumps = 0;
                }
    }
    

}

function keyReleased()
{
	if(keyCode == 32)
		spaceDown = false;
}


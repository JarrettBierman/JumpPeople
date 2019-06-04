function Platform(x, y, w)
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = 10;

    this.draw = function(){
        fill(0, 0, 180);
        rect(this.x, this.y, this.w, this.h);
    }

    // this.intersects = function(player){
    //     if(player.pos.x + player.s > this.x &&
    //         player.pos.x < this.x + this.w &&
    //         player.pos.y + player.s >= this.y &&
    //         player.pos.y + player.s < this.y + this.h*2 &&
    //         player.dy > 0)
    //             return true;
    //     return false;
    // }
}

// point
function xy(x,y) {
    this.x = x
    this.y = y
}

// point with extra data
function xyd(x,y,d) {
    this.x = x
    this.y = y
    this.d = d
}

function point(i,r,g,b,a,p) {
    this.particle = i
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
    this.a = a || 0;
}

function particle(i, lifet) {
    var c = aleat(generadores.length);
    var gx = generadores[c].x;
    var gy = generadores[c].y;
       
    this.xi = Math.floor(gx + distG*(Math.random()*2-1)*maxcoord);
    this.yi = Math.floor(gy + distG*(Math.random()*2-1)*maxcoord);

    var x = this.xi;
    var y = this.yi;
    if(x < 0) x = 0;
    if(y < 0) y = 0;
    if(x >= maxcoord) x = maxcoord-1;
    if(y >= maxcoord) y = maxcoord-1;

    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.a = 1.0;

    this.i = i;

    this.contorno = [];
    this.size = 0;

    this.tiempoDeVida = lifet
    this.tActual = 0;

    this.tInit = t;
    this.randomm = Math.random();

    this.add(x,y);
   
}

particle.prototype.add = function(x,y) { 
    var pos = x+y*maxcoord;
    if(!occupied[pos]) return;
    var r,g,b;

    // texels en el contorno del punto agregado
    var vals = [
        {'x':x-1,"y":y+1},
        {'x':x,"y":y+1},
        {'x':x+1,"y":y+1},
        {'x':x-1,"y":y},
        {'x':x+1,"y":y},
        {'x':x-1,"y":y-1},
        {'x':x,"y":y-1},
        {'x':x+1,"y":y-1}
    ];

    // Alpha blending?
    var op = occupied[pos];
    var src_a = op.a;
    var alp = this.a*(1-src_a);

    var pos = x+y*maxcoord;

    occupied[pos].particle = this.i;
    occupied[pos].r = this.r;
    occupied[pos].g = this.g;
    occupied[pos].b = this.b;
    occupied[pos].a = this.a;

    var d = Math.sqrt(x*x+y*y);
    var xp = [];
    xp[0] = toSpace(x);
    xp[1] = toSpace(y);
    xp = runge_kutta(xp,factual,dT);
    bestX = vals[0].x;
    bestY = vals[0].y;
    var de = 0;
    deP = this.calculatePriority(bestX,bestY,xp);
    for(var i = 1; i < vals.length; i++) {
        xh = vals[i].x;
        yh = vals[i].y;
        de = this.calculatePriority(xh,yh,xp);
        if(de <deP) {
            deP = de;
            bestX = xh;
            bestY = yh;
        }
        if(Math.random()>(1-randomness)) this.contorno.push(new xyd(xh,yh,de));
    }
    this.contorno.push(new xyd(bestX,bestY,deP));

    this.size = this.size+1

    this.setBorder(x,y);
};


particle.prototype.calculatePriority = function(x,y,xp) {
    
    x2 = xp[0] - toSpace(x);
    y2 = xp[1] - toSpace(y);
    // priorities
    c = x2*x2+y2*y2;
    return c
}

// set the contourn of the particle with this particle ID (i)
particle.prototype.setBorder = function(x,y) {
    //if(this.size > Math.floor(MCA/2)) return;
    sep2 = this.fsize()
    for(var i = -sep2; i < sep2; i++)
        for(var j = -sep2; j < sep2; j++) {
            pos = (x+i)+(y+j)*maxcoord;
            if(pos >= 0 && pos < maxcoord2) occupied2[pos] = this.i;
        }
}

// returns true if it is not possible to avoid other particles
particle.prototype.searchBorder = function(x,y) {
    //alert(this.size)
    //if(this.size > Math.floor(MCA/2)) return false;
    sep2 = this.fsize()
    for(var i = -sep2; i < sep2; i++)
        for(var j = -sep2; j < sep2; j++) {
            pos = (x+i)+(y+j)*maxcoord;
            v = occupied2[pos];
            if(pos >= 0 && pos < maxcoord2 && v && v!=this.i) return true;
        }
    return  false;
}



function compare(a,b){
    if (a.d < b.d)
        return -1;
    if (a.d > b.d)
        return 1;
    return 0;
}

particle.prototype.grow = function() {
    this.tActual++;//=advanceT;    
    var maxim = this.contorno.length
    var h;
    for(h = 0; h < maxim; h++) {
        var cont = this.contorno[h];
        var nx = cont.x;
        var ny = cont.y;
        var pos = nx+ny*maxcoord;
        var o = occupied[pos];
        if(o && !ocupada(pos)) {
            //nx2 = nx-maxcoord/2
            //ny2 = ny-maxcoord/2
            //p = Math.sqrt(nx2*nx2+ny2*ny2);
            // it is more likely that a particle will grow more in the center (for bread)
            //q = Math.sqrt(2)*(maxcoord/2.0)
            //if(Math.random()*1.2 > p/q)
            if(!this.searchBorder(nx,ny)) {
                this.add(nx,ny);
                break;
            }
        }
    }
    this.contorno.splice(0,h);
};

particle.prototype.fsize = function() {
    s = this.size
    if(s > MCA*0.8) return 8
    if(s > MCA*0.6) return 6
    if(s > MCA*0.4) return 4
    if(s < MCA*0.4) return 2
}

particle.prototype.morir = function() {
    sparticles[this.i] = false;
}

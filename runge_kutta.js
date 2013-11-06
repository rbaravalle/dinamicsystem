var dT = 0.05;
var factual = 3;

// Dinamic Systems
var funcs = [function(v) { var x = v[0]; var y = v[1]; return [x*x-y*y+1,2*x*y+1]; },
function(v) { var x = v[0]; var y = v[1]; return [(x*x+y*y), (x*x+y*y)]; },
function(v) { var x = v[0]; var y = v[1]; return [x*(3-x-2*y), y*(2-x-y)]; },
function(v) { var x = v[0]; var y = v[1]; return [x*x*y, x*x - y*y]; },
function(v) { var x = v[0]; var y = v[1]; return [y,-Math.sin(x)]},
function(v) { var x = v[0]; var y = v[1]; return [-x*(Math.pow(Math.E,-y)), -y]}]

// multiply vector with an scalar
function multV(x,e) {
    return [x[0]*e,x[1]*e];
}

// vector sum
function sumarV(x,y) {
    return [x[0]+y[0],x[1]+y[1]]
}

function runge_kutta(x,factual,dT) {
    var res = [];
    var k1 = multV(funcs[factual](x),dT);
    var k2 = multV(funcs[factual](sumarV(x,multV(k1,1/2))),dT);
    var k3 = multV(funcs[factual](sumarV(x,multV(k2,1/2))),dT);
    var k4 = multV(funcs[factual](sumarV(x,k3)),dT);
    var res = sumarV(k1,sumarV(multV(k2,2), sumarV(multV(k3,2), k4)));

    return sumarV(x, multV(res,1/6));
}


// una iteracion del algoritmo
function mover() {

    largoCont = 0;
    var m = [];
    for(var i = 0; i < particles.length; i++) {
       var pi = particles[i];
       if(pi.size > 6*MCA) { pi.morir(); m.push(i); }
       if(pi.repr == 0 && pi.size > Math.floor(MCA/2)) { // it must have sons
        pi.repr = 1
        k = particles.length
        for(var w = 0; w < amountSons; w++){
                d = Math.random()*Math.PI*2
                rr = 5*(Math.sqrt(pi.size/Math.PI))
                var con = pi.contorno[w]
                if(!con) con = pi.contorno[0]
                if(!con) {
                    con = new xyd(pi.xi,pi.yi,0)
                }
                u = con.x+Math.floor(rr*Math.cos(d))
                v = con.y+Math.floor(rr*Math.sin(d))

                particles.push(new particle(k++, MCA,u,v));
                sparticles.push(true); // la particula esta viva            
            }
       }
       else { 
        for(var w = 0; w < pi.fn(); w++)
            pi.grow(randomness); 
        largoCont += pi.contorno.length;
       }
    }

    //for(var i = 0; i < m.length; i++)
    //    particles.splice(m[i],1);
  
}



function dibujarParticulas() {

    // comienzo de la escena
    gl.viewport(0, 0, maxcoord, maxcoord);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [-0.5, -0.5, -1.21]); //-1.2162

    gl.uniform1i(shaderProgram.useTexturesUniform, false);

    setMatrixUniforms();

    var j = 0;

    var cant = 0;

    var vertices = [];
    var colors = [];
    for(var j = 0; j < maxcoord2; j++) {
        if(occupied[j].particle > 0) {
            var p = occupied[j];
            var x = j%maxcoord;
            var y = Math.floor(j*m1);
            
            vertices.push(x*m1,y*m1,0.0);
            colors.push(0,0,0,1.0);
            cant++;
        }
    }
    triangleVertexPositionBuffer = gl.createBuffer();
  	triangleVertexColorBuffer = gl.createBuffer();
    triangleVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors),gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, cant);

    delete vertices;vertices = [];
    delete colors; colors = [];

}

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
    }
    lastTime = timeNow;
}


function tick() {
    if(stop == 1) {
        stop = 0;
        for(var i = 0; i < maxcoord2; i++) delete occupied[i];
        for(var i = 0; i < particles.length; i++) delete particles[i];
        init_variables();
    }

    if(animar) { 
        mover();
        t++;
        if(t%REFRESCO == 0 || t== TIEMPO-1) {
            dibujarParticulas();
        }
        var d2 = new Date();
        var t2 = d2.getTime();
        $('iteracion').innerHTML = t;
        $('contorno').innerHTML = largoCont;
        $('cantPart').innerHTML = particles.length;
        $('tiempoIt').innerHTML = Math.abs(t2-t1)/1000 ;
        $('promedioIt').innerHTML = (1000*(t)/Math.abs(t2-t1)).toFixed(2) ;
        delete d2;
    }
    if(t < TIEMPO-1 && particles.length > 0 && largoCont > 0) requestAnimFrame(tick);
}

function ocupada(i) {
    var o = occupied[i].particle;
    //if (o>= 0 && particles[o] < 50) return false;
    return (o >= 0 && sparticles[o]);
}


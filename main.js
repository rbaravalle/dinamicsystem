var CANT_PARTICLES;
var RANDOM = 0;
var TIEMPO;
var maxcoord = 600;
var maxcoord2 = maxcoord*maxcoord;
var m1 = 1/maxcoord;
var largoCont;
var occupied;
var t = 0;
var tUlt;
var particles;
var sparticles; // binary array with particle states (live or death)

var vertices = [];
var cp = []; // # of particles per size (see below)
var lt = []; // lifetime of particles
var N;
var CT;
var occupied2; // contorns occupied (for self-avoidance)


var tOrig;

var triangleVertexPositionBuffer;
var triangleVertexColorBuffer;
var sceneNormalBuffer;
var scenePositionBuffer;
var sceneIndexBuffer;
var lastTime = 0;
var stop = 0; // recalculate system
var animar = true; // start/stop animation
var distG;
var cantG; // amount of generators

var REFRESCO;

var sembrado;
var muestreo; // establece el intervalo de muestreo de la funcion parametrica

var normals;
var shaderProgram;
var VF, MCA, stMCA, randomness;

var d;
var t1;

// 2D-world limits
var x0 = -3, y0 = -3, x1 = 3, y1 = 3;
var diffX = x1-x0;
var diffY = y1-y0;

var generadores;

var TIEMPO_VIDA;

var gl;
var sep = 2; // separation among particles
var diffBubbles = 10;
var amountSons = 12


function init_particles() { // simulate proving
    particles = [];
    sparticles = [];
    k = 0 // particle counter
    for(var i = 0; i < N; i++)
        for(var j = 0; j < cp[i]; j++) {
            particles.push(new particle(k++, lt[i]));
            sparticles.push(true); // la particula esta viva            
        }

    for(var i = 0; i < particles.length; i++) {
        for(h = 0; h < 4; h++)
            if(Math.random() > 0.9) {
                for(var j = 0; j < diffBubbles; j++)
                    particles[i].grow(1); // free growth
            }
    }
    dibujarParticulas()
    
}


function compute_lifetimes() {
    M = stCA*stCA;

    s = sign();
    // compute lifetimes
    for(var i = 0; i <= N-1; i++) {
        //if(M >= 0) {
            x = aleat(Math.floor(M));
            M = M - x;
            s *=-1;
            lt[i] = Math.floor(s*Math.sqrt(x)) + MCA;
            //alert(lt[i])
        //}
    }

    sum = 0;
    CT2 = CT;
    // calculate amount of particles per lifetime
    for(var i = 0; i <= N - 2; i++) {
        cp[i] = aleat(CT2);
        CT2 -= cp[i];
        sum += cp[i]*lt[i]; 
    }
    cp[N-1] = Math.floor((VF*maxcoord2 - sum)/lt[N-1]);
}


function actualizarValores() {
    TIEMPO = $('tiempo').value;
    TIEMPO_VIDA = $('tiempoVida').value;
    STDEV = parseFloat($('varparticlecolor').value);

    muestreo = $('muestreo').value;
    sembrado = $('sembrado').value;
    distG = parseFloat($('distG').value);

    REFRESCO = $('refresco').value;

    // parameters VF, MCA, stCA
    N = parseFloat($('divisions').value);
    MCA = parseFloat($('mca').value);
    stCA = parseFloat($('stmca').value);
    VF = parseFloat($('vf').value);
    CT = Math.floor(VF*maxcoord2/MCA); // total of particles
    randomness = parseFloat($('randomness').value); // total of particles

    compute_lifetimes();
    
}


function init_variables() {

    actualizarValores();
    cantG = $('cantG').value;

    t = 0;

    occupied = [];
    occupied2 = [];

    for(var i = 0; i < maxcoord2; i++)
        occupied.push({'particle':-1, 'r': 0, 'g': 0, 'b': 0, 'a': 0});

    generadores = [];
    if(sembrado == 0) {
        for(var i = 0; i < cantG; i++) {
            generadores.push({'x':aleat(maxcoord), 'y': aleat(maxcoord)});
        }
    }
    else {
        var step = maxcoord/(cantG);
        for(var i = 0; i <= maxcoord; i+=step)
            for(var j = 0; j <= maxcoord; j+=step) {
                generadores.push({'x':Math.floor(i), 'y': Math.floor(j)});
            }
    }

    normals = [];
    for(var i = 0; i < 792; i++) {
        normals.push(0.0,0.0,0.1);
    }

    tOrig = TIEMPO_VIDA;

    init_particles();

    d = new Date();
    t1 = d.getTime(); 

    tick(); 

}


function webGLStart() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initShaders();

    gl.clearColor(255.0, 255.0, 255.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
}


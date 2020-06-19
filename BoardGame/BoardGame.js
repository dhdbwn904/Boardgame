"use strict";

var canvas;
var gl;
var texSize = 64;

var program;

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];
var order = 0;
var texture;
var typeLoc;
var state = 0;
var xran = 0;
var yran = 0;
var zran = 0;



var texCoord = [  // 주사위 텍스쳐를 저장
    // 1에 해당하는 텍스쳐
	vec2(0, 0),
    vec2(0, 0.25),
    vec2(0.25, 0.25),
    vec2(0.25, 0),
	// 2에 해당하는 텍스쳐
	vec2(0.25, 0),
	vec2(0.25, 0.25),
	vec2(0.5, 0.25),
	vec2(0.5, 0),
	// 3에 해당하는 텍스쳐
	vec2(0.5, 0),
	vec2(0.5, 0.25),
	vec2(0.75, 0.25),
	vec2(0.75, 0),
	// 4에 해당하는 텍스쳐
	vec2(0.75, 0),
	vec2(0.75, 0.25),
	vec2(1, 0.25),
	vec2(1, 0),
	// 5에 해당하는 텍스쳐
	vec2(0, 0.25),
	vec2(0, 0.5),
	vec2(0.25, 0.5),
	vec2(0.25, 0.25),
	// 6에 해당하는 텍스쳐
	vec2(0.25, 0.25),
	vec2(0.25, 0.5),
	vec2(0.5, 0.5),
	vec2(0.5, 0.25)

];

var boardtex = [ // 보드의 텍스쳐

	vec2(0.5, 0.5),
	vec2(0.5, 1),
	vec2(1, 1),
	vec2(1, 0.5),

];

var vertices = [
	// 주사위 좌표
    vec4( -0.25, -0.25,  0.25, 1.0 ),
    vec4( -0.25,  0.25,  0.25, 1.0 ),
    vec4( 0.25,  0.25,  0.25, 1.0 ),
    vec4( 0.25, -0.25,  0.25, 1.0 ),
    vec4( -0.25, -0.25, -0.25, 1.0 ),
    vec4( -0.25,  0.25, -0.25, 1.0 ),
    vec4( 0.25,  0.25, -0.25, 1.0 ),
    vec4( 0.25, -0.25, -0.25, 1.0 ),
	// 보드판 좌표
	vec4( -1.0, -1.0, -0.5, 1.0),
	vec4( -1.0, 1.0, -0.5, 1.0),
	vec4( 1.0, 1.0, -0.5, 1.0),
	vec4( 1.0, -1.0, -0.5, 1.0)

	
];


var dotver = [ // 말의 초기 출발점
    vec4( 0.65, -0.69,  0.0, 1.0 ),
    vec4( 0.71, -0.69,  0.0, 1.0 ),
	vec4( 0.65, -0.75,  0.0, 1.0 ),
	vec4( 0.71, -0.75,  0.0, 1.0 )
];


var vertexColors = [
    vec4( 1.0, 0.7, 1.0, 1.0 ),  // pink
    vec4( 0.8, 0.5, 0.0, 1.0 ),  // brown
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 0.5, 1.0, 1.0 ),  // soft blue
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )  // cyan
];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;
var theta = [80.0 , 80.0 , 80.0];
var moveX = new Array(); // mx에 값을 전달할 변수들
for (var i = 0; i<4; i++) moveX[i] = 0;
var moveY = new Array(); // my에 값을 전달할 변수들
for (var i = 0; i<4; i++) moveY[i] = 0;
var thetaLoc;
var locx = new Array(); // 말의 x축 이동 거리
for (var i = 0; i<4; i++) locx[i] = 0;
var locy = new Array(); // 말의 y축 이동 거리
for (var i = 0; i<4; i++) locy[i] = 0;
var boardorder = new Array();
for (var i = 0; i<4; i++) boardorder[i] = 0;
var player = 0;
var drawp = new Array(); // 말 활성화에 대한 변수들
for (var i = 0; i<4; i++) drawp[i] = 0;
var island = 1;



function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}


function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[6]);
     texCoordsArray.push(texCoord[order + 0]);

     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[6]);
     texCoordsArray.push(texCoord[order + 1]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[6]);
     texCoordsArray.push(texCoord[order + 2]);

     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[6]);
     texCoordsArray.push(texCoord[order + 0]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[6]);
     texCoordsArray.push(texCoord[order + 2]);

     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[6]);
     texCoordsArray.push(texCoord[order + 3]);


	 order = order + 4;

}




function CreateDice()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
	
}



function board() // 보드 생성
{
     pointsArray.push(vertices[8]);
     colorsArray.push(vertexColors[6]);
     texCoordsArray.push(boardtex[0]);

     pointsArray.push(vertices[9]);
     colorsArray.push(vertexColors[6]);
     texCoordsArray.push(boardtex[1]);

     pointsArray.push(vertices[10]);
     colorsArray.push(vertexColors[6]);
     texCoordsArray.push(boardtex[2]);

     pointsArray.push(vertices[8]);
     colorsArray.push(vertexColors[6]);
     texCoordsArray.push(boardtex[0]);

     pointsArray.push(vertices[10]);
     colorsArray.push(vertexColors[6]);
     texCoordsArray.push(boardtex[2]);

     pointsArray.push(vertices[11]);
     colorsArray.push(vertexColors[6]);
     texCoordsArray.push(boardtex[3]);
}



function dot(a, b){

	 
     pointsArray.push(dotver[a]);
     colorsArray.push(vertexColors[b]);
     texCoordsArray.push(boardtex[3]);
	 

}


function rundice()
{
      state = 1;

}




window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
	// uniform 연결
	typeLoc = gl.getUniformLocation(program, "type");
	moveX[0] = gl.getUniformLocation(program, "mx0");
	moveY[0] = gl.getUniformLocation(program, "my0");
	moveX[1] = gl.getUniformLocation(program, "mx1");
	moveY[1] = gl.getUniformLocation(program, "my1");
	moveX[2] = gl.getUniformLocation(program, "mx2");
	moveY[2] = gl.getUniformLocation(program, "my2");
	moveX[3] = gl.getUniformLocation(program, "mx3");
	moveY[3] = gl.getUniformLocation(program, "my3");
	
   
	board();
	CreateDice();
	dot(0,0);
	dot(1,1);
	dot(2,2);
	dot(3,3);





    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.DYNAMIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.DYNAMIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.DYNAMIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    var image = document.getElementById("texImage");

    configureTexture( image );

    thetaLoc = gl.getUniformLocation(program, "theta");

    document.getElementById("Roll the dice").onclick = function(){
	state = 2; // 주사위가 굴러가는 애니메이션을 보여준다.

	setTimeout(rundice, 1000); // 일정 시간 뒤에 state = 1 로 만들어 회전시킬 수는 있지만 정지되어 있는 상태로 만든다.


	 xran = ~~(Math.random()*10); // xran, yran, zran에 난수를 받음
	 yran = ~~(Math.random()*10);
	 zran = ~~(Math.random()*10);


	 for(var i= 1; i<=xran; i++)
	 theta[0] += 90.0; // x방향으로 90도만큼 xran번 회전

	 for(var i= 1; i<=yran; i++)
	 theta[1] += 90.0; // y방향으로 90도만큼 yran번 회전

	 for(var i= 1; i<=zran; i++)
	 theta[2] += 90.0; // z방향으로 90도만큼 zran번 회전

	


	};

	var m = document.getElementById("mymenu");
	m.addEventListener("click", function() {
	switch (m.selectedIndex) {
		case 0:
		player = 0;
		drawp[0] = 1;
		break;
		case 1:
		player = 1;
		drawp[1] = 1;
		break;
		case 2:
		player = 2;
		drawp[2] = 1;
		break;
		case 3:
		player = 3;
		drawp[3] = 1;
		break;
	}

});
    document.getElementById("moveP").onclick = function(){

	// boardorder에 따라 좌표의 방향이 달라지도록 설정
	if(boardorder[player] < 7){
		locx[player] -= 0.2;
		boardorder[player] ++;
	}
	else if(boardorder[player] < 14){
		locy[player] += 0.2;
		boardorder[player] ++;
	}
	else if(boardorder[player] < 21){
		locx[player] += 0.2;
		boardorder[player] ++;
	}
	else if(boardorder[player] < 27){
		locy[player] -= 0.2;
		boardorder[player] ++;
	}
	else if(boardorder[player] == 27){
		locy[player] -= 0.2;
		boardorder[player] = 0;
	}
	};

    document.getElementById("explain").onclick = function(){

	alert("\t\t게임 설명 \n1. 순서에 따라 플레이어를 클릭하여 선택합니다. 처음 선택 시 플레이어가 추가됩니다. \n2. 버튼을 눌러서 주사위를 굴립니다.\n3. 나온 눈의 수만큼 이동 버튼을 클릭합니다.\nPS) 황금 열쇠를 클릭하여 황금 열쇠를 개봉할 수 있습니다.")
	};

    document.getElementById("GoldCard").onclick = function(){

	var goldn = ~~(Math.random()*5+1);
	if(goldn == 1){
		alert("  ----- 황금 열쇠 -----\n 핸드폰 끝자리 홀수 마셔! ");
	}
	if(goldn == 2){
		alert("  ----- 황금 열쇠 -----\n 핸드폰 끝자리 짝수 마셔! ");
	}
	if(goldn == 3){
		alert("  ----- 황금 열쇠 -----\n  원하는 칸으로 이동! ");
	}
	if(goldn == 4){
		alert("  ----- 황금 열쇠 -----\n       나 빼고 원샷! ");
	}
	if(goldn == 5){
		alert(" ----- 황금 열쇠 -----\n       생수 원샷!");
	}

	};
    
	render();
	renderpoint();
	renderpoint2();
	renderpoint3();
	renderpoint4();





}



var render = function(){
    
	
	pointsArray = [];
	texCoordsArray = [];
	gl.uniform1i( typeLoc, 1); // 유니폼 함수로 타입 지정
	gl.uniform3fv(thetaLoc, flatten(theta));
    gl.drawArrays( gl.TRIANGLES, 0, 6 );

	if(state == 0){ // 멈춤 상태
	pointsArray = [];
	texCoordsArray = [];
	gl.uniform1i( typeLoc, 1); // 타입 지정
	gl.uniform3fv(thetaLoc, flatten(theta));
    gl.drawArrays( gl.TRIANGLES, 6, 36 );
	}

	else if(state == 1){ // 돌아가는 상태
	pointsArray = [];
	texCoordsArray = [];
	gl.uniform1i( typeLoc, 0);
	gl.uniform3fv(thetaLoc, flatten(theta));
    gl.drawArrays( gl.TRIANGLES, 6, 36 );

	}

	else if(state == 2){ // 90도씩 회전하는 정육면체
	pointsArray = [];
	texCoordsArray = [];
	gl.uniform1i( typeLoc, 0);
	gl.uniform3fv(thetaLoc, flatten(theta));
    gl.drawArrays( gl.TRIANGLES, 6, 36 );
	theta[0] += 90.0;
	theta[1] += 90.0;
	theta[2] += 90.0;

	}


	requestAnimFrame(render);




	
   
}

var renderpoint = function(){


	pointsArray = [];
	texCoordsArray = [];
	gl.uniform1i( typeLoc, 2);
	gl.uniform1f( moveX[0], locx[0]);
	gl.uniform1f( moveY[0], locy[0]);
	gl.uniform3fv(thetaLoc, flatten(theta));
	if (drawp[0] == 1 )
    gl.drawArrays( gl.POINTS, 42 , 1 );
	requestAnimFrame(renderpoint);
	

}

var renderpoint2 = function(){


	pointsArray = [];
	texCoordsArray = [];
	gl.uniform1i( typeLoc, 3);
	gl.uniform1f( moveX[1], locx[1]);
	gl.uniform1f( moveY[1], locy[1]);
	gl.uniform3fv(thetaLoc, flatten(theta));
	if(drawp[1] ==1 )
    gl.drawArrays( gl.POINTS, 43 , 1 );
	requestAnimFrame(renderpoint2);

}

var renderpoint3 = function(){


	pointsArray = [];
	texCoordsArray = [];
	gl.uniform1i( typeLoc, 4);
	gl.uniform1f( moveX[2], locx[2]);
	gl.uniform1f( moveY[2], locy[2]);
	gl.uniform3fv(thetaLoc, flatten(theta));
	if(drawp[2] == 1)
    gl.drawArrays( gl.POINTS, 44 , 1 );
	requestAnimFrame(renderpoint3);

}

var renderpoint4 = function(){


	pointsArray = [];
	texCoordsArray = [];
	gl.uniform1i( typeLoc, 5);
	gl.uniform1f( moveX[3], locx[3]);
	gl.uniform1f( moveY[3], locy[3]);
	gl.uniform3fv(thetaLoc, flatten(theta));
	if(drawp[3] == 1)
    gl.drawArrays( gl.POINTS, 45 , 1 );
	requestAnimFrame(renderpoint4);

}

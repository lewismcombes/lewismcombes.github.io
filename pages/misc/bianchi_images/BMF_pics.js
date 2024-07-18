



var resolution = 200

var b = Math.sqrt(7)/2

var zeroPos = [100,400];
var onePos = [zeroPos[0]+resolution, zeroPos[1]]
var alphaPos = [ zeroPos[0] + resolution/2, zeroPos[1] - b*resolution ]
var onePlusAlphaPos = [ zeroPos[0]+resolution*3/2, zeroPos[1] - b*resolution ]

var drawZeroes = true
var labelVertices = true 




var $ = function (x) {
	return document.getElementById(x);
}


var dist2 = function(x1,y1,x2,y2) {
	return  (x1-x2)^2 + (y1-y2)^2
}

function mod(n, m) {
  return ((n % m) + m) % m;
}


var latticeToX = function(xf,yf,meshNum) {
	return (xf + yf/2)*meshNum/resolution
}

var latticeToY = function(xf,yf,meshNum) {
	return yf*b*meshNum/resolution
}


var nearestLatticePoint = function(x,y,meshNum) {
	var yFloor = Math.floor( (-y + zeroPos[1])*meshNum/(resolution*b) )
	var xFloor = Math.floor( (x - zeroPos[0] - (-y + zeroPos[1])/(2*b))*meshNum/resolution )

	return [xFloor,yFloor]
}





let argData0 = [];
let absData0 = [];

let argData1 = [];
let absData1 = [];

let argData2 = [];
let absData2 = [];

let absData = {
	0 : absData0,
	1 : absData1,
	2 : absData2
}

let argData = {
	0 : argData0,
	1 : argData1,
	2 : argData2
}


// loads the data. height controls the height in H_3 of the evaluation data, 
// component tells you if it F_0, F_1 or F_2, 
// and type is either absolute value or argument 
var loadData = function(height,component,type) {

	fetch('data/'.concat( type, "_", component.toString(), '_' , height ,'.csv'))
	.then(response => response.text())
		.then(data => {
		// Split the data into rows
		const rows = data.trim().split('\n');

		// Split each row into columns and convert to numbers
		// I realise this is not the best way to do this
		if (type === "arg") {
			if (component === 0) {
				argData0 = rows.map(row => row.split(',').map(Number));
			} else if (component === 1) {
				argData1 = rows.map(row => row.split(',').map(Number));
			} else if (component === 2) {
				argData2 = rows.map(row => row.split(',').map(Number));
			}
		} else if (type == "abs") {
			if (component === 0) {
				absData0 = rows.map(row => row.split(',').map(Number));
			} else if (component === 1) {
				absData1 = rows.map(row => row.split(',').map(Number));
			} else if (component === 2) {
				absData2 = rows.map(row => row.split(',').map(Number));
			}
		}
		

	})
	.catch(error => {
		console.error('Error fetching the file:', error);
	});
}



// on load we draw some data 
//document.addEventListener('DOMContentLoaded', () => {

//	loadData("r",0,"arg")
//	loadData("r",1,"arg")
//	loadData("r",2,"arg")
//	loadData("r",0,"abs")
//	loadData("r",1,"abs")
//	loadData("r",2,"abs")

//});


// indices where a possible zero is hanging out 
var possibleZeroes = []

var findZeroes = function() {
	indices = []
	for (i = 0; i < 200; i++) {
		for (j = 0; j < 200; j++) { 

			if (absData[0][i][j] < 10**(-5) && absData[1][i][j] < 10**(-5) && absData[2][i][j] < 10**(-5)) {
				indices.push([i,j])
			}

		}
	}
	return indices
}



var changeData = function(height) {

	argData0 = [];
	absData0 = [];

	argData1 = [];
	absData1 = [];

	argData2 = [];
	absData2 = [];

	loadData(height,0,"arg")
	loadData(height,1,"arg")
	loadData(height,2,"arg")
	loadData(height,0,"abs")
	loadData(height,1,"abs")
	loadData(height,2,"abs")

	var makeDataListsRefresh = setInterval(makeDataLists,100)

	var drawTheComponents = function() {
		drawOnCanvas(0)
		drawOnCanvas(1)
		drawOnCanvas(2)
	}


	function makeDataLists() {

		if (argData0.length === N && argData1.length === N && argData2.length === N && 
			absData0.length === N && absData1.length === N && absData2.length === N
			&& absData0[absData0.length-1].length === N && absData1[absData1.length-1].length === N && absData2[absData2.length-1].length === N
			&& argData0[argData0.length-1].length === N && argData1[argData1.length-1].length === N && argData2[argData2.length-1].length === N) {
			argData = [argData0, argData1, argData2]
			absData = [absData0, absData1, absData2]

			if (drawZeroes) {
				possibleZeroes = findZeroes()
			}
			
			drawTheComponents()
			clearInterval(makeDataListsRefresh);
		} 
	}

}



changeData("040")




var N = 200


var pixelMap = [];
for (var i = 0; i < 500; i++) {
	var newRow = [];
	for (var j = 0; j < 500; j++) {
		nn = nearestLatticePoint(i,j,N)
		newRow.push(nn)
	}
	pixelMap.push(newRow)
}




var checkZeroList = function(inds) {
	contains = false 
	for (i = 0; i < possibleZeroes.length; i++) {
		if (inds[0] == possibleZeroes[i][0] && inds[1] == possibleZeroes[i][1]) {
			contains = true 
			break
		}
	}
	return contains
}


var drawOnCanvas = function(n) {

	var canvas = $("F" + String(n) + "_canvas");
	var ctx = canvas.getContext("2d");

	
	agD = argData[n]
	abD = absData[n]

	toDrawZero = []

	for (var i = 0; i < 500; i++) {
		for (var j = 0; j < 500; j++) {
			//nn = nearestLatticePoint(i,j,N)
			nn = pixelMap[i][j]
			nnmod = [mod(nn[0],N), mod(nn[1],N)]
			if (nn[0] == nnmod[0] && nn[1] == nnmod[1] ) {
				ctx.fillStyle = "hsl(" + String(Math.floor(agD[nn[1]][nn[0]]*360/(2*Math.PI))) + ",100%," + String(50-abD[nn[1]][nn[0]]*300) +"%)";
				
			} else {
				ctx.fillStyle = "hsl(" + String(Math.floor(agD[mod(nn[1],N)][mod(nn[0],N)]*360/(2*Math.PI))) + ",100%," + String(20-abD[mod(nn[1],N)][mod(nn[0],N)]*100) + "%)";
			}

			ctx.beginPath();
			ctx.rect(i, j, 1, 1);
			ctx.fill();

			if (checkZeroList(nnmod)) {
				toDrawZero.push([i,j])
			}	

		}
	}

	for (i = 0; i < toDrawZero.length; i++){
		ctx.fillStyle = "rgb(0,0,0)"
		ctx.beginPath();
		ctx.arc(toDrawZero[i][0], toDrawZero[i][1], 1, 0, 2 * Math.PI);
		ctx.fill();
	}



	if (labelVertices) {

	// draws points at the four vertices of the periodic-in-ZK region 
	ctx.fillStyle = "#000000";

	ctx.beginPath();
	ctx.arc(zeroPos[0], zeroPos[1], 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.font = "25px Arial";
	ctx.fillText("0",zeroPos[0],zeroPos[1]+30)

	ctx.beginPath();
	ctx.arc(onePos[0], onePos[1], 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.fillText("1",onePos[0],onePos[1]+30)

	ctx.beginPath();
	ctx.arc(alphaPos[0], alphaPos[1], 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.fillText('\u03B1',alphaPos[0],alphaPos[1]+30)

	ctx.beginPath();
	ctx.arc(onePlusAlphaPos[0], onePlusAlphaPos[1], 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.fillText('1+\u03B1',onePlusAlphaPos[0],onePlusAlphaPos[1]+30)
	}


}




// draws points at the four vertices of the periodic-in-ZK region 
//ctx.fillStyle = "#000000";

//ctx.beginPath();
//ctx.arc(zeroPos[0], zeroPos[1], 4, 0, 2 * Math.PI);
//ctx.fill();

//ctx.beginPath();
//ctx.arc(onePos[0], onePos[1], 4, 0, 2 * Math.PI);
//ctx.fill();

//ctx.beginPath();
//ctx.arc(alphaPos[0], alphaPos[1], 4, 0, 2 * Math.PI);
//ctx.fill();

//ctx.beginPath();
//ctx.arc(onePlusAlphaPos[0], onePlusAlphaPos[1], 4, 0, 2 * Math.PI);
//ctx.fill();



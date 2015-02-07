var fs = require('fs');
var math = require('mathjs');


module.exports = function(params) {
	var start = Number(params.start);
  var end = Number(params.end);
  var range = end - start;

  var axis = (params.axis === undefined ? 'x' : params.axis);
  var axisVal = Number(params.axisValue); //y = or x =

  var parser = math.parser();
  if(axis === 'y') {
    parser.eval('f(y) = ' + params.functionInput);
  } else {
    parser.eval('f(x) = ' + params.functionInput);
  }

  var mI = (end - start)/1000;
  var meshPoints = Math.floor(range/mI)+1;

  if(params.discrete === true) {
    //Set up discrete environment
    var numDiscrete = (Number(params.numDiscrete) > 101 ? 101 : parseInt(Number(params.numDiscrete)));
    var discreteVals = new Array(numDiscrete);
    var discreteStep = range/numDiscrete;
    for(var i = 0; i < numDiscrete; i++) {
      var val = start + (i*discreteStep + discreteStep/2);
      discreteVals[i] = solveEquation(val);
    }
  }

  var vertices = new Array();

  //Push the vertices for the bottom
  for(var i = 0; i < meshPoints; i++) {
    var val = start + i*mI;
    if(axis === 'y') {
      //If the surface is rotating about a vertical axis, push the value along y
      vertices.push([0+axisVal, val, 0]);
    } else {
      vertices.push([val, 0+axisVal, 0]);
    }
  }

  //Push the vertices
  var tmesh = 2*Math.PI/(meshPoints-1); //Theta mesh interval
  for(var i = 0; i < meshPoints; i++) {
    //Find the x or y value along the mesh
    var val = start + i*mI;
    //Solve for the value, determining the radius of the cylindrical rotation
    if(params.discrete === true) {

      var discreteIndex = (Math.floor((val-start)/discreteStep) > numDiscrete-1 ? numDiscrete-1 : Math.floor((val-start)/discreteStep));
      var rMain = discreteVals[discreteIndex] - axisVal;
    } else {
      var rMain = solveEquation(val) - axisVal;
    }
    //Push along theta
    for(var j = 0; j < meshPoints; j++) {
      if(axis === 'y') {
        vertices.push([rMain*Math.cos(j*tmesh/1000)+axisVal, val, rMain*Math.sin(j*tmesh/1000)]);
      } else {
        vertices.push([val, rMain*Math.cos(j*tmesh/1000)+axisVal,rMain*Math.sin(j*tmesh/1000)]);
      }
      
    }
  }

  //Push faces
  for(var i = 0; i < meshPoints; i++) {
    var sI = meshPoints*(i+1); //For first starting index
    var sI2 = meshPoints*(i+2); //For second starting index
    for(var j = 0; j < meshPoints-1; j ++) {
      if(i === 0) {
        //First Point, Fill end
        geo.faces.push(new THREE.Face3(sI+j, sI+j+1, 0));
        geo.faces.push(new THREE.Face3(sI+j+1, sI+j, 0));
        //Filll Body
        geo.faces.push(new THREE.Face3(sI+j, sI+j+1, sI2+j));
        geo.faces.push(new THREE.Face3(sI+j+1, sI+j, sI2+j));
        geo.faces.push(new THREE.Face3(sI+j+1, sI2+j, sI2+j+1));
        geo.faces.push(new THREE.Face3(sI2+j, sI+j+1, sI2+j+1));
      } else if(i === meshPoints-1) {
        //Last Point, Fill end
        geo.faces.push(new THREE.Face3(sI+j, sI+j+1, meshPoints-1));
        geo.faces.push(new THREE.Face3(sI+j+1, sI+j, meshPoints-1));
      } else {
        geo.faces.push(new THREE.Face3(sI+j, sI+j+1, sI2+j));
        geo.faces.push(new THREE.Face3(sI+j+1, sI+j, sI2+j));
        geo.faces.push(new THREE.Face3(sI+j+1, sI2+j, sI2+j+1));
        geo.faces.push(new THREE.Face3(sI2+j, sI+j+1, sI2+j+1));
      }
      if(j === 0 && i !== meshPoints-1) {
        //First or last, fill end
        geo.faces.push(new THREE.Face3(sI+j, sI2+j, i));
        geo.faces.push(new THREE.Face3(sI2+j, sI+j, i));

        geo.faces.push(new THREE.Face3(sI2+j, i, i+1));
        geo.faces.push(new THREE.Face3(sI2+j, i+1, i));
      } else if(j === meshPoints-2 && i !== meshPoints-1) {
        //First or last, fill end
        geo.faces.push(new THREE.Face3(sI+j+1, sI2+j+1, i));
        geo.faces.push(new THREE.Face3(sI2+j+1, sI+j+1, i));

        geo.faces.push(new THREE.Face3(sI2+j+1, i, i+1));
        geo.faces.push(new THREE.Face3(sI2+j+1, i+1, i));
      }
    }
  }

  var file = fs.createWriteStream('./hello.txt');

  file.write('hello world');
}
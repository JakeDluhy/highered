/* -------------------- Create 2D Function -------------------- 
Generate an arbitrary surface passed on the equation passed in.

Input: params - a javasript object passed in containing the the following optional attributes
functionInput: the input function to be plotted
bottomFunction: the bottom function to integrate to
axis: the axis of integration - default is x
meshInterval: the mesh interval for the grid
start: the lower x value bound
end:the upper x value bound
discrete: boolean to determine whether the rotation is discrete or not
numDiscrete: number of discrete steps


Output: Will create the surface
------------------------------------------------------------------*/


DisplayLibrary.prototype.createIntegralDisplay = function(params) {
  var start = Number(params.start);
  var end = Number(params.end);
  var range = end-start;
  var mI = (end - start)/100;
  var meshPoints = 101;

  var axis = (params.axis === undefined ? 'x' : params.axis);

  var bottomFunction = (params.bottomFunction === undefined ? '0' : params.bottomFunction);

  var parser = math.parser();
  if(axis === 'y') {
    parser.eval('f(y) = ' + params.functionInput);
    parser.eval('g(y) = ' + bottomFunction);
  } else {
    parser.eval('f(x) = ' + params.functionInput);
    parser.eval('g(x) = ' + bottomFunction);
  }

  if(params.discrete === true) {
    //Set up discrete environment
    var numDiscrete = (Number(params.numDiscrete) > 101 ? 101 : parseInt(Number(params.numDiscrete)));
    var discreteVals = Array(numDiscrete);
    var discreteValsBot = Array(numDiscrete);
    var discreteStep = range/numDiscrete;
    for(var i = 0; i < numDiscrete; i++) {
      var val = start + (i*discreteStep + discreteStep/2);
      discreteVals[i] = solveEquation(val);
      discreteValsBot[i] = solveBottom(val);
    }
    console.log(discreteVals);
    console.log(discreteValsBot);
  }

  var geo = new THREE.Geometry();
  var mat = new THREE.MeshBasicMaterial({color: 0x0000ff});


  //Reset the surface
  if(!(currentObject === null)) {
    var currentObject = this.scene.getObjectByName('currentIntegral');
    this.scene.remove(currentObject);
  }
  for(var i = 0; i < meshPoints; i ++) {
    var val = start+i*mI;
    var discreteIndex = (Math.floor((val-start)/discreteStep) > numDiscrete ? numDiscrete : Math.floor((val-start)/discreteStep));
    var nextIndex = Math.floor(((start+(i+1)*mI)-start)/discreteStep); //Necessary to ensure straight interfaces
    if(axis === 'y') {
      if(params.discrete === true) {
        geo.vertices.push(new THREE.Vector3(discreteValsBot[discreteIndex], val, 0));
        geo.vertices.push(new THREE.Vector3(discreteVals[discreteIndex], val, 0));
        if(nextIndex > discreteIndex) {
          //Check for interface between steps, add vertical indices if necessary
          geo.vertices.push(new THREE.Vector3(discreteValsBot[nextIndex], val, 0));
          geo.vertices.push(new THREE.Vector3(discreteVals[nextIndex], val, 0));
        }
      } else {
        geo.vertices.push(new THREE.Vector3(solveBottom(val), val, 0));
        geo.vertices.push(new THREE.Vector3(solveEquation(val), val, 0));
      }
    } else {
      if(params.discrete === true) {
        geo.vertices.push(new THREE.Vector3(val, discreteValsBot[discreteIndex], 0));
        geo.vertices.push(new THREE.Vector3(val, discreteVals[discreteIndex], 0));
        if(nextIndex > discreteIndex) {
          geo.vertices.push(new THREE.Vector3(val, discreteValsBot[nextIndex], 0));
          geo.vertices.push(new THREE.Vector3(val, discreteVals[nextIndex], 0));
        }
      } else {
        geo.vertices.push(new THREE.Vector3(val, solveBottom(val), 0));
        geo.vertices.push(new THREE.Vector3(val, solveEquation(val), 0));
      }
    }
  }
  console.log(geo.vertices.length + 3);
  for(var j = 0; j < (geo.vertices.length - 3); j+=2) {
    geo.faces.push(new THREE.Face3(j,j+1,j+2));
    geo.faces.push(new THREE.Face3(j,j+2,j+1));

    geo.faces.push(new THREE.Face3(j+1,j+2,j+3));
    geo.faces.push(new THREE.Face3(j+1,j+3,j+2));
  }
  geo.computeFaceNormals();
  geo.computeVertexNormals();
  var mat = new THREE.MeshNormalMaterial();

  var functionObject = new THREE.Mesh(geo, mat);
  this.scene.add(functionObject);
  functionObject.name = 'currentIntegral';
  function solveEquation(v) {
    //Pass in a parser with a function f(x,y) define
    var functionAt = 'f('+v+')';
    var val = parser.eval(functionAt);
    return Number(val);
  }
  function solveBottom(v) {
    //Pass in a parser with a function f(x,y) define
    var functionAt = 'g('+v+')';
    var val = parser.eval(functionAt);
    return Number(val);
  }
}
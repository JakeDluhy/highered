import THREE from './vendor/three';
// import math from 'math';
import TrackballControls from './vendor/trackballControls';

function DisplayLibrary(container, javaContainer, buildAxes, buildConstraintBox, buildRoom) {
  //Set instance variables
  //Set class variables in the prototype
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, container.width() / container.height(), 0.1, 1000);
  var renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setClearColor(0x000000, 0);
  this.scene = scene;
  this.camera = camera;
  this.renderer = renderer;

  renderer.setSize(container.width(), container.height());
  container.append(renderer.domElement);
  //Work in Java Container
  var controls = new TrackballControls(camera, javaContainer);

  if(buildAxes) {
    this.build2DAxes(10);
  }
  if(buildConstraintBox) {
    this.buildConstraintBox(6, 6);
  }
  if(buildRoom) {
    this.buildRoom(300);
  }

  // camera.position.x = 300;
  // camera.position.y = 300;
  camera.position.z = 30;
  var quaternion = new THREE.Quaternion();
  quaternion.setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI/2);
  // camera.up.applyQuaternion(quaternion);

  var self = this;

  render();


  function render() {
    self.withinRender();
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);

  }
  
}

DisplayLibrary.prototype.invertedCoordinates = function() {
  var invCoor = new THREE.Object3D();
  invCoor.rotation.x = Math.PI;
  this.invCoor = invCoor;
  return invCoor;
}

DisplayLibrary.prototype.withinRender = function() {
}

DisplayLibrary.prototype.setWithinRender = function(func) {
  this.withinRender = func;
}

DisplayLibrary.prototype.clearDisplay = function() {
  var children = this.scene.children;
  while(children.length > 1) {
    this.scene.remove(children[1]);
  }
}

DisplayLibrary.prototype.pauseAnimation = function() {
  this.animation.pause();
}

DisplayLibrary.prototype.playAnimation = function() {
  this.animation.play();
}

DisplayLibrary.prototype.changeAnimationSpeed = function(aniSpeed) {
  this.animationSpeed = aniSpeed;
}

DisplayLibrary.prototype.roundIt = function(val, decimal) {
  return Math.round(num * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

/* -------------------- Create 2D Function -------------------- 
Generate an arbitrary surface passed on the equation passed in.

Input: params - a javasript object passed in containing the the following optional attributes
functionInput: the input function to be plotted

meshInterval: the mesh interval for the grid
start: the lower x value bound
end:the upper x value bound


Output: Will create the surface
------------------------------------------------------------------*/


DisplayLibrary.prototype.create2DFunction = function(params) {
  var start = Number(params.start);
  var end = Number(params.end);
  var mI = (end - start)/100;

  var axis = (params.axis === undefined ? 'x' : params.axis);

  var parser = math.parser();
  if(axis === 'y') {
    parser.eval('f(y) = ' + params.functionInput);
  } else {
    parser.eval('f(x) = ' + params.functionInput);
  }

  var geo = new THREE.Geometry();
  var mat = new THREE.LineBasicMaterial({linewidth: 5, color: 0xff0000});


  //Reset the surface
  if(!(currentObject === null)) {
    var currentObject = this.scene.getObjectByName('current2DFunction');
    this.scene.remove(currentObject);
  }
  for(var i = start; i < end; i += mI) {
    if(axis === 'y') {
      geo.vertices.push(new THREE.Vector3(solveEquation(i), i, 0));
    } else {
      geo.vertices.push(new THREE.Vector3(i, solveEquation(i), 0));
    }
  }
  var functionObject = new THREE.Line(geo, mat);
  this.scene.add(functionObject);
  functionObject.name = 'current2DFunction';

  function solveEquation(v) {
    //Pass in a parser with a function f(x,y) define
    var functionAt = 'f('+v+')';
    var val = parser.eval(functionAt);
    return Number(val);
  }
}



/* -------------------- Create 2D Function -------------------- 
Generate an arbitrary surface passed on the equation passed in.

Input: params - a javasript object passed in containing the the following optional attributes
functionInput: the input function to be plotted
meshInterval: the mesh interval for the grid
start: the lower x value bound
end:the upper x value bound


Output: Will create the surface
------------------------------------------------------------------*/


DisplayLibrary.prototype.createAxis = function(params) {
  var axis = (params.axis === undefined ? 'x' : params.axis);

  var start = Number(params.start);
  var end = Number(params.end);
  var axisVal = Number(params.axisValue);
  var length = end - start;
  var mI = length/100;

  var geo = new THREE.Geometry();
  var mat = new THREE.LineDashedMaterial({linewidth: 5, color: 0x000000, dashSize: length/100, gapSize: length/100});

  //Reset the surface
  if(!(currentObject === null)) {
    var currentObject = this.scene.getObjectByName('currentAxis');
    this.scene.remove(currentObject);
  }

  for(var i = start; i < end; i += mI) {
    if(axis === 'y') {
      console.log('here');
      geo.vertices.push(new THREE.Vector3(axisVal, i, 0));
    } else {
      geo.vertices.push(new THREE.Vector3(i, axisVal, 0));
    }
    
  }

  var functionObject = new THREE.Line(geo, mat);
  this.scene.add(functionObject);
  functionObject.name = 'currentAxis';
}



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



/* -------------------- Create Rotation Function -------------------- 
Generate an arbitrary surface passed on the equation passed in.

Input: params - a javasript object passed in containing the the following optional attributes
functionInput: the input function to be plotted
axis: the axis to rotate around (x or y, default x)
axisValue: the value of the axis
start: the lower value bound
end:the upper value bound
discrete: boolean to determine whether the rotation is discrete or not
numDiscrete: number of discrete steps


Output: Will create the surface
------------------------------------------------------------------*/


DisplayLibrary.prototype.createRotationFunction = function(params) {
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

  var mI = (end - start)/100;
  var meshPoints = Math.floor(range/mI)+1;

  if(params.discrete === true) {
    //Set up discrete environment
    var numDiscrete = (Number(params.numDiscrete) > 101 ? 101 : parseInt(Number(params.numDiscrete)));
    var discreteVals = Array(numDiscrete);
    var discreteStep = range/numDiscrete;
    for(var i = 0; i < numDiscrete; i++) {
      var val = start + (i*discreteStep + discreteStep/2);
      discreteVals[i] = solveEquation(val);
    }
    console.log(discreteVals);
  }


  var geo = new THREE.Geometry();

  //Reset the surface
  if(!(currentObject === null)) {
    var currentObject = this.scene.getObjectByName('current');
    this.scene.remove(currentObject);
  }

  //First indices of multiarray corresponds to morph frame, second to the vertice
  var morphVerticeHolder = [];
  for(var i = 0; i < 21; i++) {
    morphVerticeHolder[i] = [];
  }

  //Create the surface
  //Push the vertices for the bottom
  for(var i = 0; i < meshPoints; i++) {
    var val = start + i*mI;
    if(axis === 'y') {
      //If the surface is rotating about a vertical axis, push the value along y
      geo.vertices.push(new THREE.Vector3(0+axisVal, val, 0));
      for(var j = 0; j < 21; j++) { //21 Frames of the morph animation
        morphVerticeHolder[j].push(new THREE.Vector3(0+axisVal, val,0));
      }
    } else {
      geo.vertices.push(new THREE.Vector3(val,0+axisVal,0));
      for(var j = 0; j < 21; j++) { //21 Frames of the morph animation
        morphVerticeHolder[j].push(new THREE.Vector3(val,0+axisVal,0));
      }
    }
  }


  //TODO: Change to have vertical edges instead of slants for discrete revolutions
  //################################################################################


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
        geo.vertices.push(new THREE.Vector3(rMain*Math.cos(j*tmesh/1000)+axisVal, val, rMain*Math.sin(j*tmesh/1000)));
        for(var k = 0; k < 21; k++) {
          morphVerticeHolder[k].push(new THREE.Vector3(rMain*Math.cos(j*tmesh*(k)/20)+axisVal, val, rMain*Math.sin(j*tmesh*(k)/20)));
        }
      } else {
        geo.vertices.push(new THREE.Vector3(val, rMain*Math.cos(j*tmesh/1000)+axisVal,rMain*Math.sin(j*tmesh/1000)));
        for(var k = 0; k < 21; k++) {
          morphVerticeHolder[k].push(new THREE.Vector3(val, rMain*Math.cos(j*tmesh*(k)/20)+axisVal,rMain*Math.sin(j*tmesh*(k)/20)));
        }
      }
      
    }
  }

  //Push Faces
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

  // geo.mergeVertices();
  for(var k = 0; k < 21; k++) {
    geo.morphTargets.push( { name: "target" + k, vertices: morphVerticeHolder[k]} );
  }

  geo.computeFaceNormals();
  geo.computeVertexNormals();
  var mat = new THREE.MeshNormalMaterial( { color: 0x990000, morphTargets: true } );

  var functionObject = new THREE.Mesh( geo, mat);

  this.scene.add(functionObject);
  functionObject.name = 'current';

  this.animation = new THREE.MorphAnimation( functionObject);
  this.animation.loop = false;
  this.animationSpeed = 1;
  this.animation.play();

  this.setWithinRender(function() {

    this.animation.update(this.animationSpeed);

  });

  function solveEquation(v) {
    //Pass in a parser with a function f(x) define
    var functionAt = 'f('+v+')';
    var val = parser.eval(functionAt);
    return Number(val);
  }
}



/* -------------------- Create Surface Function -------------------- 
Generate an arbitrary surface passed on the equation passed in.

Input: params - a javasript object passed in containing the the following required attributes
functionInput: the input function to be plotted

and the following possible attributes
meshInterval: the mesh interval for the grid
xstart: the lower x value bound
xend:the upper x value bound
ystart: the lower y value bound
yend:the upper y value bound


Output: Will create the surface
------------------------------------------------------------------*/


DisplayLibrary.prototype.createSurface = function(params) {
  //Params must contain functionInput
  //Copy params into variables
  var parser = math.parser();
  parser.eval('f(x,y) = ' + params.functionInput);
  var maxz = 0;
  var minz = 0;

  var mI = params.meshInterval;
  var xstart = params.xstart;
  var xend = params.xend;
  var ystart = params.ystart;
  var yend = params.yend;

  //Reset the surface
  if(!(currentObject === null)) {
    var currentObject = this.scene.getObjectByName('current');
    this.scene.remove(currentObject);
  }

  //Make the Geometry, prepare the mesh, need to define start, end, mI
  var geometry = new THREE.Geometry();
  //Need mesh interval, x, y, z constraints, mesh Interval, function object (string formula, power degree)

  for (var j = ystart; j < yend-mI; j+=mI) {
    for(var i = xstart; i < xend-mI; i+=mI) {
      //Calculate the z values at the corner and kitty corner of the square
      var zMainArr = solveEquation(i,j);
      var zOffsetArr = solveEquation(i+mI,j+mI);
      var zAlongxArr = solveEquation(i+mI,j);
      var zAlongyArr = solveEquation(i,j+mI);
      //Assign positive and negative values to variables
      var zMain = zMainArr[0],
          negzMain = zMainArr[1],
          zOffset = zOffsetArr[0],
          negzOffset = zOffsetArr[1],
          zAlongx = zAlongxArr[0],
          negzAlongx = zAlongxArr[1],
          zAlongy = zAlongyArr[0],
          negzAlongy = zAlongyArr[1];

      //Keep track of the max and min values of the function for coloring purposes
      if(Math.max(zMain, zOffset, zAlongx, zAlongy) > maxz) {maxz = Math.max(zMain, zOffset, zAlongx, zAlongy)}
      if(Math.min(zMain, zOffset, zAlongx, zAlongy) < minz) {minz = Math.min(zMain, zOffset, zAlongx, zAlongy)}
      if(Math.max(negzMain, negzOffset, negzAlongx, negzAlongy) > maxz) {maxz = Math.max(negzMain, negzOffset, negzAlongx, negzAlongy)}
      if(Math.min(negzMain, negzOffset, negzAlongx, negzAlongy) < minz) {minz = Math.min(negzMain, negzOffset, negzAlongx, negzAlongy)}

      var startingIndex = geometry.vertices.length;
      var sI = startingIndex;
      if(isNotNull(zMain)) {
        if(isNotNull(zOffset)) {
          //Put in zMain and zOffset in vertices
          geometry.vertices.push(new THREE.Vector3(i,j,zMain));
          geometry.vertices.push(new THREE.Vector3(i+mI,j+mI,zOffset));
          if(isNotNull(zAlongx)) {
            //Check if zAlongx exists, if it does, put it in and create a new face
            geometry.vertices.push(new THREE.Vector3(i+mI,j,zAlongx));
            geometry.faces.push(new THREE.Face3(sI,sI+2,sI+1));
            geometry.faces.push(new THREE.Face3(sI,sI+1,sI+2));

            

            if(isNotNull(zAlongy)) {
              //Check if zAlongy exists, if it does, put it in and create a new face
              geometry.vertices.push(new THREE.Vector3(i,j+mI,zAlongy));
              geometry.faces.push(new THREE.Face3(sI,sI+1,sI+3));
              geometry.faces.push(new THREE.Face3(sI,sI+3,sI+1));

              if(isNotNull(negzMain) && isNotNull(negzOffset) && isNotNull(negzAlongx) && isNotNull(negzAlongy)) {
                geometry.vertices.push(new THREE.Vector3(i,j,negzMain));
                geometry.vertices.push(new THREE.Vector3(i+mI,j+mI,negzOffset));
                geometry.vertices.push(new THREE.Vector3(i+mI,j,negzAlongx));
                geometry.vertices.push(new THREE.Vector3(i,j+mI,negzAlongy));

                geometry.faces.push(new THREE.Face3(sI+4,sI+6,sI+5));
                geometry.faces.push(new THREE.Face3(sI+4,sI+5,sI+6));

                geometry.faces.push(new THREE.Face3(sI+4,sI+5,sI+7));
                geometry.faces.push(new THREE.Face3(sI+4,sI+7,sI+5));

                //No need to connect top and bottom
              }
            } else {
              //Had to go in else to avoid vertice problems in the preceeding logic
              if(isNotNull(negzMain) && isNotNull(negzOffset) && isNotNull(negzAlongx)) {
                geometry.vertices.push(new THREE.Vector3(i,j,negzMain));
                geometry.vertices.push(new THREE.Vector3(i+mI,j+mI,negzOffset));
                geometry.vertices.push(new THREE.Vector3(i+mI,j,negzAlongx));

                geometry.faces.push(new THREE.Face3(sI+3,sI+5,sI+4));
                geometry.faces.push(new THREE.Face3(sI+3,sI+4,sI+5));

                //Connect top and bottom
                geometry.faces.push(new THREE.Face3(sI+0, sI+1, sI+4));
                geometry.faces.push(new THREE.Face3(sI+0, sI+4, sI+1));

                geometry.faces.push(new THREE.Face3(sI+0, sI+3, sI+4));
                geometry.faces.push(new THREE.Face3(sI+0, sI+4, sI+3));
              }
            }
        } else if(isNotNull(zAlongy)) {
            //It had to be done this way, in order to manage the vertice input into Face3
            geometry.vertices.push(new THREE.Vector3(i,j+mI,zAlongy));
            geometry.faces.push(new THREE.Face3(sI,sI+1,sI+2));
            geometry.faces.push(new THREE.Face3(sI,sI+2,sI+1));

            if(isNotNull(negzMain) && isNotNull(negzOffset) && isNotNull(negzAlongy)) {
              geometry.vertices.push(new THREE.Vector3(i,j,negzMain));
              geometry.vertices.push(new THREE.Vector3(i+mI,j+mI,negzOffset));
              geometry.vertices.push(new THREE.Vector3(i,j+mI,negzAlongy));

              geometry.faces.push(new THREE.Face3(sI+3,sI+4,sI+5));
              geometry.faces.push(new THREE.Face3(sI+3,sI+5,sI+4));

              //Connect top and bottom
              geometry.faces.push(new THREE.Face3(sI+0, sI+1, sI+4));
              geometry.faces.push(new THREE.Face3(sI+0, sI+4, sI+1));

              geometry.faces.push(new THREE.Face3(sI+0, sI+3, sI+4));
              geometry.faces.push(new THREE.Face3(sI+0, sI+4, sI+3));
            }
          }
        } else if(isNotNull(zAlongx) && isNotNull(zAlongy)) {
          //Create a triangular face without zOffset
          geometry.vertices.push(new THREE.Vector3(i,j,zMain));
          geometry.vertices.push(new THREE.Vector3(i+mI,j,zAlongx));
          geometry.vertices.push(new THREE.Vector3(i,j+mI,zAlongy));

          geometry.faces.push(new THREE.Face3(sI,sI+1,sI+2));
          geometry.faces.push(new THREE.Face3(sI,sI+2,sI+1));

          if(isNotNull(negzMain) && isNotNull(negzAlongx) && isNotNull(negzAlongy)) {
            geometry.vertices.push(new THREE.Vector3(i,j,negzMain));
            geometry.vertices.push(new THREE.Vector3(i+mI,j,negzAlongx));
            geometry.vertices.push(new THREE.Vector3(i,j+mI,negzAlongy));

            geometry.faces.push(new THREE.Face3(sI+3,sI+5,sI+4));
            geometry.faces.push(new THREE.Face3(sI+3,sI+4,sI+5));

            //Connect top and bottom
            geometry.faces.push(new THREE.Face3(sI+1, sI+2, sI+4));
            geometry.faces.push(new THREE.Face3(sI+1, sI+4, sI+2));

            geometry.faces.push(new THREE.Face3(sI+2, sI+4, sI+5));
            geometry.faces.push(new THREE.Face3(sI+2, sI+5, sI+4));
          }
        } else if(isNotNull(zAlongx)) {
          geometry.vertices.push(new THREE.Vector3(i,j,zMain));
          geometry.vertices.push(new THREE.Vector3(i+mI,j,zAlongx));

          geometry.vertices.push(new THREE.Vector3(i,j,negzMain));
          geometry.vertices.push(new THREE.Vector3(i+mI,j,negzAlongx));

          //Connect top and bottom
          geometry.faces.push(new THREE.Face3(sI, sI+1, sI+2));
          geometry.faces.push(new THREE.Face3(sI, sI+2, sI+1));

          geometry.faces.push(new THREE.Face3(sI+1, sI+2, sI+3));
          geometry.faces.push(new THREE.Face3(sI+1, sI+3, sI+2));
        } else if(isNotNull(zAlongy)) {
          geometry.vertices.push(new THREE.Vector3(i,j,zMain));
          geometry.vertices.push(new THREE.Vector3(i,j+mI,zAlongy));

          geometry.vertices.push(new THREE.Vector3(i,j,negzMain));
          geometry.vertices.push(new THREE.Vector3(i,j+mI,negzAlongy));

          //Connect top and bottom
          geometry.faces.push(new THREE.Face3(sI, sI+1, sI+2));
          geometry.faces.push(new THREE.Face3(sI, sI+2, sI+1));

          geometry.faces.push(new THREE.Face3(sI+1, sI+2, sI+3));
          geometry.faces.push(new THREE.Face3(sI+1, sI+3, sI+2));
        }
      } else if(isNotNull(zOffset) && (isNotNull(zAlongx) && isNotNull(zAlongy))) {
        //Create a triangular face without zMain for positive values
        geometry.vertices.push(new THREE.Vector3(i+mI,j+mI,zOffset));
        geometry.vertices.push(new THREE.Vector3(i+mI,j,zAlongx));
        geometry.vertices.push(new THREE.Vector3(i,j+mI,zAlongy));

        geometry.faces.push(new THREE.Face3(sI,sI+2,sI+1));
        geometry.faces.push(new THREE.Face3(sI,sI+1,sI+2));

        if(isNotNull(negzOffset) && (isNotNull(negzAlongx) && isNotNull(negzAlongy))) {
          geometry.vertices.push(new THREE.Vector3(i+mI,j+mI,negzOffset));
          geometry.vertices.push(new THREE.Vector3(i+mI,j,negzAlongx));
          geometry.vertices.push(new THREE.Vector3(i,j+mI,negzAlongy));

          geometry.faces.push(new THREE.Face3(sI+3,sI+5,sI+4));
          geometry.faces.push(new THREE.Face3(sI+3,sI+4,sI+5));

          //Connect top and bottom
          geometry.faces.push(new THREE.Face3(sI+1, sI+2, sI+4));
          geometry.faces.push(new THREE.Face3(sI+1, sI+4, sI+2));

          geometry.faces.push(new THREE.Face3(sI+2, sI+4, sI+5));
          geometry.faces.push(new THREE.Face3(sI+2, sI+5, sI+4));
        }
      } else if(isNotNull(zOffset) && isNotNull(zAlongx) && isNotNull(negzOffset) && isNotNull(negzAlongx)) {
        //The case of a side of the figure => need to connect 
        geometry.vertices.push(new THREE.Vector3(i+mI,j+mI,zOffset));
        geometry.vertices.push(new THREE.Vector3(i+mI,j,zAlongx));

        geometry.vertices.push(new THREE.Vector3(i+mI,j+mI,negzOffset));
        geometry.vertices.push(new THREE.Vector3(i+mI,j,negzAlongx));

        //Connect top and bottom
        geometry.faces.push(new THREE.Face3(sI, sI+1, sI+2));
        geometry.faces.push(new THREE.Face3(sI, sI+2, sI+1));

        geometry.faces.push(new THREE.Face3(sI+1, sI+2, sI+3));
        geometry.faces.push(new THREE.Face3(sI+1, sI+3, sI+2));

      } else if(isNotNull(zOffset) && isNotNull(zAlongy) && isNotNull(negzOffset) && isNotNull(negzAlongy)) {
        geometry.vertices.push(new THREE.Vector3(i+mI,j+mI,zOffset));
        geometry.vertices.push(new THREE.Vector3(i,j+mI,zAlongy));

        geometry.vertices.push(new THREE.Vector3(i+mI,j+mI,negzOffset));
        geometry.vertices.push(new THREE.Vector3(i,j+mI,negzAlongy));

        //Connect top and bottom
        geometry.faces.push(new THREE.Face3(sI, sI+1, sI+2));
        geometry.faces.push(new THREE.Face3(sI, sI+2, sI+1));

        geometry.faces.push(new THREE.Face3(sI+1, sI+2, sI+3));
        geometry.faces.push(new THREE.Face3(sI+1, sI+3, sI+2));
      }
    }
  }
  //Merge Vertices after the surface is created
  geometry.mergeVertices();

  var uniforms = {
    resolution: { type: "v2", value: new THREE.Vector2 },
    zmax: { type: "f", value: maxz},
    zmin: { type: "f", value: minz}
  };
  var itemMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById('cubeVertexShader').innerHTML,
    fragmentShader: document.getElementById('cubeFragmentShader').innerHTML
  });

  //Create the object and add it to the scene
  var functionObject = new THREE.Mesh( geometry, itemMaterial);
  console.log(functionObject.geometry.vertices[1]);
  this.scene.add(functionObject);
  functionObject.name = 'current';


  function solveEquation(x,y) {
    //Pass in a parser with a function f(x,y) define
    var functionAt = 'f('+x+', '+y+')';
    var val = parser.eval(functionAt);
    return [Number(val), null];
  }

  function isNotNull(val) {
    if (val !== null) {
      return true;
    }
    return false;
  }
}




/* -------------------- Math Environment Functions -------------------- 
Generate an arbitrary surface passed on the equation passed in.

------------------------------------------------------------------*/


DisplayLibrary.prototype.buildAxes = function(length) {
  var axes = new THREE.Object3D();
  // var axis = new THREE.Line( new Three.Geometry(), new THREE.LineBasicMaterial({}))
  arrowLength = length - length/100;
  arrowHeight = length/100;
  //Build the axes, with dashed line for the negative axes
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(length, 0, 0), new THREE.Vector3(arrowLength, arrowHeight, 0), new THREE.Vector3(arrowLength, -arrowHeight, 0), 0x000000, false, length) );
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(-length, 0, 0), new THREE.Vector3(-arrowLength, arrowHeight, 0), new THREE.Vector3(-arrowLength, -arrowHeight, 0), 0x000000, true, length));
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(0, length, 0), new THREE.Vector3(0, arrowLength, arrowHeight), new THREE.Vector3(0, arrowLength, -arrowHeight), 0x000000, false, length));
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(0, -length, 0), new THREE.Vector3(0, -arrowLength, arrowHeight), new THREE.Vector3(0, -arrowLength, arrowHeight), 0x000000, true, length));
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0, length), new THREE.Vector3(arrowHeight, 0, arrowLength), new THREE.Vector3(-arrowHeight, 0, arrowLength), 0x000000, false, length));
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0, -length), new THREE.Vector3(arrowHeight, 0, -arrowLength), new THREE.Vector3(-arrowHeight, 0, -arrowLength), 0x000000, true, length));

  //Build the end arrows, seperately from the axes in order to make them all solid
  axes.add( buildArrow(new THREE.Vector3(length, 0, 0), new THREE.Vector3(arrowLength, 0, arrowHeight), new THREE.Vector3(arrowLength, 0, -arrowHeight), 0x000000));
  axes.add( buildArrow(new THREE.Vector3(-length, 0, 0), new THREE.Vector3(-arrowLength, 0, arrowHeight), new THREE.Vector3(-arrowLength, 0, -arrowHeight), 0x000000));
  axes.add( buildArrow(new THREE.Vector3(0, length, 0), new THREE.Vector3(0, arrowLength, arrowHeight), new THREE.Vector3(0, arrowLength, -arrowHeight), 0x000000));
  axes.add( buildArrow(new THREE.Vector3(0, -length, 0), new THREE.Vector3(0, -arrowLength, arrowHeight), new THREE.Vector3(0, -arrowLength, -arrowHeight), 0x000000));
  axes.add( buildArrow(new THREE.Vector3(0,0, length), new THREE.Vector3(arrowHeight, 0, arrowLength), new THREE.Vector3(-arrowHeight, 0, arrowLength), 0x000000));
  axes.add( buildArrow(new THREE.Vector3(0,0, -length), new THREE.Vector3(arrowHeight, 0, -arrowLength), new THREE.Vector3(-arrowHeight, 0, -arrowLength), 0x000000));

  // axes.add(label('x', length));
  // axes.add(label('y', length));
  // axes.add(label('z', length));

  this.scene.add(axes);
  this.axes = axes;

  /* -------------------------- Utility Methods for build axis function ------------------------ */
  function buildAxis(origin, end, arrowPoint1, arrowPoint2, color, dashed, length) {
    var geom = new THREE.Geometry();
    var mat;

    if(dashed) {
        mat = new THREE.LineDashedMaterial({ linewidth: 3, color: color, dashSize: length/100, gapSize: length/100});
    } else {
        mat = new THREE.LineBasicMaterial({ linewidth: 3, color: color});
    }
    

    geom.vertices.push(origin.clone());
    geom.vertices.push(end.clone());

    geom.computeLineDistances();
    

    axis = new THREE.Line(geom, mat, THREE.LinePieces);

    return axis;
  }

  function buildArrow(end, arrowPoint1, arrowPoint2, color) {
    var arrowGeom = new THREE.Geometry();
    var arrowMat = new THREE.LineBasicMaterial({ linewidth: 3, color: color});

    arrowGeom.vertices.push(end.clone());
    arrowGeom.vertices.push(arrowPoint1.clone());
    arrowGeom.vertices.push(end.clone());
    arrowGeom.vertices.push(arrowPoint2.clone());

    arrowGeom.computeLineDistances();

    arrow = new THREE.Line(arrowGeom, arrowMat, THREE.LinePieces);

    return arrow;
  }

  // function label(text, length) {
  //   var textGeo = new THREE.TextGeometry( text, {

  //     size: .3,
  //     height: .05,
  //     curveSegments: 4,

  //     font: 'gentilis',
  //     weight: 'normal',
  //     style: 'normal',

  //     bevelThickness: 0,
  //     bevelSize: 0,
  //     bevelEnabled: false
  //   });
  //   var textMat = new THREE.MeshBasicMaterial( { color: 0x000000 } );
  //   var mesh = new THREE.Mesh(textGeo, textMat);
  //   if(text === 'x') {mesh.position.x = length;}
  //   if(text === 'y') {mesh.position.y = length;}
  //   if(text === 'z') {mesh.position.z = length;}
    
  //   return mesh;
  // }
}

DisplayLibrary.prototype.build2DAxes = function(length) {
  var axes = new THREE.Object3D();
  // var axis = new THREE.Line( new Three.Geometry(), new THREE.LineBasicMaterial({}))
  var arrowLength = length - length/100;
  var arrowHeight = length/100;

  //Build the axes, with dashed line for the negative axes
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(length, 0, 0), new THREE.Vector3(arrowLength, arrowHeight, 0), new THREE.Vector3(arrowLength, -arrowHeight, 0), 0x000000, false, length) );
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(-length, 0, 0), new THREE.Vector3(-arrowLength, arrowHeight, 0), new THREE.Vector3(-arrowLength, -arrowHeight, 0), 0x000000, true, length));
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(0, length, 0), new THREE.Vector3(0, arrowLength, arrowHeight), new THREE.Vector3(0, arrowLength, -arrowHeight), 0x000000, false, length));
  axes.add( buildAxis(new THREE.Vector3(0,0,0), new THREE.Vector3(0, -length, 0), new THREE.Vector3(0, -arrowLength, arrowHeight), new THREE.Vector3(0, -arrowLength, arrowHeight), 0x000000, true, length));

  // buildTicks(-length, length, 'x', axes);
  // buildTicks(-length, length, 'y', axes);

  //Build the end arrows, seperately from the axes in order to make them all solid
  axes.add( buildArrow(new THREE.Vector3(length, 0, 0), new THREE.Vector3(arrowLength, arrowHeight, 0), new THREE.Vector3(arrowLength, -arrowHeight, 0), 0x000000));
  axes.add( buildArrow(new THREE.Vector3(-length, 0, 0), new THREE.Vector3(-arrowLength, arrowHeight, 0), new THREE.Vector3(-arrowLength, -arrowHeight, 0), 0x000000));
  axes.add( buildArrow(new THREE.Vector3(0, length, 0), new THREE.Vector3(arrowHeight, arrowLength, 0), new THREE.Vector3(-arrowHeight, arrowLength, 0), 0x000000));
  axes.add( buildArrow(new THREE.Vector3(0, -length, 0), new THREE.Vector3(arrowHeight, -arrowLength, 0), new THREE.Vector3(-arrowHeight, -arrowLength, 0), 0x000000));

  // axes.add(label('x', length));
  // axes.add(label('y', length));

  this.scene.add(axes);
  this.axes = axes;

  /* -------------------------- Utility Methods for build axis function ------------------------ */
  function buildAxis(origin, end, arrowPoint1, arrowPoint2, color, dashed, length) {
    var geom = new THREE.Geometry();
    var mat;

    if(dashed) {
        mat = new THREE.LineDashedMaterial({ linewidth: 3, color: color, dashSize: length/100, gapSize: length/100});
    } else {
        mat = new THREE.LineBasicMaterial({ linewidth: 3, color: color});
    }
    

    geom.vertices.push(origin.clone());
    geom.vertices.push(end.clone());

    geom.computeLineDistances();
    

    var axis = new THREE.Line(geom, mat, THREE.LinePieces);

    return axis;
  }

  function buildArrow(end, arrowPoint1, arrowPoint2, color) {
    var arrowGeom = new THREE.Geometry();
    var arrowMat = new THREE.LineBasicMaterial({ linewidth: 3, color: color});

    arrowGeom.vertices.push(end.clone());
    arrowGeom.vertices.push(arrowPoint1.clone());
    arrowGeom.vertices.push(end.clone());
    arrowGeom.vertices.push(arrowPoint2.clone());

    arrowGeom.computeLineDistances();

    var arrow = new THREE.Line(arrowGeom, arrowMat, THREE.LinePieces);

    return arrow;
  }

  // function buildTicks(start, end, axis) {
  //   var tickGeom = new THREE.Geometry();
  //   var tickMat = new THREE.LineBasicMaterial({ linewidth: 3, color: 0x000000});
  //   var textMat = new THREE.MeshBasicMaterial( { color: 0x000000 } );
  //   var interval = parseInt((end - start)/20);
  //   if(axis === 'x') {
  //     if(interval > 0) {
  //       for(var i = start; i < end; i += interval) {
  //         tickGeom.vertices.push(new THREE.Vector3(i, -0.1, 0));
  //         tickGeom.vertices.push(new THREE.Vector3(i, 0.1, 0));
  //         var textGeo = new THREE.TextGeometry( i, {

  //           size: .25,
  //           height: .05,
  //           curveSegments: 4,

  //           font: 'Open Sans',
  //           weight: '400',
  //           style: 'normal',

  //           bevelThickness: 0,
  //           bevelSize: 0,
  //           bevelEnabled: false
  //         });
  //         var mesh = new THREE.Mesh(textGeo, textMat);
  //         mesh.position.x = i;
  //         mesh.position.y = -.2;
  //         axes.add(mesh);
  //       }
  //     }
  //   } else if(axis === 'y') {
  //     if(interval > 0) {
  //       for(var i = start; i < end; i += interval) {
  //         tickGeom.vertices.push(new THREE.Vector3(-0.1, i, 0));
  //         tickGeom.vertices.push(new THREE.Vector3(0.1, i, 0));
  //         var textGeo = new THREE.TextGeometry( i, {

  //           size: .25,
  //           height: .05,
  //           curveSegments: 4,

  //           font: 'gentilis',
  //           weight: 'normal',
  //           style: 'normal',

  //           bevelThickness: 0,
  //           bevelSize: 0,
  //           bevelEnabled: false
  //         });
  //         var mesh = new THREE.Mesh(textGeo, textMat);
  //         mesh.position.x = -.2;
  //         mesh.position.y = i;
  //         axes.add(mesh);
  //       }
  //     }
  //   }
  //   var ticks = new THREE.Line(tickGeom, tickMat, THREE.LinePieces);
  //   axes.add(ticks);
  // }

  // function label(text, length) {
  //   var textGeo = new THREE.TextGeometry( text, {

  //     size: .3,
  //     height: .05,
  //     curveSegments: 4,

  //     font: 'gentilis',
  //     weight: 'normal',
  //     style: 'normal',

  //     bevelThickness: 0,
  //     bevelSize: 0,
  //     bevelEnabled: false
  //   });
  //   var textMat = new THREE.MeshBasicMaterial( { color: 0x000000 } );
  //   var mesh = new THREE.Mesh(textGeo, textMat);
  //   if(text === 'x') {
  //     mesh.position.x = length;
  //     mesh.position.y = -.2
  //   }
  //   if(text === 'y') {
  //     mesh.position.y = length;
  //     mesh.position.x = -.2
  //   }
  //   if(text === 'z') {
  //     mesh.position.z = length;
  //   }
    
  //   return mesh;
  // }
}

DisplayLibrary.prototype.buildConstraintBox = function(sideLength, height) {
  var halfSide = sideLength/2;

  var corner1 = new THREE.Vector3(halfSide, halfSide, halfSide);
  var corner2 = new THREE.Vector3(halfSide, halfSide, -halfSide);
  var corner3 = new THREE.Vector3(halfSide, -halfSide, -halfSide);
  var corner4 = new THREE.Vector3(halfSide, -halfSide, halfSide);
  var corner5 = new THREE.Vector3(-halfSide, halfSide, halfSide);
  var corner6 = new THREE.Vector3(-halfSide, halfSide, -halfSide);
  var corner7 = new THREE.Vector3(-halfSide, -halfSide, -halfSide);
  var corner8 = new THREE.Vector3(-halfSide, -halfSide, halfSide);

  var cboxGeom = new THREE.Geometry();
  var cboxMat = new THREE.LineBasicMaterial({ linewidth: 3, color: 0x000000});

  cboxGeom.vertices.push(corner1);
  cboxGeom.vertices.push(corner2);

  cboxGeom.vertices.push(corner2);
  cboxGeom.vertices.push(corner3);

  cboxGeom.vertices.push(corner3);
  cboxGeom.vertices.push(corner4);

  cboxGeom.vertices.push(corner4);
  cboxGeom.vertices.push(corner1);

  cboxGeom.vertices.push(corner1);
  cboxGeom.vertices.push(corner5);

  cboxGeom.vertices.push(corner2);
  cboxGeom.vertices.push(corner6);

  cboxGeom.vertices.push(corner3);
  cboxGeom.vertices.push(corner7);

  cboxGeom.vertices.push(corner4);
  cboxGeom.vertices.push(corner8);

  cboxGeom.vertices.push(corner5);
  cboxGeom.vertices.push(corner6);

  cboxGeom.vertices.push(corner6);
  cboxGeom.vertices.push(corner7);

  cboxGeom.vertices.push(corner7);
  cboxGeom.vertices.push(corner8);

  cboxGeom.vertices.push(corner8);
  cboxGeom.vertices.push(corner5);

  var cbox = new THREE.Line(cboxGeom, cboxMat, THREE.LinePieces);

  this.scene.add(cbox);
  this.cbox = cbox;
}

DisplayLibrary.buildRoom = function(size) {
  var room = new THREE.Object3D();
  var geo1 = new THREE.Geometry();
  var geo2 = new THREE.Geometry();
  var geo3 = new THREE.Geometry();
  var mat1 = new THREE.PointCloudMaterial({color: 0x0000ff, size: 4});
  var mat2 = new THREE.PointCloudMaterial({color: 0x00ff00, size: 4});
  var mat3 = new THREE.PointCloudMaterial({color: 0xff0000, size: 4});

  //Create the walls of the room
  for(var i = 0; i < size; i+=(size/10)) {
    for(var j = 0; j < size; j+=(size/10)) {
      geo1.vertices.push(new THREE.Vector3(-i,-j,size));
      geo1.vertices.push(new THREE.Vector3(i,j,size));
      geo1.vertices.push(new THREE.Vector3(-i,j,size));
      geo1.vertices.push(new THREE.Vector3(i,-j,size));

      geo1.vertices.push(new THREE.Vector3(-i,-j,-size));
      geo1.vertices.push(new THREE.Vector3(i,j,-size));
      geo1.vertices.push(new THREE.Vector3(-i,j,-size));
      geo1.vertices.push(new THREE.Vector3(i,-j,-size));

      geo2.vertices.push(new THREE.Vector3(-i,size,-j));
      geo2.vertices.push(new THREE.Vector3(i,size,j));
      geo2.vertices.push(new THREE.Vector3(-i,size,j));
      geo2.vertices.push(new THREE.Vector3(i,size,-j));

      geo2.vertices.push(new THREE.Vector3(-i,-size,-j));
      geo2.vertices.push(new THREE.Vector3(i,-size,j));
      geo2.vertices.push(new THREE.Vector3(-i,-size,j));
      geo2.vertices.push(new THREE.Vector3(i,-size,-j));

      geo3.vertices.push(new THREE.Vector3(size,-i,-j));
      geo3.vertices.push(new THREE.Vector3(size,i,j));
      geo3.vertices.push(new THREE.Vector3(size,-i,j));
      geo3.vertices.push(new THREE.Vector3(size,i,-j));

      geo3.vertices.push(new THREE.Vector3(-size,-i,-j));
      geo3.vertices.push(new THREE.Vector3(-size,i,j));
      geo3.vertices.push(new THREE.Vector3(-size,-i,j));
      geo3.vertices.push(new THREE.Vector3(-size,i,-j));
    }
  }
  room.add(new THREE.PointCloud(geo1, mat1));
  room.add(new THREE.PointCloud(geo2, mat2));
  room.add(new THREE.PointCloud(geo3, mat3));

  this.scene.add(room);
}

DisplayLibrary.prototype.drawLine = function(start, end, width, color) {
  var line = new THREE.Geometry();
  var mat = new THREE.LineBasicMaterial({linewidth: width, color: color});
  line.vertices.push(start);
  line.vertices.push(end);
  return new THREE.Line(line, mat, THREE.LinePieces); //Return the line instead of drawing the scene, in order to draw it in multiple contexts
}

DisplayLibrary.prototype.drawArc = function(start, angle, axis, size, width, color) {
  var arc = new THREE.Geometry();
  var mat = new THREE.LineBasicMaterial({linewidth: width, color: color});
  arc.vertices.push(start);
  if(angle > 0) {
    for(var i = 0; i < angle; i+= .01) {
      pushPoints(i);
    }
  } else if(angle < 0) {
    for(var i = 0; i > angle; i-= .01) {
      pushPoints(i);
    }
  }
  return new THREE.Line(arc, mat);
  
  function pushPoints(i) {
    if(axis.toLowerCase() === 'x') {
      arc.vertices.push(new THREE.Vector3(start.x, start.y + size*(Math.cos(i) - 1), start.z + size*Math.sin(i)));
    } else if(axis.toLowerCase() === 'y') {
      arc.vertices.push(new THREE.Vector3(start.x - size*(Math.cos(i) - 1), start.y, start.z + size*Math.sin(i)));
    } else if(axis.toLowerCase() === 'z') {
      arc.vertices.push(new THREE.Vector3(start.x + size*Math.sin(i), start.y - size*(Math.cos(i) - 1), start.z));
    } else {
      console.log('Arc Rotation error, axis not specified');
    }
  }
}

DisplayLibrary.prototype.drawXYZDistances = function(x,y,z) {
  var xline = this.scene.getObjectByName('xline');
  this.scene.remove(xline);
  var yline = this.scene.getObjectByName('yline');
  this.scene.remove(yline);
  var zline = this.scene.getObjectByName('zline');
  this.scene.remove(zline);
  xline = this.drawLine(new THREE.Vector3(0,0,0), new THREE.Vector3(x,0,0), 10, 0xff0000);
  xline.name = 'xline'
  this.scene.add(xline);
  yline = this.drawLine(new THREE.Vector3(x,0,0), new THREE.Vector3(x,y,0), 10, 0x00ff00);
  yline.name = 'yline'
  this.scene.add(yline);
  zline = this.drawLine(new THREE.Vector3(x,y,0), new THREE.Vector3(x,y,z), 10, 0x0000ff);
  zline.name = 'zline'
  this.scene.add(zline);
}



/* -------------------- Create 2D Function -------------------- 
Generate an arbitrary surface passed on the equation passed in.

Input: params - a javasript object passed in containing the the following optional attributes
functionInput: the input function to be plotted
meshInterval: the mesh interval for the grid
xstart: the lower x value bound
xend:the upper x value bound


Output: Will create the surface
------------------------------------------------------------------*/


DisplayLibrary.prototype.showDerivative = function(params) {
  var parser = math.parser();
  parser.eval('f(x) = ' + params.functionInput);
  
  var location = Number(params.location);
  var yval = solveEquation(location);
  var derivLength = 1;
  var xstart = location - derivLength;
  var xend = location + derivLength;
  var h = .01;

  var hminus = solveEquation(location - h);
  var hplus = solveEquation(location + h);
  var slope = (hplus - hminus)/(2*h);

  var ystart = yval - derivLength*slope;
  var yend = yval + derivLength*slope;

  var geo = new THREE.Geometry();
  var mat = new THREE.LineBasicMaterial({linewidth: 5, color: 0x000000});


  //Reset the surface
  if(!(currentObject === null)) {
    var currentObject = this.scene.getObjectByName('currentDerivative');
    this.scene.remove(currentObject);
  }

  geo.vertices.push(new THREE.Vector3(xstart, ystart, 0));
  geo.vertices.push(new THREE.Vector3(xend, yend, 0));
  var functionObject = new THREE.Line(geo, mat);
  this.scene.add(functionObject);
  functionObject.name = 'currentDerivative';
  function solveEquation(x) {
    //Pass in a parser with a function f(x,y) define
    var functionAt = 'f('+x+')';
    var val = parser.eval(functionAt);
    return Number(val);
  }
}

export default DisplayLibrary;
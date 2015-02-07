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
  for(var i = 0; i < meshPoints-1; i++) {
    var sI = meshPoints*(i+1); //For first starting index
    var sI2 = meshPoints*(i+2); //For second starting index
    geo.faces.push(new THREE.Face3(sI, sI2, i));
    geo.faces.push(new THREE.Face3(sI2, i+1, i));

    geo.faces.push(new THREE.Face3(sI2+100, sI+100, i));
    geo.faces.push(new THREE.Face3(sI2+100, i, i+1));
  }
  for(var i = 0; i < meshPoints; i++) {
    var sI = meshPoints*(i+1); //For first starting index
    var sI2 = meshPoints*(i+2); //For second starting index
    for(var j = 0; j < meshPoints-1; j ++) {
      if(i === 0) {
        //First Point, Fill end
        geo.faces.push(new THREE.Face3(sI+j+1, sI+j, 0));
        //Filll Body
        geo.faces.push(new THREE.Face3(sI+j, sI+j+1, sI2+j));
        geo.faces.push(new THREE.Face3(sI2+j, sI+j+1, sI2+j+1));
      } else if(i === meshPoints-1) {
        //Last Point, Fill end
        geo.faces.push(new THREE.Face3(sI+j, sI+j+1, meshPoints-1));
      } else {
        geo.faces.push(new THREE.Face3(sI+j, sI+j+1, sI2+j));
        geo.faces.push(new THREE.Face3(sI2+j, sI+j+1, sI2+j+1));
      }
      // if(j === 0 && i !== meshPoints-1) {
      //   //First or last, fill end
      //   geo.faces.push(new THREE.Face3(sI+j, sI2+j, i));

      //   geo.faces.push(new THREE.Face3(sI2+j, i+1, i));
      // } else if(j === meshPoints-2 && i !== meshPoints-1) {
      //   //First or last, fill end
      //   geo.faces.push(new THREE.Face3(sI2+j+1, sI+j+1, i));

      //   geo.faces.push(new THREE.Face3(sI2+j+1, i, i+1));
      // }
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
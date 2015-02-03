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
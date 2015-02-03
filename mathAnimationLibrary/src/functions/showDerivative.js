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
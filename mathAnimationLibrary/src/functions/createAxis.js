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
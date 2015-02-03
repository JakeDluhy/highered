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
  functionObject = new THREE.Mesh( geometry, itemMaterial);
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
DisplayLibrary.prototype.crossSection3D = function(params) {
  var start = Number(params.start);
  var end = Number(params.end);
  var range = end - start;
  
  var axis = (params.axis === undefined ? 'x' : params.axis);
  var crossSections = (params.crossSecions === undefined ? 10 : parseInt(Number(params.crossSecions)));
  var csWidth = range/crossSections;
  var firstFuncVal;
  var secondFuncVal;
  var csLength;

  var parser = math.parser();
  if(axis === 'y') {
    parser.eval('f(y) = ' + params.functionOne);
    parser.eval('g(y) = ' + params.functionTwo);
  } else {
    parser.eval('f(x) = ' + params.functionOne);
    parser.eval('g(x) = ' + params.functionTwo);
  }
  var csShape = (params.csShape === undefined ? 'square' : params.csShape);

  var mI = (end - start)/100;
  var meshPoints = Math.floor(range/mI)+1;

  var geo = new THREE.Geometry();

  //Reset the surface
  if(!(currentObject === null)) {
    var currentObject = this.scene.getObjectByName('current');
    this.scene.remove(currentObject);
  }

  for(var i=0; i < crossSections; i++) {
    var firstVal = start + i*csWidth; // Get the first CS value
    var midVal = (start + csWidth/2) + i*csWidth;   // Centered rieman sums: start in between the CS width
    var lastVal = start + (i+1)*csWidth; // Get the end CS value
    var firstFuncVal = getFirstVal(midVal);
    var secondFuncVal = getSecondVal(midVal);
    var funcMiddleVal = (firstFuncVal + secondFuncVal)/2;
    var funcRadius = Math.abs((firstFuncVal - secondFuncVal)/2);
    if(secondFuncVal > firstFuncVal) {
      var temp = secondFuncVal;
      secondFuncVal = firstFuncVal;
      firstFuncVal = temp;
    }
    csLength = Math.abs(secondFuncVal - firstFuncVal); // Get the length of the cross section

    if(axis === 'y') {
      if(csShape === 'square') {
        
        geo.vertices.push(new THREE.Vector3(secondFuncVal, firstVal, 0));
        geo.vertices.push(new THREE.Vector3(firstFuncVal, firstVal, 0));
        geo.vertices.push(new THREE.Vector3(secondFuncVal, firstVal, csLength));
        geo.vertices.push(new THREE.Vector3(firstFuncVal, firstVal, csLength));

        geo.vertices.push(new THREE.Vector3(secondFuncVal, lastVal, 0));
        geo.vertices.push(new THREE.Vector3(firstFuncVal, lastVal, 0));
        geo.vertices.push(new THREE.Vector3(secondFuncVal, lastVal, csLength));  
        geo.vertices.push(new THREE.Vector3(firstFuncVal, lastVal, csLength));
      } else if(csShape === 'triangle') {
        geo.vertices.push(new THREE.Vector3(secondFuncVal, firstVal, 0));
        geo.vertices.push(new THREE.Vector3(firstFuncVal, firstVal, 0));
        geo.vertices.push(new THREE.Vector3((firstFuncVal+secondFuncVal)/2, firstVal, csLength*(Math.sqrt(3)/2)));

        geo.vertices.push(new THREE.Vector3(secondFuncVal, lastVal, 0));
        geo.vertices.push(new THREE.Vector3(firstFuncVal, lastVal, 0));
        geo.vertices.push(new THREE.Vector3((firstFuncVal+secondFuncVal)/2, lastVal, csLength*(Math.sqrt(3)/2)));
      } else if(csShape === 'semicircle') {
        geo.vertices.push(new THREE.Vector3(funcMiddleVal, lastVal, 0));
        geo.vertices.push(new THREE.Vector3(funcMiddleVal, firstVal, 0));
        for(var j=0; j <= 100; j++) {
          var theta = Math.PI*j/100; // Get the value for theta on the semicircle
          var planeValue = funcMiddleVal - funcRadius*Math.cos(theta);
          var zValue = funcRadius*Math.sin(theta);
          geo.vertices.push(new THREE.Vector3(planeValue, lastVal, zValue));
          geo.vertices.push(new THREE.Vector3(planeValue, firstVal, zValue));
          
        }
      }
    } else {
      if(csShape === 'square') {
        geo.vertices.push(new THREE.Vector3(firstVal, firstFuncVal, 0));
        geo.vertices.push(new THREE.Vector3(firstVal, secondFuncVal, 0));
        geo.vertices.push(new THREE.Vector3(firstVal, firstFuncVal, csLength));
        geo.vertices.push(new THREE.Vector3(firstVal, secondFuncVal, csLength));

        geo.vertices.push(new THREE.Vector3(lastVal, firstFuncVal, 0));
        geo.vertices.push(new THREE.Vector3(lastVal, secondFuncVal, 0));
        geo.vertices.push(new THREE.Vector3(lastVal, firstFuncVal, csLength));
        geo.vertices.push(new THREE.Vector3(lastVal, secondFuncVal, csLength));
      } else if(csShape === 'triangle') {
        geo.vertices.push(new THREE.Vector3(firstVal, firstFuncVal, 0));
        geo.vertices.push(new THREE.Vector3(firstVal, secondFuncVal, 0));
        geo.vertices.push(new THREE.Vector3(firstVal, (firstFuncVal+secondFuncVal)/2, csLength*(Math.sqrt(3)/2)));

        geo.vertices.push(new THREE.Vector3(lastVal, firstFuncVal, 0));
        geo.vertices.push(new THREE.Vector3(lastVal, secondFuncVal, 0));
        geo.vertices.push(new THREE.Vector3(lastVal, (firstFuncVal+secondFuncVal)/2, csLength*(Math.sqrt(3)/2)));
      } else if(csShape === 'semicircle') {
        geo.vertices.push(new THREE.Vector3(firstVal, funcMiddleVal, 0));
        geo.vertices.push(new THREE.Vector3(lastVal, funcMiddleVal, 0));
        for(var j=0; j <= 100; j++) {
          var theta = Math.PI*j/100; // Get the value for theta on the semicircle
          var planeValue = funcMiddleVal - funcRadius*Math.cos(theta);
          var zValue = funcRadius*Math.sin(theta);
          geo.vertices.push(new THREE.Vector3(firstVal, planeValue, zValue));
          geo.vertices.push(new THREE.Vector3(lastVal, planeValue,  zValue));
        }
      }
    }
  }

  var sI; // Starting Index
  for(var i=0; i < crossSections; i++) {
    if(csShape === 'square') {
      sI = i*8;
      geo.faces.push(new THREE.Face3(sI, sI+1, sI+2));
      geo.faces.push(new THREE.Face3(sI+1, sI+3, sI+2));

      geo.faces.push(new THREE.Face3(sI+1, sI+5, sI+3));
      geo.faces.push(new THREE.Face3(sI+5, sI+7, sI+3));

      geo.faces.push(new THREE.Face3(sI, sI+5, sI+1));
      geo.faces.push(new THREE.Face3(sI, sI+4, sI+5));

      geo.faces.push(new THREE.Face3(sI, sI+2, sI+4));
      geo.faces.push(new THREE.Face3(sI+2, sI+6, sI+4));

      geo.faces.push(new THREE.Face3(sI+2, sI+3, sI+7));
      geo.faces.push(new THREE.Face3(sI+2, sI+7, sI+6));

      geo.faces.push(new THREE.Face3(sI+4, sI+7, sI+5));
      geo.faces.push(new THREE.Face3(sI+4, sI+6, sI+7));
    } else if(csShape === 'triangle') {
      sI = i*6;
      geo.faces.push(new THREE.Face3(sI, sI+1, sI+2));

      geo.faces.push(new THREE.Face3(sI+1, sI+4, sI+2));
      geo.faces.push(new THREE.Face3(sI+2, sI+4, sI+5));

      geo.faces.push(new THREE.Face3(sI, sI+4, sI+1));
      geo.faces.push(new THREE.Face3(sI, sI+3, sI+4));

      geo.faces.push(new THREE.Face3(sI, sI+2, sI+5));
      geo.faces.push(new THREE.Face3(sI, sI+5, sI+3));

      geo.faces.push(new THREE.Face3(sI+3, sI+5, sI+4));
    } else if(csShape === 'semicircle') {
      // There are 204 vertices for each cross section - 0,1 are the centers of the semicircles,
      // and 2-203 are the vertices along the circle (101x2)
      sI = i*204;
      // Push bottom
      geo.faces.push(new THREE.Face3(sI+2, sI+203, sI+3));
      geo.faces.push(new THREE.Face3(sI+2, sI+202, sI+203));
      // Start at 2, which is there the beginning of the semicircle is. End just before the last set of points
      for(var j = 2; j < 202; j+=2) {
        // Push the top of the semicircle
        geo.faces.push(new THREE.Face3(sI+j, sI+j+1, sI+j+3));
        geo.faces.push(new THREE.Face3(sI+j, sI+j+3, sI+j+2));
        // Push the sides of the semicircle
        geo.faces.push(new THREE.Face3(sI+j, sI+j+2, sI));
        geo.faces.push(new THREE.Face3(sI+j+1, sI+1, sI+j+3));
      }
    }
  }

  geo.computeFaceNormals();
  geo.computeVertexNormals();
  var mat = new THREE.MeshNormalMaterial( { color: 0x990000 } );

  var functionObject = new THREE.Mesh( geo, mat);
  console.log(functionObject);

  this.scene.add(functionObject);
  functionObject.name = 'current';

  function getFirstVal(v) {
    // Pass in the value to find the value of the f(v) function
    var functionTag = 'f('+v+')';
    var result = parser.eval(functionTag);
    return Number(result);
  }
  function getSecondVal(v) {
    // Pass in the value to find the value of the g(v) function
    var functionTag = 'g('+v+')';
    var result = parser.eval(functionTag);
    return Number(result);
  }
}



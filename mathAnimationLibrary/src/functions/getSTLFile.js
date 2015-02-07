

DisplayLibrary.prototype.getSTLFile = function(params) {
  var rotationObject = this.scene.getObjectByName('current');
  var faces = [];
  var startingIndex;
  var geometryFaces = rotationObject.geometry.faces;
  var geometryVerts = rotationObject.geometry.vertices;
  console.log(rotationObject);
  if(rotationObject.morphTargetInfluences[rotationObject.morphTargetInfluences.length - 1] >= 0.9) { //Check whether on last morph target (complete object)
    //If complete object, skip first 400 faces, which make up the ends of the object (that would be inside the solid)
    startingIndex = 400;
    var frame = 20;
  } else {
    //Start at 0 to have a complete object
    var frame = getPrevFrame(rotationObject.morphTargetInfluences) + 1;
    startingIndex = 0;
  }

  //Push faces into the string
  var stlString = "solid RevolutionsOfSolids \n";
  for(var i = startingIndex; i < geometryFaces.length; i++) {
    stlString += ("facet normal "+stringifyVector([geometryFaces[i].normal.x.toPrecision(6), geometryFaces[i].normal.y.toPrecision(6), geometryFaces[i].normal.z.toPrecision(6)]));
    stlString += ("outer loop \n");
    stlString += ("vertex " + stringifyVector(linInterpolate(geometryFaces[i].a, rotationObject.geometry.morphTargets, frame, rotationObject.morphTargetInfluences[frame])));
    stlString += ("vertex " + stringifyVector(linInterpolate(geometryFaces[i].b, rotationObject.geometry.morphTargets, frame, rotationObject.morphTargetInfluences[frame])));
    stlString += ("vertex " + stringifyVector(linInterpolate(geometryFaces[i].c, rotationObject.geometry.morphTargets, frame, rotationObject.morphTargetInfluences[frame])));
    stlString += ("endloop \n");
    stlString += ("endfacet \n");
    // var v1 = linInterpolate(geometryFaces[i].a, rotationObject.geometry.morphTargets, prevFrame, rotationObject.morphTargetInfluences[prevFrame+1]);
    // var v2 = linInterpolate(geometryFaces[i].b, rotationObject.geometry.morphTargets, prevFrame, rotationObject.morphTargetInfluences[prevFrame+1]);
    // var v3 = linInterpolate(geometryFaces[i].c, rotationObject.geometry.morphTargets, prevFrame, rotationObject.morphTargetInfluences[prevFrame+1]);
  }
  stlString += ("endsolid");
  // for(var i = startingIndex; i < geometryFaces.length; i++) {
  //   stlString += stringifyVector([geometryFaces[i].normal.x.toPrecision(6), geometryFaces[i].normal.y.toPrecision(6), geometryFaces[i].normal.z.toPrecision(6)]);
  //   stlString += (stringifyVector(linInterpolate(geometryFaces[i].a, rotationObject.geometry.morphTargets, prevFrame, rotationObject.morphTargetInfluences[prevFrame+1])));
  //   stlString += (stringifyVector(linInterpolate(geometryFaces[i].b, rotationObject.geometry.morphTargets, prevFrame, rotationObject.morphTargetInfluences[prevFrame+1])));
  //   stlString += (stringifyVector(linInterpolate(geometryFaces[i].c, rotationObject.geometry.morphTargets, prevFrame, rotationObject.morphTargetInfluences[prevFrame+1])));
  //   stlString += "0 \n";

  // }

  var blob = new Blob([stlString], {type: 'text/plain'});

  return blob;


  

  function getPrevFrame(mtInfluences) {
    for(var i=0; i < mtInfluences.length; i++) {
      if(mtInfluences[i] !== 0) {
        return i;
      }
    }
  }

  function linInterpolate(vertex, morphTargets, prevFrame, morphFraction) {
    var vert1 = morphTargets[frame-1].vertices[vertex];
    var vert2 = morphTargets[frame].vertices[vertex];
    var xyz = [];
    //Round to about 4 decimals
    xyz[0] = (vert1.x + (vert2.x - vert1.x)*morphFraction).toPrecision(6);
    xyz[1] = (vert1.y + (vert2.y - vert1.y)*morphFraction).toPrecision(6);
    xyz[2] = (vert1.z + (vert2.z - vert1.z)*morphFraction).toPrecision(6);
    return xyz;
  }

  function stringifyVector(vec) {
    return vec[0]+" "+vec[1]+" "+vec[2]+" \n";
  }
}
var THREE = require('../vendor/three.js');
var math = require('../vendor/math.js');

function DisplayLibrary(container, javaContainer, buildAxes, buildConstraintBox, buildRoom) {
  //Set instance variables
  //Set class variables in the prototype
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, container.width() / container.height(), 0.1, 1000);
  var renderer = new THREE.WebGLRenderer();
  this.scene = scene;
  this.camera = camera;
  this.renderer = renderer;

  renderer.setSize(container.width(), container.height());
  renderer.setClearColor( 0xffffff, 1 );
  container.append(renderer.domElement);
  //Work in Java Container
  controls = new THREE.TrackballControls(camera, javaContainer);

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
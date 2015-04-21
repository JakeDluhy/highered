import Ember from 'ember';
import DisplayLibrary from '../../libraries/mathAnimationLibrary/dist/display-library';

var DemosBridgeBuilderView = Ember.View.extend({
	classNames: ['full-height-view'],
  templateName: 'demos/bridge-builder',
  didInsertElement: function(){
  	var self = this;
  	this.get('controller').on('chooseView', this, this.chooseView);


  	if(this.threeDView) {
  		Ember.run.next(function(){
	      var container = $('.primary-container');
	      var javaContainer = container[0];
	      var display = new DisplayLibrary(container, javaContainer, true, false, false);
	      self.display = display;
	      self.display3D();
	    });
  	} else {
	  	var svgContainer = d3.select('.primary-container').append('svg')
	  											 .attr("width", "100%")
	  											 .attr("height", "100%");
	  	this.initD3(svgContainer);
	  	this.setupListeners(svgContainer);
	  }
  },

  initD3: function(container) {
  	var self = this;
  	if(localStorage.getItem('environment') === 'undefined' || localStorage.getItem('environment') === null)  {
  		this.environment = {
	  		lineSpacing: 50,
				labelSpacingFactor: 2,
				scaleFactor: 1,
				snapSpacing: 25,
				view: 'side'
	  	}
	  	this.saveEnvironment(this.environment);
  	} else {
  		this.environment = this.retrieveEnvironment();
  	}
  	
  	this.drawCoordinates(container);
		this.initCursor(container);
		this.loadLines(container);

  	var filter = container
		.append("defs")
	  .append("filter")
	    .attr("id", "blur")
	  .append("feGaussianBlur")
	    .attr('in', 'SourceAlpha')
	    .attr("stdDeviation", 2)
	    .attr('result', 'blur');
  },

  loadLines: function(container) {
  	var self = this;
  	var view = this.environment.view;
  	this.isDrawing = false;
  	this.linesData = {
  		top: [],
  		bottom: [],
  		side: []
  	};
  	var lineContainer = container.append('g').attr('class', 'line-container');
  	if(localStorage.getItem('linesData') !== null) {
  		var linesData = this.retrieveDesign();
  					for(var i=0; i<linesData[view].length; i++) {
  			var newLine = lineContainer.append('line').data([linesData[view][i]])
		  			.attr('x1', function(d) {
							return self.convertCoordsToPixelsX(d.x1);
			  		})
						.attr('y1', function(d) {
							return self.convertCoordsToPixelsY(d.y1);
						})
						.attr('x2', function(d) {
							return self.convertCoordsToPixelsX(d.x2);
			  		})
						.attr('y2', function(d) {
							return self.convertCoordsToPixelsY(d.y2);
						})
						.attr('stroke-width', 3)
					 .attr('stroke', '#000');

				self.linesData[view].push(newLine);
  		}
  	}
  },

  clearLines: function(svgContainer) {
  	svgContainer.select('.line-container').remove();
  },

  display3D: function() {
  	var linesData = this.retrieveDesign();
  	if(this.fullDisplay) {
  		this.display.renderBridge(linesData);
  	} else {
		  this.display.renderLineDesign(linesData[this.environment.view]);
		}
  },

  saveDesign: function() {
  	var view = this.environment.view;
  	if(localStorage.getItem('linesData') !== null) {
  		var linesData = this.retrieveDesign();
  	} else {
  		var linesData = {
	  		'top': [],
	  		'bottom': [],
	  		'side': []
	  	};
  	}
  	linesData[view] = [];
		for(var i=0; i<this.linesData[view].length; i++) {
  		linesData[view].push(this.linesData[view][i].data()[0]);
  	}
  	localStorage.setItem('linesData', JSON.stringify(linesData));
  },
  retrieveDesign: function() {
  	return JSON.parse(localStorage.getItem('linesData'));
  },
  saveEnvironment: function(environment) {
  	environment.cursor = '';
  	localStorage.setItem('environment', JSON.stringify(environment));
  },
  retrieveEnvironment: function() {
  	return JSON.parse(localStorage.getItem('environment'));
  },

  setupListeners: function(container) {
  	var self = this;
  	container.on('mousemove', function() {
  		var pt = d3.mouse(this);
  		self.moveCursor(container, pt[0], pt[1]);
  	});
  	container.on('mouseleave', function() {
  		self.removeCursor(container);
  	});
  	container.on('mouseenter', function() {
  		self.initCursor(container);
  	});
  	container.on('click', function() {
  		if(self.isDrawing) {
  			self.isDrawing = false;
  			self.saveDesign();
  		} else {
  			var drawingStart = d3.mouse(this);
  			drawingStart = self.snapCoords(drawingStart[0], drawingStart[1], self.environment.snapSpacing);
  			var data = [{
  				x1: self.convertPixelsToCoordsX(drawingStart[0]),
  				y1: self.convertPixelsToCoordsY(drawingStart[1])
  			}];
  			var newLine = container.select('.line-container').append('line')
  										.data(data)
  										.attr('x1', function(d) {
  											return self.convertCoordsToPixelsX(d.x1);
  										})
  										.attr('y1', function(d) {
  											return self.convertCoordsToPixelsY(d.y1);
  										});
  			self.linesData[self.environment.view].push(newLine);
  			self.isDrawing = true;
  		}
  	});
  },

  // flipVerts: function(line) {
  // 	var data = line.data()[0];
		// if(Math.abs(data.x2-data.x1) >= Math.abs(data.y2-data.y1)) {
  //     if(data.x1 > data.x2) {
  //       var temp = [data.x1,data.x2,data.y1,data.y2];
  //       data.x1 = temp[1];
  //       data.x2 = temp[0];
  //       data.y1 = temp[3];
  //       data.y2 = temp[2];
  //     }
  //   } else {
  //     if(data.y2 > data.y1) {
  //       var temp = [data.x1,data.x2,data.y1,data.y2];
  //       data.x1 = temp[1];
  //       data.x2 = temp[0];
  //       data.y1 = temp[3];
  //       data.y2 = temp[2];
  //     }
  //   }
  // },
	chooseView: function(view) {
		this.environment.view = view;
		this.saveEnvironment(this.environment);
		if(this.threeDView) {
			this.display3D();
		} else {
			var svgContainer = d3.select('.primary-container').select('svg');
			this.clearLines(svgContainer);
			this.loadLines(svgContainer);
		}
	},
  moveCursor: function(container, x1, y1) {
  	var cursor = this.environment.cursor;
  	var newCoords = this.snapCoords(x1, y1, this.environment.snapSpacing);
  	var xNew = newCoords[0];
  	var yNew = newCoords[1];

  	cursor.attr('cx', xNew).attr('cy', yNew);
  	if(this.isDrawing) {
  		this.drawLine(container, xNew, yNew);
  	}
  },
  snapCoords: function(x1, y1, spacing) {
  	var xSpacing = x1%spacing;
  	var ySpacing = y1%spacing;
  	((spacing-xSpacing) < xSpacing ? xSpacing = spacing-xSpacing : xSpacing = xSpacing);
  	((spacing-ySpacing) < ySpacing ? ySpacing = spacing-ySpacing : ySpacing = ySpacing);

  	if((Math.pow(xSpacing, 2) + Math.pow(ySpacing, 2)) > Math.pow(spacing/5, 2)) {
  		return [x1, y1];
  	} else {
  		var xReturn = Math.round(x1/spacing)*spacing;
  		var yReturn = Math.round(y1/spacing)*spacing;
  		return [xReturn, yReturn];
  	}
  },
  convertPixelsToCoordsX: function(x1) {
  	var xOrigin = this.environment.xOrigin;
		var scaleFactor = this.environment.scaleFactor;

		var xCoord = (x1 - xOrigin)/scaleFactor;
		return xCoord;
  },
  convertPixelsToCoordsY: function(y1) {
  	var yOrigin = this.environment.yOrigin;
		var scaleFactor = this.environment.scaleFactor;

		var yCoord = (yOrigin - y1)/scaleFactor;
		return yCoord;
  },
  convertCoordsToPixelsX: function(x1) {
  	var xOrigin = this.environment.xOrigin;
  	var scaleFactor = this.environment.scaleFactor;

  	var xPixel = (x1*scaleFactor + xOrigin);
  	return xPixel;
  },
  convertCoordsToPixelsY: function(y1) {
  	var yOrigin = this.environment.yOrigin;
  	var scaleFactor = this.environment.scaleFactor;

  	var yPixel = (yOrigin - y1*scaleFactor);
  	return yPixel;
  },
  initCursor: function(container) {
  	var cursor = container.append('circle')
								  					 .attr('r', 5)
								  					 .style({'fill': '#03A9F4'})
								  					 .attr('class', 'cursor')
								  					 .attr('filter', 'url(#blur)');
		this.environment.cursor = cursor;
  },
  removeCursor: function(container) {
  	this.environment.cursor.remove();
  },
  drawLine: function(container, x2, y2) {
  	var view = this.environment.view;
  	var self = this;
		var line = this.linesData[view][this.linesData[view].length-1];
		var data = line.data()[0];
		data.x2 = this.convertPixelsToCoordsX(x2);
		data.y2 = this.convertPixelsToCoordsY(y2);
		line.data([data])
				.attr('x2', function(d) {
					return self.convertCoordsToPixelsX(d.x2);
	  		})
				.attr('y2', function(d) {
					return self.convertCoordsToPixelsY(d.y2);
				})
				.attr('stroke-width', 3)
			 .attr('stroke', '#000');
  },
  drawCoordinates: function(svgContainer) {
  	var scaleFactor = this.environment.scaleFactor;
  	var lineSpacing = this.environment.lineSpacing;
  	var w = svgContainer.style('width').replace('px', '');
  	var h = svgContainer.style('height').replace('px', '');
  	var halfWidth = Math.round(w/2/(lineSpacing*scaleFactor))*lineSpacing*scaleFactor;
  	var halfHeight = Math.round(h/2/(lineSpacing*scaleFactor))*lineSpacing*scaleFactor;
  	this.environment.xOrigin = halfWidth;
  	this.environment.yOrigin = halfHeight;
  	var coordinateContainer = svgContainer.append('g').attr('class', 'coordinateContainer');
  	for(var x=0; x < w; x+=lineSpacing*scaleFactor) {
  		coordinateContainer.append('line')
  								.attr('x1', x)
  								.attr('y1', 0)
  								.attr('x2', x)
  								.attr('y2', h)
  								.attr('stroke-width', 2)
  								.attr('stroke', '#f2f0e9');
  	}
  	for(var y=0; y < h; y+=lineSpacing*scaleFactor) {
  		coordinateContainer.append('line')
  								.attr('x1', 0)
  								.attr('y1', y)
  								.attr('x2', w)
  								.attr('y2', y)
  								.attr('stroke-width', 2)
  								.attr('stroke', '#f2f0e9');
  	}

  	coordinateContainer.append('line')
	  						.attr('x1', halfWidth)
								.attr('y1', 0)
								.attr('x2', halfWidth)
								.attr('y2', h)
								.attr('stroke-width', 2)
								.attr('stroke', '#ebe7df');
		coordinateContainer.append('line')
	  						.attr('x1', 0)
								.attr('y1', halfHeight)
								.attr('x2', w)
								.attr('y2', halfHeight)
								.attr('stroke-width', 2)
								.attr('stroke', '#ebe7df');

		var textContainer = svgContainer.append('g').attr('class', 'text-container');
		textContainer.append('text').text('x').style({'font-size': '18px', 'fill': '#cfc8b2', 'font-weight': 'bold'}).attr('y', halfHeight+15).attr('x', w-15);
		textContainer.append('text').text('y').style({'font-size': '18px', 'fill': '#cfc8b2', 'font-weight': 'bold'}).attr('y', 15).attr('x', halfWidth-15);

  	var labelSpacing = this.environment.labelSpacingFactor;
  	for(x=lineSpacing*labelSpacing/scaleFactor; x < (w - halfWidth)/scaleFactor; x +=lineSpacing*labelSpacing/scaleFactor) {
  		textContainer.append('text').text(x).style({'font-size': '14px', 'fill': '#cfc8b2', 'font-weight': 'bold'}).attr('y', halfHeight+12).attr('x', (halfWidth+x*scaleFactor)-10);
  		textContainer.append('text').text("-"+x).style({'font-size': '14px', 'fill': '#cfc8b2', 'font-weight': 'bold'}).attr('y', halfHeight+12).attr('x', (halfWidth-x*scaleFactor)-10);
  	}
  	for(y=lineSpacing*labelSpacing/scaleFactor; y < (h - halfHeight)/scaleFactor; y +=lineSpacing*labelSpacing/scaleFactor) {
  		textContainer.append('text').text(y).style({'font-size': '14px', 'fill': '#cfc8b2', 'font-weight': 'bold'}).attr('y', halfHeight-y*scaleFactor+5).attr('x', halfWidth-28);
  		textContainer.append('text').text("-"+y).style({'font-size': '14px', 'fill': '#cfc8b2', 'font-weight': 'bold'}).attr('y', halfHeight+y*scaleFactor+5).attr('x', halfWidth-28);
  	}
  },



  actions: {
  	toggleView: function() {
	  	this.threeDView = !this.threeDView;
	  	$('.primary-container').empty();
	  	this.didInsertElement();
	  },

	  displayBridge: function() {
	  	this.threeDView = !this.threeDView;
	  	this.fullDisplay = !this.fullDisplay;
	  	$('.primary-container').empty();
	  	this.didInsertElement();
	  },

	  getSTLFile: function() {
      var name = this.get('controller').get('printName');
      var blob = this.display.getSTLFile(this.params);
      saveAs(blob, (name + '.stl'));
    },


  	expandOptions: function() {
      this.expandOptions();
    },
    collapseOptions: function() {
      this.collapseOptions();
    },
  },

  //UI handling fOptions
  expandOptions: function() {
    var self = this;
    var container = $('.options-container');
    container.animate({
      width: "0"
    }, 500, function() {
      self.get('controller').set('optionsView', true);
      container.animate({
        width: "20%"
      }, 1000, function() {
        console.log('done');
      });
    });
  },
  collapseOptions: function() {
    var self = this;
    var container = $('.options-container');
    container.animate({
      width: "0"
    }, 1000, function() {
      self.get('controller').set('optionsView', false);
      container.animate({
        width: "50px"
      }, 500, function() {
        console.log('done');
      });
    });
  },
  slideDown: function(classSelector) {
    $(classSelector).slideDown();
  },
  slideUp: function(classSelector) {
    $(classSelector).slideUp();
  },
});

export default DemosBridgeBuilderView;
function initialize() {

	var com_dataset = {
		fillColor : "rgba(151,187,205,0.5)",
		strokeColor : "#099EC6",
		pointColor : "#002E67",
		pointStrokeColor : "#fff"
	};

	var com_opt = {
		scaleOverlay : false,
		scaleOverride : false,
		scaleLineColorX : "transparent",
		scaleLineColorY : "#002E67",
		scaleLineWidth : 3,
		scaleFontFamily : "'comfortaa'",
		scaleFontSize : 12,
		scaleFontStyle : "normal",
		scaleFontColorY : "#099EC6",
		scaleFontColorX : "rgb(127,127,127)",
		scaleShowGridLinesX : true,
		scaleShowGridLinesY : false,
		scaleShowMiniLinesY : false,
		scaleGridLineColor : "rgba(0,0,0,.05)",
		scaleGridLineWidth : 2,
		bezierCurve : false,
		pointDot : true,
		pointDotRadius : 4,
		pointDotStrokeWidth : 2,
		datasetStroke : true,
		datasetStrokeWidth : 1,
		datasetFill : false ,
		animation : true,
		animationSteps : 60,
		animationEasing : "easeOutQuart",
		onAnimationComplete : null
	};

	var cpu_dataset = {datasets: [jQuery.extend({}, com_dataset)]};
	var cpu_opt = jQuery.extend({}, com_opt);
	cpu_opt.scaleSteps = null;
	cpu_opt.scaleStepWidth = null;
	cpu_opt.scaleStartValue = null;

	var disk_dataset = {datasets: [jQuery.extend({}, com_dataset)]};
	var disk_opt = jQuery.extend({}, com_opt);
	disk_opt.scaleSteps = null;
	disk_opt.scaleStepWidth = null;
	disk_opt.scaleStartValue = null;

	var mem_dataset = {datasets: [jQuery.extend({}, com_dataset)]};
	var mem_opt = jQuery.extend({}, com_opt);
	mem_opt.scaleSteps = null;
	mem_opt.scaleStepWidth = null;
	mem_opt.scaleStartValue = null;

};

function initSpeedometers(divId, name, maxVal, units) {
	
	var canv = document.createElement('canvas');
	canv.id = 'graphic';
	var refresh = document.createElement('div');
	refresh.id = 'refresh';
	var r_button = document.createElement('button');
	r_button.id = 'refresh_button';

	document.getElementById(divId).appendChild(refresh);
	document.getElementById(refresh.id).appendChild(r_button);
	document.getElementById(divId).appendChild(canv);

	var speedometer = new Speedometer({elementId: divId, canvasId: 'graphic', size: 300, maxVal: maxVal, name: name, units: units});
	speedometer.draw();

	return speedometer;

};

function updateSpeedometers(speedometer, elementId, stats) {

	switch (elementId) {

		case 'cpu':
		//var cpu = Math.round(stats[0].percCPULoad.value);
		var cpu = stats.percCPULoad;
		speedometer.drawWithInputValue(cpu);
		break;

		case 'disk':

		//var disk = Math.round(stats[0].percDiskUsed.value);
		var disk = stats.percDiskUsed;
		speedometer.drawWithInputValue(disk);
		break;

		case 'mem':
		//var mem = Math.round(stats[0].percRAMUsed.value);
		var mem = stats.percRAMUsed;
		speedometer.drawWithInputValue(mem);
		break;

		default:
		alert("Error. Can't identify element to monitor");
	}
};


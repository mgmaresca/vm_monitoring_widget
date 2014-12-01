/** Main function.

Through calls to different secondary functions, collects the necessary information about
the virtual machine you want to monitor. Once such data has been collected, draws the
graph of monitoring, on the screen.

Params:
- vm_id: 
- token: 
- tenant: id of the vm we want to monitor.
- check_param: key to identify the parameter you want to monitor. 
{Monitoring CPU: 'cpu', Monitoring disk: 'disk', Monitoring RAM: 'mem'}
- divId: id of the div where you want to place the monitoring graphic.
*/

var element = {
			id: "",
			name : "",
			maxVal: 0,
			units : "",
			speedometer: ""
		};

var measures;

init_vm = function(vm_id, token, tenant, region, check_param, divId){

	initGraph();

	element.id = check_param;

	JSTACK.Keystone.init('https://cloud.lab.fi-ware.org/keystone/v2.0/');

	JSTACK.Keystone.authenticate(undefined, undefined, token, tenant, function(resp) {
		
		compute = JSTACK.Keystone.getservice("compute");
		
		for (e in compute.endpoints) {
	    	compute.endpoints[e].publicURL = 'https://cloud.lab.fi-ware.org/' 
	    									  + compute.endpoints[e].region 
	    									  + "/compute" 
	    									  + compute.endpoints[e].publicURL.replace(/.*:[0-9]*/, "");
		}

		getVMProperties(vm_id, region);

		

	});

	
};


/** Getting parameters of the virtual machine

This function makes an API call to get the parameters of 
the vm's element we want to monitor.
*/

getVMProperties = function(vm_id, region){
	
	var server;
	var flavor;

	measures = {
		percCPULoad: 0,
		percRAMUsed: 0,
		percDiskUsed: 0
	};

	//Getting the flavor id
	JSTACK.Nova.getserverdetail(vm_id, function (resp) { server = resp.server;
		//Getting VM parametres (disk.maxValue and ram.maxValue)	
		JSTACK.Nova.getflavordetail(server.flavor.id, function (resp) {
			flavor = resp.flavor;

			switch(element.id){

				case 'cpu':
				console.log(element);
				element.name = "CPU";
				element.maxVal = 100;
				element.units = "%";
				break;

				case 'disk':
				console.log(element);
				element.name = "DISK";
				element.maxVal = flavor.disk;
				element.units = "GB";
				break;

				case 'mem':
				console.log(element);
				element.name = "RAM";
				element.maxVal = flavor.ram;
				element.units = "MB";
				break;

				default:
				console.log(element);
				alert("Error. Can not identify 'check_param' in getVMProperties");

			};

			getVMmeasures();
			element.speedometer = initSpeedometers(divId);
			updateSpeedometers();

			
		},function (error_msg){console.log(error_msg);},region);

	}, function (error_msg){console.log(error_msg);}, region);

};


/** Getting monitoring measures

This function makes a call to Monitoring API in order  to collect 
real-time status of the element that we are monitoring. 
*/

getVMmeasures = function() {

	
	//var measures = Monitoring.API.getVMmeasures(vm_id, options.success, options.error, endPoint);

	measures.percCPULoad = 75;
	measures.percRAMUsed = 200;
	measures.percDiskUsed = 7;
	
};


/** Refreshing monitoring measures
			
*/

refreshData = function() {

	switch(element.id) {

		case 'cpu':
		if (measures.percCPULoad + 10 <= element.maxVal) {
			measures.percCPULoad += 10 ;
		} else {
			measures.percCPULoad = 0;
		}
		console.log(measures);
		updateSpeedometers();
		break;

		case 'disk':
		if (measures.percDiskUsed + 1 <= element.maxVal) {
			measures.percDiskUsed += 1 ;
		} else {
			measures.percDiskUsed = 0;
		}
		console.log(measures);
		updateSpeedometers();
		break;

		case 'mem':
		if (measures.percRAMUsed + 300 <= element.maxVal) {
			measures.percRAMUsed += 300 ;
		} else {
			measures.percRAMUsed = 0;
		}
		console.log(measures);
		updateSpeedometers();
		break;

		default:
		console.log(element);
		alert("Error. Can not identify 'check_param' in refreshData");
	}
}





initSpeedometers = function(divId) {

	id = '#' + divId
	$(id).empty();

	$(id).append(
		$('<div>', {
			id: 'refresh'
		}).append(
			$('<button>', {
				id: 'refresh_button'
			})),
		$('<canvas>', {
			id: 'graphic'
		}));
	
	var speedometer = new Speedometer({elementId: divId, 
										canvasId: 'graphic', 
											size: 300, 
											maxVal: element.maxVal, 
											name: element.name, 
											units: element.units
										});

	$('#refresh_button').on('click', refreshData);

	speedometer.draw();

	return speedometer;

};

updateSpeedometers = function() {

	switch (element.id) {

		case 'cpu':
		//var cpu = Math.round(stats[0].percCPULoad.value);
		element.speedometer.drawWithInputValue(measures.percCPULoad);
		console.log(element);
		break;

		case 'disk':
		//var disk = Math.round(stats[0].percDiskUsed.value);
		element.speedometer.drawWithInputValue(measures.percDiskUsed);
		console.log(element);
		break;

		case 'mem':
		//var mem = Math.round(stats[0].percRAMUsed.value);
		element.speedometer.drawWithInputValue(measures.percRAMUsed);
		console.log(element);
		break;

		default:
		console.log(element);
		alert("Error. Can't identify 'check_param' in updateSpeedometers");
	}
};

initGraph = function() {

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


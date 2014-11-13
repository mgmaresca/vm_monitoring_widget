/** Main function.

Through calls to different secondary functions, collects the necessary information about
the virtual machine you want to monitor. Once such data has been collected, draws the
graph of monitoring, on the screen.

Params:
- Endpoint ->
- token -> 
- vm_id -> id of the vm we want to monitor.
- elementID -> key to identify the parameter you want to monitor. 
{Monitoring CPU: 'cpu', Monitoring disk: 'disk', Monitoring RAM: 'mem'}
- divId -> id of the div where you want to place the monitoring graphic.
*/



init_vm = function(vm_id, token, tenant, region, instanceId, divId){

	initGraph();

	var access;

	JSTACK.Keystone.init('https://cloud.lab.fi-ware.org/keystone/v2.0/');

	JSTACK.Keystone.authenticate(undefined, undefined, token, tenant, function(resp) {access = resp.access;});

	compute = JSTACK.Keystone.getservice("compute");


	for (e in compute.endpoints) {
    	compute.endpoints[e].publicURL = 'https://cloud.lab.fi-ware.org/' 
    									  + compute.endpoints[e].region 
    									  + "/compute" 
    									  + compute.endpoints[e].publicURL.replace(/.*:[0-9]*/, "");
	}

	var element = getVMProperties(vm_id, region, instanceId);

	var measures = getVMmeasures();

	var speedometer = initSpeedometers(divId, element, instanceId);

	updateSpeedometers(speedometer, instanceId, measures);

};


/** Getting parameters of the virtual machine

This function makes an API call to get the parameters of 
the vm's element we want to monitor.
*/

getVMProperties = function(vm_id, region, instanceId){
	
	var server;
	var flavor;
	

	//Getting the flavor id
	JSTACK.Nova.getserverdetail(vm_id, function (resp) { server = resp.server;}, function (error_msg){console.log(error_msg);}, region);


	//Getting VM parametres (disk.maxValue and ram.maxValue)	
	JSTACK.Nova.getflavordetail(server.flavor.id, function (resp) { flavor = resp.flavor;},function (error_msg){console.log(error_msg);},region);


	var element = {
		instanceId: this.instanceId,
		name : "",
		maxVal: 0,
		units : ""
	};

	switch(instanceId){

		case 'cpu':
		element.name = "CPU";
		element.maxVal = 100;
		element.units = "%";
		break;

		case 'disk':
		element.name = "DISK";
		element.maxVal = flavor.disk;
		element.units = "GB";
		break;

		case 'mem':
		element.name = "RAM";
		element.maxVal = flavor.ram;
		element.units = "MB";
		break;

		default:
		alert("Error. Can not identify 'instanceId' in getVMProperties");

	};

	return element;

};


/** Getting monitoring measures

This function makes a call to Monitoring API in order  to collect 
real-time status of the element that we are monitoring. 
*/

getVMmeasures = function() {

	
	//var measures = Monitoring.API.getVMmeasures(vm_id, options.success, options.error, endPoint);

	var	measures = {
		percCPULoad: 75,
		percRAMUsed: 200,
		percDiskUsed: 160
	};

	return measures;
	
};


/** Refreshing monitoring measures
			¡¡NO FUNCIONA!!
*/

refresh_data = function(speedometer, instanceId){

	var measures = getVMmeasures();

	updateSpeedometers(speedometer, instanceId, measures);

};


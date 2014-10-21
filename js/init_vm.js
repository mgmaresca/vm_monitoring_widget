
	var	measures = {
		percCPULoad: 0,
		percRAMUsed: 0,
		percDiskUsed: 0
	};

	var speedometer;

	var element = {
		elementId: this.elementId,
		name : "",
		maxVal: 0,
		units : ""
	};

function init_vm(endPoint, token, vm_id, elementId, divId){

	initialize();



	switch(elementId){

		case 'cpu':
		element.name = "CPU";
		element.maxVal = 100;
		element.units = "%";
		break;

		case 'disk':
		element.name = "DISK";
		element.maxVal = 500;
		element.units = "GB";
		break;

		case 'mem':
		element.name = "RAM";
		element.maxVal = 600;
		element.units = "MB";
		break;

		default:
		alert("Error. Can not identify 'elementId'");

	};

	speedometer = initSpeedometers(divId, element.name, element.maxVal, element.units);


	 measures = {
		percCPULoad: 90,
		percRAMUsed: 20,
		percDiskUsed: 50
	};

	updateSpeedometers(speedometer, elementId, measures);


};

function getVMmeasures() {

	// get flavor
	//var measures = Monitoring.API.getVMmeasures(ip, options.success, options.error, this.getRegion());

	return 
	
}

function refresh_data(elementId){



		if(elementId == 'cpu'){
			if(measures.percCPULoad <= element.maxVal){ 
				measures.percCPULoad = measures.percCPULoad + 10;
			}else{
				measures.percCPULoad = 0;
			}
			speedometer.draw();
			speedometer.drawWithInputValue(measures.percCPULoad);

		}else if (elementId == 'disk'){
			if(measures.percDiskUsed <= element.maxVal){ 
				measures.percDiskUsed = measures.percDiskUsed+ 10;
			}else{
				measures.percDiskUsed = 0;
			}
			speedometer.draw();
			speedometer.drawWithInputValue(measures.percDiskUsed);

		}else{
			if(measures.percRAMUsed <= element.maxVal){ 
				measures.percRAMUsed = measures.percRAMUsed + 10;
			}else{
				measures.percRAMUsed = 0;
			}
			speedometer.draw();
			speedometer.drawWithInputValue(measures.percRamkUsed);
		}





	//var measures = Monitoring.API.getVMmeasures(ip, options.success, options.error, this.getRegion());

};
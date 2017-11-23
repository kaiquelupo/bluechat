host = "18:89:5B:4A:37:6A"

var tracking_status;
var msg_counter;

function connect_to_beacon(mac, channel, comm){
	var dev = "/dev/" + comm;

	function feedback(str){
		alert(str);
	}

	function error(str){
		var msg = "Connection not accepted or dropped";
		p3 = run("rfcomm", ["release", comm], nothing, nothing, nothing);
		alert(msg);
	}

	p1 = run("sdptool", ["add","--channel="+channel.toString(), "SP"], feedback, feedback, nothing);
	p2 = run("rfcomm", ["-L3600", "-M", "connect", dev, mac, channel],
			 error, error, nothing);

	setTimeout(function(){
		read_stream(dev, show_msg);
	}, 3000);
}

function wait_for_master(channel, comm){
	var dev = "/dev/" + comm;

	function feedback(str){
		alert(str);
	}

	function error(str){
		var msg = "Connection not accepted or dropped";
		p3 = run("rfcomm", ["release", comm], nothing, nothing, nothing);
		alert(msg);
	}

	p1 = run("sdptool", ["add","--channel="+channel.toString(), "SP"], feedback, feedback, nothing);
	p2 = run("rfcomm", ["listen", dev, channel], error, error, nothing);

	setTimeout(function(){
		read_stream(dev, show_msg);
	}, 5000);
}

function check_rssi(host){
	var count = 0, c = "0";

	function extract_rssi(str){
		if(tracking_status){
			count++;
			html_rssi_feedback("tracking");
			data = extract_number(str, 3);
			html_append_rssi(data);
		}
	}

	function end(proc){
		kill_process(proc);
		html_return_tracking_button();

		if(count > 0) html_rssi_feedback("drop");
		else html_rssi_feedback("error");
	}


	p1 = run("l2ping", [host], nothing, nothing, nothing);
	
	html_connecting_button();

	tracking_status = true;

	setTimeout(function(){
		html_tracking_button(); 
		var intervalId = setInterval(function() {
			if(c != "0" || !tracking_status){ end(p1); clearInterval(intervalId); }
			else run("hcitool", ["rssi", host], extract_rssi, nothing, function(code){ c = code;} );
		}, 50); 
	}, 2000);
}

function scan_devices(){
	var output = "";

	html_scanning_button();

	function add_device(str){
		output+=str;
	}

	function list_devices(code){
		html_add_devices(code, output);
	}

	run("hcitool", ["scan"], add_device, nothing, list_devices);
	
}

function show_msg(data){
	alert(data);
}
/* Scanning */

function html_scanning_button(){
	$("#scanning-button").removeClass("btn-primary");
	$("#scanning-button").addClass("btn-warning");
	$("#scanning-button").addClass("disabled");
	$("#scanning-button").html(text_scanning);
}

function html_return_scan_button(){
	$("#scanning-button").removeClass("btn-warning");
	$("#scanning-button").removeClass("disabled");
	$("#scanning-button").addClass("btn-primary");
	$("#scanning-button").html(text_scan_button);
}


function html_remove_devices(){
	$("#devices-list").html("");
}

function html_scan_feedback(type){
	var html = "", c = "";

	$("#scanning-feedback").removeClass();
	$("#scanning-feedback").addClass("alert");

	if(type == "found"){ html = text_found_devices; c = "alert-success"; } 
	if(type == "no_device"){ html = text_no_device; c = "alert-warning"; }
	if(type == "error"){ html = text_bluetooth_error; c = "alert-danger"; }

	$("#scanning-feedback").addClass(c);
	$("#scanning-feedback").html(html);
}

function html_chat_feedback(type){
	var html = "", c = "";

	$("#chat-feedback").removeClass();
	$("#chat-feedback").addClass("alert");

	if(type == "error"){ html = text_chat_dropped; c = "alert-danger"; }
	if(type == "file-error"){ html = text_chat_file_error; c = "alert-danger"; }


	$("#chat-feedback").addClass(c);
	$("#chat-feedback").html(html);
}

function html_remove_feedback(){
	$("#scanning-feedback").html("");
	$("#scanning-feedback").removeClass();
}

/*href=\"/files/rssi.html?mac="+ device.mac + "&name=" + device.name +"\" "*/

function html_add_devices(code, output){

	function create_element(device){
		var visibility;

		if(device.chat){
			visibility = "disabled"; 
		}
		else {
			visibility = "";
		}

		var html = "<div id=\"item1\" class=\"list-group-item list-group-item-action\"><span class=\"device-title\">"+
		           device.name + " <span class=\"badge badge-default\">" + device.mac + "</span></span>" +
		           "<a href=\"#1#\" class=\"btn btn-info btn-add " + visibility + " \" onclick=\"add_device(\'" + device.name +"\',\'" + device.mac +"\', true, this);\">Add Device</a></div>";

		return html;
	}

	if(parseInt(code) == 0){
		var devices = extract_devices(output);

		$("#devices-list").html("");

		if(devices.length != 0){
			html_scan_feedback("found");
			for(i = 0; i < devices.length; i++){
				$("#devices-list").append(create_element(devices[i]));
			}
		}else{
			html_scan_feedback("no_device");
		}
		
	}else{
		html_scan_feedback("error");
	}

	html_return_scan_button();
}

/* Chats */

function html_add_chats(devices){
	for(i = 0; i < devices.length; i++){
		var html = "<a href=\"/src/chat.html?name=" + devices[i].name + "&mac=" + devices[i].mac + "\" " +
		       "class=\"list-group-item list-group-item-action\"><span class=\"device-title\">"+
	           devices[i].name + " <span class=\"badge badge-default\">" + devices[i].mac + "</span></span></a>";

		$("#chats-list").append(html);
	}
}


function html_add_device_notice(){
	$("#tracking-description").html(text_no_device_selected);
	$("#tracking-button").addClass("disabled");
}

$("#tracking-stop-button").hide();

function html_append_rssi(str){
	$("#rssi-list").html(data);
}

function html_connecting_button(){
	$("#tracking-button").removeClass("btn-primary");
	$("#tracking-button").addClass("btn-warning");
	$("#tracking-button").addClass("disabled");
	$("#tracking-button").html(text_connecting);
}

function html_tracking_button(){
	$("#tracking-stop-button").show();
	$("#tracking-button").removeClass("btn-primary");
	$("#tracking-button").addClass("btn-warning");
	$("#tracking-button").addClass("disabled");
	$("#tracking-button").html(text_tracking);
}

function html_return_tracking_button(){
	$("#tracking-stop-button").hide();
	$("#tracking-button").removeClass("btn-warning");
	$("#tracking-button").removeClass("disabled");
	$("#tracking-button").addClass("btn-primary");
	$("#tracking-button").html(text_tracking_button);
}


function html_rssi_feedback(type){
	var html = "", c = "";

	$("#tracking-feedback").removeClass();
	$("#tracking-feedback").addClass("alert");

	if(type == "tracking"){ html = text_tracking_online; c = "alert-success"; } 
	if(type == "drop"){ html = text_drop; c = "alert-warning"; }
	if(type == "error"){ html = text_tracking_error; c = "alert-danger"; }

	$("#tracking-feedback").addClass(c);
	$("#tracking-feedback").html(html);
}

function html_add_buttons_disable(btn){
	btn.innerHTML = "Added";
	$(btn).parent('div').find("a").addClass("disabled");
}

function html_add_device_name(name){
	$("#device_name").html(name);
}

function html_add_msg(str){
	$("#chat_box").append(str);
}
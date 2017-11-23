var devices = []
var my_mac;

function io_start_tracking(){
	if(devices.length > 0){
		check_rssi(devices[0].mac);
	}
}

function io_stop_tracking(){
	html_rssi_feedback("drop");
	tracking_status = false;
}

function io_scan_devices(){
	/*html_remove_feedback();
	html_remove_devices();*/
	scan_devices();
}

function io_add_chats(){
	get_list();
	html_add_chats(devices);
}

function add_device(name, mac, chat, btn){
	html_add_buttons_disable(btn);
	devices.push({"name": name, "mac": mac, "chat": chat});
	add_list_to_file();
}

function add_list_to_file(){
	fs.writeFile("./src/txts/devices.json", JSON.stringify(devices), 'utf8', function(err){});
}

function get_list(){
	try{
		devices = JSON.parse(fs.readFileSync("./src/txts/devices.json", 'utf8'));
	}catch(err){
		devices = [];
		fs.writeFile("./src/txts/devices.json", JSON.stringify(devices), 'utf8', function(err){});
	}
}

function reset_files_devs(){
	fs.writeFile("./src/txts/files.txt", "0", 'utf8', function(err){});

}

function io_index(){
	const { exec } = require('child_process');
	exec("hciconfig hci0 up", (error, stdout, stderr) => {});
	get_list();
	reset_files_devs();
}
var check_chat;
var number = 0/*read_file_stream()*/;
var comm = "rfcomm" + number
var dev = "/dev/" + comm;
var p;
var rstream;
var counter = 0;
var exit_status = false;
var master;

const { exec } = require('child_process');

function chat(){
	$("#loading").hide();
	html_add_device_name(getParameterByName("name"));
	get_chat();
	connect_to_device(getParameterByName("mac"), 22);
}

function exit(link){
	exit_status = true;
	writeToDev(dev, "0exit0");
	kill_process(p);
	$("#loading").show();
	$("#loading_txt").html("Disconnecting, please wait...");
	setTimeout(function(){window.open(link,"_self");}, 1000);
}

function inputEvent(e, obj) {
    if (e.keyCode == 13) {
		writeToDev(dev, $(obj).val());
    	$(obj).val("");
    }
}

function connect_to_device(mac, channel){
	var my_mac;

	function isMaster(mmac, dmac){
		return (mmac > dmac);
	}

	function error_function(str){
		$("#loading").hide();
		html_chat_feedback("error");
		//p3 = run("rfcomm", ["release", comm], nothing, nothing, nothing);
	}

	function connect(){
		master = isMaster(my_mac, mac);

		p1 = run("sdptool", ["add","--channel="+channel.toString(), "SP"],
				 nothing, nothing, nothing);

		$("#loading").show();
		if(master){
			$("#loading_txt").html("Connecting to device, please wait...");

			p = exec("rfcomm -L3600 -M connect "+dev+" " + mac + " " + channel.toString(), (error, stdout, stderr) => {
			 	if(error && !exit_status){
			 		alert("error: " + error.toString());
			 	}
			 	
			 	error_function(stdout);
			 	error_function(stderr);

			});

		}else{
			$("#loading_txt").html("Waiting device to connect...");
			p = exec("rfcomm listen " + dev + " " + channel.toString(), (error, stdout, stderr) => {
			 	if(error && !exit_status) error_function(error.toString());
			 	error_function(stdout);
			});
			//p = run("rfcomm", ["listen", dev, channel], error_function, error_function, nothing);
		}
	}

	function get_my_mac(obj){
		var output = obj.toString();
		my_mac = (((output.split('\n')[1]).split('\t')[2]).replace('\n', ''));
		connect();
	}

	p0 = run("hcitool", ["dev"], get_my_mac, nothing, nothing);
}


function get_chat(){
	check_chat = true;

	var intervalId = setInterval(function() {
		if(check_chat){
			p3 = run("ls", ["/dev/"], files, nothing, nothing);	
		}else{
			clearInterval(intervalId); 
		}
	}, 500); 
}

function files(obj){
	var str = (obj.toString()).split('\n');

	for(i = 0; i < str.length; i++){
		if(str[i] == comm){ 
			check_chat = false; 
			$("#loading").hide();
			add_file_stream();
			if(master) writeToDev(dev, "The chat has started...");
			read_stream(dev, communication); 
		}
	}
}

var comm_start = false;
var comm_text = "";

function cleanMsg(txt){
	var open = false, close = false; 
	for(i = 0; i < txt.length; i++){
		if(txt[i] == "<") open = true;
		if(txt[i] == ">") close = true;
	}

	if(open && close){
		txt = txt.replace(">", "");
		txt = txt.replace("<", "");

		return txt;
	}
	else{
		return null;
	}
}

function communication(obj){
	counter++;
	var txt = obj.toString();
	if(txt.length > 1){
		comm_start = false;
		comm_text = "";
		txt = cleanMsg(txt); 
		if(txt != null){
			txt = txt.trim();
			if(txt == "0exit0" && counter > 1){
				exit("/src/chats.html"); 
			}
			else {
				html_add_msg("<strong>" + getParameterByName("name") + "</strong>: " + txt + "<br>");
			}
		}
	}else{
		if(txt == '<') comm_start = true;
		else if(txt == '>' && comm_start){
			comm_start = false;
			if(txt != null){
				txt = txt.trim();
				if(txt != "0exit0" && counter > 1){
					html_add_msg("<strong>Me</strong>: " + comm_text + "<br>");
				}
			}
			
			comm_text = "";
		}
		else if(comm_start){
			comm_text += txt;
		}
	}
}

function writeToDev(dev, txt){
	txt = "<" + txt + ">";
	exec("echo \""+ txt +"\" > " + dev, (error, stdout, stderr) => {
	 	if(error) html_chat_feedback("file-error");
	});
}

function read_file_stream(){
	return fs.readFileSync("./src/txts/files.txt", 'utf8');
}

function add_file_stream(){
	var n = parseInt(number);
	n += 1;
	fs.writeFile("./src/txts/files.txt", n.toString(), 'utf8', function(err){});
}
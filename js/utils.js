function extract_number(string, pos){
	return parseInt(string.split(' ')[pos]);
}

function extract_devices(str){
	var new_devices = [];
	var lines = str.split('\n');

	for(i=1; i < (lines.length-1); i++){
		aux = lines[i].split('\t')
		new_devices.push({"mac": aux[1], "name": aux[2], "chat" : false});
	}

	for(j = 0; j < new_devices.length; j++){
		for(i = 0; i < devices.length; i++){
			if(new_devices[j].mac == devices[i].mac){ new_devices[j].chat = true; break;} 
		}
	}

	return new_devices;
}

function nothing(data){}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function read_stream(dev, callback){
	//var readStream = 

	rstream = fs.createReadStream(dev);

	rstream.on('data', function (data) {
		callback(data);
	});

	rstream.on('error', function(err){
		alert("Error: there is no connection to pull data. Try again.");
	});

	//return readStream;
}

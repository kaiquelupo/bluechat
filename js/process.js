var fs = require('fs');

const { spawn } = require('child_process');

function run(cmd, args, f1, f2, f3){

	var program = spawn(cmd, args);

	program.stdout.on('data', (data) => {
	 	f1(data.toString());
	});

	program.stderr.on('data', (data) => {
	 	f2(data.toString());
	});

	program.on('close', (code) => {
		if(code != null){
			f3(code.toString());
		}
	});

	return program;
}

function kill_process(proc){
	proc.kill();
}


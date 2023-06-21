#! /usr/bin/env node

// Javascript layer for using the whisper.cpp built-in model downloader scripts
//
// npx @tech9app/whisper.js download -m <modelName> -p <storagePath>

import shell from 'shelljs';
import { program } from 'commander';
import * as path from "path";
import figlet from "figlet";
import * as fs from "fs";

const MODELS_LIST = [
	"tiny",
	"tiny.en",
	"base",
	"base.en",
	"small",
	"small.en",
	"medium",
	"medium.en",
	"large-v1",
	"large"
];

console.log(figlet.textSync("Tech9 whisper.js"));


program
	.option('-m, --modelName <modelName>', 'Specify the model name')
	.option('-p, --storagePath <storagePath>', 'Specify the storage path')
	.parse(process.argv);

const defaultPath = path.join(__dirname, "../whisper.cpp/models");


const options = program.opts();

const modelName = options.modelName || "base.en";
const storagePath = options.storagePath;

if (!modelName) {
	console.error('Model name is required!');
	process.exit(1);
}

console.log(`Model name: ${modelName}`);
console.log(`Storage path: ${storagePath}`);


try {
	shell.cd(defaultPath);
	
	console.log(`List of modules:
|-----------|--------|---------|
| Model     | Disk   | RAM     |
|-----------|--------|---------|
| tiny      |  75 MB | ~390 MB |
| tiny.en   |  75 MB | ~390 MB |
| base      | 142 MB | ~500 MB |
| base.en   | 142 MB | ~500 MB |
| small     | 466 MB | ~1.0 GB |
| small.en  | 466 MB | ~1.0 GB |
| medium    | 1.5 GB | ~2.6 GB |
| medium.en | 1.5 GB | ~2.6 GB |
| large-v1  | 2.9 GB | ~4.7 GB |
| large     | 2.9 GB | ~4.7 GB |
`);
	
	program.parse();

  if (!MODELS_LIST.includes(modelName)) {
		console.error("\n[@tech9app/whisper.js] FAIL: Name not found. Check your spelling or quit the wizard and use a custom model.");
		process.exit(0);
	}
	
	// ensure running in correct path
	if (!shell.which("./download-ggml-model.sh")) {
		console.error("@tech9app/whisper.js downloader is not being run from the correct path! cd to project root and run again.");
		process.exit(0);
	}
	
	// default is .sh
	let scriptPath = "./download-ggml-model.sh"
	// windows .cmd version
	if(process.platform === 'win32') scriptPath = "download-ggml-model.cmd";
	
	console.log(path.join(defaultPath, `ggml-${modelName}.bin`))
	
	if (!fs.existsSync(path.join(defaultPath, `ggml-${modelName}.bin`))) {
		// todo: check if windows or unix to run bat command or .sh command
		console.log(`Downloading model ${modelName}`);
		shell.exec(`${scriptPath} ${modelName}`);
	}
	
	if (storagePath && !fs.existsSync(path.join(storagePath, `ggml-${modelName}.bin`))) {
		console.log(`Copying model to ${storagePath}`);
		shell.mv(path.join(defaultPath, `ggml-${modelName}.bin`), storagePath);
	}
	
	process.exit(0);
} catch (error) {
	console.log("ERROR Caught in downloadModel")
	console.log(error);
	throw error;
}
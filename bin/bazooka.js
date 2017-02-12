#! /usr/bin/env node

const fs = require('fs');
const Client = require('ssh2').Client;
const path = require('path');
const mdtojson = require('../lib/mdtojson');

// Path of where command is executed from
const workingDir = process.cwd();

// Get Project config
const configFile = fs.readFileSync(`${workingDir}/.bazookaConfig`,'utf8','r');

const config = JSON.parse(configFile);

/* ============================================================================
 * EXPORT
 * ==========================================================================*/

const getDirectories = (srcpath) =>
	fs.readdirSync(srcpath)
		.filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());

const getFiles = (srcpath) =>
	fs.readdirSync(srcpath)
		.filter(file =>
			fs.statSync(path.join(srcpath, file)).isDirectory() === false);

const crawlnstore = (crawlPath, obj) => {
	const dirs = getDirectories(crawlPath);
	const excludeDirs = dirs.filter(dir => config.excludeDirs.indexOf(dir) < 0);

	const newObj = {};
	excludeDirs.forEach((dir) => {
		const files = getFiles(crawlPath);
		const folderContents = {};
		files.forEach((file) => {
			const filejson = mdtojson.process(`${crawlPath}/${file}`);
			const fileExtention = path.extname(file);
			const filename = file.replace(fileExtention, '');
			folderContents[filename] = filejson;
		});
		newObj.pages = folderContents;
		newObj[dir] = crawlnstore(`${crawlPath}/${dir}`, {});
	});

	if (dirs.length > 0) {
		return Object.assign(obj, newObj);
	}

	return {};
};

const compile = (outputFile) => {
	const json = crawlnstore(process.cwd(), {});
	const jsonString = JSON.stringify(json, null, 4);

	// Write to file
	fs.writeFileSync(outputFile, jsonString);

	return json;
};

// Compile and create temp file
compile('export.json');

/* ============================================================================
 * REMOTE UPLOAD
 * ==========================================================================*/

// Connect to remote server and upload public files
const conn = new Client();

conn.on('ready', () => {
	conn.sftp((err, sftp) => {
		if (err) throw err;

		// SFTP connect is ready. Do actions below.
		const readStream =
			fs.createReadStream(`${workingDir}/export.json`);
		const writeStream =
			sftp.createWriteStream(`${config.location}/export.json`);

		writeStream.on('close', () => {
			console.log('- file transferred successfully');
		});

		writeStream.on('end', () => {
			console.log('sftp connection closed');
			conn.close();
		});

		readStream.pipe(writeStream);
	});
}).connect({
	host: config.host,
	port: config.port,
	username: config.username,
	password: config.password,
});

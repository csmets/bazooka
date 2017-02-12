#! /usr/bin/env node

'use strict'
const fs = require('fs')
const Client = require('ssh2').Client
const path = require('path')

// Path of where command is executed from
const workingDir = process.cwd();

// Get Project config
const configFile = fs.readFileSync(
	workingDir + "/.bazookaConfig",
	'utf8',
	'r'
);

const config = JSON.parse(configFile);

/* ============================================================================
 * EXPORT
 * ==========================================================================*/

const getDirectories = (srcpath) => {
	return fs.readdirSync(srcpath)
		.filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());
}

const getFiles = (srcpath) => {
	return fs.readdirSync(srcpath)
		.filter(file => fs.statSync(
			path.join(srcpath, file)).isDirectory() == false
		);
}

const crawlnstore = (path, obj) => {
	const dirs = getDirectories(path);
	const newObj = {};
	dirs.forEach((dir) => {
		const files = getFiles(path);
		files.forEach((file) => {
			
		});
		newObj[dir] = crawlnstore(path + '/' + dir, {});
	});

	if (dirs.length > 0) {
		return Object.assign(obj, newObj);
	} else {
		return {};
	}
}

const compile = () => {
	
	const rootDirectories = getDirectories('./');
	
	const json = crawlnstore(workingDir, {});

	console.log(JSON.stringify(json))

}

compile();

/* ============================================================================
 * REMOTE UPLOAD
 * ==========================================================================*/
/*
// Connect to remote server and upload public files
const conn = new Client();

conn.on('ready', () => {
	conn.sftp((err, sftp) => {
		if (err) throw err;
		
		// SFTP connect is ready. Do actions below.
		const readStream = fs.createReadStream(workingDir + "/public/test.txt");
		const writeStream = sftp.createWriteStream(
			config.location + "/text.txt");

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
	password: config.password
});
*/

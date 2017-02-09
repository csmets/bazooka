#! /usr/bin/env node

'use strict'
const fs = require('fs')
const Client = require('ssh2').Client

// Get Project config
const workingDir = process.cwd();

const configFile = fs.readFileSync(
	workingDir + "/.bazookaConfig",
	'utf8',
	'r'
);

const config = JSON.parse(configFile);

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

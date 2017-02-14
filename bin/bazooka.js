#! /usr/bin/env node

const fs = require('fs');
const Client = require('ssh2').Client;
const bazooka = require('../lib/bazooka-compile');
const program = require('commander');
const color = require('colors');

// Path of where command is executed from
const workingDir = process.cwd();

const bazookaConfigExists = () => {
	if (fs.existsSync(`${process.cwd()}/.bazookaConfig`)){
		return true;
	}
	return false;
}

/* ============================================================================
 * LET'S BAZOOKA!
 * ==========================================================================*/
program
	.version('0.1.0')

program
	.command('push', 'Push project to remote server')
	.action(() => {

		// Get Project config
		if (!bazookaConfigExists()){
			console.log(
				`.bazookaConfig not found. Please run "bazooka init" first`
				.red);
			process.exit();
		}

		const configFile =
			fs.readFileSync(`${workingDir}/.bazookaConfig`,'utf8','r');

		const config = JSON.parse(configFile);

		/* ====================================================================
		 * EXPORT
		 * ==================================================================*/

		const globalIgnoredDirs = 'public';
		config.excludeDirs.push(globalIgnoredDirs);
		const json = bazooka.compile(process.cwd(), config.excludeDirs, {});
		const jsonString = JSON.stringify(json, null, 4);

		// Write to file
		fs.writeFileSync('export.json', jsonString);

		/* ====================================================================
		 * REMOTE UPLOAD
		 * ==================================================================*/
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
	});

program
	.command('init', 'Creates bazooka config file')
	.action(() => {
		// Create .bazookaconfig file and run through default steps.
	});

program.parse(process.argv);

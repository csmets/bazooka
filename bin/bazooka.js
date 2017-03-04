#! /usr/bin/env node

const fs = require('fs');
const Client = require('ssh2').Client;
const bazooka = require('../lib/bazooka-compile');
const program = require('commander');
const color = require('colors');
const prompt = require('prompt');

// Path of where command is executed from
const workingDir = process.cwd();

const bazookaConfigExists = () => {
	if (fs.existsSync(`${process.cwd()}/.bazookaConfig`)) {
		return true;
	}
	return false;
};

/* ============================================================================
 * LET'S BAZOOKA!
 * ==========================================================================*/
program.version('0.1.0');

program
	.command('push')
	.description('Push project to remote server')
	.action(() => {

		// Get Project config
		if (!bazookaConfigExists()) {
			console.log(
				'.bazookaConfig not found. Please run "bazooka init" first'
				.red);
			process.exit();
		}

		const configFile =
			fs.readFileSync(`${workingDir}/.bazookaConfig`, 'utf8', 'r');

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
		const schema = {
			properties: {
				username: {
					description: 'sftp username',
					required: true,
				},
				password: {
					description: 'sftp password',
					required: true,
				},
			},
		};

		prompt.start();

		prompt.get(schema, (promptErr, result) => {
			const conn = new Client();

			conn.on('ready', () => {
				conn.sftp((err, sftp) => {
					if (err) throw err;

					// Push compiled export.json files to remote server.
					const exportReadStream =
						fs.createReadStream(`${workingDir}/export.json`);
					const exportWriteStream = sftp.createWriteStream(
						`${config.location}/export.json`
					);
					exportReadStream.pipe(exportWriteStream);

					// Push all public assets to remote server.
					const upload = (asset, dir) => {
						const string = `${workingDir}/public`;
						const remotePath = dir.replace(
							string,
							config.location
						);
						if (fs.statSync(`${dir}/${asset}`)
							.isDirectory() === true) {
							sftp.mkdir(`${remotePath}/${asset}`);
						} else {
							const readStream =
								fs.createReadStream(`${dir}/${asset}`);
							const writeStream =
								sftp.createWriteStream(`${remotePath}/${asset}`);
							readStream.pipe(writeStream);
						}
					}

					bazooka.dirRecFunc(`${workingDir}/public`, upload);

					exportWriteStream.on('close', () => {
						console.log('- file transferred successfully'.green);
						conn.end();
					});

				});
			})
			.connect({
				host: config.host,
				port: config.port,
				username: result.username,
				password: result.password,
			});
		});
	});

program
	.command('init')
	.description('Create bazooka project configuration file.')
	.action(() => {
		// Create .bazookaconfig file and run through default steps.
		const schema = {
			properties: {
				host: {
					description: 'Enter in the remote server host ip',
				},
				port: {
					type: 'integer',
					description: 'Enter the host port number',
				},
				server_location: {
					type: 'string',
					description: 'Enter remote server project path',
				},
			},
		};
		prompt.start();
		prompt.get(
			schema,
			(err, result) => {
				const configObj = {
					host: result.host,
					port: result.port,
					location: result.server_location,
					excludeDirs: [],
				};
				const bazookaConfig = JSON.stringify(configObj, null, 4);
				fs.writeFile('./.bazookaConfig', bazookaConfig, (fsErr) => {
					if (fsErr) {
						console.log(fsErr);
						return false;
					}
					console.log('.bazookaConfig created'.green);
					return true;
				});
			});
	});

program.parse(process.argv);

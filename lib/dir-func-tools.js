/*
 * Bunch of directory tools
 */

const fs = require('fs');
const path = require('path');

// Dump all directories found in a given path.
const getDirectories = srcpath =>
	fs.readdirSync(srcpath)
		.filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());

// Get number of directories
const getNumOfDirs = (srcpath) => {
	const dirs = getDirectories(srcpath);
	return dirs.length;
};

// Dump all the files in a given path.
const getFiles = srcpath =>
	fs.readdirSync(srcpath)
		.filter(file =>
			fs.statSync(path.join(srcpath, file)).isDirectory() === false);

// Recursive directory function that will apply a function
const dirRecFunc = (dir, func) => {
	if (typeof func === 'function') {
		const files = getFiles(dir);
		const dirs = getDirectories(dir);

		files.forEach(f => func(f, dir));

		dirs.forEach((d) => {
			func(d, dir);
			dirRecFunc(`${dir}/${d}`, func);
		});
	}
};

module.exports = {
	getDirectories,
	getNumOfDirs,
	getFiles,
	dirRecFunc,
}

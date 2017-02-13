/*
 * Compile the bazooka framework
 */
const fs = require('fs');
const mdtojson = require('./mdtojson');
const path = require('path');

// Dump all directories found in a given path.
const getDirectories = (srcpath) =>
	fs.readdirSync(srcpath)
		.filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());

// Dump all the files in a given path.
const getFiles = (srcpath) =>
	fs.readdirSync(srcpath)
		.filter(file =>
			fs.statSync(path.join(srcpath, file)).isDirectory() === false);

// Check whether the file is markdown or not and return a boolean.
const isMarkdown = (filename) => {
	const extension = path.extname(filename);
	if (extension === '.md'){
		return true;
	}
	return false;
}

/*
 * Crawl directories and output found into an object. This includes markdown
 * file contents.
 */
const compile = (crawlPath, excludeDirs, obj) => {
	const dirs = getDirectories(crawlPath);
	const permittedDirs = dirs.filter(dir => excludeDirs.indexOf(dir) < 0);

	const newObj = {};
	permittedDirs.forEach((dir) => {
		const files = getFiles(crawlPath);
		const folderContents = {};
		files.forEach((file) => {
			if (isMarkdown(file)) {
				const filejson = mdtojson.process(`${crawlPath}/${file}`);
				const fileExtention = path.extname(file);
				const filename = file.replace(fileExtention, '');
				folderContents[filename] = filejson;
			}
		});
		newObj.pages = folderContents;
		newObj[dir] = compile(`${crawlPath}/${dir}`, excludeDirs, {});
	});

	if (dirs.length > 0) {
		return Object.assign(obj, newObj);
	}

	return {};
};

module.exports = {
	compile,
}

/*
 * Compile the bazooka framework
 */
const mdtojson = require('./mdtojson');
const path = require('path');
const dirtools = require('./dir-func-tools');

// Check whether the file is markdown or not and return a boolean.
const isMarkdown = (filename) => {
	const extension = path.extname(filename);
	if (extension === '.md') {
		return true;
	}
	return false;
};

/*
 * Crawl directories and output found into an object. This includes markdown
 * file contents.
 */
const compile = (crawlPath, excludeDirs, obj) => {
	const dirs = dirtools.getDirectories(crawlPath);
	const permittedDirs = dirs.filter(dir => excludeDirs.indexOf(dir) < 0);

	const newObj = {};
	permittedDirs.forEach((dir) => {
		const dirPath = `${crawlPath}/${dir}`;
		const files = dirtools.getFiles(dirPath);
		const folderContents = {};
		files.forEach((file) => {
			if (isMarkdown(file)) {
				const filejson = mdtojson.process(`${dirPath}/${file}`);
				const fileExtention = path.extname(file);
				const filename = file.replace(fileExtention, '');
				folderContents[filename] = filejson;
			}
		});
		newObj[dir] = folderContents;
		if (dirtools.getNumOfDirs(dirPath) > 0) {
			Object.assign(
				newObj[dir], compile(`${crawlPath}/${dir}`, excludeDirs, {}));
		}
	});

	if (dirs.length > 0) {
		return Object.assign(obj, newObj);
	}

	return {};
};

module.exports = {
	compile,
};

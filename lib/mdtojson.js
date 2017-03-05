/*
Markdown to JSON

Uses a yaml flavoured header to get the metadata for a page.
Content gets converted from markdown to html.

Returns an object ready to be stringified to JSON.
*/

const yaml = require('yaml-front-matter');
const marked = require('marked');
const path = require('path');

const process = (filename) => {
	const extension = path.extname(filename);

	if (extension !== '.md') {
		console.log('File to be processed is not markdown');
		return false;
	}

	// Load the markdown file and retrieve metadata as well as content.
	const mdFile = yaml.loadFront(filename);

	if (mdFile) {
		mdFile.content = marked(mdFile.__content);
		delete mdFile.__content;
	}

	return mdFile;
};

module.exports = {
	process,
};

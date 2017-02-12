/*
Markdown to JSON
*/

const yaml = require('yaml-front-matter');
const marked = require('marked');

const process = (filename) => {
	const metadata = yaml.loadFront(filename);

	if (metadata) {
		metadata.content = marked(metadata.__content);
		delete metadata.__content;
	}

	return metadata;
};

module.exports = {
	process,
};

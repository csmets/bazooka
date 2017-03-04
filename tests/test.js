const test = require('ava');
const mdtojson = require('../lib/mdtojson.js');

test('mdtosjson should return false if file is not markdown.', t => {
	const file = 'mywebpagefile.txt';
	const process = mdtojson.process(file);
	console.log(process);
	const expected = false;
	t.true(process === expected, 'Process returns false if file is not .md');
});

test('mdtojson must return an object if file is markdown.', t => {
	const file = 'samplefile.md';
	const process = mdtojson.process(file);
	if (typeof process === 'object'){
		t.pass('Correct return! Is object');
	} else {
		t.fail('Is not object');
	}
});

test('mdtojson must contain a contents key.', t => {
	const file = 'samplefile.md';
	const process = mdtojson.process(file);
	if ("content" in process){
		t.pass('"Content" key exists!');
	} else {
		t.fail('No "Content" key found.')
	}
});

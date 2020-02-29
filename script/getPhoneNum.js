const fs = require('fs');
const path = require('path');

const fourPath = '../../Downloads/fourSixPhone/four';
const sixPath = '../../Downloads/fourSixPhone/six';

const files1 = fs.readdirSync(fourPath);
const files2 = fs.readdirSync(sixPath);

const arr1 = new Set(files1.map(item => path.basename(item, path.extname(item))));
const arr2 = new Set(files2.map(item => path.basename(item, path.extname(item))));

let arr = [
    ...Array.from(arr1),
    ...Array.from(arr2),
]
console.log(arr);


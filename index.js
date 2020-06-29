const fs = require('fs');
const jimp = require('jimp');
const pngToIco = require('png-to-ico');

const srcDir = __dirname + '/jpeg';
const destDir = __dirname + '/ico';

(async () => {

	const files = await fs.readdirSync(srcDir);

	let task = files.map((file) => {
		return new Promise(async (resolve, reject) => {
			try {
				const dest = `${destDir}/${file.split('.').shift()}`;
				// jpg to png
				const jpg = await jimp.read(`${srcDir}/${file}`);
				await jpg.resize(256, 256).write(dest + '.png');
				// png to ico
				const buf = await pngToIco(`${dest}.png`);
				await fs.writeFileSync(`${dest}.ico`, buf);
				// delete files
				await Promise.all([
					fs.unlinkSync(`${srcDir}/${file}`),
					fs.unlinkSync(`${dest}.png`),
				]);
				resolve(`${dest}.ico created...`);
			} catch (e) {
				reject(e);
			}
		});
	});
	await Promise.all(task);

})();
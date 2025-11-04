import { createReadStream, createWriteStream } from "node:fs";
import { join } from "node:path";
import { performance } from "perf_hooks";

const path = import.meta.dirname;

// grab mb-size param from command line args if provided
const args = Object.fromEntries(
	process.argv.slice(2).map((arg) => {
		const [key, value] = arg.replace(/^--/, "").split("=");
		return [key, value ?? true];
	})
);

const mbSize = parseInt(args["txt-size"] || 50);

const inputPath = join(path, `./text-files/${mbSize}mb.txt`);
const outputPath = join(path, "./text-files/large-output.txt");

function writeChunk(writer, chunk) {
	return new Promise((resolve) => {
		const canWrite = writer.write(chunk);
		if (canWrite) {
			resolve();
		} else {
			writer.once("drain", resolve);
		}
	});
}

function benchmarkReadWrite(runs) {
	let totalReadTime = 0;
	let totalWriteTime = 0;

	async function run() {
		const readStart = performance.now();
		const readStream = createReadStream(inputPath, {
			highWaterMark: 64 * 1024,
		});
		const chunks = [];

		for await (const chunk of readStream) {
			chunks.push(chunk);
		}
		const readEnd = performance.now();
		totalReadTime += readEnd - readStart;

		const writeStart = performance.now();
		const writeStream = createWriteStream(outputPath);
		for (const chunk of chunks) {
			await writeChunk(writeStream, chunk);
		}
		await new Promise((resolve) => writeStream.end(resolve));
		const writeEnd = performance.now();
		totalWriteTime += writeEnd - writeStart;

		// Clear output file for next run
		await new Promise((resolve, reject) => {
			import("node:fs").then((fs) => {
				fs.writeFile(outputPath, "", (err) => {
					if (err) reject(err);
					else resolve();
				});
			});
		});
	}

	(async () => {
		for (let i = 0; i < runs; i++) {
			await run();
		}
		console.log(
			`Average read time: ${(totalReadTime / runs).toFixed(2)} ms`
		);
		console.log(
			`Average write time: ${(totalWriteTime / runs).toFixed(2)} ms`
		);
	})();
}

benchmarkReadWrite(50);

// deno version of read-write benchmark
// run with:
// deno run --allow-read --allow-write read-write-deno.js

import { join } from "https://deno.land/std/path/mod.ts";

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

async function benchmarkReadWrite(runs) {
	let totalReadTime = 0;
	let totalWriteTime = 0;

	for (let i = 0; i < runs; i++) {
		const startRead = performance.now();

		const inputFile = await Deno.open(inputPath, { read: true });
		const reader = inputFile.readable.getReader();

		const chunks = [];
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			chunks.push(value);
		}
		// Dispose inputFile safely
		inputFile[Symbol.dispose]?.();

		const endRead = performance.now();
		totalReadTime += endRead - startRead;

		const startWrite = performance.now();

		const outputFile = await Deno.open(outputPath, {
			write: true,
			create: true,
			truncate: true,
		});
		const writer = outputFile.writable.getWriter();

		for (const chunk of chunks) {
			await writer.write(chunk);
		}

		await writer.close();
		// Dispose outputFile safely
		outputFile[Symbol.dispose]?.();

		const endWrite = performance.now();
		totalWriteTime += endWrite - startWrite;
	}

	console.log(`Average read time: ${(totalReadTime / runs).toFixed(2)} ms`);
	console.log(`Average write time: ${(totalWriteTime / runs).toFixed(2)} ms`);
}

benchmarkReadWrite(50);

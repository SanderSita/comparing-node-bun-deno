function fib(n) {
	if (n <= 1) return n;
	return fib(n - 1) + fib(n - 2);
}

function benchmark(n, runs) {
	let total = 0;

	for (let i = 0; i < runs; i++) {
		const start = performance.now();
		fib(n);
		const end = performance.now();
		total += end - start;
		console.log(`Run ${i + 1}: ${(end - start).toFixed(2)} ms`);
	}

	console.log(`Average: ${(total / runs).toFixed(2)} ms`);
}

benchmark(45, 10);

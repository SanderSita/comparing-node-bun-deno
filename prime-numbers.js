function getPrimeIndex(n) {
	if (!Number.isInteger(n) || n < 1)
		throw new Error("n must be a positive integer");
	if (n === 1) return 2;

	// upper bound estimate for the n prime (for n >= 6)
	let estimate;
	if (n < 6) {
		estimate = 15;
	} else {
		const ln = Math.log(n);
		estimate = Math.ceil(n * (ln + Math.log(ln)));
	}

	while (true) {
		const sieve = new Uint8Array(estimate + 1);
		sieve[0] = sieve[1] = 1;
		const limit = Math.floor(Math.sqrt(estimate));
		for (let i = 2; i <= limit; i++) {
			if (!sieve[i]) {
				for (let j = i * i; j <= estimate; j += i) sieve[j] = 1;
			}
		}

		let count = 0;
		for (let i = 2; i <= estimate; i++) {
			if (!sieve[i]) {
				count++;
				if (count === n) return i;
			}
		}

		//not enough primes found, increase estimate and try again
		estimate *= 2;
	}
}

function benchmark(n, runs) {
	let total = 0;
	let result = 0;
	for (let i = 0; i < runs; i++) {
		const start = performance.now();
		result = getPrimeIndex(n);
		const end = performance.now();
		total += end - start;
		console.log(`Run ${i + 1}: ${(end - start).toFixed(2)} ms`);
	}
	console.log(`Average: ${(total / runs).toFixed(2)} ms`);
	console.log(`The ${n}th prime number is ${result}`);
}

benchmark(1000000, 30);

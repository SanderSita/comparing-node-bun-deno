# JavaScript Runtime Performance Comparison

This project compares the execution speed of **Node.js**, **Deno**, and **Bun** using the same JavaScript code.

The tests include both CPU-bound and I/O-bound tasks:

-   Recursive Fibonacci calculation
-   Prime number generation
-   Reading and writing text files (from small sizes up to 500 MB)

## Requirements

-   Latest versions of **Node.js**, **Deno**, and **Bun**
-   A Windows or macOS/Linux system
-   The test text files (for I/O experiments)

📂 **Download required text files:**  
put these txt files in the /text-files folder
[Download text files here](https://icthva-my.sharepoint.com/:f:/g/personal/sander_sekreve_hva_nl/El2_6MnCnKpClRYoOm1ov-QBu7D_Z4TiAdajXriecZaGZA?e=2Ork0p)

## Running the Experiments

Clone this repository, then navigate into the project folder:

```bash
cd comparing-node-bun-deno

# run fibonacci experiment
node fibonacci.js
bun run fibonacci.js
deno run fibonacci.js

# run prime number experiment
node prime-numbers.js
bun run prime-numbers.js
deno run prime-numbers.js

# run read/write experiment
node read-write.js
bun run read-write.js
deno run --allow-read --allow-write read-write-deno.js
```

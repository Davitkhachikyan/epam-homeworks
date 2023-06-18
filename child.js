process.stdin.on('data', (data) => {
    console.log(`parent sent: ${data}`);
});

process.stdout.write('Hello from child! \n');
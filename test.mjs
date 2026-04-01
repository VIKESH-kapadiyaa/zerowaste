import { build } from 'vite';
async function run() {
  try {
    await build();
  } catch (err) {
    if (err.errors) console.log(JSON.stringify(err.errors, null, 2));
    else console.log(err.stack);
  }
}
run();

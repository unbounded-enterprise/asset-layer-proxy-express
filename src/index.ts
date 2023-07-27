import server from "./server";

async function main() {
  try {
    await server.init();
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

main();
const { spawn, spawnSync } = require("node:child_process");

const runMigration = () => {
  const result = spawnSync(process.execPath, ["scripts/migrate.js"], {
    env: process.env,
    stdio: "inherit",
  });

  if (result.error) {
    console.error("Failed to start migration process:", result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const startServer = () => {
  const server = spawn(process.execPath, ["server.js"], {
    env: process.env,
    stdio: "inherit",
  });

  const forwardSignal = (signal) => {
    server.kill(signal);
  };

  process.on("SIGINT", forwardSignal);
  process.on("SIGTERM", forwardSignal);

  server.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
};

runMigration();
startServer();

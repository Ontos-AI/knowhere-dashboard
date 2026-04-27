const { spawn, spawnSync } = require("node:child_process");

const MIGRATION_WORKDIR = "/migration";

const runCommand = (command, args) => {
  const result = spawnSync(command, args, {
    env: process.env,
    stdio: "inherit",
  });

  if (result.error) {
    console.error(`Failed to start ${command} ${args.join(" ")}:`, result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const runMigrations = () => {
  runCommand("pnpm", ["--dir", MIGRATION_WORKDIR, "db:generate"]);
  runCommand("pnpm", ["--dir", MIGRATION_WORKDIR, "db:migrate"]);
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

runMigrations();
startServer();

const { exec } = require('child_process');
const fs = require('fs');

const npmCli = "C:\\Users\\86188\\.trae\\binaries\\node\\versions\\24.13.1\\node_modules\\npm\\bin\\npm-cli.js";
const nodeExe = "C:\\Users\\86188\\.trae\\binaries\\node\\versions\\24.13.1\\node.exe";

console.log('Starting install...');
const child = exec(`"${nodeExe}" "${npmCli}" install`, {
  cwd: "F:\\trae 图片风格化\\friends"
}, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    fs.writeFileSync('install_error.log', error.toString());
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
  fs.writeFileSync('install_stdout.log', stdout);
  fs.writeFileSync('install_stderr.log', stderr);
});

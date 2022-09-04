let addresses =
  `XmaroZwvCKjsYQQVdCQP2BuWnnMGxWLCGJ XmCyQ6qARLWXap74QubFMunngoiiA1QgCL XaxrcNUS6MrAfsvXNF2s24eChFVKabU6gP XdaWS6gScUjxbFdA8WSFZbeBK2mpGDr6uc XgfQUxiwo7BnTpwxAqpmVJSJwtJHdRCJd2 Xhn6eTCwW94vhVifhshyTeihvTa7LcatiM XnepcKMViJE3bR4ggFkAfLGgqBSr6EjA8z Xp3pqfnYUYLif4SqWFU3Fuv4hJJQRen1ud Xsa1WM9FbRxqSfBxjfFVjLfQ5zinK5NHio Xw2zuXP3VwoRKMoV7cA9TQpJ5bnbCsw13Q XxrK9XH5L3mGCyirz26RpGpCQcJB3v39Lk`.split(
    " "
  );

let debug_output = localStorage.getItem("debug_output") === "1";

async function testGetTx(index) {
  debug(`Initializing dashsight library`);
  let Dashsight = require("dashsight");

  debug(`Creating dashsight instance`);
  let dashsight = Dashsight.create({
    baseUrl: "https://insight.dash.org",
  });

  // Base58Check-encoded Pay to Pubkey Hash (p2pkh)
  let addr = addresses[index];
  debug(`Using addr: ${addr}`);

  debug(`Call to dashsight.getInstantBalance`);
  let info = await dashsight.getInstantBalance(addr);
  call_to(`getInstantBalance(${addr})`, info);

  debug(`Call to dashsight.getBalance`);
  info = await dashsight.getBalance(addr);
  call_to(`getBalance(${addr})`, info);

  // Base58Check-encoded Pay to Pubkey Hash (p2pkh)
  let txid = `f92e66edc9c8da41de71073ef08d62c56f8752a3f4e29ced6c515e0b1c074a38`;

  debug(`Call to dashsight.getTx`);
  let tx = await dashsight.getTx(txid);

  call_to(`getTx(${txid})`, tx);
  return tx;
}

function output() {
  return document.getElementById("output");
}

function clear() {
  output().innerHTML = "";
}
function expand_line(line) {
  if (typeof line === "object") {
    return JSON.stringify(line, null, 2);
  }
  return line;
}
function _msg(line, type, color) {
  type = type.replace(/[^a-z_]+/i, "");
  color = color.replace(/[^a-z_]+/i, "");
  let obj = expand_line(line);
  let pre = document.createElement("pre");
  let div = document.createElement("div");
  div.innerText = obj;
  pre.appendChild(div);
  output().innerHTML += `<br/><b style="color: ${color};">${type}: </b>`;
  output().appendChild(pre);
}
function call_to(func, result) {
  _msg(func, "Call to", "green");
  _msg(result, "Result", "green");
}
function status(line) {
  _msg(line, "Status", "black");
}
function error(line) {
  _msg(line, "Error", "red");
}
function debug(line) {
  if (debug_output) {
    _msg(line, "Debug", "grey");
  }
}
function toggle_debug_output() {
  debug_output = localStorage.getItem("debug_output");
  if (debug_output === "1") {
    localStorage.setItem("debug_output", "0");
  } else {
    localStorage.setItem("debug_output", "1");
  }
  debug_output = localStorage.getItem("debug_output") === "1";
  document.getElementById("debug-output").innerText = debug_output
    ? "on"
    : "off";
}
function clear_outputs() {
  output().innerHTML = "";
}

async function test_one() {
  status("<b>Loading test_one...</b>");
  let tx = await testGetTx(0).catch(function (issue) {
    error(issue);
    console.error(issue);
  });
  status(`Was able to get back transaction: `);
  status(tx);
  status(`test_one() test complete`);
}

document.getElementById("test-one").onclick = test_one;

(async function () {
  debug_output = localStorage.getItem("debug_output") === "1";
  await test_one();
  document.getElementById("debug").onclick = toggle_debug_output;
  document.getElementById("debug-output").innerText = debug_output
    ? "on"
    : "off";
  document.getElementById("clear").onclick = clear_outputs;
})();

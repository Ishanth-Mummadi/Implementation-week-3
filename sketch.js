let screen = "login";
let account = { email: "", password: "" };
let email = "";
let password = "";
let focus = "email";
let message = "";
let exercise = 0;
let done = [false, false, false];
let clicks = 0;
let wipe = 0;
let jarClicks = 0;

function setup() {
  createCanvas(480, 720);
  textFont("system-ui");
  let saved = localStorage.getItem("obsidian-minibus-account");
  if (saved) account = JSON.parse(saved);
}

function draw() {
  background(255);
  if (screen === "login" || screen === "create") formScreen();
  if (screen === "home") homeScreen();
  if (screen === "exercise") exerciseScreen();
}

function heading(big, small) {
  fill(0); textAlign(CENTER, CENTER); textSize(13); text(big, 240, 30);
  fill(0); textSize(28); text(small, 240, 78);
}

function formScreen() {
  heading("OBSIDIAN MINIBUS", screen === "login" ? "Log in" : "Create account");
  field("Account", email, 190, focus === "email", false);
  field("Password", password, 290, focus === "password", true);
  button(screen === "login" ? "Log in" : "Save", 140, 410, 200, 55, [0, 0, 0]);
  button(screen === "login" ? "Create account" : "Back", 140, 490, 200, 45, [0, 0, 0]);
  fill(0); textSize(14); text(message, 240, 585);
  fill(0); textSize(12); text("Simple demo storage in this browser", 240, 650);
}

function field(name, value, y, active, hidden) {
  fill(0); textAlign(LEFT, CENTER); textSize(16); text(name, 40, y + 28);
  stroke(0); strokeWeight(2); fill(255); rect(160, y, 280, 56, 10);
  noStroke(); fill(0); text(hidden ? "•".repeat(value.length) : value, 175, y + 28);
}

function homeScreen() {
  heading("OBSIDIAN MINIBUS", "Pick one exercise");
  fill(0); textSize(14); text("There are only three.", 240, 125);
  button("1. Open the jar", 110, 190, 260, 65, [0, 0, 0]);
  button("2. Click the lights", 110, 285, 260, 65, [0, 0, 0]);
  button("3. Wipe the window", 110, 380, 260, 65, [0, 0, 0]);
  button("Account", 160, 545, 160, 45, [0, 0, 0]);
}

function exerciseScreen() {
  let names = ["Open the jar", "Click the lights", "Clean the surface"];
  let hints = ["Click the jar three times.", "Click the three lights.", "Hold the mouse and wipe the surface."];
  heading("EXERCISE " + (exercise + 1) + " OF 3", names[exercise]);
  fill(0); textSize(15); text(hints[exercise], 240, 135);
  if (exercise === 0) openJar();
  if (exercise === 1) clickLights();
  if (exercise === 2) wipeWindow();
  fill(0); textSize(16); text(done[exercise] ? "Done!" : "Keep going", 240, 560);
  button("Back", 90, 630, 120, 45, [0, 0, 0]);
  button("Next", 270, 630, 120, 45, [0, 0, 0]);
}

function openJar() {
  fill(0); ellipse(240, 320, 170, 150);
  fill(255); rect(175, 245, 130, 35, 8);
  fill(0); textSize(15); text("Clicks: " + jarClicks + " / 3", 240, 440);
}

function clickLights() {
  for (let i = 0; i < 3; i++) { fill(i < clicks ? 0 : 255); ellipse(170 + i * 70, 320, 42, 42); }
  fill(0); textSize(14); text("Lights clicked: " + clicks + " / 3", 240, 410);
}

function wipeWindow() {
  fill(0); rect(90, 210, 300, 230, 12);
  fill(255); rect(105, 225, wipe * 2.7, 200, 6);
  fill(0); textSize(14); text("Wiped: " + floor(wipe) + "%", 240, 480);
  if (wipe === 100) done[2] = true;
}

function button(label, x, y, w, h, rgb) {
  let over = inside(mouseX, mouseY, x, y, w, h);
  stroke(0); strokeWeight(2); fill(255); rect(x, y, w, h, 10);
  fill(0); textAlign(CENTER, CENTER); textSize(16); text(label, x + w / 2, y + h / 2);
}

function inside(px, py, x, y, w, h) { return px > x && px < x + w && py > y && py < y + h; }

function mousePressed() {
  if (screen === "login" || screen === "create") {
    if (inside(mouseX, mouseY, 160, 190, 280, 56)) focus = "email";
    if (inside(mouseX, mouseY, 160, 290, 280, 56)) focus = "password";
    if (inside(mouseX, mouseY, 140, 410, 200, 55)) {
      if (screen === "login") login(); else saveAccount();
    }
    if (inside(mouseX, mouseY, 140, 490, 200, 45)) { screen = screen === "login" ? "create" : "login"; message = ""; }
    return;
  }
  if (screen === "home") {
    if (inside(mouseX, mouseY, 110, 190, 260, 65)) start(0);
    if (inside(mouseX, mouseY, 110, 285, 260, 65)) start(1);
    if (inside(mouseX, mouseY, 110, 380, 260, 65)) start(2);
    if (inside(mouseX, mouseY, 160, 545, 160, 45)) { screen = "login"; message = ""; }
    return;
  }
  if (screen === "exercise") {
    if (exercise === 0 && mouseX > 160 && mouseX < 320 && mouseY > 240 && mouseY < 410 && jarClicks < 3) { jarClicks++; if (jarClicks === 3) done[0] = true; }
    if (exercise === 1 && mouseY > 290 && mouseY < 350 && clicks < 3) clicks++;
    if (inside(mouseX, mouseY, 90, 630, 120, 45)) screen = "home";
    if (inside(mouseX, mouseY, 270, 630, 120, 45)) { exercise = (exercise + 1) % 3; clicks = 0; wipe = 0; jarClicks = 0; }
  }
}

function start(which) { exercise = which; screen = "exercise"; clicks = 0; wipe = 0; jarClicks = 0; }

function saveAccount() {
  if (!email || !password) { message = "Fill in both boxes."; return; }
  account = { email: email, password: password };
  localStorage.setItem("obsidian-minibus-account", JSON.stringify(account));
  email = ""; password = ""; message = "Saved. Now log in."; screen = "login";
}

function login() {
  if (email === account.email && password === account.password) { screen = "home"; email = ""; password = ""; message = ""; }
  else message = "Wrong account or password.";
}

function mouseDragged() {
  if (screen === "exercise" && exercise === 2 && mouseX > 90 && mouseX < 390 && mouseY > 210 && mouseY < 440) {
    wipe += max(0.12, dist(mouseX, mouseY, pmouseX, pmouseY) * 0.12);
    if (wipe > 100) wipe = 100;
    if (wipe === 100) done[2] = true;
  }
}

function keyTyped() {
  if (screen !== "login" && screen !== "create") return;
  if (key.length !== 1) return;
  if (focus === "email") email += key; else password += key;
}

function keyPressed() {
  if (screen !== "login" && screen !== "create") return;
  if (keyCode === BACKSPACE || keyCode === DELETE) { if (focus === "email") email = email.slice(0, -1); else password = password.slice(0, -1); return false; }
  if (keyCode === TAB) { focus = focus === "email" ? "password" : "email"; return false; }
}

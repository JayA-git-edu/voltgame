(() => {
  const PIXEL_SCALE_OPTIONS = [2, 3, 4, 5];
  const DEFAULT_SETTINGS = {
    pixelScale: 3,
    screenShake: true,
    shaderFx: true,
    lowFxMode: false,
    masterVolume: 0.8,
    musicVolume: 0.6,
    sfxVolume: 0.7,
    keybinds: {
      left: "ArrowLeft",
      right: "ArrowRight",
      jump: "Space",
      dash: "Shift",
      attack: "KeyZ",
      blast: "KeyX",
      charge: "KeyC",
    },
  };

  const GAME_CONFIG = {
    width: 640,
    height: 360,
    tileSize: 32,
    gravity: 0.35,
    dashCost: 12,
    blastCost: 8,
    energyRegen: 6,
    energyMax: 100,
  };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const formatPercent = (value) => `${Math.round(value * 100)}%`;
  const now = () => performance.now();

  class InputManager {
    constructor(keybinds) {
      this.keybinds = keybinds;
      this.state = new Map();
      this.handlers = {
        keydown: (event) => this.setKey(event.code, true),
        keyup: (event) => this.setKey(event.code, false),
        blur: () => this.reset(),
      };
    }

    connect() {
      window.addEventListener("keydown", this.handlers.keydown);
      window.addEventListener("keyup", this.handlers.keyup);
      window.addEventListener("blur", this.handlers.blur);
    }

    setKey(code, pressed) {
      this.state.set(code, pressed);
    }

    reset() {
      this.state.clear();
    }

    isPressed(action) {
      const key = this.keybinds[action];
      if (!key) return false;
      return this.state.get(key) === true;
    }
  }

  class Renderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.ctx.imageSmoothingEnabled = false;
    }

    clear() {
      this.ctx.fillStyle = "#0b1120";
      this.ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
    }

    drawGround() {
      const { ctx } = this;
      ctx.fillStyle = "#14213d";
      ctx.fillRect(0, GAME_CONFIG.height - 48, GAME_CONFIG.width, 48);
      ctx.fillStyle = "#1f2a44";
      ctx.fillRect(0, GAME_CONFIG.height - 52, GAME_CONFIG.width, 4);
    }

    drawPlayer(player) {
      const { ctx } = this;
      const size = player.size;
      ctx.save();
      ctx.translate(player.position.x, player.position.y);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.strokeStyle = player.energyGlow;
      ctx.lineWidth = 3;
      ctx.strokeRect(-size / 2 + 1.5, -size / 2 + 1.5, size - 3, size - 3);
      ctx.restore();
    }

    drawEnemy(enemy) {
      const { ctx } = this;
      ctx.save();
      ctx.translate(enemy.position.x, enemy.position.y);
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(-enemy.size / 2, -enemy.size / 2, enemy.size, enemy.size);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.strokeRect(-enemy.size / 2 + 1, -enemy.size / 2 + 1, enemy.size - 2, enemy.size - 2);
      ctx.restore();
    }

    drawProjectile(projectile) {
      const { ctx } = this;
      ctx.save();
      ctx.translate(projectile.position.x, projectile.position.y);
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(0, 0, projectile.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    drawDamageNumbers(numbers) {
      const { ctx } = this;
      ctx.font = "12px monospace";
      ctx.fillStyle = "#f87171";
      numbers.forEach((number) => {
        ctx.fillText(number.text, number.position.x, number.position.y);
      });
    }
  }

  class Player {
    constructor() {
      this.size = 32;
      this.position = { x: 160, y: 220 };
      this.velocity = { x: 0, y: 0 };
      this.energy = GAME_CONFIG.energyMax;
      this.xp = 0;
      this.level = 1;
      this.state = "idle";
      this.facing = 1;
      this.onGround = false;
      this.cooldowns = {
        dash: 0,
        blast: 0,
      };
    }

    get energyPercent() {
      return this.energy / GAME_CONFIG.energyMax;
    }

    get energyGlow() {
      const intensity = Math.round(200 * this.energyPercent + 55);
      return `rgb(${intensity}, ${200 - intensity / 2}, 255)`;
    }

    update(delta, input) {
      const speed = 2.2;
      const jumpForce = -7.5;
      const dashSpeed = 6;

      this.velocity.x = 0;

      if (input.isPressed("left")) {
        this.velocity.x = -speed;
        this.facing = -1;
      }
      if (input.isPressed("right")) {
        this.velocity.x = speed;
        this.facing = 1;
      }

      if (input.isPressed("jump") && this.onGround) {
        this.velocity.y = jumpForce;
        this.onGround = false;
      }

      const wantsDash = input.isPressed("dash");
      if (wantsDash && this.energy >= GAME_CONFIG.dashCost && this.cooldowns.dash <= 0) {
        this.energy -= GAME_CONFIG.dashCost;
        this.velocity.x = dashSpeed * this.facing;
        this.cooldowns.dash = 0.35;
        this.state = "dash";
      }

      if (input.isPressed("charge")) {
        this.energy = clamp(this.energy + GAME_CONFIG.energyRegen * delta * 1.8, 0, GAME_CONFIG.energyMax);
        this.state = "charge";
      }

      if (input.isPressed("attack")) {
        this.state = "attack";
      }

      if (!this.onGround) {
        this.velocity.y += GAME_CONFIG.gravity;
      }

      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      const ground = GAME_CONFIG.height - 64;
      if (this.position.y >= ground) {
        this.position.y = ground;
        this.velocity.y = 0;
        this.onGround = true;
      }

      this.position.x = clamp(this.position.x, 32, GAME_CONFIG.width - 32);

      this.cooldowns.dash = Math.max(0, this.cooldowns.dash - delta);
      this.cooldowns.blast = Math.max(0, this.cooldowns.blast - delta);

      if (!input.isPressed("charge") && this.state === "charge") {
        this.state = "idle";
      }
    }

    canBlast() {
      return this.energy >= GAME_CONFIG.blastCost && this.cooldowns.blast <= 0;
    }

    consumeBlast() {
      this.energy = clamp(this.energy - GAME_CONFIG.blastCost, 0, GAME_CONFIG.energyMax);
      this.cooldowns.blast = 0.25;
    }

    gainXp(amount) {
      this.xp += amount;
      if (this.xp >= 100) {
        this.level += 1;
        this.xp = 0;
      }
    }
  }

  class Enemy {
    constructor(position) {
      this.position = { ...position };
      this.size = 28;
      this.state = "patrol";
      this.health = 3;
      this.stunTimer = 0;
      this.direction = 1;
    }

    update(delta, player) {
      if (this.stunTimer > 0) {
        this.stunTimer -= delta;
        this.state = "stunned";
        return;
      }

      const distance = player.position.x - this.position.x;
      if (Math.abs(distance) < 140) {
        this.state = "chase";
        this.position.x += Math.sign(distance) * delta * 50;
      } else {
        this.state = "patrol";
        this.position.x += this.direction * delta * 30;
      }

      if (this.position.x > 520 || this.position.x < 120) {
        this.direction *= -1;
      }
    }

    hit() {
      this.health -= 1;
      this.stunTimer = 0.2;
      return this.health <= 0;
    }
  }

  class Projectile {
    constructor(position, direction) {
      this.position = { ...position };
      this.velocity = { x: direction * 8, y: 0 };
      this.radius = 4;
      this.active = true;
    }

    update(delta) {
      this.position.x += this.velocity.x * delta * 60;
      if (this.position.x < 0 || this.position.x > 640) {
        this.active = false;
      }
    }
  }

  const updateHud = ({ player, overlay }) => {
    const energyFill = overlay.querySelector("#energyFill");
    const xpFill = overlay.querySelector("#xpFill");
    const stats = overlay.querySelector("#hudStats");

    if (energyFill) {
      energyFill.style.width = formatPercent(player.energyPercent);
    }

    if (xpFill) {
      xpFill.style.width = formatPercent(player.xp / 100);
    }

    if (stats) {
      stats.innerHTML = `
        <div>State: ${player.state}</div>
        <div>Level: ${player.level}</div>
        <div>Energy: ${Math.round(player.energy)}</div>
        <div>Cooldown (Dash): ${player.cooldowns.dash.toFixed(2)}s</div>
      `;
    }
  };

  const WORLD_DATA = [
    {
      id: "emberfall",
      name: "Emberfall Circuit",
      status: "locked",
      theme: "Lava conduits and unstable cores.",
    },
    {
      id: "skyspire",
      name: "Skyspire Nexus",
      status: "locked",
      theme: "Vertical gauntlets and wind lifts.",
    },
    {
      id: "verdant",
      name: "Verdant Relay",
      status: "locked",
      theme: "Bioluminescent growth and spores.",
    },
    {
      id: "tundra",
      name: "Tundra Shell",
      status: "locked",
      theme: "Frozen platforms with brittle ice.",
    },
    {
      id: "void",
      name: "The Null Core",
      status: "locked",
      theme: "Void echoes and shifting gravity.",
    },
  ];

  const buildWorldMap = () => {
    return `
      <div class="overlay__section">
        <h3>World Map</h3>
        ${WORLD_DATA.map(
          (world, index) => `
            <p>
              <strong>${index + 1}. ${world.name}</strong><br />
              <span>${world.theme}</span><br />
              <em>Status: ${world.status}</em>
            </p>
          `
        ).join("")}
      </div>
    `;
  };

  const buildSettings = (settings) => {
    return `
      <div class="overlay__section">
        <h3>Settings</h3>
        <p>Pixel Scale: ${settings.pixelScale}x</p>
        <p>Screen Shake: ${settings.screenShake ? "On" : "Off"}</p>
        <p>Shader FX: ${settings.shaderFx ? "On" : "Off"}</p>
        <p>Low-FX Mode: ${settings.lowFxMode ? "On" : "Off"}</p>
      </div>
    `;
  };

  const buildPause = () => {
    return `
      <div class="overlay__section">
        <h3>Pause Menu</h3>
        <p>Resume to continue the fight.</p>
        <p>Use the settings button to tweak accessibility options.</p>
      </div>
    `;
  };

  const buildOverlay = (game, overlay) => {
    overlay.innerHTML = `
      <h2 class="overlay__title">${game.overlayState.title}</h2>
      ${game.overlayState.content}
    `;
  };

  const bindUi = (game, overlayPanel) => {
    const pauseButton = document.querySelector("#togglePause");
    const mapButton = document.querySelector("#toggleMap");
    const settingsButton = document.querySelector("#toggleSettings");

    const toggle = (title, content) => {
      game.toggleOverlay(title, content);
      overlayPanel.hidden = !game.overlayState.visible;
      buildOverlay(game, overlayPanel);
    };

    pauseButton?.addEventListener("click", () => {
      toggle("Paused", buildPause());
    });

    mapButton?.addEventListener("click", () => {
      toggle("World Map", buildWorldMap());
    });

    settingsButton?.addEventListener("click", () => {
      toggle("Settings", buildSettings(game.settings.settings));
    });
  };

  const STORAGE_KEY = "volt_settings_v1";

  const loadSettings = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("Unable to load settings", error);
      return null;
    }
  };

  const saveSettings = (settings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn("Unable to save settings", error);
    }
  };

  class SettingsManager {
    constructor() {
      this.settings = { ...DEFAULT_SETTINGS, ...(loadSettings() ?? {}) };
    }

    update(partial) {
      this.settings = { ...this.settings, ...partial };
      saveSettings(this.settings);
    }

    updateKeybind(action, key) {
      this.settings.keybinds = { ...this.settings.keybinds, [action]: key };
      saveSettings(this.settings);
    }
  }

  class Game {
    constructor({ canvas, hudPanel, overlayPanel }) {
      this.renderer = new Renderer(canvas);
      this.settings = new SettingsManager();
      this.input = new InputManager(this.settings.settings.keybinds);
      this.player = new Player();
      this.enemies = [new Enemy({ x: 420, y: 240 })];
      this.projectiles = [];
      this.damageNumbers = [];
      this.hudPanel = hudPanel;
      this.overlayPanel = overlayPanel;
      this.lastTime = now();
      this.running = false;
      this.overlayState = {
        visible: false,
        title: "",
        content: "",
      };
    }

    start() {
      this.input.connect();
      this.running = true;
      requestAnimationFrame(() => this.loop());
    }

    toggleOverlay(title, content) {
      if (this.overlayState.visible && this.overlayState.title === title) {
        this.overlayState = { visible: false, title: "", content: "" };
        return;
      }
      this.overlayState = { visible: true, title, content };
    }

    loop() {
      if (!this.running) return;
      const current = now();
      const delta = Math.min(0.05, (current - this.lastTime) / 1000);
      this.lastTime = current;

      if (!this.overlayState.visible) {
        this.update(delta);
      }
      this.render();
      requestAnimationFrame(() => this.loop());
    }

    update(delta) {
      this.player.update(delta, this.input);

      if (this.input.isPressed("blast") && this.player.canBlast()) {
        this.player.consumeBlast();
        this.projectiles.push(new Projectile(this.player.position, this.player.facing));
      }

      this.enemies.forEach((enemy) => enemy.update(delta, this.player));
      this.projectiles.forEach((projectile) => projectile.update(delta));
      this.projectiles = this.projectiles.filter((projectile) => projectile.active);

      this.handleCollisions();
      this.updateDamageNumbers(delta);

      updateHud({ player: this.player, overlay: this.hudPanel });
    }

    handleCollisions() {
      this.projectiles.forEach((projectile) => {
        this.enemies.forEach((enemy) => {
          const dx = projectile.position.x - enemy.position.x;
          const dy = projectile.position.y - enemy.position.y;
          const distance = Math.hypot(dx, dy);
          if (distance < projectile.radius + enemy.size / 2) {
            projectile.active = false;
            if (enemy.hit()) {
              this.player.gainXp(25);
            }
            this.damageNumbers.push({
              text: "-1",
              position: { x: enemy.position.x, y: enemy.position.y - 12 },
              time: 0.4,
            });
          }
        });
      });
    }

    updateDamageNumbers(delta) {
      this.damageNumbers.forEach((number) => {
        number.position.y -= delta * 24;
        number.time -= delta;
      });
      this.damageNumbers = this.damageNumbers.filter((number) => number.time > 0);
    }

    render() {
      this.renderer.clear();
      this.renderer.drawGround();
      this.renderer.drawPlayer(this.player);
      this.enemies.forEach((enemy) => this.renderer.drawEnemy(enemy));
      this.projectiles.forEach((projectile) => this.renderer.drawProjectile(projectile));
      this.renderer.drawDamageNumbers(this.damageNumbers);
    }
  }

  const canvas = document.querySelector("#gameCanvas");
  const hudPanel = document.querySelector("#hudPanel");
  const overlayPanel = document.querySelector("#overlayPanel");

  if (canvas && hudPanel && overlayPanel) {
    const game = new Game({ canvas, hudPanel, overlayPanel });
    bindUi(game, overlayPanel);
    buildOverlay(game, overlayPanel);
    game.start();
  }
})();

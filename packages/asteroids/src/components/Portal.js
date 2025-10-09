const PORTAL_BASE_RADIUS = 120;
const PULSE_SPEED = 0.0025;
const PULSE_SCALE = 0.12;

export class Portal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.spawnedAt = performance.now();
    this.active = true;
  }

  getRadius(now = performance.now()) {
    const elapsed = now - this.spawnedAt;
    const pulse = Math.sin(elapsed * PULSE_SPEED);
    return PORTAL_BASE_RADIUS * (1 + PULSE_SCALE * pulse);
  }

  draw(ctx, camera, canvasWidth, canvasHeight) {
    if (!this.active) return;

    const screenPos = camera.worldToScreen(this.x, this.y, canvasWidth, canvasHeight);
    const radius = this.getRadius();

    if (!camera.isVisible(this.x, this.y, radius, canvasWidth, canvasHeight)) {
      return;
    }

    ctx.save();
    ctx.translate(screenPos.x, screenPos.y);
    ctx.scale(1 / camera.zoom, 1 / camera.zoom);
    ctx.translate(-this.x, -this.y);

    const glowRadius = radius * 1.4;
    const gradient = ctx.createRadialGradient(this.x, this.y, radius * 0.6, this.x, this.y, glowRadius);
    gradient.addColorStop(0, 'rgba(72, 192, 255, 0.9)');
    gradient.addColorStop(0.4, 'rgba(100, 80, 255, 0.65)');
    gradient.addColorStop(0.7, 'rgba(50, 20, 140, 0.35)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(180, 240, 255, 0.85)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.setLineDash([20, 12]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius * 0.7, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  drawOnMinimap(ctx, scaleX, scaleY) {
    if (!this.active) return;

    const px = this.x * scaleX;
    const py = this.y * scaleY;
    const scale = Math.min(scaleX, scaleY);
    const outerRadius = Math.max(6, this.getRadius() * scale * 0.6);

    ctx.save();
    ctx.strokeStyle = '#6ef6ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(px, py, outerRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(110, 246, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(px, py, Math.max(4, outerRadius * 0.6), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

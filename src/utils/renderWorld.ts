import { Ladder, Platform, WORLD_HEIGHT, WORLD_ROOMS, WORLD_WIDTH } from '../data/world';
import { GameTime, TimeOfDay } from '../types/game';
import { spriteManager } from './spriteAssets';

export interface PlayerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: 'left' | 'right';
  isClimbing: boolean;
  isWalking: boolean;
  walkFrame: number;
}

export interface NPCState {
  id: string;
  name: string;
  species: 'sowa' | 'lis' | 'borsuk' | 'jez' | 'slimak' | 'mysz' | 'szczur' | 'wrona' | 'zaba';
  x: number;
  y: number;
  facing: 'left' | 'right';
  dialoguePreview: string;
  isSleeping?: boolean;
}

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 19) return 'day';
  if (hour >= 19 && hour < 22) return 'dusk';
  return 'night';
}

export function drawSkyAndSurface(
  ctx: CanvasRenderingContext2D,
  time: GameTime,
  cameraX: number,
  cameraY: number,
  viewWidth: number,
  viewHeight: number
) {
  const timeOfDay = getTimeOfDay(time.hour);

  // Surface Sky gradient
  const skyGrad = ctx.createLinearGradient(0, -cameraY, 0, 220 - cameraY);
  if (timeOfDay === 'day') {
    skyGrad.addColorStop(0, '#38bdf8');
    skyGrad.addColorStop(0.7, '#7dd3fc');
    skyGrad.addColorStop(1, '#bae6fd');
  } else if (timeOfDay === 'dawn') {
    skyGrad.addColorStop(0, '#f43f5e');
    skyGrad.addColorStop(0.5, '#fb923c');
    skyGrad.addColorStop(0.8, '#fde047');
    skyGrad.addColorStop(1, '#bae6fd');
  } else if (timeOfDay === 'dusk') {
    skyGrad.addColorStop(0, '#1e1b4b');
    skyGrad.addColorStop(0.5, '#7c3aed');
    skyGrad.addColorStop(0.8, '#c026d3');
    skyGrad.addColorStop(1, '#f97316');
  } else {
    // Night
    skyGrad.addColorStop(0, '#020617');
    skyGrad.addColorStop(0.6, '#0f172a');
    skyGrad.addColorStop(1, '#1e1b4b');
  }

  ctx.fillStyle = skyGrad;
  ctx.fillRect(-cameraX, -cameraY, WORLD_WIDTH, 220);

  // Celestial bodies (Sun / Moon)
  if (timeOfDay === 'day' || timeOfDay === 'dawn') {
    // Sun
    const sunProgress = (time.hour - 5) / 14;
    const sunX = 200 + sunProgress * (WORLD_WIDTH - 400) - cameraX;
    const sunY = 110 - Math.sin(sunProgress * Math.PI) * 65 - cameraY;

    ctx.save();
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Cartoon clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    [320, 780, 1260].forEach((cx, idx) => {
      const px = ((cx + time.minute * 0.4) % WORLD_WIDTH) - cameraX;
      const py = 50 + idx * 22 - cameraY;
      ctx.beginPath();
      ctx.arc(px, py, 22, 0, Math.PI * 2);
      ctx.arc(px + 20, py - 10, 26, 0, Math.PI * 2);
      ctx.arc(px + 45, py, 22, 0, Math.PI * 2);
      ctx.fill();
    });
  } else {
    // Moon & Twinkling Stars
    const moonProgress = time.hour >= 20 ? (time.hour - 20) / 9 : (time.hour + 4) / 9;
    const moonX = 350 + moonProgress * 850 - cameraX;
    const moonY = 75 - Math.sin(moonProgress * Math.PI) * 35 - cameraY;

    // Stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 45; i++) {
      const sx = (i * 47) % WORLD_WIDTH - cameraX;
      const sy = 15 + (i * 31) % 150 - cameraY;
      const twinkle = Math.sin(Date.now() * 0.003 + i) > 0 ? 2 : 1;
      ctx.fillRect(sx, sy, twinkle, twinkle);
    }

    // Glowing Moon
    ctx.save();
    ctx.fillStyle = '#fef9c3';
    ctx.shadowColor = '#e0e7ff';
    ctx.shadowBlur = 32;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Surface Grass Mound Layer
  ctx.fillStyle = timeOfDay === 'night' ? '#14532d' : '#16a34a';
  ctx.beginPath();
  ctx.moveTo(-cameraX, 220 - cameraY);
  ctx.lineTo(-cameraX, 190 - cameraY);
  // Grass hills
  ctx.bezierCurveTo(
    300 - cameraX, 172 - cameraY,
    600 - cameraX, 202 - cameraY,
    900 - cameraX, 185 - cameraY
  );
  ctx.bezierCurveTo(
    1100 - cameraX, 175 - cameraY,
    1350 - cameraX, 195 - cameraY,
    WORLD_WIDTH - cameraX, 190 - cameraY
  );
  ctx.lineTo(WORLD_WIDTH - cameraX, 220 - cameraY);
  ctx.closePath();
  ctx.fill();

  // Grass blades
  ctx.strokeStyle = timeOfDay === 'night' ? '#166534' : '#15803d';
  ctx.lineWidth = 2;
  for (let gx = 50; gx < WORLD_WIDTH; gx += 35) {
    const screenGX = gx - cameraX;
    const gy = 190 - cameraY;
    ctx.beginPath();
    ctx.moveTo(screenGX, gy);
    ctx.lineTo(screenGX - 4, gy - 12);
    ctx.moveTo(screenGX + 5, gy);
    ctx.lineTo(screenGX + 8, gy - 15);
    ctx.stroke();
  }

  // Human Garden Fence (on the right)
  ctx.fillStyle = '#78350f';
  for (let fx = 1200; fx < 1550; fx += 35) {
    const screenFX = fx - cameraX;
    ctx.fillRect(screenFX, 150 - cameraY, 12, 45);
    ctx.beginPath();
    ctx.moveTo(screenFX, 150 - cameraY);
    ctx.lineTo(screenFX + 6, 140 - cameraY);
    ctx.lineTo(screenFX + 12, 150 - cameraY);
    ctx.fill();
  }
  ctx.fillRect(1190 - cameraX, 165 - cameraY, 360, 6);
  ctx.fillRect(1190 - cameraX, 180 - cameraY, 360, 6);

  // Human scarecrow / birdhouse silhouette in distance
  ctx.fillStyle = '#451a03';
  ctx.fillRect(1420 - cameraX, 125 - cameraY, 6, 60);
  ctx.fillRect(1405 - cameraX, 135 - cameraY, 36, 4);
  ctx.beginPath();
  ctx.arc(1423 - cameraX, 120 - cameraY, 10, 0, Math.PI * 2);
  ctx.fill();

  // Great Wizard Oak Tree (left surface)
  drawOakTree(ctx, 220 - cameraX, 190 - cameraY, timeOfDay);
}

function drawOakTree(ctx: CanvasRenderingContext2D, baseX: number, baseY: number, timeOfDay: TimeOfDay) {
  // Tree Trunk
  ctx.fillStyle = '#45220f';
  ctx.beginPath();
  ctx.moveTo(baseX - 48, baseY);
  ctx.quadraticCurveTo(baseX - 35, baseY - 80, baseX - 60, baseY - 160);
  ctx.lineTo(baseX + 60, baseY - 160);
  ctx.quadraticCurveTo(baseX + 35, baseY - 80, baseX + 48, baseY);
  ctx.closePath();
  ctx.fill();

  // Underground Roots
  ctx.strokeStyle = '#2b1408';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(baseX - 30, baseY);
  ctx.quadraticCurveTo(baseX - 70, baseY + 60, baseX - 110, baseY + 120);
  ctx.moveTo(baseX + 25, baseY);
  ctx.quadraticCurveTo(baseX + 80, baseY + 80, baseX + 140, baseY + 140);
  ctx.stroke();

  // Tree Ladder / Vine Steps up the trunk to Sowa's Branch!
  ctx.fillStyle = '#b45309';
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 2.5;
  for (let ly = baseY - 15; ly >= baseY - 75; ly -= 14) {
    ctx.fillRect(baseX - 25, ly, 16, 4);
    ctx.strokeRect(baseX - 25, ly, 16, 4);
  }

  // Branch Platform for Czarodziejka Sowa (at y = 110, which is baseY - 80)
  ctx.fillStyle = '#5c3a21';
  ctx.beginPath();
  ctx.roundRect(baseX - 80, baseY - 82, 160, 14, 6);
  ctx.fill();
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Branch support bracket
  ctx.beginPath();
  ctx.moveTo(baseX - 50, baseY - 68);
  ctx.lineTo(baseX - 10, baseY - 20);
  ctx.moveTo(baseX + 50, baseY - 68);
  ctx.lineTo(baseX + 10, baseY - 20);
  ctx.stroke();

  // Leafy Canopy
  ctx.fillStyle = timeOfDay === 'night' ? '#064e3b' : '#15803d';
  ctx.beginPath();
  ctx.arc(baseX, baseY - 180, 85, 0, Math.PI * 2);
  ctx.arc(baseX - 60, baseY - 150, 65, 0, Math.PI * 2);
  ctx.arc(baseX + 60, baseY - 150, 65, 0, Math.PI * 2);
  ctx.fill();

  // Owl's Hollow / Dziupla
  ctx.fillStyle = '#1c1109';
  ctx.beginPath();
  ctx.ellipse(baseX, baseY - 118, 30, 36, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wooden rim
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Nighttime Magical Aura & Runes
  if (timeOfDay === 'night' || timeOfDay === 'dusk') {
    ctx.save();
    ctx.fillStyle = '#c084fc';
    ctx.shadowColor = '#e879f9';
    ctx.shadowBlur = 18;
    ctx.font = '16px Fredoka, sans-serif';
    ctx.fillText('✨', baseX - 60, baseY - 110);
    ctx.fillText('✨', baseX + 50, baseY - 110);
    ctx.restore();
  }
}

export function drawUndergroundCrossSection(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  cameraY: number,
  time: GameTime
) {
  // Earth base background
  ctx.fillStyle = '#3f2817';
  ctx.fillRect(-cameraX, 220 - cameraY, WORLD_WIDTH, WORLD_HEIGHT - 220);

  // Earth strata layers
  ctx.fillStyle = '#2d1a0e';
  ctx.fillRect(-cameraX, 220 - cameraY, WORLD_WIDTH, 40);

  ctx.fillStyle = '#26150b';
  ctx.fillRect(-cameraX, 720 - cameraY, WORLD_WIDTH, WORLD_HEIGHT - 720);

  // Pebbles & Earth flecks
  ctx.fillStyle = '#52341d';
  for (let i = 0; i < 180; i++) {
    const px = (i * 37) % WORLD_WIDTH - cameraX;
    const py = 240 + (i * 43) % (WORLD_HEIGHT - 250) - cameraY;
    ctx.fillRect(px, py, (i % 3) + 2, (i % 2) + 2);
  }

  // Draw Rooms (hollowed burrows)
  WORLD_ROOMS.forEach((room) => {
    if (room.theme.startsWith('surface')) return;

    const rx = room.x - cameraX;
    const ry = room.y - cameraY;

    // Room interior hollow
    ctx.save();
    ctx.fillStyle = '#1c130d';
    ctx.beginPath();
    ctx.roundRect(rx, ry, room.width, room.height, 28);
    ctx.fill();

    // Wood floor plank
    ctx.fillStyle = '#78350f';
    ctx.fillRect(rx + 6, room.floorY - cameraY, room.width - 12, 12);

    // Ceiling arch roots
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(rx + 10, ry + 15);
    ctx.quadraticCurveTo(rx + room.width / 2, ry + 35, rx + room.width - 10, ry + 15);
    ctx.stroke();

    // Specific room furniture
    if (room.theme === 'bedroom') {
      // Bed of moss & leaves
      ctx.fillStyle = '#15803d';
      ctx.fillRect(rx + 30, room.floorY - 24 - cameraY, 75, 24);
      // Quilt
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(rx + 45, room.floorY - 20 - cameraY, 55, 20);
      // Pillow
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(rx + 42, room.floorY - 18 - cameraY, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      // Wooden bed frame
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(rx + 25, room.floorY - 34 - cameraY, 6, 34);
      ctx.fillRect(rx + 105, room.floorY - 24 - cameraY, 6, 24);

      // Bookcase / Files
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(rx + room.width - 90, room.floorY - 80 - cameraY, 65, 80);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(rx + room.width - 85, room.floorY - 60 - cameraY, 55, 6);
      ctx.fillRect(rx + room.width - 85, room.floorY - 30 - cameraY, 55, 6);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(rx + room.width - 80, room.floorY - 55 - cameraY, 8, 24);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(rx + room.width - 70, room.floorY - 55 - cameraY, 10, 24);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(rx + room.width - 55, room.floorY - 55 - cameraY, 12, 24);
    } else if (room.theme === 'tavern') {
      // Tavern counter
      ctx.fillStyle = '#78350f';
      ctx.fillRect(rx + 50, room.floorY - 45 - cameraY, 140, 45);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(rx + 45, room.floorY - 48 - cameraY, 150, 8);

      // Bar mugs / bottles
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(rx + 65, room.floorY - 62 - cameraY, 12, 14);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(rx + 90, room.floorY - 65 - cameraY, 10, 17);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(rx + 120, room.floorY - 60 - cameraY, 14, 12);

      // Tables & Chairs
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(rx + 240, room.floorY - 38 - cameraY, 90, 38);
      ctx.fillRect(rx + 380, room.floorY - 38 - cameraY, 90, 38);
      ctx.fillRect(rx + 220, room.floorY - 26 - cameraY, 16, 26);
      ctx.fillRect(rx + 335, room.floorY - 26 - cameraY, 16, 26);
      ctx.fillRect(rx + 360, room.floorY - 26 - cameraY, 16, 26);
      ctx.fillRect(rx + 475, room.floorY - 26 - cameraY, 16, 26);

      // Sign: "Pod Wilgotnym Korzeniem"
      ctx.fillStyle = '#b45309';
      ctx.fillRect(rx + room.width / 2 - 80, ry + 15, 160, 26);
      ctx.fillStyle = '#fef3c7';
      ctx.font = '11px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Pod Wilgotnym Korzeniem', rx + room.width / 2, ry + 32);
    } else if (room.theme === 'pantry') {
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.ellipse(rx + 60, room.floorY - 20 - cameraY, 24, 18, 0, 0, Math.PI * 2);
      ctx.ellipse(rx + 105, room.floorY - 22 - cameraY, 26, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(rx + 220, room.floorY - 35 - cameraY, 16, 22);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(rx + 245, room.floorY - 35 - cameraY, 16, 22);
    } else if (room.theme === 'office') {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(rx + 80, room.floorY - 45 - cameraY, 130, 45);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(rx + 95, room.floorY - 50 - cameraY, 45, 6);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(rx + 160, room.floorY - 52 - cameraY, 10, 8);
    } else if (room.theme === 'cave') {
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.moveTo(rx + 80, room.floorY - cameraY);
      ctx.lineTo(rx + 90, room.floorY - 50 - cameraY);
      ctx.lineTo(rx + 100, room.floorY - cameraY);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(rx + 100, room.floorY - cameraY);
      ctx.lineTo(rx + 115, room.floorY - 65 - cameraY);
      ctx.lineTo(rx + 125, room.floorY - cameraY);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (room.theme === 'cellar') {
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(rx + 80, room.floorY - 35 - cameraY, 30, 34, 0, 0, Math.PI * 2);
      ctx.ellipse(rx + 155, room.floorY - 35 - cameraY, 30, 34, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Room Label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Outfit, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(room.name, rx + 18, ry + 22);

    // Warm hanging lantern
    const lanternX = rx + room.width / 2;
    const lanternY = ry + 40;
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lanternX, ry);
    ctx.lineTo(lanternX, lanternY);
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(lanternX - 7, lanternY, 14, 18);
    ctx.save();
    ctx.fillStyle = room.ambientLightColor ? `${room.ambientLightColor}33` : 'rgba(251, 191, 36, 0.2)';
    ctx.beginPath();
    ctx.arc(lanternX, lanternY + 9, 85, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  });

  // Connecting Tunnels
  ctx.fillStyle = '#1c130d';
  ctx.fillRect(50 - cameraX, 360 - cameraY, 1450, 70);
  ctx.fillRect(60 - cameraX, 620 - cameraY, 1450, 70);
  ctx.fillRect(80 - cameraX, 860 - cameraY, 1300, 70);
}

export function drawLadders(ctx: CanvasRenderingContext2D, ladders: Ladder[], cameraX: number, cameraY: number) {
  ladders.forEach((ladder) => {
    const lx = ladder.x - cameraX;
    const yTop = ladder.yTop - cameraY;
    const yBottom = ladder.yBottom - cameraY;

    // Ladder vertical poles
    ctx.fillStyle = '#92400e';
    ctx.fillRect(lx - 14, yTop, 5, yBottom - yTop);
    ctx.fillRect(lx + 10, yTop, 5, yBottom - yTop);

    // Rungs
    ctx.fillStyle = '#b45309';
    for (let ry = yTop + 12; ry < yBottom; ry += 18) {
      ctx.fillRect(lx - 12, ry, 24, 4);
    }
  });
}

// Draw Detective Mole using high-quality bitmap sprite or cartoon vector fallback
export function drawMolePlayer(
  ctx: CanvasRenderingContext2D,
  player: PlayerState,
  cameraX: number,
  cameraY: number
) {
  const px = player.x - cameraX;
  const py = player.y - cameraY;
  const isFacingLeft = player.facing === 'left';

  ctx.save();
  ctx.translate(px, py);
  if (isFacingLeft) {
    ctx.scale(-1, 1);
  }

  // Waddle cycle
  const waddle = player.isWalking ? Math.sin(player.walkFrame * 0.5) * 4 : 0;
  const tilt = player.isWalking ? Math.sin(player.walkFrame * 0.5) * 0.08 : 0;
  ctx.rotate(tilt);

  // Soft shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(0, 2, 22, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  const moleImg = spriteManager.getImage('kret');
  if (moleImg) {
    // Render the beautiful storybook sprite as a charming circular medallion badge
    const spriteSize = 72;
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, -36 + waddle, spriteSize / 2 - 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(moleImg, -spriteSize / 2, -72 + waddle, spriteSize, spriteSize);
    ctx.restore();

    // Ornate gold detective frame around sprite
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -36 + waddle, spriteSize / 2 - 2, 0, Math.PI * 2);
    ctx.stroke();

    // Floating small magnifying glass icon indicator
    ctx.fillStyle = '#fef08a';
    ctx.font = '12px Fredoka, sans-serif';
    ctx.fillText('🔍', 18, -48 + waddle);
  } else {
    // Fallback vector drawing
    ctx.fillStyle = '#262626';
    ctx.beginPath();
    ctx.ellipse(0, -22 + waddle, 18, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#854d0e';
    ctx.fillRect(-14, -28 + waddle, 28, 20);
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(14, -36 + waddle, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Draw NPCs using high-quality bitmap sprites
export function drawNPC(
  ctx: CanvasRenderingContext2D,
  npc: NPCState,
  cameraX: number,
  cameraY: number,
  time: GameTime
) {
  const nx = npc.x - cameraX;
  const ny = npc.y - cameraY;
  const isFacingLeft = npc.facing === 'left';
  const timeOfDay = getTimeOfDay(time.hour);

  ctx.save();
  ctx.translate(nx, ny);
  if (isFacingLeft) {
    ctx.scale(-1, 1);
  }

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 2, 24, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  const spriteSize = 76;

  if (npc.species === 'sowa') {
    const isSleeping = timeOfDay === 'day' || timeOfDay === 'dawn';
    const sowaImg = spriteManager.getImage('sowa');

    if (sowaImg) {
      ctx.save();
      // Glowing halo around wizard owl
      if (!isSleeping) {
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 24;
      }
      ctx.beginPath();
      ctx.arc(0, -38, spriteSize / 2 - 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(sowaImg, -spriteSize / 2, -76, spriteSize, spriteSize);
      ctx.restore();

      // Border frame
      ctx.strokeStyle = !isSleeping ? '#818cf8' : '#64748b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -38, spriteSize / 2 - 2, 0, Math.PI * 2);
      ctx.stroke();

      if (isSleeping) {
        // Sleep cap tag & Zzz
        ctx.fillStyle = '#a5b4fc';
        ctx.font = 'bold 13px Fredoka, sans-serif';
        const zOffset = (Date.now() % 2000) / 2000;
        ctx.fillText('Zzz...', 18, -60 - zOffset * 15);
      } else {
        // Star sparkle
        ctx.fillStyle = '#fde047';
        ctx.font = '14px sans-serif';
        ctx.fillText('✨', 18, -60);
      }
    } else {
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(0, -35, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (npc.species === 'lis') {
    const lisImg = spriteManager.getImage('lis');
    if (lisImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, -38, spriteSize / 2 - 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(lisImg, -spriteSize / 2, -76, spriteSize, spriteSize);
      ctx.restore();

      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -38, spriteSize / 2 - 2, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(0, -35, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (npc.species === 'borsuk') {
    const badgerImg = spriteManager.getImage('borsuk');
    if (badgerImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, -38, spriteSize / 2 - 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(badgerImg, -spriteSize / 2, -76, spriteSize, spriteSize);
      ctx.restore();

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -38, spriteSize / 2 - 2, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(0, -35, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (npc.species === 'jez') {
    const hedgehogImg = spriteManager.getImage('jez');
    if (hedgehogImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, -38, spriteSize / 2 - 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(hedgehogImg, -spriteSize / 2, -76, spriteSize, spriteSize);
      ctx.restore();

      ctx.strokeStyle = '#a8a29e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -38, spriteSize / 2 - 2, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#78716c';
      ctx.beginPath();
      ctx.arc(0, -35, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (npc.species === 'slimak') {
    // Snail Barman
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(-8, -20, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(8, -10, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(10, -14, 8, 8);
  }

  ctx.restore();

  // Name Tag above character
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 11px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(npc.name, nx, ny - 68);
}

export function drawClueIndicator(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cameraX: number,
  cameraY: number,
  isDiscovered: boolean,
  label: string
) {
  const sx = x - cameraX;
  const sy = y - cameraY;
  const pulse = Math.sin(Date.now() * 0.005) * 4;

  ctx.save();
  if (!isDiscovered) {
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(sx, sy - 15 + pulse, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('?', sx, sy - 12 + pulse);
  } else {
    ctx.fillStyle = 'rgba(74, 222, 128, 0.7)';
    ctx.beginPath();
    ctx.arc(sx, sy - 12, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

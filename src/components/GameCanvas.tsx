import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  WORLD_HEIGHT,
  WORLD_LADDERS,
  WORLD_PLATFORMS,
  WORLD_WIDTH,
  Platform,
  Ladder,
} from '../data/world';
import { Clue, CriminalCase, GameTime, InteractiveObject } from '../types/game';
import {
  NPCState,
  PlayerState,
  drawClueIndicator,
  drawLadders,
  drawMolePlayer,
  drawNPC,
  drawSkyAndSurface,
  drawUndergroundCrossSection,
} from '../utils/renderWorld';
import { sound } from '../utils/sound';

interface GameCanvasProps {
  currentCase: CriminalCase;
  gameTime: GameTime;
  discoveredClueIds: string[];
  onInteractNPC: (npcId: string) => void;
  onInteractClue: (clue: Clue) => void;
  onInteractBed: () => void;
  heldKeys: { [key: string]: boolean };
  onProximityChange?: (promptText: string | null) => void;
  actionTriggered: boolean;
  onActionConsumed: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  currentCase,
  gameTime,
  discoveredClueIds,
  onInteractNPC,
  onInteractClue,
  onInteractBed,
  heldKeys,
  onProximityChange,
  actionTriggered,
  onActionConsumed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player position state
  const playerRef = useRef<PlayerState>({
    x: 220,
    y: 420, // Start in Kret's bedroom
    vx: 0,
    vy: 0,
    facing: 'right',
    isClimbing: false,
    isWalking: false,
    walkFrame: 0,
  });

  // Target navigation for mouse / touch click
  const targetPosRef = useRef<{ x: number; y: number } | null>(null);

  // Camera coordinates
  const cameraRef = useRef<{ x: number; y: number }>({ x: 0, y: 150 });

  // NPCs in the world
  const npcsRef = useRef<NPCState[]>([
    {
      id: 'npc_sowa',
      name: 'Czarodziejka Sowa',
      species: 'sowa',
      x: 230,
      y: 110, // On branch platform at y: 110
      facing: 'right',
      dialoguePreview: 'Zawsze da 1 podpowiedź z 2-3 do wyboru (tylko w nocy)',
    },
    {
      id: 'npc_lis',
      name: 'Lis Felix',
      species: 'lis',
      x: 820,
      y: 190, // Meadow near surface exit
      facing: 'left',
      dialoguePreview: 'Rudy spryciarz z zarośli',
    },
    {
      id: 'npc_zenon',
      name: 'Ślimak Zenon (Gospodarz)',
      species: 'slimak',
      x: 520,
      y: 680, // Behind tavern counter
      facing: 'right',
      dialoguePreview: 'Napar z mniszka i plotki o świecie ludzi',
    },
    {
      id: 'npc_borsuk',
      name: 'Borsuk Barnaba',
      species: 'borsuk',
      x: 1140,
      y: 680, // Badger checkpoint
      facing: 'left',
      dialoguePreview: 'Strażnik podziemnego porządku',
    },
    {
      id: 'npc_jez',
      name: 'Jeż Igiełka',
      species: 'jez',
      x: 180,
      y: 680, // Hedgehog nook
      facing: 'right',
      dialoguePreview: 'Cichy ogrodnik z norki',
    },
  ]);

  // Positions of interactive objects (clues, bed, tavern table)
  const getInteractiveObjects = useCallback((): InteractiveObject[] => {
    const list: InteractiveObject[] = [
      {
        id: 'obj_bed',
        name: 'Łóżko z Mchu',
        x: 110,
        y: 420,
        width: 60,
        height: 40,
        type: 'bed',
        label: 'Idź spać [E]',
      },
    ];

    // Map clues from current case to physical world coordinates
    currentCase.clues.forEach((c, idx) => {
      let cx = 650;
      let cy = 420;

      if (c.id === 'clue_fur_lock' || c.id === 'clue_grey_whiskers') {
        cx = 720;
        cy = 420; // Upper pantry / office
      } else if (c.id === 'clue_tail_trace') {
        cx = 980;
        cy = 420; // Tunnel corridor
      } else if (c.id === 'clue_snail_talk' || c.id === 'clue_tavern_bag' || c.id === 'clue_tavern_crow_gossip') {
        cx = 580;
        cy = 680; // Tavern
      } else if (c.id === 'clue_human_gossip_1' || c.id === 'clue_human_gossip_2' || c.id === 'clue_human_gossip_3' || c.id === 'clue_human_gossip_4') {
        cx = 1380;
        cy = 190; // Human garden fence
      } else if (c.id === 'clue_owl_divination_1' || c.id === 'clue_owl_divination_2' || c.id === 'clue_owl_divination_3' || c.id === 'clue_owl_divination_4') {
        cx = 220;
        cy = 80; // Owl's hollow
      } else if (c.id === 'clue_rat_contract' || c.id === 'clue_candy_foil') {
        cx = 1180;
        cy = 420; // Office desk or branch
      } else if (c.id === 'clue_quill_in_wax' || c.id === 'clue_firefly_jars') {
        cx = 880;
        cy = 920; // Cellar
      } else {
        cx = 400 + idx * 160;
        cy = 680;
      }

      list.push({
        id: c.id,
        name: c.title,
        x: cx,
        y: cy,
        width: 32,
        height: 32,
        type: 'clue',
        label: `Zbadaj: ${c.title} [E]`,
        clueId: c.id,
      });
    });

    return list;
  }, [currentCase]);

  // Click / Tap on canvas to move
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickScreenX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const clickScreenY = (e.clientY - rect.top) * (canvas.height / rect.height);

    const worldClickX = clickScreenX + cameraRef.current.x;
    const worldClickY = clickScreenY + cameraRef.current.y;

    targetPosRef.current = { x: worldClickX, y: worldClickY };
  };

  // Main 60fps simulation loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let stepSoundTimer = 0;

    const updateAndRender = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const player = playerRef.current;
      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(updateAndRender);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animId = requestAnimationFrame(updateAndRender);
        return;
      }

      // Check ladder proximity
      const currentLadder = WORLD_LADDERS.find(
        (lad) =>
          Math.abs(player.x - lad.x) < 24 &&
          player.y >= lad.yTop - 15 &&
          player.y <= lad.yBottom + 15
      );

      // Input resolution
      let moveLeft = heldKeys['KeyA'] || heldKeys['ArrowLeft'];
      let moveRight = heldKeys['KeyD'] || heldKeys['ArrowRight'];
      let climbUp = heldKeys['KeyW'] || heldKeys['ArrowUp'];
      let climbDown = heldKeys['KeyS'] || heldKeys['ArrowDown'];

      // Mouse click navigation override
      if (targetPosRef.current) {
        const dx = targetPosRef.current.x - player.x;
        const dy = targetPosRef.current.y - player.y;

        if (Math.abs(dx) > 10) {
          if (dx > 0) moveRight = true;
          else moveLeft = true;
        }

        if (currentLadder && Math.abs(dy) > 15) {
          if (dy < 0) climbUp = true;
          else climbDown = true;
        }

        if (Math.abs(dx) <= 10 && (!currentLadder || Math.abs(dy) <= 15)) {
          targetPosRef.current = null;
        }
      }

      // Ladder climbing physics
      const wantsToClimbVertically = climbUp || climbDown;
      const wantsToMoveHorizontally = moveLeft || moveRight;

      // Player can only dismount from ladder if they are at the top or bottom platform!
      const isAtLadderTop = currentLadder ? Math.abs(player.y - currentLadder.yTop) <= 14 : false;
      const isAtLadderBottom = currentLadder ? Math.abs(player.y - currentLadder.yBottom) <= 14 : false;
      const isAtLadderPlatform = isAtLadderTop || isAtLadderBottom;

      let shouldClimb = false;
      if (currentLadder) {
        if (player.isClimbing) {
          // If already on the ladder:
          // CANNOT step off in the middle of the ladder shaft!
          // Can ONLY dismount horizontally when reaching the top or bottom platform!
          if (wantsToMoveHorizontally && isAtLadderPlatform && !wantsToClimbVertically) {
            shouldClimb = false; // Step off onto platform floor
          } else {
            shouldClimb = true; // Stay safely on ladder
          }
        } else {
          // Player is walking on floor near ladder:
          // Only grab the ladder if they explicitly press Climb Up or Climb Down
          if (wantsToClimbVertically) {
            shouldClimb = true;
          }
        }
      }

      if (shouldClimb && currentLadder) {
        player.isClimbing = true;
        player.vx = 0;
        // Lock player securely to ladder center while in shaft
        player.x += (currentLadder.x - player.x) * 0.35;

        if (climbUp) {
          player.y -= 150 * dt;
          player.isWalking = true;
          if (player.y <= currentLadder.yTop) {
            player.y = currentLadder.yTop;
          }
        } else if (climbDown) {
          player.y += 150 * dt;
          player.isWalking = true;
          if (player.y >= currentLadder.yBottom) {
            player.y = currentLadder.yBottom;
          }
        } else {
          player.isWalking = false;
        }
      } else {
        player.isClimbing = false;

        // Horizontal walking physics
        const moveSpeed = 160;
        if (moveLeft) {
          player.vx = -moveSpeed;
          player.facing = 'left';
          player.isWalking = true;
        } else if (moveRight) {
          player.vx = moveSpeed;
          player.facing = 'right';
          player.isWalking = true;
        } else {
          player.vx *= 0.7;
          if (Math.abs(player.vx) < 5) {
            player.vx = 0;
            player.isWalking = false;
          }
        }

        player.x += player.vx * dt;

        // Clamp to world horizontal bounds
        player.x = Math.max(60, Math.min(WORLD_WIDTH - 60, player.x));

        // Find closest platform below or near player
        const activePlatform = WORLD_PLATFORMS.reduce<Platform | null>((closest, plat) => {
          if (player.x >= plat.x1 - 25 && player.x <= plat.x2 + 25) {
            if (!closest || Math.abs(plat.y - player.y) < Math.abs(closest.y - player.y)) {
              return plat;
            }
          }
          return closest;
        }, null);

        if (activePlatform && Math.abs(activePlatform.y - player.y) < 35) {
          player.y += (activePlatform.y - player.y) * 0.35;
        }
      }

      // Step sound cadence
      if (player.isWalking) {
        player.walkFrame += dt * 15;
        stepSoundTimer += dt;
        if (stepSoundTimer > 0.28) {
          sound.playStep();
          stepSoundTimer = 0;
        }
      } else {
        stepSoundTimer = 0;
      }

      // Proximity detection for interaction
      let nearestPrompt: string | null = null;
      let nearestAction: (() => void) | null = null;

      // 1. Check NPCs
      for (const npc of npcsRef.current) {
        if (npc.id === 'npc_sowa') {
          // Kret can talk to Sowa while standing on the branch OR on the meadow ground directly under the tree!
          const isUnderOrOnTree = Math.abs(player.x - 220) < 100 && player.y <= 195;
          if (isUnderOrOnTree) {
            nearestPrompt = `Porozmawiaj z: ${npc.name} [E]`;
            nearestAction = () => onInteractNPC(npc.id);
            break;
          }
        } else {
          const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
          if (dist < 60) {
            nearestPrompt = `Porozmawiaj z: ${npc.name} [E]`;
            nearestAction = () => onInteractNPC(npc.id);
            break;
          }
        }
      }

      // 2. Check Interactive Objects & Clues if no NPC
      if (!nearestAction) {
        const objects = getInteractiveObjects();
        for (const obj of objects) {
          const dist = Math.hypot(player.x - obj.x, player.y - obj.y);
          if (dist < 50) {
            nearestPrompt = obj.label;
            if (obj.type === 'bed') {
              nearestAction = onInteractBed;
            } else if (obj.type === 'clue' && obj.clueId) {
              const clueObj = currentCase.clues.find((c) => c.id === obj.clueId);
              if (clueObj) {
                nearestAction = () => onInteractClue(clueObj);
              }
            }
            break;
          }
        }
      }

      if (onProximityChange) {
        onProximityChange(nearestPrompt);
      }

      // Trigger interaction when Space or E is pressed or touch action clicked
      if (actionTriggered) {
        onActionConsumed();
        if (nearestAction) {
          nearestAction();
        }
      }

      // Camera lerp towards player
      const targetCamX = player.x - canvas.width / 2;
      const targetCamY = player.y - canvas.height / 2;
      cameraRef.current.x += (targetCamX - cameraRef.current.x) * 0.08;
      cameraRef.current.y += (targetCamY - cameraRef.current.y) * 0.08;

      // Clamp camera to world
      cameraRef.current.x = Math.max(0, Math.min(WORLD_WIDTH - canvas.width, cameraRef.current.x));
      cameraRef.current.y = Math.max(0, Math.min(WORLD_HEIGHT - canvas.height, cameraRef.current.y));

      // ---------------- RENDER ----------------
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const camX = cameraRef.current.x;
      const camY = cameraRef.current.y;

      // Draw Sky, Sun/Moon, and Surface hills
      drawSkyAndSurface(ctx, gameTime, camX, camY, canvas.width, canvas.height);

      // Draw Underground Cross-section (chambers, soil strata, furniture, lanterns)
      drawUndergroundCrossSection(ctx, camX, camY, gameTime);

      // Draw Ladders & Roots
      drawLadders(ctx, WORLD_LADDERS, camX, camY);

      // Draw Clue Beacons & Indicators
      const objects = getInteractiveObjects();
      objects.forEach((obj) => {
        if (obj.type === 'clue') {
          const isDiscovered = discoveredClueIds.includes(obj.id);
          drawClueIndicator(ctx, obj.x, obj.y, camX, camY, isDiscovered, obj.name);
        }
      });

      // Draw NPCs
      npcsRef.current.forEach((npc) => {
        drawNPC(ctx, npc, camX, camY, gameTime);
      });

      // Draw Mole Detective Player
      drawMolePlayer(ctx, player, camX, camY);

      // Floating interaction prompt above player head
      if (nearestPrompt) {
        ctx.save();
        const px = player.x - camX;
        const py = player.y - 75 - camY;

        ctx.font = 'bold 12px Fredoka, sans-serif';
        const textWidth = ctx.measureText(nearestPrompt).width;

        ctx.fillStyle = 'rgba(28, 17, 9, 0.9)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(px - textWidth / 2 - 10, py - 14, textWidth + 20, 24, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fef08a';
        ctx.textAlign = 'center';
        ctx.fillText(nearestPrompt, px, py + 2);
        ctx.restore();
      }

      animId = requestAnimationFrame(updateAndRender);
    };

    animId = requestAnimationFrame(updateAndRender);
    return () => cancelAnimationFrame(animId);
  }, [
    heldKeys,
    gameTime,
    currentCase,
    discoveredClueIds,
    onInteractNPC,
    onInteractClue,
    onInteractBed,
    actionTriggered,
    onActionConsumed,
    onProximityChange,
    getInteractiveObjects,
  ]);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        canvasRef.current.width = canvasRef.current.parentElement.clientWidth;
        canvasRef.current.height = canvasRef.current.parentElement.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#1c0f06]">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="block w-full h-full cursor-pointer"
      />
    </div>
  );
};

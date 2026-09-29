/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { ElevatorGame, GameStatus } from './game/core/ElevatorGame';
import { ElevatorHUD } from './components/ElevatorHUD';
import { soundManager } from './game/audio/soundManager';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<ElevatorGame | null>(null);
  const [status, setStatus] = useState<GameStatus | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize 3D Elevator Game
    const game = new ElevatorGame(containerRef.current);
    gameRef.current = game;

    game.onStatusUpdate = (newStatus) => {
      setStatus({ ...newStatus });
      setIsLocked(game.player.isLocked);
    };

    return () => {
      game.destroy();
      gameRef.current = null;
    };
  }, []);

  const handleExpress = () => {
    gameRef.current?.triggerExpress();
  };

  const handleForceNext = () => {
    gameRef.current?.forceNextFloor();
  };

  const handleOpenDoor = () => {
    gameRef.current?.manualOpenDoor();
  };

  const handleCloseDoor = () => {
    gameRef.current?.manualCloseDoor();
  };

  const handleRingBell = () => {
    soundManager.playAlarmBell();
  };

  const handleSelectCategory = (cat: string) => {
    gameRef.current?.selectCategory(cat);
  };

  const handleLockPointer = () => {
    gameRef.current?.player.requestPointerLock();
  };

  const handleMoveInput = (x: number, y: number) => {
    gameRef.current?.player.setMoveInput(x, y);
  };

  const handleLookInput = (yaw: number, pitch: number) => {
    gameRef.current?.player.addLookInput(yaw, pitch);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-['Plus_Jakarta_Sans'] select-none">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* 2D Semantic DOM HUD Overlay */}
      <ElevatorHUD
        status={status}
        onExpress={handleExpress}
        onForceNext={handleForceNext}
        onOpenDoor={handleOpenDoor}
        onCloseDoor={handleCloseDoor}
        onRingBell={handleRingBell}
        onLockPointer={handleLockPointer}
        onMoveInput={handleMoveInput}
        onLookInput={handleLookInput}
        onSelectCategory={handleSelectCategory}
        isLocked={isLocked}
      />
    </div>
  );
}

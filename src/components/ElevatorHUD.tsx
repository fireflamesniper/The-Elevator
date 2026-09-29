import React, { useState, useEffect, useRef } from 'react';
import { GameStatus } from '../game/core/ElevatorGame';
import { soundManager } from '../game/audio/soundManager';
import {
  Volume2,
  VolumeX,
  FastForward,
  BookOpen,
  DoorOpen,
  DoorClosed,
  Bell,
  Compass,
  X,
  Maximize2,
  Smartphone,
  Music,
  Info,
  ChevronDown,
  Layers
} from 'lucide-react';

interface ElevatorHUDProps {
  status: GameStatus | null;
  onExpress: () => void;
  onForceNext: () => void;
  onOpenDoor: () => void;
  onCloseDoor: () => void;
  onRingBell: () => void;
  onLockPointer: () => void;
  onMoveInput?: (x: number, y: number) => void;
  onLookInput?: (yaw: number, pitch: number) => void;
  onSelectCategory?: (category: string) => void;
  isLocked: boolean;
}

const CATEGORY_OPTIONS = [
  { id: 'random', label: 'Random (Each Floor)', icon: '🎲', desc: 'Randomized surprise category on each floor' },
  { id: 'comedic', label: 'Comedy', icon: '🎭', desc: 'Dancing Cactus, Snail Knight, Dino Disco' },
  { id: 'horror', label: 'Horror / Liminal', icon: '👁️', desc: 'Non-Euclidean Backrooms Floor -13' },
  { id: 'surreal', label: 'Surreal', icon: '🌌', desc: 'Moon Casino Poker, Abyssal Whale' },
  { id: 'absurd', label: 'Absurd', icon: '🦆', desc: 'Rubber Duck Temple, Zero-G Pizza' },
  { id: 'sci-fi', label: 'Sci-Fi', icon: '🚀', desc: 'Cyberpunk 2099, Neon Synthwave Grid' },
];

export const ElevatorHUD: React.FC<ElevatorHUDProps> = ({
  status,
  onExpress,
  onForceNext,
  onOpenDoor,
  onCloseDoor,
  onRingBell,
  onLockPointer,
  onMoveInput,
  onLookInput,
  onSelectCategory,
  isLocked,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [showLogbook, setShowLogbook] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showTouchControls, setShowTouchControls] = useState(false);
  const [closedFloorId, setClosedFloorId] = useState<string | null>(null);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  // Auto-detect touch device on mount
  useEffect(() => {
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth < 800;
    setShowTouchControls(isTouch);
  }, []);

  // Left Joystick State
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [joystickKnobPos, setJoystickKnobPos] = useState({ x: 0, y: 0 });
  const isJoystickActive = useRef(false);
  const joystickTouchId = useRef<number | null>(null);

  // Right Look Pad State
  const lookPadRef = useRef<HTMLDivElement>(null);
  const prevLookPos = useRef<{ x: number; y: number } | null>(null);
  const lookTouchId = useRef<number | null>(null);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMute(next);
  };

  const handleInitialClick = () => {
    setHasInteracted(true);
    soundManager.init();
    soundManager.resume();
    if (!showTouchControls) {
      onLockPointer();
    }
  };

  const progressPercent = status
    ? Math.max(0, Math.min(100, (1 - status.timeRemaining / Math.max(1, status.totalTime)) * 100))
    : 0;

  const getStatusLabel = () => {
    if (!status) return 'INITIALIZING...';
    switch (status.state) {
      case 'TRANSIT':
        return `IN TRANSIT ${status.direction === 'UP' ? '▲' : '▼'}`;
      case 'DOOR_OPENING':
        return 'DOORS OPENING...';
      case 'DOOR_OPEN':
        return 'DOORS OPEN - OBSERVE';
      case 'DOOR_CLOSING':
        return 'DOORS CLOSING...';
    }
  };

  const currentCategoryObj =
    CATEGORY_OPTIONS.find((c) => c.id === status?.selectedCategory) || CATEGORY_OPTIONS[0];

  // --- Analog Thumbstick Handlers ---
  const handleJoystickStart = (clientX: number, clientY: number, touchId: number | null) => {
    if (!joystickBaseRef.current) return;
    isJoystickActive.current = true;
    joystickTouchId.current = touchId;
    updateJoystick(clientX, clientY);
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current || !isJoystickActive.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const maxRadius = rect.width / 2 - 12;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const clampedDist = Math.min(distance, maxRadius);
    const angle = Math.atan2(deltaY, deltaX);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setJoystickKnobPos({ x: knobX, y: knobY });

    const normX = knobX / maxRadius;
    const normY = -(knobY / maxRadius);
    onMoveInput?.(normX, normY);
  };

  const handleJoystickEnd = () => {
    isJoystickActive.current = false;
    joystickTouchId.current = null;
    setJoystickKnobPos({ x: 0, y: 0 });
    onMoveInput?.(0, 0);
  };

  const onJoystickTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.changedTouches[0];
    handleJoystickStart(touch.clientX, touch.clientY, touch.identifier);
  };

  const onJoystickTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === joystickTouchId.current) {
        updateJoystick(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const onJoystickTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === joystickTouchId.current) {
        handleJoystickEnd();
        break;
      }
    }
  };

  // --- Right Look Trackpad Handlers ---
  const onLookTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.changedTouches[0];
    lookTouchId.current = touch.identifier;
    prevLookPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const onLookTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!prevLookPos.current) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === lookTouchId.current) {
        const deltaX = touch.clientX - prevLookPos.current.x;
        const deltaY = touch.clientY - prevLookPos.current.y;
        prevLookPos.current = { x: touch.clientX, y: touch.clientY };

        onLookInput?.(deltaX * 0.0055, deltaY * 0.0055);
        break;
      }
    }
  };

  const onLookTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === lookTouchId.current) {
        prevLookPos.current = null;
        lookTouchId.current = null;
        break;
      }
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex flex-col justify-between">
      {/* Initial Start / Click-to-Play Overlay */}
      {!hasInteracted && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center pointer-events-auto p-4 sm:p-6">
          <div className="max-w-md w-full text-center space-y-5">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Space_Grotesk']">
                The Infinite Elevator
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400">
                You are riding a brightly lit endless elevator stopping at absurd, unpredictable, and surreal dimensions.
              </p>
            </div>

            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 text-left space-y-2.5 text-xs text-neutral-300">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-semibold text-neutral-200">Look Around</span>
                <span className="font-mono text-neutral-400">Mouse Drag / Right Touchpad</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-semibold text-neutral-200">Walk Inside Cabin</span>
                <span className="font-mono text-neutral-400">WASD / Left Virtual Thumbstick</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-semibold text-neutral-200">Floor Categories</span>
                <span className="font-mono text-amber-400">Choose via Elevator Wall Buttons or HUD</span>
              </div>
              <div className="text-neutral-400 pt-1 leading-relaxed">
                Aim at elevator wall buttons to see what they do. Select specific dimensions (Comedy, Horror, Surreal, Absurd, Sci-Fi) or Random!
              </div>
            </div>

            <button
              onClick={handleInitialClick}
              className="w-full py-3.5 px-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-sm transition-colors shadow-lg shadow-amber-500/20 active:scale-98 min-h-[44px] cursor-pointer"
            >
              Step Into The Elevator
            </button>
          </div>
        </div>
      )}

      {/* Top Bar Navigation (Frontend Design Guidelines: 3 Zones) */}
      <header className="pointer-events-auto w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent border-b border-white/5 backdrop-blur-[2px]">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-sm sm:text-base font-bold tracking-tight text-white font-['Space_Grotesk'] whitespace-nowrap">
            The Infinite Elevator
          </span>
          <span className="text-xs text-amber-400 font-mono">
            Fl {status ? status.simulatedFloorDisplay : '1'}
          </span>
        </div>

        {/* Zone 2: Informational items (clean unboxed text per zero-pill rules) */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-neutral-300">
          <span className="font-mono text-amber-300 font-medium">
            {getStatusLabel()}
          </span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span className="truncate max-w-[200px]">
            {status?.state === 'TRANSIT'
              ? `Next: ${status.nextFloor?.name.split(':')[0] || 'Unknown'}`
              : status?.currentFloor?.name || 'In Motion'}
          </span>
          {status?.state === 'TRANSIT' && status.muzakTrackName && (
            <>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="flex items-center gap-1.5 text-amber-300/90 font-mono text-[11px] truncate max-w-[220px]">
                <Music className="w-3 h-3 text-amber-400 animate-pulse shrink-0" />
                <span className="truncate">{status.muzakTrackName}</span>
              </span>
            </>
          )}
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span className="font-mono tabular-nums text-neutral-400">
            {Math.ceil(status?.timeRemaining || 0)}s left
          </span>
        </div>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Target Category Selector Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              title="Target Category for Next Floor"
              className="min-h-[40px] px-2.5 sm:px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/70 border border-amber-500/40 rounded-md hover:bg-amber-900/70 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>{currentCategoryObj.icon}</span>
              <span className="hidden sm:inline font-mono capitalize">
                {status?.selectedCategory === 'random' ? 'Random' : currentCategoryObj.label}
              </span>
              <ChevronDown className="w-3 h-3 text-amber-400" />
            </button>

            {/* Dropdown Menu */}
            {showCategoryMenu && (
              <div className="absolute top-full right-0 mt-1.5 w-60 bg-neutral-950/95 border border-amber-500/40 rounded-xl p-1.5 shadow-2xl backdrop-blur-md z-50 flex flex-col gap-0.5 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-800 flex items-center justify-between">
                  <span>Target Dimension</span>
                  <span className="text-amber-400/80">6 Sectors</span>
                </div>
                {CATEGORY_OPTIONS.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory?.(cat.id);
                      setShowCategoryMenu(false);
                    }}
                    className={`px-3 py-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      status?.selectedCategory === cat.id
                        ? 'bg-amber-500/20 text-amber-300 font-semibold'
                        : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1.5">
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </span>
                      <span className="text-[10px] text-neutral-500 font-normal pl-5">
                        {cat.desc}
                      </span>
                    </div>
                    {status?.selectedCategory === cat.id && (
                      <span className="text-xs font-mono text-emerald-400 font-bold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Toggle Touch Controls Button */}
          <button
            onClick={() => setShowTouchControls(!showTouchControls)}
            title={showTouchControls ? 'Hide Touch Controls' : 'Show Touch Controls'}
            className={`min-h-[40px] px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md border transition-colors flex items-center gap-1.5 cursor-pointer ${
              showTouchControls
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10'
                : 'bg-neutral-900/80 text-neutral-300 hover:text-white border-white/10 hover:bg-neutral-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Touch</span>
          </button>

          {status?.state === 'TRANSIT' && (
            <button
              onClick={onExpress}
              title="Fast forward transit"
              className="min-h-[40px] px-2.5 sm:px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/70 border border-amber-500/30 rounded-md hover:bg-amber-900/70 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Express</span>
            </button>
          )}

          <button
            onClick={() => setShowLogbook(true)}
            title="View Discovered Floor Log"
            className="min-h-[40px] min-w-[40px] p-2 text-neutral-300 hover:text-white bg-neutral-900/80 border border-white/10 rounded-md hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="min-h-[40px] min-w-[40px] p-2 text-neutral-300 hover:text-white bg-neutral-900/80 border border-white/10 rounded-md hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {!isLocked && !showTouchControls && (
            <button
              onClick={onLockPointer}
              title="Lock Mouse Pointer to Look Around"
              className="min-h-[40px] min-w-[40px] p-2 text-neutral-300 hover:text-white bg-neutral-900/80 border border-white/10 rounded-md hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer hidden md:flex"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Center Crosshair (subtle indicator) */}
      {!showTouchControls && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-4 h-4 flex items-center justify-center opacity-60">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
            <div className="absolute w-4 h-[1px] bg-white/40"></div>
            <div className="absolute h-4 w-[1px] bg-white/40"></div>
          </div>
        </div>
      )}

      {/* --- Interactive 3D Button Inspection Bubble (When looking at an elevator button) --- */}
      {status?.hoveredButton && (
        <div className="absolute top-1/2 left-1/2 -translate-y-32 translate-x-6 pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95 z-40">
          <div className="bg-neutral-950/95 border-2 border-amber-500/70 backdrop-blur-md rounded-xl p-3 shadow-2xl max-w-[250px] text-left">
            <div className="flex items-center justify-between gap-1.5 border-b border-neutral-800 pb-1.5 mb-1.5">
              <span className="font-bold text-xs text-amber-300 font-['Space_Grotesk'] flex items-center gap-1.5">
                {status.hoveredButton.label}
              </span>
              {status.hoveredButton.isSelected ? (
                <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                  ACTIVE
                </span>
              ) : (
                <span className="text-[9px] font-mono text-neutral-400">
                  {status.hoveredButton.category ? 'Click to Set' : 'Click to Use'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-200 leading-snug">
              {status.hoveredButton.description}
            </p>
            <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-2 pt-1 border-t border-neutral-800/80 font-mono">
              <span className="text-amber-400/90">{status.hoveredButton.tooltipDetail}</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Floor Presentation Card (When Doors are Open) */}
      {status?.state === 'DOOR_OPEN' && status.currentFloor && (
        closedFloorId !== status.currentFloor.id ? (
          <div className="pointer-events-auto mx-auto max-w-md w-full px-4 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-neutral-950/90 backdrop-blur-md border border-amber-500/30 rounded-xl p-3.5 sm:p-4 shadow-2xl relative">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                <span className="text-amber-400 font-semibold tracking-wide uppercase">
                  {status.currentFloor.category} Floor
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono tabular-nums text-neutral-400">
                    Doors close in {Math.ceil(status.timeRemaining)}s
                  </span>
                  <button
                    onClick={() => setClosedFloorId(status.currentFloor.id)}
                    title="Close description"
                    aria-label="Close floor description"
                    className="p-1 -mr-1 text-neutral-400 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk'] leading-snug">
                {status.currentFloor.name}
              </h2>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed line-clamp-3 sm:line-clamp-none">
                {status.currentFloor.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="pointer-events-auto mx-auto px-4 transition-all duration-300">
            <button
              onClick={() => setClosedFloorId(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-950/80 hover:bg-neutral-900 border border-amber-500/30 text-xs text-amber-300 backdrop-blur-md shadow-lg transition-colors cursor-pointer"
              title="Show floor description"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>{status.currentFloor.name.split(':')[0]}</span>
            </button>
          </div>
        )
      )}

      {/* Bottom Area: Controls, Touch Controls & Progress Bar */}
      <footer className="pointer-events-auto w-full px-4 sm:px-6 pb-4 sm:pb-5 pt-2 flex flex-col gap-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        {/* Mobile Muzak Playing Indicator */}
        {status?.state === 'TRANSIT' && status.muzakTrackName && (
          <div className="lg:hidden pointer-events-none mx-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-amber-500/20 text-[11px] font-mono text-amber-300/90 shadow-md">
            <Music className="w-3 h-3 text-amber-400 animate-pulse shrink-0" />
            <span className="truncate max-w-[220px]">{status.muzakTrackName}</span>
          </div>
        )}

        {/* Progress Bar (Time until next state) */}
        <div className="w-full bg-neutral-800/80 rounded-full h-1 overflow-hidden">
          <div
            className={`h-full transition-all duration-200 ${
              status?.state === 'DOOR_OPEN' ? 'bg-amber-400' : 'bg-blue-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* --- Toggleable Touch Controls Overlay --- */}
        {showTouchControls && (
          <div className="w-full flex items-end justify-between py-1 select-none">
            {/* Left Analog Virtual Thumbstick (Walk / Strafe) */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                Move Inside
              </span>
              <div
                ref={joystickBaseRef}
                onTouchStart={onJoystickTouchStart}
                onTouchMove={onJoystickTouchMove}
                onTouchEnd={onJoystickTouchEnd}
                className="relative w-28 h-28 rounded-full bg-neutral-900/85 border-2 border-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg touch-none"
              >
                {/* 4 Direction Guides */}
                <div className="absolute top-1 text-[10px] text-neutral-500 font-bold">▲</div>
                <div className="absolute bottom-1 text-[10px] text-neutral-500 font-bold">▼</div>
                <div className="absolute left-1 text-[10px] text-neutral-500 font-bold">◀</div>
                <div className="absolute right-1 text-[10px] text-neutral-500 font-bold">▶</div>

                {/* Movable Thumb Knob */}
                <div
                  className="w-12 h-12 rounded-full bg-amber-500 border border-amber-300 shadow-md shadow-amber-500/30 flex items-center justify-center transition-transform duration-75"
                  style={{
                    transform: `translate(${joystickKnobPos.x}px, ${joystickKnobPos.y}px)`,
                  }}
                >
                  <div className="w-3 h-3 rounded-full bg-neutral-950/40" />
                </div>
              </div>
            </div>

            {/* Center Quick Mobile Actions */}
            <div className="flex flex-col items-center gap-2 pb-1">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={onRingBell}
                  className="min-h-[44px] min-w-[44px] px-3 py-2 bg-neutral-900/90 border border-neutral-700 rounded-lg text-white font-medium text-xs flex items-center justify-center gap-1 active:bg-neutral-800"
                >
                  <Bell className="w-3.5 h-3.5 text-red-400" />
                  <span>Bell</span>
                </button>
                <button
                  onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                  className="min-h-[44px] min-w-[44px] px-3 py-2 bg-neutral-900/90 border border-amber-500/40 rounded-lg text-amber-300 font-medium text-xs flex items-center justify-center gap-1 active:bg-neutral-800"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Sector</span>
                </button>
                <button
                  onClick={onOpenDoor}
                  disabled={status?.state === 'DOOR_OPEN'}
                  className="min-h-[44px] min-w-[44px] px-3 py-2 bg-neutral-900/90 border border-neutral-700 rounded-lg text-white font-medium text-xs flex items-center justify-center gap-1 disabled:opacity-40 active:bg-neutral-800"
                >
                  <DoorOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open</span>
                </button>
                <button
                  onClick={onCloseDoor}
                  disabled={status?.state !== 'DOOR_OPEN'}
                  className="min-h-[44px] min-w-[44px] px-3 py-2 bg-neutral-900/90 border border-neutral-700 rounded-lg text-white font-medium text-xs flex items-center justify-center gap-1 disabled:opacity-40 active:bg-neutral-800"
                >
                  <DoorClosed className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Close</span>
                </button>
              </div>
            </div>

            {/* Right Look Trackpad (Look around 360°) */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                Drag to Look
              </span>
              <div
                ref={lookPadRef}
                onTouchStart={onLookTouchStart}
                onTouchMove={onLookTouchMove}
                onTouchEnd={onLookTouchEnd}
                className="relative w-28 h-28 rounded-full bg-neutral-900/85 border-2 border-white/20 backdrop-blur-sm flex flex-col items-center justify-center shadow-lg active:border-amber-400/60 touch-none"
              >
                <Compass className="w-7 h-7 text-neutral-400 opacity-60" />
                <span className="text-[9px] text-neutral-500 font-mono mt-1">Swipe 360°</span>
              </div>
            </div>
          </div>
        )}

        {/* Desktop / Default Control Bar */}
        {!showTouchControls && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3 text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {isLocked ? 'Move: [W A S D] · Aim at panel buttons for details' : 'Click screen or [Touch] button for controls'}
                </span>
              </div>
              <span aria-hidden="true" className="text-neutral-700 hidden sm:inline">·</span>
              <span className="hidden sm:inline text-neutral-400">
                Target Sector: <strong className="text-amber-300 font-mono capitalize">{status?.selectedCategory || 'Random'}</strong>
              </span>
            </div>

            {/* Quick Lift Buttons for Desktop */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onRingBell}
                title="Ring Elevator Bell"
                className="min-h-[36px] px-2.5 py-1 text-xs text-neutral-300 hover:text-white bg-neutral-900/90 border border-neutral-700 rounded hover:bg-neutral-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Bell className="w-3 h-3 text-red-400" />
                <span className="hidden sm:inline">Bell</span>
              </button>

              <button
                onClick={onOpenDoor}
                disabled={status?.state === 'DOOR_OPEN'}
                title="Hold Doors Open"
                className="min-h-[36px] px-2.5 py-1 text-xs text-neutral-300 hover:text-white bg-neutral-900/90 border border-neutral-700 rounded hover:bg-neutral-800 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <DoorOpen className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Open</span>
              </button>

              <button
                onClick={onCloseDoor}
                disabled={status?.state !== 'DOOR_OPEN'}
                title="Close Doors Now"
                className="min-h-[36px] px-2.5 py-1 text-xs text-neutral-300 hover:text-white bg-neutral-900/90 border border-neutral-700 rounded hover:bg-neutral-800 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <DoorClosed className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">Close</span>
              </button>

              <button
                onClick={onForceNext}
                title="Skip to next floor immediately"
                className="min-h-[36px] px-2.5 py-1 text-xs text-amber-300 bg-amber-950/80 border border-amber-600/40 rounded hover:bg-amber-900/80 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <FastForward className="w-3 h-3" />
                <span>Next Floor</span>
              </button>
            </div>
          </div>
        )}
      </footer>

      {/* Discovered Floors Logbook Modal */}
      {showLogbook && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk']">
                  Elevator Floor Log
                </h3>
                <p className="text-xs text-neutral-400">
                  {status?.visitedFloors.length || 0} of 22 known anomalies recorded
                </p>
              </div>
              <button
                onClick={() => setShowLogbook(false)}
                className="min-h-[44px] min-w-[44px] p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
              {status?.visitedFloors.length === 0 ? (
                <div className="text-center py-8 text-neutral-400 text-sm">
                  No floors visited yet. The elevator is on its way to your first destination!
                </div>
              ) : (
                status?.visitedFloors.map((floor) => (
                  <div
                    key={floor.id}
                    className="p-3 bg-neutral-950/60 border border-neutral-800/80 rounded-lg space-y-1 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-400 font-['Space_Grotesk']">
                        {floor.name}
                      </span>
                      <span className="text-neutral-500 font-mono text-[11px]">
                        Floor #{floor.floorNumber}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {floor.description}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-1">
                      <span className="capitalize">{floor.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Audio: {floor.audioTheme.replace('_', ' ')}</span>
                      <span aria-hidden="true">·</span>
                      <span>Dwell: {floor.duration}s</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="px-5 sm:px-6 py-3 border-t border-neutral-800 bg-neutral-950/40 flex justify-end">
              <button
                onClick={() => setShowLogbook(false)}
                className="min-h-[44px] px-4 py-2 text-xs font-medium text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
              >
                Return to Elevator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

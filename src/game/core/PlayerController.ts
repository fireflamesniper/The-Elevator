import * as THREE from 'three';
import { soundManager } from '../audio/soundManager';

export class PlayerController {
  public camera: THREE.PerspectiveCamera;
  public domElement: HTMLElement;
  public isLocked: boolean = false;

  // Position & Velocity
  public position: THREE.Vector3 = new THREE.Vector3(0, 0, 0.4);
  private velocity: THREE.Vector3 = new THREE.Vector3();
  private euler: THREE.Euler = new THREE.Euler(0, 0, 0, 'YXZ');

  // Input states
  private keys: { [key: string]: boolean } = {};
  public moveJoystick = { x: 0, y: 0 }; // For mobile virtual stick
  public lookJoystick = { x: 0, y: 0 };

  public setMoveInput(x: number, y: number) {
    this.moveJoystick.x = x;
    this.moveJoystick.y = y;
  }

  public addLookInput(deltaYaw: number, deltaPitch: number) {
    this.euler.y -= deltaYaw;
    this.euler.x -= deltaPitch;
    this.euler.x = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, this.euler.x));
    this.camera.quaternion.setFromEuler(this.euler);
  }

  // Head bobbing & footsteps
  private bobTimer: number = 0;
  private lastStepTime: number = 0;
  private eyeHeight: number = 0.35; // Camera height above floor

  // Cabin collision boundaries
  // Elevator interior is [-1.4, 1.4] along X, [-1.45, 1.35] along Z
  private minX = -1.35;
  private maxX = 1.35;
  private minZ = -1.45; // Front doorway boundary (player stays inside cabin)
  private maxZ = 1.35;  // Back wall boundary

  // Pointer drag fallback
  private isMouseDown: boolean = false;
  private prevMouseX: number = 0;
  private prevMouseY: number = 0;

  // Interaction callback
  public onInteractClick?: (raycaster: THREE.Raycaster) => void;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.setupEventListeners();
  }

  private setupEventListeners() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);

    this.domElement.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);

    document.addEventListener('pointerlockchange', this.onPointerLockChange);

    // Touch controls fallback
    this.domElement.addEventListener('touchstart', this.onTouchStart, { passive: false });
    this.domElement.addEventListener('touchmove', this.onTouchMove, { passive: false });
    this.domElement.addEventListener('touchend', this.onTouchEnd);
  }

  public destroy() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    this.domElement.removeEventListener('touchstart', this.onTouchStart);
    this.domElement.removeEventListener('touchmove', this.onTouchMove);
    this.domElement.removeEventListener('touchend', this.onTouchEnd);
  }

  public requestPointerLock() {
    try {
      this.domElement.requestPointerLock();
      soundManager.init();
      soundManager.resume();
    } catch {
      // Ignore
    }
  }

  public exitPointerLock() {
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }
  }

  private onPointerLockChange = () => {
    this.isLocked = document.pointerLockElement === this.domElement;
  };

  private onKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true;
    soundManager.init();
    soundManager.resume();
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };

  private onMouseDown = (e: MouseEvent) => {
    soundManager.init();
    soundManager.resume();
    this.isMouseDown = true;
    this.prevMouseX = e.clientX;
    this.prevMouseY = e.clientY;

    // Raycast interaction
    if (this.onInteractClick) {
      const raycaster = new THREE.Raycaster();
      // Center crosshair raycast if locked, otherwise mouse coords
      if (this.isLocked) {
        raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
      } else {
        const rect = this.domElement.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
      }
      this.onInteractClick(raycaster);
    }
  };

  private onMouseUp = () => {
    this.isMouseDown = false;
  };

  private onMouseMove = (e: MouseEvent) => {
    if (this.isLocked) {
      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;

      this.euler.y -= movementX * 0.0022;
      this.euler.x -= movementY * 0.0022;
      this.euler.x = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, this.euler.x));
      this.camera.quaternion.setFromEuler(this.euler);
    } else if (this.isMouseDown) {
      const deltaX = e.clientX - this.prevMouseX;
      const deltaY = e.clientY - this.prevMouseY;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;

      this.euler.y -= deltaX * 0.0035;
      this.euler.x -= deltaY * 0.0035;
      this.euler.x = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, this.euler.x));
      this.camera.quaternion.setFromEuler(this.euler);
    }
  };

  private touchStartX = 0;
  private touchStartY = 0;
  private onTouchStart = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      soundManager.init();
      soundManager.resume();
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }
  };

  private onTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - this.touchStartX;
      const deltaY = touch.clientY - this.touchStartY;
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;

      this.euler.y -= deltaX * 0.005;
      this.euler.x -= deltaY * 0.005;
      this.euler.x = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, this.euler.x));
      this.camera.quaternion.setFromEuler(this.euler);
    }
  };

  private onTouchEnd = () => {};

  public update(delta: number) {
    // Determine movement direction vector relative to camera heading
    const moveDir = new THREE.Vector3();

    if (this.keys['KeyW'] || this.keys['ArrowUp']) moveDir.z -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) moveDir.z += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveDir.x -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) moveDir.x += 1;

    // Mobile joystick input
    if (this.moveJoystick.x !== 0 || this.moveJoystick.y !== 0) {
      moveDir.x += this.moveJoystick.x;
      moveDir.z -= this.moveJoystick.y;
    }

    if (this.lookJoystick.x !== 0 || this.lookJoystick.y !== 0) {
      this.euler.y -= this.lookJoystick.x * delta * 2.5;
      this.euler.x -= this.lookJoystick.y * delta * 2.0;
      this.euler.x = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, this.euler.x));
      this.camera.quaternion.setFromEuler(this.euler);
    }

    const isMoving = moveDir.lengthSq() > 0.01;
    if (isMoving) {
      moveDir.normalize();

      // Transform direction into world space based on yaw only (not pitch)
      const yawAngle = this.euler.y;
      const rotatedX = moveDir.x * Math.cos(yawAngle) + moveDir.z * Math.sin(yawAngle);
      const rotatedZ = -moveDir.x * Math.sin(yawAngle) + moveDir.z * Math.cos(yawAngle);

      const speed = 2.4; // Walking speed inside elevator
      this.velocity.x = rotatedX * speed;
      this.velocity.z = rotatedZ * speed;

      // Head bobbing
      this.bobTimer += delta * 9;
      const now = performance.now();
      if (now - this.lastStepTime > 400) {
        this.lastStepTime = now;
        soundManager.playFootstep();
      }
    } else {
      // Damping deceleration
      this.velocity.x *= 0.7;
      this.velocity.z *= 0.7;
      this.bobTimer += delta * 1.5; // gentle idle breathing
    }

    // Apply movement
    this.position.x += this.velocity.x * delta;
    this.position.z += this.velocity.z * delta;

    // Strict Elevator Interior Clamping (keeps player inside cabin at all times)
    this.position.x = Math.max(this.minX, Math.min(this.maxX, this.position.x));
    this.position.z = Math.max(this.minZ, Math.min(this.maxZ, this.position.z));

    // Update Camera position with head bob
    const bobOffset = Math.sin(this.bobTimer) * (isMoving ? 0.025 : 0.005);
    this.camera.position.x = this.position.x;
    this.camera.position.y = this.eyeHeight + bobOffset;
    this.camera.position.z = this.position.z;
  }
}

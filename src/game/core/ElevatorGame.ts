import * as THREE from 'three';
import { ElevatorCabin } from './ElevatorCabin';
import { PlayerController } from './PlayerController';
import { FLOOR_SCENES } from '../scenes/floorScenes';
import { FloorSceneDefinition } from '../scenes/sceneTypes';
import { soundManager } from '../audio/soundManager';

export type ElevatorState = 'TRANSIT' | 'DOOR_OPENING' | 'DOOR_OPEN' | 'DOOR_CLOSING';

export interface HoveredButtonInfo {
  id: string;
  label: string;
  description: string;
  tooltipDetail: string;
  category?: string;
  isSelected?: boolean;
}

export interface GameStatus {
  state: ElevatorState;
  currentFloor: FloorSceneDefinition;
  nextFloor: FloorSceneDefinition;
  timeRemaining: number;
  totalTime: number;
  visitedFloors: FloorSceneDefinition[];
  floorCount: number;
  direction: 'UP' | 'DOWN';
  simulatedFloorDisplay: string;
  muzakTrackName: string;
  selectedCategory: string; // 'random' | 'comedic' | 'horror' | 'surreal' | 'absurd' | 'sci-fi'
  hoveredButton: HoveredButtonInfo | null;
}

export class ElevatorGame {
  private container: HTMLElement;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public cabin: ElevatorCabin;
  public player: PlayerController;

  // External floor scene container
  private exteriorGroup: THREE.Group;
  private currentSceneDef: FloorSceneDefinition = FLOOR_SCENES[0];
  private nextSceneDef: FloorSceneDefinition = FLOOR_SCENES[1];
  private currentSceneElapsed: number = 0;

  // State Machine
  public state: ElevatorState = 'TRANSIT';
  private stateTimer: number = 0;
  private transitDuration: number = 18; // 18s transit (within 15-30s range)
  private doorOpenDuration: number = 22; // 22s door open (within 15-30s range)
  private doorTransitionDuration: number = 1.8; // Door animation time
  private direction: 'UP' | 'DOWN' = 'UP';
  private simulatedFloorNumber: number = 1;
  private visitedList: FloorSceneDefinition[] = [];
  private sceneQueue: FloorSceneDefinition[] = [];

  // Category Selection & Hover Inspection
  public selectedCategory: string = 'random'; // default is random on each floor
  public hoveredButton: HoveredButtonInfo | null = null;
  private mouseCoords: THREE.Vector2 = new THREE.Vector2(0, 0);

  // Lighting & Environment
  private exteriorLight: THREE.DirectionalLight;
  private exteriorAmbient: THREE.AmbientLight;

  // Animation Loop
  private animationFrameId: number | null = null;
  private clock: THREE.Clock = new THREE.Clock();

  // Status callback for UI HUD
  public onStatusUpdate?: (status: GameStatus) => void;

  constructor(container: HTMLElement) {
    this.container = container;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0e);

    // 2. Camera
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(72, aspect, 0.1, 120);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    container.appendChild(this.renderer.domElement);

    // 4. Cabin & Player
    this.cabin = new ElevatorCabin();
    this.scene.add(this.cabin.group);

    this.player = new PlayerController(this.camera, this.renderer.domElement);

    // Setup 3D button interactions
    this.setupElevatorButtons();

    // 5. Exterior Scene Group
    this.exteriorGroup = new THREE.Group();
    this.exteriorGroup.position.set(0, 0, 0);
    this.scene.add(this.exteriorGroup);

    // 6. Exterior Lighting
    this.exteriorLight = new THREE.DirectionalLight(0xffffff, 1.4);
    this.exteriorLight.position.set(5, 12, -10);
    this.scene.add(this.exteriorLight);

    this.exteriorAmbient = new THREE.AmbientLight(0x777788, 1.1);
    this.scene.add(this.exteriorAmbient);

    // 7. Initialize Floor Sequence
    this.shuffleFloorQueue();
    this.currentSceneDef = this.sceneQueue.shift() || FLOOR_SCENES[0];
    this.pickNextFloor();

    // Begin in TRANSIT state
    this.startTransit();

    // Window Resize & Mouse Move tracking
    window.addEventListener('resize', this.onWindowResize);
    container.addEventListener('mousemove', this.onMouseMove);

    // Start Loop
    this.clock.start();
    this.animate();
  }

  private onMouseMove = (e: MouseEvent) => {
    const rect = this.container.getBoundingClientRect();
    this.mouseCoords.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseCoords.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  };

  private shuffleFloorQueue() {
    this.sceneQueue = [...FLOOR_SCENES].sort(() => Math.random() - 0.5);
  }

  public pickNextFloor() {
    if (this.selectedCategory === 'random') {
      if (this.sceneQueue.length === 0) {
        this.shuffleFloorQueue();
      }
      let next = this.sceneQueue.shift() || FLOOR_SCENES[0];
      if (next.id === this.currentSceneDef?.id && this.sceneQueue.length > 0) {
        this.sceneQueue.push(next);
        next = this.sceneQueue.shift() || FLOOR_SCENES[0];
      }
      this.nextSceneDef = next;
    } else {
      // Pick matching category
      const matching = FLOOR_SCENES.filter((f) => {
        if (this.selectedCategory === 'sci-fi') {
          return f.category === 'sci-fi' || f.category === 'nostalgic';
        }
        return f.category === this.selectedCategory;
      });

      if (matching.length > 0) {
        const available = matching.filter((f) => f.id !== this.currentSceneDef?.id);
        const chosen =
          available.length > 0
            ? available[Math.floor(Math.random() * available.length)]
            : matching[Math.floor(Math.random() * matching.length)];
        this.nextSceneDef = chosen;
      }
    }
  }

  public selectCategory(category: string) {
    this.selectedCategory = category;
    soundManager.playButtonClick();
    this.cabin.updateCategoryLEDs(this.selectedCategory);
    this.cabin.updatePanelScreen(
      this.selectedCategory,
      this.state === 'TRANSIT' ? 'ROUTING...' : 'TARGET SET'
    );
    this.pickNextFloor();
  }

  private setupElevatorButtons() {
    this.cabin.buttons.forEach((btn) => {
      if (btn.id === 'express') {
        btn.action = () => this.triggerExpress();
      } else if (btn.id === 'open') {
        btn.action = () => this.manualOpenDoor();
      } else if (btn.id === 'close') {
        btn.action = () => this.manualCloseDoor();
      } else if (btn.id === 'alarm') {
        btn.action = () => soundManager.playAlarmBell();
      } else if (btn.id === 'stop') {
        btn.action = () => soundManager.playButtonClick();
      } else if (btn.category) {
        btn.action = () => this.selectCategory(btn.category!);
      }
    });

    this.player.onInteractClick = (raycaster) => {
      const intersects = raycaster.intersectObjects(this.cabin.raycastMeshes);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const button = this.cabin.buttons.find((b) => b.mesh === hit);
        if (button) {
          // Visual tactile bounce
          const origColor = (button.lightMesh.material as THREE.MeshBasicMaterial).color.getHex();
          (button.lightMesh.material as THREE.MeshBasicMaterial).color.setHex(0xffffff);
          setTimeout(() => {
            if (button.category) {
              const isSelected = button.category === this.selectedCategory;
              (button.lightMesh.material as THREE.MeshBasicMaterial).color.setHex(
                isSelected ? 0xffffff : button.baseColor
              );
            } else {
              (button.lightMesh.material as THREE.MeshBasicMaterial).color.setHex(origColor);
            }
          }, 180);
          button.action();
        }
      }
    };
  }

  // --- State Transitions ---

  public startTransit() {
    this.state = 'TRANSIT';
    this.transitDuration = 16 + Math.floor(Math.random() * 8);
    this.stateTimer = this.transitDuration;
    this.cabin.setDoorOpenAmount(0);

    this.direction = Math.random() > 0.4 ? 'UP' : 'DOWN';

    soundManager.setElevatorMoving(true);
    this.cabin.updateFloorDisplay(
      String(this.simulatedFloorNumber),
      'TRAVELING...',
      this.direction
    );

    // Pick next floor according to selected category (e.g. random or user choice)
    this.pickNextFloor();

    this.cabin.updatePanelScreen(
      this.selectedCategory,
      `APPROACHING FL ${this.nextSceneDef.floorNumber}`
    );
  }

  public arriveAtFloor() {
    this.state = 'DOOR_OPENING';
    this.stateTimer = this.doorTransitionDuration;

    soundManager.setElevatorMoving(false);
    soundManager.playChime();
    soundManager.playDoorSound(true);

    this.currentSceneDef = this.nextSceneDef;
    if (!this.visitedList.some((f) => f.id === this.currentSceneDef.id)) {
      this.visitedList.push(this.currentSceneDef);
    }

    this.simulatedFloorNumber =
      typeof this.currentSceneDef.floorNumber === 'number'
        ? this.currentSceneDef.floorNumber
        : parseInt(this.currentSceneDef.floorNumber as string) || 42;

    this.cabin.updateFloorDisplay(
      String(this.currentSceneDef.floorNumber),
      'ARRIVED',
      'STOPPED'
    );

    this.cabin.updatePanelScreen(
      this.selectedCategory,
      'DOORS OPEN'
    );

    this.loadExteriorScene(this.currentSceneDef);
  }

  private loadExteriorScene(sceneDef: FloorSceneDefinition) {
    while (this.exteriorGroup.children.length > 0) {
      const obj = this.exteriorGroup.children[0];
      this.exteriorGroup.remove(obj);
    }

    this.scene.background = new THREE.Color(sceneDef.skyColor);
    this.scene.fog = new THREE.FogExp2(sceneDef.fogColor, sceneDef.fogDensity || 0.02);

    this.exteriorLight.color.setHex(sceneDef.lightColor || 0xffffff);
    this.exteriorLight.intensity = sceneDef.lightIntensity || 1.4;

    this.currentSceneElapsed = 0;
    sceneDef.init(this.exteriorGroup, this.scene);
  }

  private startDoorOpen() {
    this.state = 'DOOR_OPEN';
    this.doorOpenDuration = this.currentSceneDef.duration || 20;
    this.stateTimer = this.doorOpenDuration;
    this.cabin.setDoorOpenAmount(1);

    soundManager.startFloorTheme(this.currentSceneDef.audioTheme);

    this.cabin.updateFloorDisplay(
      String(this.currentSceneDef.floorNumber),
      'DOORS OPEN',
      'STOPPED'
    );
  }

  private startDoorClosing() {
    this.state = 'DOOR_CLOSING';
    this.stateTimer = this.doorTransitionDuration;

    soundManager.stopFloorTheme();
    soundManager.playDoorSound(false);

    this.cabin.updateFloorDisplay(
      String(this.currentSceneDef.floorNumber),
      'CLOSING...',
      'STOPPED'
    );

    this.cabin.updatePanelScreen(
      this.selectedCategory,
      'DEPARTING...'
    );
  }

  // --- Manual Actions from HUD or 3D Buttons ---

  public triggerExpress() {
    if (this.state === 'TRANSIT') {
      soundManager.playButtonClick();
      this.stateTimer = Math.min(this.stateTimer, 1.5);
    }
  }

  public forceNextFloor() {
    soundManager.playButtonClick();
    if (this.state === 'DOOR_OPEN') {
      this.stateTimer = 0.5;
    } else if (this.state === 'TRANSIT') {
      this.stateTimer = 1.0;
    }
  }

  public manualOpenDoor() {
    if (this.state === 'DOOR_OPEN') return;
    soundManager.playButtonClick();
    if (this.state === 'DOOR_CLOSING') {
      this.state = 'DOOR_OPENING';
      this.stateTimer = this.doorTransitionDuration;
      soundManager.playDoorSound(true);
    }
  }

  public manualCloseDoor() {
    if (this.state === 'DOOR_OPEN') {
      soundManager.playButtonClick();
      this.stateTimer = 0.8;
    }
  }

  // --- Main Animation Loop ---

  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const delta = Math.min(this.clock.getDelta(), 0.1);
    this.stateTimer -= delta;

    this.player.update(delta);

    // --- Hover Inspection Raycast ---
    const raycaster = new THREE.Raycaster();
    if (this.player.isLocked) {
      raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    } else {
      raycaster.setFromCamera(this.mouseCoords, this.camera);
    }

    const intersects = raycaster.intersectObjects(this.cabin.raycastMeshes);
    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const button = this.cabin.buttons.find((b) => b.mesh === hit);
      if (button) {
        this.hoveredButton = {
          id: button.id,
          label: button.label,
          description: button.description,
          tooltipDetail: button.tooltipDetail,
          category: button.category,
          isSelected: button.category ? this.selectedCategory === button.category : false,
        };
      } else {
        this.hoveredButton = null;
      }
    } else {
      this.hoveredButton = null;
    }

    // State Machine Processing
    if (this.state === 'TRANSIT') {
      if (Math.random() < 0.15) {
        const deltaFloor = this.direction === 'UP' ? 1 : -1;
        this.simulatedFloorNumber += deltaFloor * (Math.floor(Math.random() * 3) + 1);
        this.cabin.updateFloorDisplay(
          String(this.simulatedFloorNumber),
          'TRANSIT',
          this.direction
        );
      }

      this.cabin.group.position.y = Math.sin(performance.now() * 0.02) * 0.006;

      if (this.stateTimer <= 0) {
        this.arriveAtFloor();
      }
    } else if (this.state === 'DOOR_OPENING') {
      const progress = 1 - Math.max(0, this.stateTimer / this.doorTransitionDuration);
      this.cabin.setDoorOpenAmount(progress);
      if (this.stateTimer <= 0) {
        this.startDoorOpen();
      }
    } else if (this.state === 'DOOR_OPEN') {
      this.currentSceneElapsed += delta;
      if (this.currentSceneDef && this.currentSceneDef.update) {
        this.currentSceneDef.update(delta, this.currentSceneElapsed, this.exteriorGroup);
      }

      if (this.stateTimer <= 0) {
        this.startDoorClosing();
      }
    } else if (this.state === 'DOOR_CLOSING') {
      const progress = Math.max(0, this.stateTimer / this.doorTransitionDuration);
      this.cabin.setDoorOpenAmount(progress);
      if (this.stateTimer <= 0) {
        this.startTransit();
      }
    }

    this.renderer.render(this.scene, this.camera);

    if (this.onStatusUpdate) {
      this.onStatusUpdate({
        state: this.state,
        currentFloor: this.currentSceneDef,
        nextFloor: this.nextSceneDef,
        timeRemaining: Math.max(0, this.stateTimer),
        totalTime: this.state === 'TRANSIT' ? this.transitDuration : this.doorOpenDuration,
        visitedFloors: this.visitedList,
        floorCount: this.visitedList.length,
        direction: this.direction,
        simulatedFloorDisplay: String(this.simulatedFloorNumber),
        muzakTrackName: soundManager.getCurrentMuzakTrackName(),
        selectedCategory: this.selectedCategory,
        hoveredButton: this.hoveredButton,
      });
    }
  };

  private onWindowResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onWindowResize);
    this.container.removeEventListener('mousemove', this.onMouseMove);
    this.player.destroy();
    soundManager.setElevatorMoving(false);
    soundManager.stopFloorTheme();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}

import * as THREE from 'three';

export interface ElevatorButtonData {
  id: string;
  label: string;
  description: string;
  tooltipDetail: string;
  category?: string; // 'random' | 'comedic' | 'horror' | 'surreal' | 'absurd' | 'sci-fi'
  mesh: THREE.Mesh;
  lightMesh: THREE.Mesh;
  baseColor: number;
  action: () => void;
}

export class ElevatorCabin {
  public group: THREE.Group;
  public leftDoor: THREE.Mesh;
  public rightDoor: THREE.Mesh;
  public doorOpenAmount: number = 0; // 0 = fully closed, 1 = fully open
  public ceilingLight: THREE.PointLight;
  public floorDisplayCanvas: HTMLCanvasElement;
  public floorDisplayTexture: THREE.CanvasTexture;
  public floorDisplayMesh: THREE.Mesh;
  public panelScreenCanvas: HTMLCanvasElement;
  public panelScreenTexture: THREE.CanvasTexture;
  public panelScreenMesh: THREE.Mesh;
  public buttons: ElevatorButtonData[] = [];
  public raycastMeshes: THREE.Mesh[] = [];

  // Door geometry constants
  private doorWidth = 1.05;
  private doorHeight = 2.6;
  private cabinWidth = 3.4;
  private cabinDepth = 3.2;
  private cabinHeight = 2.8;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'elevatorCabin';

    // Materials - Bright, warm luxury elevator finishes
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x684c35, // Rich honey-warm polished parquet
      roughness: 0.25,
      metalness: 0.15,
    });

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xa89680, // Bright champagne bronze & warm architectural panels
      roughness: 0.35,
      metalness: 0.45,
    });

    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xf5c358, // Polished bright brass/gold accent trim
      roughness: 0.18,
      metalness: 0.92,
    });

    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x4a4744,
      roughness: 0.5,
      metalness: 0.3,
    });

    // 1. Floor
    const floorGeo = new THREE.PlaneGeometry(this.cabinWidth, this.cabinDepth);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -1.3, 0);
    this.group.add(floor);

    // Floor brass transition threshold at doorway
    const threshGeo = new THREE.BoxGeometry(2.3, 0.04, 0.2);
    const thresh = new THREE.Mesh(threshGeo, trimMat);
    thresh.position.set(0, -1.28, -1.55);
    this.group.add(thresh);

    // 2. Ceiling
    const ceilGeo = new THREE.PlaneGeometry(this.cabinWidth, this.cabinDepth);
    const ceil = new THREE.Mesh(ceilGeo, ceilingMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, 1.45, 0);
    this.group.add(ceil);

    // Bright Luminous Ceiling Light Panel
    const lightPanelGeo = new THREE.PlaneGeometry(1.8, 1.8);
    const lightPanelMat = new THREE.MeshBasicMaterial({ color: 0xfffcf0 });
    const lightPanel = new THREE.Mesh(lightPanelGeo, lightPanelMat);
    lightPanel.rotation.x = Math.PI / 2;
    lightPanel.position.set(0, 1.44, 0);
    this.group.add(lightPanel);

    // Primary Central Overhead Flood
    this.ceilingLight = new THREE.PointLight(0xfffaea, 4.5, 9, 1.2);
    this.ceilingLight.position.set(0, 1.35, 0);
    this.group.add(this.ceilingLight);

    // Interior Soft Ambient Fill Light (prevents dark corners)
    const cabinFill = new THREE.HemisphereLight(0xfffaea, 0x6e5c4a, 1.6);
    this.group.add(cabinFill);

    // 4 Warm Recessed Downlights in Ceiling Corners
    const cornerPositions = [
      { x: -1.1, z: -1.0 },
      { x: 1.1, z: -1.0 },
      { x: -1.1, z: 1.0 },
      { x: 1.1, z: 1.0 },
    ];
    cornerPositions.forEach((pos) => {
      const downlight = new THREE.PointLight(0xfff3db, 1.8, 5, 1.3);
      downlight.position.set(pos.x, 1.38, pos.z);
      this.group.add(downlight);

      // Mini brass fixture bezel
      const fixtureMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.02, 12),
        trimMat
      );
      fixtureMesh.position.set(pos.x, 1.44, pos.z);
      this.group.add(fixtureMesh);
    });

    // 3. Back Wall (z = +1.6)
    const backWallGeo = new THREE.BoxGeometry(this.cabinWidth, this.cabinHeight, 0.1);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 0.05, 1.6);
    this.group.add(backWall);

    // Back Wall Mirror
    const mirrorGeo = new THREE.PlaneGeometry(2.2, 1.8);
    const mirrorMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.05,
      metalness: 0.95,
    });
    const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
    mirror.position.set(0, 0.2, 1.54);
    mirror.rotation.y = Math.PI;
    this.group.add(mirror);

    // Mirror Brass Frame
    const frameGeo = new THREE.BoxGeometry(2.3, 1.9, 0.02);
    const frame = new THREE.Mesh(frameGeo, trimMat);
    frame.position.set(0, 0.2, 1.545);
    this.group.add(frame);

    // 4. Left Wall (x = -1.7)
    const sideWallGeo = new THREE.BoxGeometry(0.1, this.cabinHeight, this.cabinDepth);
    const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
    leftWall.position.set(-1.65, 0.05, 0);
    this.group.add(leftWall);

    // Framed Certificate on Left Wall
    const certFrame = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.6, 0.8), trimMat);
    certFrame.position.set(-1.58, 0.4, 0.2);
    const certPaper = new THREE.Mesh(
      new THREE.PlaneGeometry(0.72, 0.52),
      new THREE.MeshBasicMaterial({ color: 0xf5eedc })
    );
    certPaper.rotation.y = Math.PI / 2;
    certPaper.position.set(-1.555, 0.4, 0.2);
    this.group.add(certFrame);
    this.group.add(certPaper);

    // 5. Right Wall (x = +1.7)
    const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
    rightWall.position.set(1.65, 0.05, 0);
    this.group.add(rightWall);

    // Handrails on Left, Back, and Right
    const railMat = trimMat;
    const backRail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.8), railMat);
    backRail.rotation.z = Math.PI / 2;
    backRail.position.set(0, -0.3, 1.48);
    this.group.add(backRail);

    const leftRail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.6), railMat);
    leftRail.rotation.x = Math.PI / 2;
    leftRail.position.set(-1.55, -0.3, 0);
    this.group.add(leftRail);

    const rightRail = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.6), railMat);
    rightRail.rotation.x = Math.PI / 2;
    rightRail.position.set(1.55, -0.3, 0);
    this.group.add(rightRail);

    // 6. Front Wall (with door opening in center)
    const frontSideGeo = new THREE.BoxGeometry(0.65, this.cabinHeight, 0.1);
    const frontLeft = new THREE.Mesh(frontSideGeo, wallMat);
    frontLeft.position.set(-1.35, 0.05, -1.6);
    this.group.add(frontLeft);

    const frontRight = new THREE.Mesh(frontSideGeo, wallMat);
    frontRight.position.set(1.35, 0.05, -1.6);
    this.group.add(frontRight);

    // Header above door
    const headerGeo = new THREE.BoxGeometry(2.1, 0.35, 0.1);
    const header = new THREE.Mesh(headerGeo, wallMat);
    header.position.set(0, 1.25, -1.6);
    this.group.add(header);

    // 7. Sliding Doors
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x5a544d, // Brushed dark steel
      metalness: 0.85,
      roughness: 0.25,
    });

    const doorGeo = new THREE.BoxGeometry(this.doorWidth, this.doorHeight, 0.06);

    this.leftDoor = new THREE.Mesh(doorGeo, doorMat);
    this.leftDoor.position.set(-this.doorWidth / 2, 0.0, -1.62);
    this.leftDoor.name = 'leftDoor';
    this.group.add(this.leftDoor);

    this.rightDoor = new THREE.Mesh(doorGeo, doorMat);
    this.rightDoor.position.set(this.doorWidth / 2, 0.0, -1.62);
    this.rightDoor.name = 'rightDoor';
    this.group.add(this.rightDoor);

    // Door bumpers
    const bumperMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const bumperL = new THREE.Mesh(new THREE.BoxGeometry(0.02, this.doorHeight, 0.07), bumperMat);
    bumperL.position.set(this.doorWidth / 2, 0, 0);
    this.leftDoor.add(bumperL);
    const bumperR = new THREE.Mesh(new THREE.BoxGeometry(0.02, this.doorHeight, 0.07), bumperMat);
    bumperR.position.set(-this.doorWidth / 2, 0, 0);
    this.rightDoor.add(bumperR);

    // 8. Digital Floor Indicator Display (Above the door)
    this.floorDisplayCanvas = document.createElement('canvas');
    this.floorDisplayCanvas.width = 512;
    this.floorDisplayCanvas.height = 128;
    this.floorDisplayTexture = new THREE.CanvasTexture(this.floorDisplayCanvas);
    this.floorDisplayTexture.minFilter = THREE.LinearFilter;

    const displayMat = new THREE.MeshBasicMaterial({
      map: this.floorDisplayTexture,
      transparent: true,
    });
    const displayGeo = new THREE.PlaneGeometry(1.2, 0.3);
    this.floorDisplayMesh = new THREE.Mesh(displayGeo, displayMat);
    this.floorDisplayMesh.position.set(0, 1.25, -1.54);
    this.group.add(this.floorDisplayMesh);

    this.updateFloorDisplay('1', 'STOPPED', 'NORMAL');

    // 9. Interactive 3D Control Panel (Right Wall near door)
    this.panelScreenCanvas = document.createElement('canvas');
    this.panelScreenCanvas.width = 512;
    this.panelScreenCanvas.height = 140;
    this.panelScreenTexture = new THREE.CanvasTexture(this.panelScreenCanvas);
    this.panelScreenTexture.minFilter = THREE.LinearFilter;
    const panelScreenMat = new THREE.MeshBasicMaterial({ map: this.panelScreenTexture });
    this.panelScreenMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.12), panelScreenMat);

    this.buildControlPanel();
    this.updatePanelScreen('RANDOM', 'AUTO ROUTING');
  }

  private buildControlPanel() {
    const panelGroup = new THREE.Group();
    panelGroup.position.set(1.58, 0.05, -0.75);
    panelGroup.rotation.y = -Math.PI / 2;

    // Brass Panel Backing Plate (Enlarged to fit category buttons)
    const plateGeo = new THREE.BoxGeometry(0.58, 1.48, 0.02);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0xc49a45,
      metalness: 0.9,
      roughness: 0.25,
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    panelGroup.add(plate);

    // Mini status screen on panel
    this.panelScreenMesh.position.set(0, 0.58, 0.015);
    panelGroup.add(this.panelScreenMesh);

    // Operational Divider Label
    const divMat = new THREE.MeshBasicMaterial({ color: 0x332612 });
    const div1 = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.02), divMat);
    div1.position.set(0, 0.17, 0.012);
    panelGroup.add(div1);

    // Category Section Header Divider
    const div2 = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.02), divMat);
    div2.position.set(0, -0.32, 0.012);
    panelGroup.add(div2);

    // Comprehensive Buttons Configuration
    const buttonConfigs = [
      // Operational Row 1
      {
        id: 'open',
        label: '◄||► OPEN',
        description: 'Holds or re-opens elevator doors',
        tooltipDetail: 'Door Hold / Override',
        x: -0.14,
        y: 0.45,
        color: 0xf59e0b,
      },
      {
        id: 'close',
        label: '►||◄ CLOSE',
        description: 'Closes elevator doors and departs immediately',
        tooltipDetail: 'Manual Door Close',
        x: 0.14,
        y: 0.45,
        color: 0x10b981,
      },
      // Operational Row 2
      {
        id: 'express',
        label: '⚡ FAST',
        description: 'Engages express transit thrusters to arrive immediately',
        tooltipDetail: 'Fast-Forward Travel',
        x: -0.14,
        y: 0.31,
        color: 0x3b82f6,
      },
      {
        id: 'alarm',
        label: '🔔 BELL',
        description: 'Rings the vintage emergency elevator bell',
        tooltipDetail: 'Acoustic Signal',
        x: 0.14,
        y: 0.31,
        color: 0xef4444,
      },

      // Category Selection Row 1
      {
        id: 'cat_random',
        label: '🎲 RANDOM',
        category: 'random',
        description: 'Sets destination to a completely randomized surprise category on each floor',
        tooltipDetail: 'Default · All 12+ Anomalies',
        x: -0.14,
        y: 0.04,
        color: 0x10b981,
      },
      {
        id: 'cat_comedic',
        label: '🎭 COMEDY',
        category: 'comedic',
        description: 'Targets next floor to a hilarious comedic dimension',
        tooltipDetail: 'Dancing Cactus, Snail Knight, etc.',
        x: 0.14,
        y: 0.04,
        color: 0xf59e0b,
      },

      // Category Selection Row 2
      {
        id: 'cat_horror',
        label: '👁️ HORROR',
        category: 'horror',
        description: 'Targets next floor to an eerie liminal or spooky dimension',
        tooltipDetail: 'Non-Euclidean Backrooms Floor -13',
        x: -0.14,
        y: -0.09,
        color: 0xef4444,
      },
      {
        id: 'cat_surreal',
        label: '🌌 SURREAL',
        category: 'surreal',
        description: 'Targets next floor to a dreamlike surreal cosmic realm',
        tooltipDetail: 'Moon Poker, Midnight Abyss Whale',
        x: 0.14,
        y: -0.09,
        color: 0xa855f7,
      },

      // Category Selection Row 3
      {
        id: 'cat_absurd',
        label: '🦆 ABSURD',
        category: 'absurd',
        description: 'Targets next floor to a delightfully absurd anomaly',
        tooltipDetail: 'Rubber Duck Temple, Zero-G Pizza',
        x: -0.14,
        y: -0.22,
        color: 0x06b6d4,
      },
      {
        id: 'cat_scifi',
        label: '🚀 SCI-FI',
        category: 'sci-fi',
        description: 'Targets next floor to futuristic or retro sci-fi sectors',
        tooltipDetail: 'Cyberpunk 2099, Neon Synthwave',
        x: 0.14,
        y: -0.22,
        color: 0xec4899,
      },

      // Bottom Row: Emergency Stop / Reset
      {
        id: 'stop',
        label: '🛑 BRAKE',
        description: 'Auxiliary mechanical emergency elevator brake lever',
        tooltipDetail: 'Emergency Stop / Inspection Check',
        x: 0,
        y: -0.42,
        color: 0xd97706,
      },
    ];

    const btnGeo = new THREE.CylinderGeometry(0.065, 0.07, 0.03, 16);
    btnGeo.rotateX(Math.PI / 2);

    buttonConfigs.forEach((cfg) => {
      const btnMat = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        metalness: 0.8,
        roughness: 0.2,
      });
      const btnMesh = new THREE.Mesh(btnGeo, btnMat);
      btnMesh.position.set(cfg.x, cfg.y, 0.02);
      btnMesh.name = `btn_${cfg.id}`;

      // Glowing LED Ring
      const ringGeo = new THREE.TorusGeometry(0.072, 0.008, 8, 20);
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.category ? (cfg.category === 'random' ? 1.0 : 0.35) : 0.85,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(cfg.x, cfg.y, 0.02);

      panelGroup.add(btnMesh);
      panelGroup.add(ringMesh);

      this.raycastMeshes.push(btnMesh);
      this.buttons.push({
        id: cfg.id,
        label: cfg.label,
        description: cfg.description,
        tooltipDetail: cfg.tooltipDetail,
        category: cfg.category,
        mesh: btnMesh,
        lightMesh: ringMesh as unknown as THREE.Mesh,
        baseColor: cfg.color,
        action: () => {},
      });
    });

    this.group.add(panelGroup);
  }

  public updatePanelScreen(categoryName: string, stateText: string) {
    const ctx = this.panelScreenCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0d0d12';
    ctx.fillRect(0, 0, 512, 140);

    // Beveled frame border
    ctx.strokeStyle = '#22222a';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 504, 132);

    // Header label
    ctx.fillStyle = '#888899';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('TARGET SECTOR', 20, 36);

    // Active Category
    ctx.fillStyle = '#00ffcc';
    ctx.font = 'bold 44px "Space Grotesk", monospace';
    ctx.fillText(`[ ${categoryName.toUpperCase()} ]`, 20, 88);

    // State text
    ctx.fillStyle = '#ffaa33';
    ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(stateText.toUpperCase(), 20, 122);

    this.panelScreenTexture.needsUpdate = true;
  }

  public updateCategoryLEDs(selectedCategory: string) {
    this.buttons.forEach((btn) => {
      if (btn.category) {
        const isSelected = btn.category === selectedCategory;
        const mat = btn.lightMesh.material as THREE.MeshBasicMaterial;
        mat.opacity = isSelected ? 1.0 : 0.3;
        mat.color.setHex(isSelected ? 0xffffff : btn.baseColor);
      }
    });
  }

  public updateFloorDisplay(floorText: string, statusText: string, direction: 'UP' | 'DOWN' | 'STOPPED' | 'NORMAL') {
    const ctx = this.floorDisplayCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a0a0d';
    ctx.fillRect(0, 0, 512, 128);

    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 504, 120);

    ctx.fillStyle = '#ff9900';
    ctx.font = 'bold 36px monospace';
    let arrow = '■';
    if (direction === 'UP') arrow = '▲';
    if (direction === 'DOWN') arrow = '▼';
    ctx.fillText(arrow, 24, 78);

    ctx.fillStyle = '#ffb300';
    ctx.font = 'bold 52px "Space Grotesk", monospace';
    ctx.fillText(floorText, 80, 82);

    ctx.fillStyle = '#aaaaaa';
    ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(statusText, 320, 76);

    this.floorDisplayTexture.needsUpdate = true;
  }

  public setDoorOpenAmount(amount: number) {
    this.doorOpenAmount = Math.max(0, Math.min(1, amount));
    const closedLX = -this.doorWidth / 2;
    const openLX = -1.48;
    this.leftDoor.position.x = closedLX + (openLX - closedLX) * this.doorOpenAmount;

    const closedRX = this.doorWidth / 2;
    const openRX = 1.48;
    this.rightDoor.position.x = closedRX + (openRX - closedRX) * this.doorOpenAmount;
  }
}

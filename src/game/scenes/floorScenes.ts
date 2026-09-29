import * as THREE from 'three';
import { FloorSceneDefinition } from './sceneTypes';

/**
 * 1. Dancing Mexican Cactus in Sonoran Desert
 */
const dancingCactusScene: FloorSceneDefinition = {
  id: 'cactus_desert',
  floorNumber: 47,
  name: 'Floor 47: Sonoran Fiesta Dunes',
  category: 'comedic',
  description: 'A vibrant desert where a giant mustache-wearing cactus in a sombrero dances with maracas.',
  duration: 22,
  audioTheme: 'cactus_mariachi',
  skyColor: 0xffaa5e,
  fogColor: 0xffb366,
  fogDensity: 0.02,
  lightColor: 0xffe2b3,
  lightIntensity: 1.8,
  init: (container) => {
    // Desert Ground & Dunes
    const groundGeo = new THREE.PlaneGeometry(80, 80, 32, 32);
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Gentle dunes
      pos.setZ(i, Math.sin(x * 0.15) * 1.2 + Math.cos(y * 0.2) * 1.0);
    }
    groundGeo.computeVertexNormals();
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xdeb887,
      roughness: 0.9,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -1.3, -12);
    container.add(ground);

    // Warm Desert Sun
    const sunGeo = new THREE.SphereGeometry(6, 24, 24);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xff4500 });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(0, 15, -35);
    container.add(sun);

    // Giant Dancing Cactus Group
    const cactusGroup = new THREE.Group();
    cactusGroup.position.set(0, -1.2, -6.5);
    cactusGroup.name = 'mainCactus';

    // Cactus Body (green segmented cylinder)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x2e8b57,
      roughness: 0.6,
      bumpScale: 0.05
    });
    const bodyGeo = new THREE.CylinderGeometry(0.5, 0.45, 3.2, 16);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.6;
    cactusGroup.add(body);

    // Left Arm (branch)
    const armGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.2, 12);
    const leftArmLower = new THREE.Mesh(armGeo, bodyMat);
    leftArmLower.rotation.z = Math.PI / 2;
    leftArmLower.position.set(-0.7, 1.8, 0);
    const leftArmUp = new THREE.Mesh(armGeo, bodyMat);
    leftArmUp.position.set(-1.2, 2.3, 0);
    const leftArmGroup = new THREE.Group();
    leftArmGroup.name = 'leftArmGroup';
    leftArmGroup.add(leftArmLower);
    leftArmGroup.add(leftArmUp);

    // Left Maraca
    const maracaMat = new THREE.MeshStandardMaterial({ color: 0xff3333, roughness: 0.3 });
    const maracaHead = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), maracaMat);
    maracaHead.position.set(-1.2, 3.1, 0);
    const maracaStick = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5), new THREE.MeshStandardMaterial({ color: 0xd2b48c }));
    maracaStick.position.set(-1.2, 2.8, 0);
    leftArmGroup.add(maracaHead);
    leftArmGroup.add(maracaStick);
    cactusGroup.add(leftArmGroup);

    // Right Arm (branch)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.name = 'rightArmGroup';
    const rightArmLower = new THREE.Mesh(armGeo, bodyMat);
    rightArmLower.rotation.z = -Math.PI / 2;
    rightArmLower.position.set(0.7, 1.8, 0);
    const rightArmUp = new THREE.Mesh(armGeo, bodyMat);
    rightArmUp.position.set(1.2, 2.3, 0);
    rightArmGroup.add(rightArmLower);
    rightArmGroup.add(rightArmUp);

    // Right Maraca
    const maracaHeadR = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), maracaMat);
    maracaHeadR.position.set(1.2, 3.1, 0);
    const maracaStickR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5), new THREE.MeshStandardMaterial({ color: 0xd2b48c }));
    maracaStickR.position.set(1.2, 2.8, 0);
    rightArmGroup.add(maracaHeadR);
    rightArmGroup.add(maracaStickR);
    cactusGroup.add(rightArmGroup);

    // Giant Sombrero
    const hatGroup = new THREE.Group();
    hatGroup.position.set(0, 3.25, 0);
    hatGroup.name = 'sombrero';
    const brimGeo = new THREE.CylinderGeometry(1.5, 1.4, 0.1, 24);
    const brimMat = new THREE.MeshStandardMaterial({ color: 0xe5a65d, roughness: 0.8 });
    const brim = new THREE.Mesh(brimGeo, brimMat);
    const crownGeo = new THREE.ConeGeometry(0.6, 1.1, 16);
    const crown = new THREE.Mesh(crownGeo, brimMat);
    crown.position.y = 0.55;

    // Colorful Serape Hat Trim (Red and Yellow bands)
    const bandGeo = new THREE.TorusGeometry(0.62, 0.06, 8, 24);
    const bandMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
    const band = new THREE.Mesh(bandGeo, bandMat);
    band.rotation.x = Math.PI / 2;
    band.position.y = 0.15;

    hatGroup.add(brim);
    hatGroup.add(crown);
    hatGroup.add(band);
    cactusGroup.add(hatGroup);

    // Big Comedic Mustache
    const stacheMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const stacheL = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.5, 8), stacheMat);
    stacheL.rotation.z = Math.PI / 3;
    stacheL.position.set(-0.25, 2.55, 0.45);
    const stacheR = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.5, 8), stacheMat);
    stacheR.rotation.z = -Math.PI / 3;
    stacheR.position.set(0.25, 2.55, 0.45);

    // Googly Cartoon Eyes
    const eyeWhiteGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const eyeBlackGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const eyeBlackMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

    const eyeL = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    eyeL.position.set(-0.2, 2.8, 0.45);
    const pupilL = new THREE.Mesh(eyeBlackGeo, eyeBlackMat);
    pupilL.position.set(-0.2, 2.8, 0.55);

    const eyeR = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    eyeR.position.set(0.2, 2.8, 0.45);
    const pupilR = new THREE.Mesh(eyeBlackGeo, eyeBlackMat);
    pupilR.position.set(0.2, 2.8, 0.55);

    cactusGroup.add(stacheL);
    cactusGroup.add(stacheR);
    cactusGroup.add(eyeL);
    cactusGroup.add(pupilL);
    cactusGroup.add(eyeR);
    cactusGroup.add(pupilR);

    container.add(cactusGroup);

    // Two Mini Backup Dancer Cacti
    [-3.2, 3.2].forEach((xOffset, idx) => {
      const miniCactus = cactusGroup.clone();
      miniCactus.scale.set(0.55, 0.55, 0.55);
      miniCactus.position.set(xOffset, -1.2, -8.5);
      miniCactus.name = `miniCactus_${idx}`;
      container.add(miniCactus);
    });
  },
  update: (delta, elapsed, container) => {
    const cactus = container.getObjectByName('mainCactus');
    if (cactus) {
      // Energetic Mexican side-to-side salsa dance
      cactus.position.x = Math.sin(elapsed * 5) * 0.4;
      cactus.rotation.z = Math.sin(elapsed * 5) * 0.15;
      cactus.position.y = -1.2 + Math.abs(Math.sin(elapsed * 10)) * 0.35; // bouncing jump

      const leftArm = cactus.getObjectByName('leftArmGroup');
      const rightArm = cactus.getObjectByName('rightArmGroup');
      if (leftArm && rightArm) {
        leftArm.rotation.z = Math.sin(elapsed * 12) * 0.4;
        rightArm.rotation.z = -Math.sin(elapsed * 12) * 0.4;
        leftArm.rotation.x = Math.cos(elapsed * 10) * 0.3;
        rightArm.rotation.x = -Math.cos(elapsed * 10) * 0.3;
      }

      const hat = cactus.getObjectByName('sombrero');
      if (hat) {
        hat.rotation.y = Math.sin(elapsed * 6) * 0.2;
        hat.rotation.z = Math.cos(elapsed * 8) * 0.15;
      }
    }

    // Backup dancers bounce with phase offset
    [0, 1].forEach((idx) => {
      const mini = container.getObjectByName(`miniCactus_${idx}`);
      if (mini) {
        mini.position.y = -1.2 + Math.abs(Math.sin(elapsed * 10 + (idx + 1))) * 0.25;
        mini.rotation.z = Math.sin(elapsed * 5 + (idx + 1)) * 0.2;
      }
    });
  }
};

/**
 * 2. Astronauts Playing Poker on the Moon
 */
const moonPokerScene: FloorSceneDefinition = {
  id: 'moon_poker',
  floorNumber: 404,
  name: 'Floor 404: Lunar High-Stakes Casino',
  category: 'surreal',
  description: 'Low-gravity moon surface with astronauts playing poker around a floating green felt table.',
  duration: 25,
  audioTheme: 'moon_poker',
  skyColor: 0x020208,
  fogColor: 0x050512,
  fogDensity: 0.015,
  lightColor: 0xddeeff,
  lightIntensity: 1.4,
  init: (container) => {
    // Moon Surface with Craters
    const moonGeo = new THREE.PlaneGeometry(80, 80, 40, 40);
    const pos = moonGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Rough lunar regolith craters
      const dist = Math.sqrt(x * x + y * y);
      pos.setZ(i, (Math.sin(x * 0.3) * Math.cos(y * 0.3) * 0.8) - (dist > 15 ? Math.sin(dist * 0.5) * 1.5 : 0));
    }
    moonGeo.computeVertexNormals();
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0x888899,
      roughness: 0.95,
      metalness: 0.1
    });
    const moonSurface = new THREE.Mesh(moonGeo, moonMat);
    moonSurface.rotation.x = -Math.PI / 2;
    moonSurface.position.set(0, -1.3, -12);
    container.add(moonSurface);

    // Distant Glowing Earth in deep space
    const earthGeo = new THREE.SphereGeometry(3.5, 32, 32);
    const earthMat = new THREE.MeshBasicMaterial({ color: 0x3388ff });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.position.set(12, 14, -30);
    container.add(earth);

    // Stars particle field
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 300;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 80;
      starPositions[i + 1] = Math.random() * 40 - 5;
      starPositions[i + 2] = -15 - Math.random() * 40;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15 });
    const starPoints = new THREE.Points(starsGeo, starMat);
    container.add(starPoints);

    // Green Baize Poker Table
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0, -0.6, -5.5);
    tableGroup.name = 'pokerTable';

    const tableTopGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.12, 24);
    const tableTopMat = new THREE.MeshStandardMaterial({ color: 0x0f5924, roughness: 0.7 });
    const tableTop = new THREE.Mesh(tableTopGeo, tableTopMat);
    tableGroup.add(tableTop);

    const rimGeo = new THREE.TorusGeometry(1.6, 0.08, 12, 32);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x5a2d0c, roughness: 0.4 });
    const tableRim = new THREE.Mesh(rimGeo, rimMat);
    tableRim.rotation.x = Math.PI / 2;
    tableGroup.add(tableRim);

    // Floating Stacks of Poker Chips (Red, Blue, Black)
    const chipColors = [0xee2222, 0x2255ee, 0x222222];
    for (let c = 0; c < 8; c++) {
      const chipGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.03, 12);
      const chipMat = new THREE.MeshStandardMaterial({ color: chipColors[c % 3] });
      const chip = new THREE.Mesh(chipGeo, chipMat);
      const angle = (c / 8) * Math.PI * 2;
      chip.position.set(Math.cos(angle) * 0.8, 0.08 + (c % 3) * 0.04, Math.sin(angle) * 0.8);
      tableGroup.add(chip);
    }

    // Floating Poker Cards in low gravity
    const cardGroup = new THREE.Group();
    cardGroup.name = 'floatingCards';
    const cardGeo = new THREE.PlaneGeometry(0.24, 0.35);
    const cardMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    for (let k = 0; k < 5; k++) {
      const card = new THREE.Mesh(cardGeo, cardMat);
      card.position.set(-0.4 + k * 0.2, 0.2 + (k % 2) * 0.08, (Math.random() - 0.5) * 0.3);
      card.rotation.x = Math.PI / 3 + Math.random() * 0.2;
      card.rotation.z = (Math.random() - 0.5) * 0.4;
      cardGroup.add(card);
    }
    tableGroup.add(cardGroup);
    container.add(tableGroup);

    // 3 Astronaut Figures around the table
    const astronautPositions = [
      { x: -1.8, z: -5.5, rotY: Math.PI / 2 },
      { x: 0, z: -7.2, rotY: 0 },
      { x: 1.8, z: -5.5, rotY: -Math.PI / 2 },
    ];

    astronautPositions.forEach((posData, idx) => {
      const astro = createAstronautMesh();
      astro.position.set(posData.x, -1.2, posData.z);
      astro.rotation.y = posData.rotY;
      astro.name = `astronaut_${idx}`;
      container.add(astro);
    });
  },
  update: (delta, elapsed, container) => {
    // Floating cards slow oscillation in zero gravity
    const cards = container.getObjectByName('floatingCards');
    if (cards) {
      cards.children.forEach((c, idx) => {
        c.position.y = 0.2 + Math.sin(elapsed * 2 + idx) * 0.06;
        c.rotation.y += delta * 0.5;
      });
    }

    // Astronauts gesturing and thinking
    [0, 1, 2].forEach((idx) => {
      const astro = container.getObjectByName(`astronaut_${idx}`);
      if (astro) {
        astro.position.y = -1.2 + Math.sin(elapsed * 1.5 + idx * 2) * 0.04;
        const head = astro.getObjectByName('astroHead');
        if (head) {
          head.rotation.y = Math.sin(elapsed * 1.8 + idx) * 0.3;
          head.rotation.x = Math.cos(elapsed * 1.2 + idx) * 0.15;
        }
      }
    });
  }
};

function createAstronautMesh(): THREE.Group {
  const group = new THREE.Group();
  const suitMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.7 });
  const visorMat = new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    metalness: 0.9,
    roughness: 0.1
  });

  // Body
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.35, 1.1, 12), suitMat);
  torso.position.y = 1.0;
  group.add(torso);

  // Oxygen Backpack
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.3), new THREE.MeshStandardMaterial({ color: 0xcccccc }));
  pack.position.set(0, 1.1, -0.32);
  group.add(pack);

  // Helmet
  const headGroup = new THREE.Group();
  headGroup.name = 'astroHead';
  headGroup.position.set(0, 1.8, 0);

  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), suitMat);
  const visor = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16, 0, Math.PI), visorMat);
  visor.position.set(0, 0, 0.15);
  visor.rotation.y = -Math.PI / 2;

  headGroup.add(helmet);
  headGroup.add(visor);
  group.add(headGroup);

  // Chair
  const chair = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 0.7), new THREE.MeshStandardMaterial({ color: 0x444444 }));
  chair.position.set(0, 0.45, 0);
  group.add(chair);

  return group;
}

/**
 * 3. Disco T-Rex Dinosaur Floor
 */
const discoTrexScene: FloorSceneDefinition = {
  id: 'disco_trex',
  floorNumber: 777,
  name: 'Floor 777: Jurassic Studio 54',
  category: 'comedic',
  description: 'A prehistoric neon jungle where a giant sunglasses-wearing T-Rex grooves under a massive disco ball.',
  duration: 20,
  audioTheme: 'disco_trex',
  skyColor: 0x110022,
  fogColor: 0x220033,
  fogDensity: 0.02,
  lightColor: 0xff00ff,
  lightIntensity: 1.5,
  init: (container) => {
    // Disco Floor Tiles
    const floorGeo = new THREE.PlaneGeometry(30, 30, 10, 10);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x221133,
      roughness: 0.2,
      metalness: 0.8
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -1.3, -8);
    container.add(floor);

    // Giant Mirror Disco Ball
    const ballGeo = new THREE.SphereGeometry(1.2, 24, 24);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      metalness: 0.95,
      roughness: 0.05
    });
    const discoBall = new THREE.Mesh(ballGeo, ballMat);
    discoBall.position.set(0, 4.5, -6.5);
    discoBall.name = 'discoBall';
    container.add(discoBall);

    // Disco Ball Hanging Chain
    const chainGeo = new THREE.CylinderGeometry(0.02, 0.02, 3);
    const chain = new THREE.Mesh(chainGeo, new THREE.MeshBasicMaterial({ color: 0x888888 }));
    chain.position.set(0, 6, -6.5);
    container.add(chain);

    // T-Rex Character
    const trexGroup = new THREE.Group();
    trexGroup.position.set(0, -1.2, -6.5);
    trexGroup.name = 'trex';

    const dinoSkinMat = new THREE.MeshStandardMaterial({ color: 0x3d7e36, roughness: 0.8 });
    // T-Rex Body
    const body = new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.6, 12), dinoSkinMat);
    body.rotation.x = -Math.PI / 6;
    body.position.set(0, 1.4, -0.3);
    trexGroup.add(body);

    // T-Rex Head
    const headGroup = new THREE.Group();
    headGroup.name = 'trexHead';
    headGroup.position.set(0, 2.7, 0.5);

    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 1.4), dinoSkinMat);
    headGroup.add(snout);

    // Cool Black Aviator Sunglasses
    const glassesMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
    const lensL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.28, 0.05), glassesMat);
    lensL.position.set(-0.25, 0.1, 0.72);
    const lensR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.28, 0.05), glassesMat);
    lensR.position.set(0.25, 0.1, 0.72);
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.04, 0.05), glassesMat);
    bridge.position.set(0, 0.15, 0.72);
    headGroup.add(lensL);
    headGroup.add(lensR);
    headGroup.add(bridge);

    trexGroup.add(headGroup);

    // Tiny Funky Arms
    const armMat = dinoSkinMat;
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5), armMat);
    armL.position.set(-0.55, 1.8, 0.5);
    armL.rotation.x = Math.PI / 4;
    armL.name = 'armL';
    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5), armMat);
    armR.position.set(0.55, 1.8, 0.5);
    armR.rotation.x = Math.PI / 4;
    armR.name = 'armR';
    trexGroup.add(armL);
    trexGroup.add(armR);

    container.add(trexGroup);

    // 4 Neon Prehistoric Palm Pillars
    [-4, 4].forEach((x) => {
      [-4, -9].forEach((z) => {
        const palmTrunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2, 0.3, 5, 8),
          new THREE.MeshStandardMaterial({ color: 0x553311 })
        );
        palmTrunk.position.set(x, 1.2, z);
        container.add(palmTrunk);

        const leafMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
        const crown = new THREE.Mesh(new THREE.ConeGeometry(1.5, 0.8, 6), leafMat);
        crown.position.set(x, 3.8, z);
        container.add(crown);
      });
    });
  },
  update: (delta, elapsed, container) => {
    const ball = container.getObjectByName('discoBall');
    if (ball) {
      ball.rotation.y += delta * 2;
    }

    const trex = container.getObjectByName('trex');
    if (trex) {
      // Funky dino dance moves
      trex.position.y = -1.2 + Math.abs(Math.sin(elapsed * 8)) * 0.4;
      trex.rotation.y = Math.sin(elapsed * 4) * 0.35;

      const head = trex.getObjectByName('trexHead');
      if (head) {
        head.rotation.x = Math.sin(elapsed * 16) * 0.25; // frantic headbanging
      }

      const armL = trex.getObjectByName('armL');
      const armR = trex.getObjectByName('armR');
      if (armL && armR) {
        armL.rotation.z = Math.sin(elapsed * 12) * 0.5;
        armR.rotation.z = -Math.sin(elapsed * 12) * 0.5;
      }
    }
  }
};

/**
 * 4. The Deep Ocean Abyssal Trench
 */
const deepOceanScene: FloorSceneDefinition = {
  id: 'deep_ocean',
  floorNumber: -8500,
  name: 'Floor -8500m: The Midnight Abyssal Trench',
  category: 'surreal',
  description: 'Pitch-black ocean depths where a gigantic glowing bioluminescent whale glides through swarms of jellyfish.',
  duration: 24,
  audioTheme: 'deep_ocean',
  skyColor: 0x010814,
  fogColor: 0x021124,
  fogDensity: 0.035,
  lightColor: 0x33aaff,
  lightIntensity: 1.2,
  init: (container) => {
    // Ocean Floor with Hydrothermal Vents
    const oceanFloorGeo = new THREE.PlaneGeometry(60, 60, 20, 20);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x05131f, roughness: 0.95 });
    const oceanFloor = new THREE.Mesh(oceanFloorGeo, floorMat);
    oceanFloor.rotation.x = -Math.PI / 2;
    oceanFloor.position.set(0, -1.3, -10);
    container.add(oceanFloor);

    // Glowing Jellyfish Floating Swarm
    const jellyGroup = new THREE.Group();
    jellyGroup.name = 'jellyfishSwarm';
    for (let j = 0; j < 14; j++) {
      const jelly = new THREE.Group();
      const capMat = new THREE.MeshStandardMaterial({
        color: j % 2 === 0 ? 0x00ffff : 0xff33cc,
        emissive: j % 2 === 0 ? 0x0088bb : 0xaa1188,
        roughness: 0.3,
        transparent: true,
        opacity: 0.8
      });
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2), capMat);
      cap.rotation.x = Math.PI;
      jelly.add(cap);

      // Tentacles
      for (let t = 0; t < 4; t++) {
        const tentacle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.005, 0.8), capMat);
        tentacle.position.set((Math.random() - 0.5) * 0.25, -0.4, (Math.random() - 0.5) * 0.25);
        jelly.add(tentacle);
      }

      jelly.position.set((Math.random() - 0.5) * 12, (Math.random() * 4) - 0.5, -4 - Math.random() * 10);
      jellyGroup.add(jelly);
    }
    container.add(jellyGroup);

    // Giant Bioluminescent Whale
    const whaleGroup = new THREE.Group();
    whaleGroup.name = 'giantWhale';
    whaleGroup.position.set(-18, 1.5, -9);

    const whaleSkinMat = new THREE.MeshStandardMaterial({
      color: 0x0f2b46,
      emissive: 0x074466,
      roughness: 0.5
    });
    // Streamlined body
    const bodyGeo = new THREE.ConeGeometry(1.8, 9, 16);
    const body = new THREE.Mesh(bodyGeo, whaleSkinMat);
    body.rotation.z = Math.PI / 2;
    whaleGroup.add(body);

    // Whale Tail Flukes
    const tailFluke = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.8, 1.2), whaleSkinMat);
    tailFluke.position.set(-4.8, 0, 0);
    tailFluke.name = 'whaleTail';
    whaleGroup.add(tailFluke);

    // Glowing Bioluminescent Belly Stripes
    const stripeGeo = new THREE.CylinderGeometry(1.82, 1.82, 0.2, 16);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0x44eeff });
    for (let s = 0; s < 3; s++) {
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.rotation.z = Math.PI / 2;
      stripe.position.set(1.5 - s * 1.5, 0, 0);
      whaleGroup.add(stripe);
    }

    container.add(whaleGroup);
  },
  update: (delta, elapsed, container) => {
    // Whale swims majestically across the door view
    const whale = container.getObjectByName('giantWhale');
    if (whale) {
      whale.position.x += delta * 2.2;
      whale.position.y = 1.2 + Math.sin(elapsed * 0.8) * 0.6;
      if (whale.position.x > 22) {
        whale.position.x = -22;
      }

      const tail = whale.getObjectByName('whaleTail');
      if (tail) {
        tail.rotation.y = Math.sin(elapsed * 3) * 0.4;
      }
    }

    // Jellyfish bobbing
    const jellySwarm = container.getObjectByName('jellyfishSwarm');
    if (jellySwarm) {
      jellySwarm.children.forEach((jelly, i) => {
        jelly.position.y += Math.sin(elapsed * 2 + i) * 0.008;
      });
    }
  }
};

/**
 * 5. Liminal Backrooms / Horror Floor
 */
const backroomsScene: FloorSceneDefinition = {
  id: 'backrooms',
  floorNumber: -13,
  name: 'Floor -13: Non-Euclidean Backrooms',
  category: 'horror',
  description: 'Infinite mono-yellow wallpaper, buzzing flickering fluorescent lights, and a shadowy watcher in the distance.',
  duration: 18,
  audioTheme: 'backrooms',
  skyColor: 0x111105,
  fogColor: 0xd6c67a,
  fogDensity: 0.045,
  lightColor: 0xfff3a8,
  lightIntensity: 1.0,
  init: (container) => {
    // Moist, dirty carpet floor
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x7c7348, roughness: 0.95 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -1.3, -8);
    container.add(floor);

    // Ceiling with recessed acoustic panels
    const ceilGeo = new THREE.PlaneGeometry(30, 30);
    const ceilMat = new THREE.MeshStandardMaterial({ color: 0x999478 });
    const ceil = new THREE.Mesh(ceilGeo, ceilMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, 3.8, -8);
    container.add(ceil);

    // Yellow Wallpaper Walls creating an eerie maze corridor
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xc4b76a, roughness: 0.85 });
    const corridorWalls = [
      { x: -3.5, z: -8, w: 0.4, h: 5.1, d: 16 },
      { x: 3.5, z: -8, w: 0.4, h: 5.1, d: 16 },
      { x: 0, z: -15, w: 6.6, h: 5.1, d: 0.4 },
    ];
    corridorWalls.forEach((w) => {
      const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(w.w, w.h, w.d), wallMat);
      wallMesh.position.set(w.x, 1.2, w.z);
      container.add(wallMesh);
    });

    // Flickering Overhead Fluorescent Tube
    const tubeGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.2);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0xffffee });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.rotation.z = Math.PI / 2;
    tube.position.set(0, 3.7, -6);
    tube.name = 'tubeLight';
    container.add(tube);

    // Creepy Tall Shadow Entity peeking from around corner
    const shadowGroup = new THREE.Group();
    shadowGroup.position.set(2.4, -1.2, -12);
    shadowGroup.name = 'shadowEntity';

    const entityMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
    // Slender body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 3.2, 12), entityMat);
    body.position.y = 1.6;
    shadowGroup.add(body);

    // Head with two glowing pinprick red eyes
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), entityMat);
    head.position.y = 3.3;
    shadowGroup.add(head);

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0022 });
    const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), eyeMat);
    eye1.position.set(-0.08, 3.3, 0.22);
    const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), eyeMat);
    eye2.position.set(0.08, 3.3, 0.22);
    shadowGroup.add(eye1);
    shadowGroup.add(eye2);

    // Slender arm slowly waving hello
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4), entityMat);
    arm.position.set(-0.4, 2.4, 0);
    arm.name = 'wavingArm';
    shadowGroup.add(arm);

    container.add(shadowGroup);
  },
  update: (delta, elapsed, container) => {
    // Fluorescent tube flickering
    const tube = container.getObjectByName('tubeLight');
    if (tube) {
      const flicker = Math.sin(elapsed * 45) > 0.3 ? 1 : 0.2;
      tube.scale.set(flicker, flicker, flicker);
    }

    // Shadow entity peeking and slowly waving
    const shadow = container.getObjectByName('shadowEntity');
    if (shadow) {
      shadow.position.x = 2.4 + Math.sin(elapsed * 1.5) * 0.3; // leaning in and out
      const arm = shadow.getObjectByName('wavingArm');
      if (arm) {
        arm.rotation.z = -Math.PI / 4 + Math.sin(elapsed * 4) * 0.4;
      }
    }
  }
};

/**
 * 6. The Golden Rubber Duck Worship Temple
 */
const duckTempleScene: FloorSceneDefinition = {
  id: 'duck_temple',
  floorNumber: 7,
  name: 'Floor 7: Sanctum of the Supreme Bath Duck',
  category: 'absurd',
  description: 'A holy marble pantheon where dozens of tiny rubber ducks worship a monumental golden duck deity.',
  duration: 22,
  audioTheme: 'duck_temple',
  skyColor: 0xfff0aa,
  fogColor: 0xffebaa,
  fogDensity: 0.02,
  lightColor: 0xffea88,
  lightIntensity: 1.8,
  init: (container) => {
    // White Greek Marble floor
    const floorGeo = new THREE.PlaneGeometry(40, 40);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xeeeef5, roughness: 0.2 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -1.3, -10);
    container.add(floor);

    // Marble Pillars
    [-4, 4].forEach((x) => {
      [-4, -8, -12].forEach((z) => {
        const pillar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.4, 0.45, 6, 16),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
        );
        pillar.position.set(x, 1.7, z);
        container.add(pillar);
      });
    });

    // Altar pedestal
    const altar = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2.2, 0.8, 24),
      new THREE.MeshStandardMaterial({ color: 0xddccaa, roughness: 0.4 })
    );
    altar.position.set(0, -0.9, -8);
    container.add(altar);

    // Colossal Golden Rubber Duck
    const giantDuck = createDuckMesh(1.6, 0xffd700, true);
    giantDuck.position.set(0, -0.5, -8);
    giantDuck.name = 'goldenDuck';
    container.add(giantDuck);

    // Worshipping Mini Ducks array
    const worshippers = new THREE.Group();
    worshippers.name = 'worshippers';
    for (let i = 0; i < 12; i++) {
      const miniDuck = createDuckMesh(0.35, 0xffcc00, false);
      const angle = (i / 12) * Math.PI - Math.PI / 2;
      miniDuck.position.set(Math.cos(angle) * 3.2, -1.2, -8 + Math.sin(angle) * 2.2);
      miniDuck.rotation.y = -angle + Math.PI / 2;
      worshippers.add(miniDuck);
    }
    container.add(worshippers);
  },
  update: (delta, elapsed, container) => {
    const giantDuck = container.getObjectByName('goldenDuck');
    if (giantDuck) {
      giantDuck.position.y = -0.5 + Math.sin(elapsed * 2) * 0.15; // divine levitation
      giantDuck.rotation.y += delta * 0.4;
    }

    // Mini worshipping ducks bowing up and down in unison
    const worshippers = container.getObjectByName('worshippers');
    if (worshippers) {
      worshippers.children.forEach((duck, idx) => {
        duck.rotation.x = Math.abs(Math.sin(elapsed * 4 + idx * 0.2)) * 0.45; // bowing prostration
      });
    }
  }
};

function createDuckMesh(scale: number, colorHex: number, isGold: boolean): THREE.Group {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: colorHex,
    metalness: isGold ? 0.85 : 0.1,
    roughness: isGold ? 0.15 : 0.4
  });

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(scale, 16, 16), mat);
  body.scale.set(1, 0.8, 1.2);
  body.position.y = scale * 0.8;
  group.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(scale * 0.6, 16, 16), mat);
  head.position.set(0, scale * 1.5, scale * 0.6);
  group.add(head);

  // Bill (Orange Beak)
  const billMat = new THREE.MeshStandardMaterial({ color: 0xff6600, roughness: 0.4 });
  const bill = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.4, scale * 0.15, scale * 0.45), billMat);
  bill.position.set(0, scale * 1.42, scale * 1.15);
  group.add(bill);

  return group;
}

/**
 * 7. Cyberpunk 2099 Flying Highway
 */
const cyberpunkScene: FloorSceneDefinition = {
  id: 'cyberpunk',
  floorNumber: 2099,
  name: 'Floor 2099: Neo-Tokyo Airway 4B',
  category: 'sci-fi',
  description: 'A neon-drenched futuristic megacity with flying hovercars zooming past right outside the elevator doors.',
  duration: 20,
  audioTheme: 'synthwave',
  skyColor: 0x050510,
  fogColor: 0x110822,
  fogDensity: 0.02,
  lightColor: 0x00ffff,
  lightIntensity: 1.6,
  init: (container) => {
    // Distant Neon Skyscrapers
    const buildingMat = new THREE.MeshStandardMaterial({ color: 0x080816, roughness: 0.8 });
    for (let b = 0; b < 16; b++) {
      const h = 15 + Math.random() * 25;
      const bMesh = new THREE.Mesh(new THREE.BoxGeometry(4, h, 4), buildingMat);
      bMesh.position.set((b % 4 - 1.5) * 8 + (Math.random() - 0.5) * 2, h / 2 - 8, -16 - Math.floor(b / 4) * 8);
      container.add(bMesh);

      // Neon window strips
      const stripMat = new THREE.MeshBasicMaterial({ color: b % 2 === 0 ? 0xff0077 : 0x00e5ff });
      const strip = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.3, 4.1), stripMat);
      strip.position.set(bMesh.position.x, bMesh.position.y + (Math.random() - 0.5) * 6, bMesh.position.z);
      container.add(strip);
    }

    // Flying Hovercars Group
    const carsGroup = new THREE.Group();
    carsGroup.name = 'hovercars';
    const carColors = [0xff0055, 0x00ffff, 0xffff00, 0x9900ff];

    for (let c = 0; c < 5; c++) {
      const car = new THREE.Group();
      const carBody = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.45, 3.2),
        new THREE.MeshStandardMaterial({ color: carColors[c % carColors.length], metalness: 0.8, roughness: 0.2 })
      );
      car.add(carBody);

      // Glowing Trail Thrusters
      const thruster = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
      thruster.rotation.x = Math.PI / 2;
      thruster.position.set(0, 0, -1.6);
      car.add(thruster);

      car.position.set((c - 2) * 4, (c % 3) * 1.5, -6 - c * 2.5);
      car.userData = { speed: 12 + c * 3, lane: c };
      carsGroup.add(car);
    }
    container.add(carsGroup);
  },
  update: (delta, elapsed, container) => {
    const cars = container.getObjectByName('hovercars');
    if (cars) {
      cars.children.forEach((car) => {
        car.position.x += delta * car.userData.speed;
        if (car.position.x > 25) {
          car.position.x = -25;
        }
        car.position.y += Math.sin(elapsed * 3 + car.userData.lane) * 0.01;
      });
    }
  }
};

/**
 * 8. Zero-G Pizza & Cosmic Food Dimension
 */
const foodVoidScene: FloorSceneDefinition = {
  id: 'food_void',
  floorNumber: 314,
  name: 'Floor π: The Zero-G Fast Food Nebula',
  category: 'absurd',
  description: 'A deep space vortex where giant pepperoni pizzas, cheeseburgers, and French fries drift weightlessly.',
  duration: 22,
  audioTheme: 'space_food',
  skyColor: 0x0a001a,
  fogColor: 0x1f0b3b,
  fogDensity: 0.015,
  lightColor: 0xffaa44,
  lightIntensity: 1.6,
  init: (container) => {
    const foodGroup = new THREE.Group();
    foodGroup.name = 'floatingFoods';

    // Giant Pizza
    const pizzaGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.15, 24);
    const pizzaMat = new THREE.MeshStandardMaterial({ color: 0xee9922, roughness: 0.8 });
    const pizza = new THREE.Mesh(pizzaGeo, pizzaMat);
    pizza.position.set(-2.5, 1.2, -6);
    // Pepperonis
    for (let p = 0; p < 8; p++) {
      const pep = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.04, 12), new THREE.MeshStandardMaterial({ color: 0xaa1111 }));
      const ang = (p / 8) * Math.PI * 2;
      pep.position.set(Math.cos(ang) * 1.4, 0.09, Math.sin(ang) * 1.4);
      pizza.add(pep);
    }
    foodGroup.add(pizza);

    // Giant Cheeseburger
    const burgerGroup = new THREE.Group();
    burgerGroup.position.set(2.8, 0.5, -7.5);
    const bunMat = new THREE.MeshStandardMaterial({ color: 0xd49b4b, roughness: 0.7 });
    const pattyMat = new THREE.MeshStandardMaterial({ color: 0x4a2a18, roughness: 0.9 });
    const cheeseMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });

    const topBun = new THREE.Mesh(new THREE.SphereGeometry(1.4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), bunMat);
    topBun.position.y = 0.5;
    const patty = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.4, 16), pattyMat);
    const cheese = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.05, 2.2), cheeseMat);
    cheese.rotation.y = Math.PI / 4;
    cheese.position.y = 0.25;
    const bottomBun = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.3, 16), bunMat);
    bottomBun.position.y = -0.3;

    burgerGroup.add(topBun);
    burgerGroup.add(cheese);
    burgerGroup.add(patty);
    burgerGroup.add(bottomBun);
    foodGroup.add(burgerGroup);

    // Flying French Fries in orbit
    for (let f = 0; f < 10; f++) {
      const fry = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 1.2, 0.18),
        new THREE.MeshStandardMaterial({ color: 0xffd000, roughness: 0.5 })
      );
      fry.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 4 + 1, -5 - Math.random() * 5);
      fry.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      foodGroup.add(fry);
    }

    container.add(foodGroup);
  },
  update: (delta, elapsed, container) => {
    const foodGroup = container.getObjectByName('floatingFoods');
    if (foodGroup) {
      foodGroup.children.forEach((item, idx) => {
        item.rotation.x += delta * (0.3 + (idx % 3) * 0.2);
        item.rotation.y += delta * (0.4 + (idx % 2) * 0.2);
        item.position.y += Math.sin(elapsed * 2 + idx) * 0.008;
      });
    }
  }
};

/**
 * 9. Medieval Knight on Giant Garden Snail
 */
const knightSnailScene: FloorSceneDefinition = {
  id: 'knight_snail',
  floorNumber: 1340,
  name: 'Floor 1340: Slow-Motion Jousting Arena',
  category: 'comedic',
  description: 'A cobblestone courtyard where a valiant knight in shining steel armor majestically rides an adorable giant snail.',
  duration: 24,
  audioTheme: 'medieval_fanfare',
  skyColor: 0x87ceeb,
  fogColor: 0xb0e0e6,
  fogDensity: 0.018,
  lightColor: 0xfffaf0,
  lightIntensity: 1.5,
  init: (container) => {
    // Castle Cobblestone Courtyard
    const groundGeo = new THREE.PlaneGeometry(40, 40);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.8 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -1.3, -8);
    container.add(ground);

    // Snail & Knight Mount
    const mountGroup = new THREE.Group();
    mountGroup.name = 'snailMount';
    mountGroup.position.set(-8, -1.2, -6.5);

    // Giant Snail Shell (Swirly Brown Cone/Torus)
    const shellMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.6 });
    const shell = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.65, 12, 24), shellMat);
    shell.rotation.y = Math.PI / 2;
    shell.position.set(0, 1.4, 0);
    mountGroup.add(shell);

    // Snail Soft Body
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xc8c088, roughness: 0.3 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, 3.8, 12), bodyMat);
    body.rotation.z = Math.PI / 2;
    body.position.set(0.6, 0.4, 0);
    mountGroup.add(body);

    // Wobbly Eye Stalks
    [-0.3, 0.3].forEach((z, i) => {
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2), bodyMat);
      stalk.position.set(2.4, 1.2, z);
      stalk.name = `eyeStalk_${i}`;
      const eyeOrb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), new THREE.MeshBasicMaterial({ color: 0x111111 }));
      eyeOrb.position.y = 0.6;
      stalk.add(eyeOrb);
      mountGroup.add(stalk);
    });

    // Knight in Armor sitting on the shell
    const armorMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.9, roughness: 0.2 });
    const knight = new THREE.Group();
    knight.position.set(0, 2.5, 0);

    // Knight Torso
    const knightBody = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.3, 0.9, 8), armorMat);
    knight.add(knightBody);

    // Knight Helmet with Plume
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), armorMat);
    helmet.position.y = 0.7;
    const plume = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 6), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    plume.position.set(0, 1.0, -0.1);
    plume.rotation.x = -Math.PI / 4;
    helmet.add(plume);
    knight.add(helmet);

    // Long Jousting Lance
    const lance = new THREE.Mesh(new THREE.ConeGeometry(0.08, 3.8, 8), new THREE.MeshStandardMaterial({ color: 0xeecc44 }));
    lance.rotation.z = -Math.PI / 2.6;
    lance.position.set(1.5, 0.4, 0.4);
    knight.add(lance);

    mountGroup.add(knight);
    container.add(mountGroup);
  },
  update: (delta, elapsed, container) => {
    const mount = container.getObjectByName('snailMount');
    if (mount) {
      // Extremely slow, determined snail crawl across the doorway
      mount.position.x += delta * 0.75;
      if (mount.position.x > 8) {
        mount.position.x = -8;
      }

      // Snail body compression & expansion crawl motion
      mount.scale.x = 1 + Math.sin(elapsed * 4) * 0.1;

      // Wobbly eye stalks
      [0, 1].forEach((i) => {
        const stalk = mount.getObjectByName(`eyeStalk_${i}`);
        if (stalk) {
          stalk.rotation.z = Math.sin(elapsed * 3 + i) * 0.25;
        }
      });
    }
  }
};

/**
 * 10. The Office of Staring Corporate Clones
 */
const officeClonesScene: FloorSceneDefinition = {
  id: 'office_clones',
  floorNumber: 99,
  name: 'Floor 99: Department of Redundancy Department',
  category: 'comedic',
  description: 'An endless beige corporate office where 8 identical clones all swivel their heads to stare into the elevator, then break into dance.',
  duration: 21,
  audioTheme: 'office_chime',
  skyColor: 0xcccccc,
  fogColor: 0xd9d9d9,
  fogDensity: 0.025,
  lightColor: 0xffffff,
  lightIntensity: 1.4,
  init: (container) => {
    // Office Grey Carpet
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x60666d, roughness: 0.9 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -1.3, -8);
    container.add(floor);

    // Cubicle Desks & Clones
    const cubicles = new THREE.Group();
    cubicles.name = 'cubicles';

    const deskMat = new THREE.MeshStandardMaterial({ color: 0xdcd8cf, roughness: 0.6 });
    const suitMat = new THREE.MeshStandardMaterial({ color: 0x222c36 });
    const headMat = new THREE.MeshStandardMaterial({ color: 0xf5c296 });

    const clonePositions = [
      { x: -2.8, z: -5.5 },
      { x: 0, z: -5.5 },
      { x: 2.8, z: -5.5 },
      { x: -2.8, z: -9 },
      { x: 0, z: -9 },
      { x: 2.8, z: -9 },
    ];

    clonePositions.forEach((cp, idx) => {
      const cubicle = new THREE.Group();
      cubicle.position.set(cp.x, -1.2, cp.z);

      // Desk
      const desk = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 1.0), deskMat);
      desk.position.set(0, 0.4, 0);
      cubicle.add(desk);

      // Computer Monitor
      const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.1), new THREE.MeshBasicMaterial({ color: 0x33ddff }));
      monitor.position.set(0, 1.05, -0.2);
      cubicle.add(monitor);

      // Corporate Clone
      const clone = new THREE.Group();
      clone.position.set(0, 0, 0.5);
      clone.name = `clone_${idx}`;

      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.28, 0.9), suitMat);
      torso.position.y = 0.8;
      clone.add(torso);

      // Swiveling Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), headMat);
      head.position.y = 1.45;
      head.name = 'cloneHead';
      clone.add(head);

      cubicle.add(clone);
      cubicles.add(cubicle);
    });

    container.add(cubicles);
  },
  update: (delta, elapsed, container) => {
    const cubicles = container.getObjectByName('cubicles');
    if (cubicles) {
      cubicles.children.forEach((cubicle, idx) => {
        const clone = cubicle.getObjectByName(`clone_${idx}`);
        if (clone) {
          const head = clone.getObjectByName('cloneHead');
          if (head) {
            // First 5 seconds: heads turn 180 deg to lock eyes with the player
            // Then: all clones start bouncing in synchronized corporate Macarena
            if (elapsed < 6) {
              const turnProgress = Math.min(1, elapsed / 3);
              head.rotation.y = turnProgress * Math.PI;
            } else {
              head.rotation.y = Math.PI + Math.sin(elapsed * 8) * 0.3;
              clone.position.y = Math.abs(Math.sin(elapsed * 10)) * 0.35;
              clone.rotation.z = Math.sin(elapsed * 6) * 0.15;
            }
          }
        }
      });
    }
  }
};

/**
 * 11. UFO Cow Abduction
 */
const ufoAbductionScene: FloorSceneDefinition = {
  id: 'ufo_abduction',
  floorNumber: 51,
  name: 'Floor 51: Sector 4 Pastoral Anomaly',
  category: 'comedic',
  description: 'A midnight pasture where a flying saucer hovers in a neon tractor beam, slowly lifting a puzzled cow.',
  duration: 23,
  audioTheme: 'synthwave',
  skyColor: 0x020510,
  fogColor: 0x071526,
  fogDensity: 0.02,
  lightColor: 0x00ffcc,
  lightIntensity: 1.7,
  init: (container) => {
    // Night Pasture Grass
    const grassGeo = new THREE.PlaneGeometry(40, 40);
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x113311, roughness: 0.9 });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.rotation.x = -Math.PI / 2;
    grass.position.set(0, -1.3, -8);
    container.add(grass);

    // Glowing Flying Saucer (UFO)
    const ufoGroup = new THREE.Group();
    ufoGroup.name = 'ufo';
    ufoGroup.position.set(0, 4.2, -7.5);

    const discMat = new THREE.MeshStandardMaterial({ color: 0x9999aa, metalness: 0.9, roughness: 0.15 });
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.2, 0.4, 24), discMat);
    const domeMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
    dome.position.y = 0.2;
    ufoGroup.add(disc);
    ufoGroup.add(dome);

    // Rotating perimeter lights
    for (let l = 0; l < 8; l++) {
      const lightOrb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshBasicMaterial({ color: l % 2 === 0 ? 0xff00ff : 0x00ffaa }));
      const a = (l / 8) * Math.PI * 2;
      lightOrb.position.set(Math.cos(a) * 3.1, 0, Math.sin(a) * 3.1);
      ufoGroup.add(lightOrb);
    }
    container.add(ufoGroup);

    // Tractor Beam Cone
    const beamGeo = new THREE.ConeGeometry(2.5, 5.5, 24, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(0, 1.5, -7.5);
    beam.name = 'tractorBeam';
    container.add(beam);

    // The Floating Abducted Cow
    const cowGroup = new THREE.Group();
    cowGroup.name = 'abductedCow';
    cowGroup.position.set(0, -0.6, -7.5);

    const cowMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.8 });
    const cowBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 2.2), cowMat);
    cowGroup.add(cowBody);

    // Spots (Black)
    const spotMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const spot = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), spotMat);
    spot.position.set(0.5, 0.2, 0.3);
    cowGroup.add(spot);

    // Cow Head & Cute Horns
    const cowHead = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.9), cowMat);
    cowHead.position.set(0, 0.6, 1.3);
    cowGroup.add(cowHead);

    const hornMat = new THREE.MeshStandardMaterial({ color: 0xffeeaa });
    [-0.35, 0.35].forEach((hx) => {
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.4, 6), hornMat);
      horn.position.set(hx, 1.1, 1.2);
      cowGroup.add(horn);
    });

    container.add(cowGroup);
  },
  update: (delta, elapsed, container) => {
    const ufo = container.getObjectByName('ufo');
    if (ufo) {
      ufo.rotation.y += delta * 1.5;
      ufo.position.y = 4.2 + Math.sin(elapsed * 2) * 0.25;
    }

    const cow = container.getObjectByName('abductedCow');
    if (cow) {
      // Gentle floating ascent and spin inside the tractor beam
      cow.position.y = 0.2 + Math.sin(elapsed * 1.5) * 1.4;
      cow.rotation.y += delta * 0.8;
      cow.rotation.x = Math.sin(elapsed * 2) * 0.2;
    }
  }
};

/**
 * 12. Retro 80s Synthwave Grid
 */
const synthwaveScene: FloorSceneDefinition = {
  id: 'synthwave',
  floorNumber: 1984,
  name: 'Floor 1984: Neon Outrun Horizon',
  category: 'nostalgic',
  description: 'Endless rolling glowing wireframe terrain, a giant neon grid sunset, and a retro cruising sports car.',
  duration: 21,
  audioTheme: 'synthwave',
  skyColor: 0x100020,
  fogColor: 0x2b044d,
  fogDensity: 0.02,
  lightColor: 0xff00bb,
  lightIntensity: 1.8,
  init: (container) => {
    // Glowing Wireframe Grid Plane
    const gridGeo = new THREE.PlaneGeometry(60, 60, 30, 30);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.set(0, -1.3, -15);
    grid.name = 'synthGrid';
    container.add(grid);

    // Giant 80s Neon Sunset Sun
    const sunGeo = new THREE.CircleGeometry(8, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xff0066 });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(0, 6, -30);
    container.add(sun);

    // Retro Neon Wireframe Delorean / Sports Car
    const carGroup = new THREE.Group();
    carGroup.name = 'retroCar';
    carGroup.position.set(0, -0.6, -7);

    const carMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.9, roughness: 0.1 });
    const carBody = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, 4.4), carMat);
    carGroup.add(carBody);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 2.2), new THREE.MeshBasicMaterial({ color: 0x110022 }));
    cabin.position.set(0, 0.5, -0.3);
    carGroup.add(cabin);

    // Neon Cyan Underglow
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const underglow = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 4.6), glowMat);
    underglow.rotation.x = -Math.PI / 2;
    underglow.position.y = -0.32;
    carGroup.add(underglow);

    container.add(carGroup);
  },
  update: (delta, elapsed, container) => {
    const grid = container.getObjectByName('synthGrid');
    if (grid) {
      // Animate grid moving forward to give the illusion of high speed
      grid.position.z = -15 + ((elapsed * 12) % 2);
    }

    const car = container.getObjectByName('retroCar');
    if (car) {
      car.position.y = -0.6 + Math.sin(elapsed * 12) * 0.04;
      car.rotation.z = Math.sin(elapsed * 3) * 0.05;
    }
  }
};

import { EXTENDED_FLOOR_SCENES } from './extendedFloorScenes';

export const FLOOR_SCENES: FloorSceneDefinition[] = [
  dancingCactusScene,
  moonPokerScene,
  discoTrexScene,
  deepOceanScene,
  backroomsScene,
  duckTempleScene,
  cyberpunkScene,
  foodVoidScene,
  knightSnailScene,
  officeClonesScene,
  ufoAbductionScene,
  synthwaveScene,
  ...EXTENDED_FLOOR_SCENES,
];

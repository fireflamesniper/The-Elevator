import * as THREE from 'three';
import { FloorSceneDefinition } from './sceneTypes';

/**
 * 1. Comedic: Emperor Penguin Espresso Meltdown (Floor 99)
 * An Antarctic cafe with an overdressed Emperor Penguin barista wildly operating
 * a violently shaking brass steampunk espresso machine spraying steam clouds.
 */
const penguinBaristaScene: FloorSceneDefinition = {
  id: 'penguin_barista',
  floorNumber: 99,
  name: 'Floor 99: Emperor Penguin Espresso Meltdown',
  category: 'comedic',
  description: 'An Antarctic cafe where an overdressed penguin barista in tiny gold spectacles panics as a steampunk espresso machine explodes with glowing steam and bouncing coffee beans.',
  duration: 22,
  audioTheme: 'penguin_cafe',
  skyColor: 0x93c5fd,
  fogColor: 0xbfdbfe,
  fogDensity: 0.025,
  lightColor: 0xffedd5,
  lightIntensity: 1.6,
  init: (container) => {
    // Snowy Floor & Ice Cafe Tiles
    const floorGeo = new THREE.PlaneGeometry(50, 50, 16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      roughness: 0.4,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -1.3, -10);
    container.add(floor);

    // Rustic Wood Cafe Counter
    const counterGeo = new THREE.BoxGeometry(7, 1.2, 1.6);
    const counterMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 });
    const counter = new THREE.Mesh(counterGeo, counterMat);
    counter.position.set(0, -0.7, -4.8);
    container.add(counter);

    // Giant Steampunk Espresso Machine
    const machineGroup = new THREE.Group();
    machineGroup.position.set(0, -0.1, -4.8);
    machineGroup.name = 'espressoMachine';

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.2 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });

    const machineBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 1.1), bodyMat);
    machineGroup.add(machineBody);

    // Pressure gauges & dials
    for (let i = -0.7; i <= 0.7; i += 0.7) {
      const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16), chromeMat);
      gauge.rotation.x = Math.PI / 2;
      gauge.position.set(i, 0.35, 0.58);
      machineGroup.add(gauge);
    }

    // Two big steaming group heads & levers
    for (let x = -0.5; x <= 0.5; x += 1.0) {
      const portafilter = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.3, 16), chromeMat);
      portafilter.position.set(x, -0.35, 0.6);
      machineGroup.add(portafilter);

      // Steam pipe chimney
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 12), bodyMat);
      pipe.position.set(x, 0.9, 0);
      machineGroup.add(pipe);
    }

    container.add(machineGroup);

    // Panicking Emperor Penguin Barista
    const penguinGroup = new THREE.Group();
    penguinGroup.position.set(0, -0.7, -6.4);
    penguinGroup.name = 'baristaPenguin';

    const pBlack = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const pWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const pOrange = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3 });

    // Body
    const pBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.55, 1.1, 16, 16), pBlack);
    pBody.position.y = 1.0;
    penguinGroup.add(pBody);

    // White Belly
    const pBelly = new THREE.Mesh(new THREE.CapsuleGeometry(0.45, 0.9, 12, 12), pWhite);
    pBelly.position.set(0, 0.95, 0.18);
    penguinGroup.add(pBelly);

    // Head
    const pHead = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), pBlack);
    pHead.position.set(0, 1.8, 0.05);
    penguinGroup.add(pHead);

    // Beak
    const pBeak = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 12), pOrange);
    pBeak.rotation.x = Math.PI / 2;
    pBeak.position.set(0, 1.75, 0.5);
    penguinGroup.add(pBeak);

    // Tiny Gold Spectacles
    const glassesMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9 });
    const glassL = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.015, 8, 16), glassesMat);
    glassL.position.set(-0.15, 1.85, 0.4);
    penguinGroup.add(glassL);
    const glassR = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.015, 8, 16), glassesMat);
    glassR.position.set(0.15, 1.85, 0.4);
    penguinGroup.add(glassR);

    // Barista Apron
    const apronMat = new THREE.MeshStandardMaterial({ color: 0x047857 });
    const apron = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.1), apronMat);
    apron.position.set(0, 0.9, 0.52);
    penguinGroup.add(apron);

    // Flippers (Arms waving in panic)
    const flipperGeo = new THREE.BoxGeometry(0.15, 0.9, 0.3);
    const leftArm = new THREE.Mesh(flipperGeo, pBlack);
    leftArm.position.set(-0.65, 1.1, 0);
    leftArm.name = 'leftArm';
    penguinGroup.add(leftArm);

    const rightArm = new THREE.Mesh(flipperGeo, pBlack);
    rightArm.position.set(0.65, 1.1, 0);
    rightArm.name = 'rightArm';
    penguinGroup.add(rightArm);

    container.add(penguinGroup);

    // Floating Steam Cloud Particles
    const steamGroup = new THREE.Group();
    steamGroup.name = 'steamClouds';
    const steamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    for (let i = 0; i < 16; i++) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(0.2 + Math.random() * 0.25, 8, 8), steamMat);
      puff.position.set((Math.random() - 0.5) * 2, 0.5 + Math.random() * 2, -4.8 + (Math.random() - 0.5) * 0.8);
      steamGroup.add(puff);
    }
    container.add(steamGroup);
  },
  update: (delta, elapsed, container) => {
    // Violent machine rumble
    const machine = container.getObjectByName('espressoMachine');
    if (machine) {
      machine.position.y = -0.1 + Math.sin(elapsed * 45) * 0.03;
      machine.rotation.z = Math.cos(elapsed * 35) * 0.02;
    }

    // Panicking penguin flipper flails
    const penguin = container.getObjectByName('baristaPenguin');
    if (penguin) {
      penguin.position.y = -0.7 + Math.abs(Math.sin(elapsed * 12)) * 0.15;
      penguin.rotation.y = Math.sin(elapsed * 8) * 0.3;
      const leftArm = penguin.getObjectByName('leftArm');
      const rightArm = penguin.getObjectByName('rightArm');
      if (leftArm && rightArm) {
        leftArm.rotation.z = 1.2 + Math.sin(elapsed * 25) * 0.6;
        rightArm.rotation.z = -1.2 - Math.cos(elapsed * 25) * 0.6;
      }
    }

    // Steam clouds rising
    const steam = container.getObjectByName('steamClouds');
    if (steam) {
      steam.children.forEach((puff, idx) => {
        puff.position.y += delta * (0.8 + idx * 0.05);
        puff.scale.addScalar(delta * 0.4);
        if (puff.position.y > 3.0) {
          puff.position.y = 0.6;
          puff.scale.set(1, 1, 1);
        }
      });
    }
  }
};

/**
 * 2. Comedic: Tuxedo Cat Symphony No. 9 (Floor 777)
 * A baroque concert hall where an elite tuxedo cat conductor with a silver baton
 * vigorously directs an orchestra of dressed-up cats playing miniature cellos, violins, and a giant bass drum.
 */
const catOrchestraScene: FloorSceneDefinition = {
  id: 'cat_orchestra',
  floorNumber: 777,
  name: 'Floor 777: Tuxedo Cat Symphony No. 9',
  category: 'comedic',
  description: 'A lavish baroque concert hall where an elite tuxedo cat conductor with a silver baton furiously conducts an orchestra of cats playing tiny violins and a giant tuna-can bass drum.',
  duration: 24,
  audioTheme: 'cat_orchestra',
  skyColor: 0x4a0404,
  fogColor: 0x300202,
  fogDensity: 0.02,
  lightColor: 0xffe4b5,
  lightIntensity: 1.8,
  init: (container) => {
    // Concert Hall Parquet Floor
    const stageGeo = new THREE.PlaneGeometry(30, 20);
    const stageMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.25, metalness: 0.2 });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.rotation.x = -Math.PI / 2;
    stage.position.set(0, -1.3, -8);
    container.add(stage);

    // Red Velvet Stage Curtains
    const velvetMat = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.7 });
    const curtainL = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 8, 16), velvetMat);
    curtainL.position.set(-6, 2, -5);
    container.add(curtainL);

    const curtainR = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 8, 16), velvetMat);
    curtainR.position.set(6, 2, -5);
    container.add(curtainR);

    // Conductor Podium in Center Foreground
    const podium = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 1.4), new THREE.MeshStandardMaterial({ color: 0xb45309 }));
    podium.position.set(0, -1.1, -4.5);
    container.add(podium);

    // Tuxedo Cat Conductor Group
    const conductorGroup = new THREE.Group();
    conductorGroup.position.set(0, -0.9, -4.5);
    conductorGroup.name = 'catConductor';

    const catFur = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
    const whiteFur = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });

    // Cat Body
    const catBody = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 1.0, 16), catFur);
    catBody.position.y = 0.5;
    conductorGroup.add(catBody);

    // White Tuxedo Chest
    const bib = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.6), whiteFur);
    bib.position.set(0, 0.55, 0.36);
    conductorGroup.add(bib);

    // Red Bowtie
    const bowMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
    const bowtie = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 0.08), bowMat);
    bowtie.position.set(0, 0.85, 0.4);
    conductorGroup.add(bowtie);

    // Cat Head
    const catHead = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), catFur);
    catHead.position.set(0, 1.2, 0.1);
    conductorGroup.add(catHead);

    // Cat Ears
    const earGeo = new THREE.ConeGeometry(0.14, 0.28, 8);
    const earL = new THREE.Mesh(earGeo, catFur);
    earL.position.set(-0.2, 1.5, 0.1);
    earL.rotation.z = -0.3;
    conductorGroup.add(earL);

    const earR = new THREE.Mesh(earGeo, catFur);
    earR.position.set(0.2, 1.5, 0.1);
    earR.rotation.z = 0.3;
    conductorGroup.add(earR);

    // Conductor Baton Arm
    const batonArm = new THREE.Group();
    batonArm.position.set(0.4, 0.8, 0.1);
    batonArm.name = 'batonArm';

    const paw = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8), whiteFur);
    paw.rotation.x = Math.PI / 3;
    batonArm.add(paw);

    const baton = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.025, 0.9, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9 }));
    baton.position.set(0, 0.3, 0.4);
    baton.rotation.x = -Math.PI / 4;
    batonArm.add(baton);

    conductorGroup.add(batonArm);
    container.add(conductorGroup);

    // Cat Musicians in Tiered Rows (Violinists, Cellists, giant tuna drum)
    const orchestraGroup = new THREE.Group();
    orchestraGroup.name = 'orchestraCats';

    const positions = [
      { x: -2.2, z: -6.5, type: 'violin' },
      { x: -1.0, z: -7.0, type: 'violin' },
      { x: 1.0, z: -7.0, type: 'cello' },
      { x: 2.2, z: -6.5, type: 'cello' },
      { x: 0, z: -8.5, type: 'tuna_drum' },
    ];

    positions.forEach((pos, i) => {
      const catMusician = new THREE.Group();
      catMusician.position.set(pos.x, -1.3, pos.z);
      catMusician.name = `musician_${i}`;

      const fColor = i % 2 === 0 ? 0xf97316 : 0x64748b; // ginger and grey cats
      const mFur = new THREE.MeshStandardMaterial({ color: fColor, roughness: 0.6 });
      const mBody = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 0.8, 12), mFur);
      mBody.position.y = 0.4;
      catMusician.add(mBody);

      const mHead = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), mFur);
      mHead.position.set(0, 0.95, 0);
      catMusician.add(mHead);

      if (pos.type === 'violin') {
        const violin = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.45, 0.08), new THREE.MeshStandardMaterial({ color: 0x92400e }));
        violin.position.set(0.2, 0.6, 0.25);
        violin.rotation.z = -0.5;
        catMusician.add(violin);
      } else if (pos.type === 'cello') {
        const cello = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.8, 0.15), new THREE.MeshStandardMaterial({ color: 0x78350f }));
        cello.position.set(0, 0.5, 0.35);
        catMusician.add(cello);
      } else if (pos.type === 'tuna_drum') {
        // Giant Tuna Can Bass Drum
        const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.8, 20), new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8 }));
        drum.rotation.x = Math.PI / 2;
        drum.position.set(0, 0.8, 0);
        catMusician.add(drum);
      }

      orchestraGroup.add(catMusician);
    });

    container.add(orchestraGroup);
  },
  update: (delta, elapsed, container) => {
    // Conductor passionate baton conducting
    const conductor = container.getObjectByName('catConductor');
    if (conductor) {
      conductor.rotation.y = Math.sin(elapsed * 4) * 0.25;
      const batonArm = conductor.getObjectByName('batonArm');
      if (batonArm) {
        batonArm.rotation.x = Math.sin(elapsed * 9) * 0.7;
        batonArm.rotation.z = Math.cos(elapsed * 9) * 0.5;
      }
    }

    // Orchestra cats swaying in rhythm
    const orchestra = container.getObjectByName('orchestraCats');
    if (orchestra) {
      orchestra.children.forEach((cat, idx) => {
        cat.rotation.z = Math.sin(elapsed * 6 + idx * 0.8) * 0.15;
        cat.position.y = -1.3 + Math.abs(Math.sin(elapsed * 6 + idx)) * 0.05;
      });
    }
  }
};

/**
 * 3. Horror: Gallery of Twitching Victorian Mannequins (Floor -666)
 * A peeling antique wallpaper hallway lined with tall wooden mannequins that
 * violently snap their heads and creep forward whenever the lights flicker.
 */
const mannequinHallScene: FloorSceneDefinition = {
  id: 'mannequin_hall',
  floorNumber: -666,
  name: 'Floor -666: Gallery of Twitching Mannequins',
  category: 'horror',
  description: 'A dim Victorian corridor lined with tall antique wooden mannequins. When the flickering chandelier buzzes, their porcelain heads snap 90 degrees in eerie synchronization.',
  duration: 20,
  audioTheme: 'mannequin_hall',
  skyColor: 0x050505,
  fogColor: 0x08080a,
  fogDensity: 0.045,
  lightColor: 0xfef08a,
  lightIntensity: 0.7,
  init: (container, mainScene) => {
    // Weathered Creaky Floorboards
    const floorGeo = new THREE.PlaneGeometry(12, 40);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1f1915, roughness: 0.9 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -1.3, -15);
    container.add(floor);

    // Dilapidated Victorian Hallway Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.85 });
    const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 40), wallMat);
    wallL.position.set(-4.5, 0.7, -15);
    container.add(wallL);

    const wallR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4, 40), wallMat);
    wallR.position.set(4.5, 0.7, -15);
    container.add(wallR);

    // Swinging Antique Brass Chandelier
    const chandelierGroup = new THREE.Group();
    chandelierGroup.position.set(0, 1.8, -7);
    chandelierGroup.name = 'chandelier';

    const brassMat = new THREE.MeshStandardMaterial({ color: 0xb45309, metalness: 0.9, roughness: 0.3 });
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2), brassMat);
    chandelierGroup.add(rod);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.05, 8, 20), brassMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.6;
    chandelierGroup.add(ring);

    const candleBulb = new THREE.PointLight(0xffedd5, 1.4, 10);
    candleBulb.position.set(0, -0.7, 0);
    candleBulb.name = 'flickerLight';
    chandelierGroup.add(candleBulb);

    container.add(chandelierGroup);

    // Eerie Wooden Mannequins
    const mannequinGroup = new THREE.Group();
    mannequinGroup.name = 'mannequins';

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x713f12, roughness: 0.6 });
    const porcelainMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.2 });

    const mannequinPositions = [
      { x: -2.2, z: -5.5, rotY: 0.6 },
      { x: 2.2, z: -6.0, rotY: -0.7 },
      { x: -1.8, z: -9.0, rotY: 0.3 },
      { x: 1.9, z: -9.5, rotY: -0.4 },
      { x: 0.0, z: -13.0, rotY: 0.0 }, // Tall menacing one in background
    ];

    mannequinPositions.forEach((pos, idx) => {
      const m = new THREE.Group();
      m.position.set(pos.x, -1.3, pos.z);
      m.rotation.y = pos.rotY;
      m.name = `mannequin_${idx}`;

      // Stand Base
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.08, 16), brassMat);
      m.add(base);

      // Torso
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.22, 1.3, 12), woodMat);
      torso.position.y = 1.0;
      m.add(torso);

      // Neck joint
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 8), brassMat);
      neck.position.y = 1.7;
      m.add(neck);

      // Faceless Porcelain Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), porcelainMat);
      head.position.y = 1.95;
      head.name = 'head';
      m.add(head);

      // Wooden Spindly Arms
      const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9), woodMat);
      armL.position.set(-0.4, 1.1, 0.1);
      armL.rotation.z = 0.3;
      m.add(armL);

      const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9), woodMat);
      armR.position.set(0.4, 1.1, 0.1);
      armR.rotation.z = -0.3;
      m.add(armR);

      mannequinGroup.add(m);
    });

    container.add(mannequinGroup);
  },
  update: (delta, elapsed, container) => {
    // Chandelier swings subtly
    const chandelier = container.getObjectByName('chandelier');
    if (chandelier) {
      chandelier.rotation.z = Math.sin(elapsed * 1.5) * 0.08;
      chandelier.rotation.x = Math.cos(elapsed * 1.2) * 0.05;

      const light = chandelier.getObjectByName('flickerLight') as THREE.PointLight;
      if (light) {
        // Spooky sudden light flickers
        const flicker = Math.random() > 0.08 ? (0.8 + Math.sin(elapsed * 10) * 0.2) : 0.05;
        light.intensity = flicker;
      }
    }

    // Sudden synchronized head twitch snaps
    const mannequins = container.getObjectByName('mannequins');
    if (mannequins) {
      const snapPhase = Math.floor(elapsed * 0.8) % 4;
      mannequins.children.forEach((m, idx) => {
        const head = m.getObjectByName('head');
        if (head) {
          if (snapPhase === 1) {
            head.rotation.y = 1.4; // Jerk to side
          } else if (snapPhase === 2) {
            head.rotation.y = -1.2;
            head.rotation.x = 0.4; // Tilt down menacingly
          } else {
            head.rotation.y = 0;
            head.rotation.x = 0;
          }
        }
      });
    }
  }
};

/**
 * 4. Horror: Infinite 3:33 AM Laundromat (Floor 1313)
 * A surreal liminal green fluorescent 24/7 laundromat with spinning washers,
 * floating spectral bedsheets, and giant glowing red eyes peering from the center dryer drum.
 */
const cursedLaundromatScene: FloorSceneDefinition = {
  id: 'cursed_laundromat',
  floorNumber: 1313,
  name: 'Floor 1313: Infinite 3:33 AM Laundromat',
  category: 'horror',
  description: 'A sickly green fluorescent 24/7 laundromat stretching into infinity. The central commercial dryer violently thumps while a pair of giant glowing red eyes spins in the drum.',
  duration: 21,
  audioTheme: 'cursed_laundromat',
  skyColor: 0x030704,
  fogColor: 0x061a0d,
  fogDensity: 0.04,
  lightColor: 0x86efac,
  lightIntensity: 1.1,
  init: (container) => {
    // Checkerboard Tile Floor
    const floorGeo = new THREE.PlaneGeometry(16, 40);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.2, metalness: 0.3 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -1.3, -15);
    container.add(floor);

    // Rows of Industrial Washers
    const washerMat = new THREE.MeshStandardMaterial({ color: 0xdcfce7, roughness: 0.3, metalness: 0.7 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.1, metalness: 0.9 });

    const washerGroup = new THREE.Group();
    washerGroup.name = 'washers';

    // Left and Right banks of washers
    for (let z = -4; z >= -22; z -= 3.5) {
      [-3.2, 3.2].forEach((x) => {
        const washer = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 1.8), washerMat);
        washer.position.set(x, -0.2, z);

        // Circular Porthole Door
        const door = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.1, 16), glassMat);
        door.rotation.z = Math.PI / 2;
        door.position.set(x < 0 ? 0.85 : -0.85, 0.1, 0);
        washer.add(door);

        washerGroup.add(washer);
      });
    }
    container.add(washerGroup);

    // Central Cursed Dryer (Directly Facing Elevator Doorway)
    const cursedDryer = new THREE.Group();
    cursedDryer.position.set(0, -0.2, -7.5);
    cursedDryer.name = 'cursedDryer';

    const bigDryer = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.6, 2.2), new THREE.MeshStandardMaterial({ color: 0x052e16, metalness: 0.8 }));
    cursedDryer.add(bigDryer);

    // Spinning Drum with Glowing Red Eyes Inside
    const drumGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.15, 24), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    drumGlass.rotation.x = Math.PI / 2;
    drumGlass.position.set(0, 0.1, 1.15);
    cursedDryer.add(drumGlass);

    // Glowing Red Demon Eyes inside drum
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), eyeMat);
    eyeL.position.set(-0.35, 0.15, 1.25);
    cursedDryer.add(eyeL);

    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), eyeMat);
    eyeR.position.set(0.35, 0.15, 1.25);
    cursedDryer.add(eyeR);

    container.add(cursedDryer);

    // Floating Spectral Bedsheet
    const sheetMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.8,
      transparent: true,
      opacity: 0.75,
    });
    const sheet = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.4, 8, 8), sheetMat);
    sheet.position.set(0, 0.8, -5.2);
    sheet.name = 'floatingSheet';
    container.add(sheet);
  },
  update: (delta, elapsed, container) => {
    // Unbalanced heavy thumping of cursed dryer
    const cursedDryer = container.getObjectByName('cursedDryer');
    if (cursedDryer) {
      cursedDryer.position.x = Math.sin(elapsed * 30) * 0.04;
      cursedDryer.position.y = -0.2 + Math.abs(Math.sin(elapsed * 15)) * 0.06;
    }

    // Ghost bedsheet floating and rippling
    const sheet = container.getObjectByName('floatingSheet');
    if (sheet) {
      sheet.position.y = 0.8 + Math.sin(elapsed * 2) * 0.3;
      sheet.position.x = Math.cos(elapsed * 1.5) * 0.4;
      sheet.rotation.z = Math.sin(elapsed * 2) * 0.15;
    }
  }
};

/**
 * 5. Surreal: Origami Sunset Cloud Archipelago (Floor ∞)
 * A tranquil pastel sky of folded paper where giant geometric origami paper cranes
 * circle with flapping wings above floating paper islands with cherry blossom petals.
 */
const origamiWorldScene: FloorSceneDefinition = {
  id: 'origami_world',
  floorNumber: '∞',
  name: 'Floor ∞: Origami Sunset Archipelago',
  category: 'surreal',
  description: 'A serene pastel sunset void above floating folded-paper islands. Colossal geometric origami paper cranes soar gracefully through clouds as cherry blossom petals drift.',
  duration: 25,
  audioTheme: 'origami_dream',
  skyColor: 0xfda4af,
  fogColor: 0xfbcfe8,
  fogDensity: 0.015,
  lightColor: 0xfef08a,
  lightIntensity: 1.7,
  init: (container) => {
    // Low floating fluffy paper sunset clouds
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.9, flatShading: true });
    for (let i = 0; i < 8; i++) {
      const cloud = new THREE.Mesh(new THREE.DodecahedronGeometry(2.5 + Math.random() * 2, 1), cloudMat);
      cloud.position.set((Math.random() - 0.5) * 25, -3 - Math.random() * 2, -12 - Math.random() * 15);
      container.add(cloud);
    }

    // Floating Central Origami Island
    const islandGeo = new THREE.ConeGeometry(5, 4, 6);
    const islandMat = new THREE.MeshStandardMaterial({ color: 0xa7f3d0, flatShading: true, roughness: 0.7 });
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.rotation.x = Math.PI;
    island.position.set(0, -1.8, -8);
    island.name = 'origamiIsland';
    container.add(island);

    // Folded Paper Cherry Blossom Tree on Island
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, flatShading: true });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2.2, 5), trunkMat);
    trunk.position.set(0, 1.1, 0);
    island.add(trunk);

    const foliageMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, flatShading: true, roughness: 0.6 });
    const leaves = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6, 1), foliageMat);
    leaves.position.set(0, 2.4, 0);
    island.add(leaves);

    // Giant Origami Paper Crane in Flight
    const craneGroup = new THREE.Group();
    craneGroup.position.set(0, 2, -9);
    craneGroup.name = 'origamiCrane';

    const paperMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, flatShading: true });

    // Crane Body (faceted pyramid)
    const cBody = new THREE.Mesh(new THREE.ConeGeometry(0.7, 2.2, 4), paperMat);
    cBody.rotation.x = Math.PI / 2;
    craneGroup.add(cBody);

    // Crane Long Folded Neck & Head
    const cNeck = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1.8, 3), paperMat);
    cNeck.position.set(0, 0.7, 1.2);
    cNeck.rotation.x = -Math.PI / 4;
    craneGroup.add(cNeck);

    // Folded Wings
    const wingGeo = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, 0, 0,
      -3.0, 0.5, -0.8,
      -1.2, -0.2, 1.2
    ]);
    wingGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    wingGeo.computeVertexNormals();

    const leftWing = new THREE.Mesh(wingGeo, paperMat);
    leftWing.name = 'craneLeftWing';
    craneGroup.add(leftWing);

    const rightWingGeo = wingGeo.clone();
    rightWingGeo.scale(-1, 1, 1);
    const rightWing = new THREE.Mesh(rightWingGeo, paperMat);
    rightWing.name = 'craneRightWing';
    craneGroup.add(rightWing);

    container.add(craneGroup);

    // Drifting Paper Petals
    const petalsGroup = new THREE.Group();
    petalsGroup.name = 'petals';
    const petalMat = new THREE.MeshBasicMaterial({ color: 0xfbcfe8, side: THREE.DoubleSide });
    for (let i = 0; i < 30; i++) {
      const petal = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.18), petalMat);
      petal.position.set((Math.random() - 0.5) * 10, -1 + Math.random() * 4, -4 - Math.random() * 8);
      petal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      petalsGroup.add(petal);
    }
    container.add(petalsGroup);
  },
  update: (delta, elapsed, container) => {
    // Crane gliding in gentle circle with flapping wings
    const crane = container.getObjectByName('origamiCrane');
    if (crane) {
      crane.position.x = Math.sin(elapsed * 0.8) * 4.5;
      crane.position.z = -9 + Math.cos(elapsed * 0.8) * 3.0;
      crane.rotation.y = elapsed * 0.8 + Math.PI / 2;
      crane.rotation.z = Math.sin(elapsed * 0.8) * 0.2;

      const wingL = crane.getObjectByName('craneLeftWing');
      const wingR = crane.getObjectByName('craneRightWing');
      if (wingL && wingR) {
        const flap = Math.sin(elapsed * 3.5) * 0.4;
        wingL.rotation.z = flap;
        wingR.rotation.z = -flap;
      }
    }

    // Floating island bobbing
    const island = container.getObjectByName('origamiIsland');
    if (island) {
      island.position.y = -1.8 + Math.sin(elapsed * 1.2) * 0.2;
    }

    // Drifting petals
    const petals = container.getObjectByName('petals');
    if (petals) {
      petals.children.forEach((p) => {
        p.position.y -= delta * 0.4;
        p.position.x += Math.sin(elapsed + p.position.z) * delta * 0.3;
        p.rotation.x += delta;
        p.rotation.y += delta * 0.8;
        if (p.position.y < -1.4) {
          p.position.y = 3.0;
        }
      });
    }
  }
};

/**
 * 6. Surreal: Inverted Gravity 1950s Speakeasy (Floor 404)
 * A lavish cocktail lounge where gravity is completely upside down on the ceiling.
 * Patrons walk on the ceiling, champagne bottles pour upwards into glasses, and inverted musicians play.
 */
const upsideDownLoungeScene: FloorSceneDefinition = {
  id: 'upside_down_lounge',
  floorNumber: 404,
  name: 'Floor 404: The Inverted Gravity Speakeasy',
  category: 'surreal',
  description: 'An upscale 1950s jazz cocktail lounge where gravity is flipped: patrons walk on the ceiling above you, champagne pours upwards, and an inverted pianist jams in reverse.',
  duration: 23,
  audioTheme: 'upside_down_jazz',
  skyColor: 0x1e1b4b,
  fogColor: 0x2e1065,
  fogDensity: 0.02,
  lightColor: 0xfef08a,
  lightIntensity: 1.5,
  init: (container) => {
    // Normal Empty Bottom Floor (nothing on it)
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 20), new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -1.3, -8);
    container.add(floor);

    // Inverted Ceiling Floor (Where the whole bar is located!)
    const ceilingBar = new THREE.Mesh(new THREE.PlaneGeometry(16, 20), new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.3, metalness: 0.3 }));
    ceilingBar.rotation.x = Math.PI / 2;
    ceilingBar.position.set(0, 3.2, -8);
    container.add(ceilingBar);

    // Inverted Bar Counter hanging from ceiling
    const barCounter = new THREE.Mesh(new THREE.BoxGeometry(7, 1.1, 1.4), new THREE.MeshStandardMaterial({ color: 0x3f2d1d }));
    barCounter.position.set(0, 2.6, -7);
    container.add(barCounter);

    // Upside-Down Chandelier pointing UP toward the floor!
    const chandelier = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.4, 8), new THREE.MeshStandardMaterial({ color: 0xfef08a, metalness: 0.9 }));
    chandelier.position.set(0, 1.8, -5);
    container.add(chandelier);

    // Upside-Down Grand Piano hanging from ceiling
    const pianoGroup = new THREE.Group();
    pianoGroup.position.set(-2.5, 2.5, -6);
    pianoGroup.name = 'invertedPiano';

    const pBody = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, 1.8), new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.1 }));
    pianoGroup.add(pBody);
    container.add(pianoGroup);

    // Upside-Down Pianist
    const pianist = new THREE.Group();
    pianist.position.set(-2.5, 2.6, -4.8);
    pianist.name = 'invertedPianist';
    // Upside-down suit
    const suit = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 1.1, 12), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    suit.position.y = 0.4;
    pianist.add(suit);
    const pHead = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), new THREE.MeshStandardMaterial({ color: 0xfbcfe8 }));
    pHead.position.set(0, -0.3, 0);
    pianist.add(pHead);
    container.add(pianist);

    // Floating UPWARDS Champagne Bubbles & Droplets
    const bubbleGroup = new THREE.Group();
    bubbleGroup.name = 'risingBubbles';
    const bMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.1, metalness: 0.8 });
    for (let i = 0; i < 24; i++) {
      const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.06 + Math.random() * 0.08, 8, 8), bMat);
      bubble.position.set((Math.random() - 0.5) * 4, -0.5 + Math.random() * 3, -6 + (Math.random() - 0.5) * 3);
      bubbleGroup.add(bubble);
    }
    container.add(bubbleGroup);
  },
  update: (delta, elapsed, container) => {
    // Champagne bubbles floating UPWARDS toward ceiling
    const bubbles = container.getObjectByName('risingBubbles');
    if (bubbles) {
      bubbles.children.forEach((b) => {
        b.position.y += delta * 1.2;
        if (b.position.y > 3.0) {
          b.position.y = -1.0;
        }
      });
    }

    // Inverted pianist head bobbing to the jazz groove
    const pianist = container.getObjectByName('invertedPianist');
    if (pianist) {
      pianist.rotation.z = Math.sin(elapsed * 5) * 0.1;
      pianist.position.y = 2.6 + Math.sin(elapsed * 5) * 0.05;
    }
  }
};

/**
 * 7. Absurd: The Great Sentient Toaster Uprising (Floor 101)
 * A retro laboratory where giant chrome toasters with cute LED faces
 * and tank treads launch golden toast slices 30 feet into the air.
 */
const sentientToastersScene: FloorSceneDefinition = {
  id: 'sentient_toasters',
  floorNumber: 101,
  name: 'Floor 101: The Sentient Toaster Uprising',
  category: 'absurd',
  description: 'A retro-futuristic facility overrun by sentient chrome toasters with tank treads chanting in binary while launching golden waffles and buttered toast skyward.',
  duration: 21,
  audioTheme: 'toaster_party',
  skyColor: 0xf59e0b,
  fogColor: 0xd97706,
  fogDensity: 0.02,
  lightColor: 0xffedd5,
  lightIntensity: 1.8,
  init: (container) => {
    // Industrial Checkerboard Factory Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.3 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -1.3, -10);
    container.add(floor);

    // Giant Supreme Leader Toaster in Center
    const leaderToaster = new THREE.Group();
    leaderToaster.position.set(0, -0.4, -6.5);
    leaderToaster.name = 'leaderToaster';

    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.08 });
    const blackMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });

    // Toaster Body
    const tBody = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.8, 1.8), chromeMat);
    leaderToaster.add(tBody);

    // Two Top Slots
    const slotL = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 0.35), blackMat);
    slotL.position.set(0, 0.9, -0.4);
    leaderToaster.add(slotL);

    const slotR = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 0.35), blackMat);
    slotR.position.set(0, 0.9, 0.4);
    leaderToaster.add(slotR);

    // Front Cute LED Digital Smile Display
    const displayFace = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.7), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    displayFace.position.set(0, 0, 0.91);
    leaderToaster.add(displayFace);

    // Side Slider Lever
    const lever = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.25, 0.35), blackMat);
    lever.position.set(1.45, 0.4, 0);
    lever.name = 'toasterLever';
    leaderToaster.add(lever);

    // Tank Treads on Sides
    const treadL = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2.2, 16), blackMat);
    treadL.rotation.x = Math.PI / 2;
    treadL.position.set(-1.6, -0.7, 0);
    leaderToaster.add(treadL);

    const treadR = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2.2, 16), blackMat);
    treadR.rotation.x = Math.PI / 2;
    treadR.position.set(1.6, -0.7, 0);
    leaderToaster.add(treadR);

    container.add(leaderToaster);

    // Flying Golden Toast Particles
    const toastGroup = new THREE.Group();
    toastGroup.name = 'flyingToast';
    const toastMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 });
    for (let i = 0; i < 12; i++) {
      const slice = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.12), toastMat);
      slice.position.set((Math.random() - 0.5) * 4, 1 + Math.random() * 4, -6.5 + (Math.random() - 0.5) * 2);
      toastGroup.add(slice);
    }
    container.add(toastGroup);
  },
  update: (delta, elapsed, container) => {
    // Supreme Toaster bouncing on tank treads
    const toaster = container.getObjectByName('leaderToaster');
    if (toaster) {
      toaster.position.y = -0.4 + Math.abs(Math.sin(elapsed * 10)) * 0.15;
      toaster.rotation.z = Math.sin(elapsed * 8) * 0.05;

      const lever = toaster.getObjectByName('toasterLever');
      if (lever) {
        lever.position.y = 0.4 + Math.sin(elapsed * 6) * 0.3;
      }
    }

    // Slices of toast launching skyward and tumbling
    const toasts = container.getObjectByName('flyingToast');
    if (toasts) {
      toasts.children.forEach((slice, idx) => {
        slice.position.y += delta * (2.5 + idx * 0.3);
        slice.rotation.x += delta * 4;
        slice.rotation.y += delta * 3;
        if (slice.position.y > 6.0) {
          slice.position.y = 0.5;
          slice.position.x = (Math.random() - 0.5) * 3;
        }
      });
    }
  }
};

/**
 * 8. Absurd: Intergalactic Heavyweight Sumo Bananas (Floor 240)
 * A traditional Japanese Dohyo sumo ring in deep space where two giant muscular
 * bananas wearing black mawashi belts fiercely grapple each other.
 */
const sumoBananasScene: FloorSceneDefinition = {
  id: 'sumo_bananas',
  floorNumber: 240,
  name: 'Floor 240: Intergalactic Sumo Bananas',
  category: 'absurd',
  description: 'A circular sacred sumo ring suspended in deep space. Two giant muscular humanoid bananas wearing black belts fiercely grapple, slap, and stomp in an epic tournament.',
  duration: 22,
  audioTheme: 'sumo_bananas',
  skyColor: 0x0f172a,
  fogColor: 0x1e1b4b,
  fogDensity: 0.015,
  lightColor: 0xffedd5,
  lightIntensity: 1.8,
  init: (container) => {
    // Floating Circular Sumo Dohyo Ring
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.8 });
    const dohyo = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 6.0, 1.2, 32), ringMat);
    dohyo.position.set(0, -1.2, -7.5);
    container.add(dohyo);

    // Rice-Straw Sacred Boundary Rope
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.9 });
    const rope = new THREE.Mesh(new THREE.TorusGeometry(4.8, 0.15, 8, 32), ropeMat);
    rope.rotation.x = Math.PI / 2;
    rope.position.set(0, -0.58, -7.5);
    container.add(rope);

    // Two Giant Sumo Bananas Grappling
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });

    // Banana 1 (East Side)
    const banana1 = new THREE.Group();
    banana1.position.set(-1.4, -0.6, -7.5);
    banana1.name = 'bananaEast';

    const bBody1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.7, 1.8, 16, 16), yellowMat);
    bBody1.rotation.z = -0.3; // Curving banana posture
    banana1.add(bBody1);

    const bBelt1 = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.4, 16), beltMat);
    banana1.add(bBelt1);

    container.add(banana1);

    // Banana 2 (West Side)
    const banana2 = new THREE.Group();
    banana2.position.set(1.4, -0.6, -7.5);
    banana2.name = 'bananaWest';

    const bBody2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.7, 1.8, 16, 16), yellowMat);
    bBody2.rotation.z = 0.3;
    banana2.add(bBody2);

    const bBelt2 = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.4, 16), beltMat);
    banana2.add(bBelt2);

    container.add(banana2);

    // Salt Particle Dust in Air
    const saltGroup = new THREE.Group();
    saltGroup.name = 'sumoSalt';
    const saltMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = 0; i < 20; i++) {
      const salt = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), saltMat);
      salt.position.set((Math.random() - 0.5) * 3, 0 + Math.random() * 2, -7.5 + (Math.random() - 0.5) * 2);
      saltGroup.add(salt);
    }
    container.add(saltGroup);
  },
  update: (delta, elapsed, container) => {
    // Sumo bananas lunging, stomping and grappling
    const bEast = container.getObjectByName('bananaEast');
    const bWest = container.getObjectByName('bananaWest');

    if (bEast && bWest) {
      const grapple = Math.sin(elapsed * 8) * 0.35;
      bEast.position.x = -1.4 + grapple;
      bWest.position.x = 1.4 + grapple;

      bEast.position.y = -0.6 + Math.abs(Math.sin(elapsed * 6)) * 0.15;
      bWest.position.y = -0.6 + Math.abs(Math.cos(elapsed * 6)) * 0.15;
    }
  }
};

/**
 * 9. Sci-Fi: Antimatter Singularity Core (Floor 2184)
 * A colossal hypercube quantum fusion core spinning along 4D geometric axes
 * inside spinning magnetic containment rings, blasting cyan and magenta plasma arcs.
 */
const quantumCoreScene: FloorSceneDefinition = {
  id: 'quantum_core',
  floorNumber: 2184,
  name: 'Floor 2184: Antimatter Singularity Core',
  category: 'sci-fi',
  description: 'Deep inside an antimatter starship reactor. A colossal pulsing 4D hypercube singularity core spins inside gyroscopic magnetic rings, radiating blinding plasma energy.',
  duration: 24,
  audioTheme: 'quantum_core',
  skyColor: 0x020617,
  fogColor: 0x090d16,
  fogDensity: 0.02,
  lightColor: 0x38bdf8,
  lightIntensity: 2.2,
  init: (container) => {
    // Starship Reactor Deck
    const deckMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.2 });
    const deck = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), deckMat);
    deck.rotation.x = -Math.PI / 2;
    deck.position.set(0, -1.3, -10);
    container.add(deck);

    // Glowing Neon Circuit Lines on Floor
    const circuitMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    for (let x = -6; x <= 6; x += 3) {
      const line = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 20), circuitMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(x, -1.29, -10);
      container.add(line);
    }

    // Colossal Reactor Core Chamber Group
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0.8, -8);
    coreGroup.name = 'singularityCore';

    // 1. Inner Glowing Antimatter Singularity Sphere
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.0, 32, 32), coreMat);
    coreGroup.add(sphere);

    // 2. Translucent Tesseract Cube
    const cubeMat = new THREE.MeshStandardMaterial({
      color: 0xe879f9,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.65,
    });
    const cube = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 2.2), cubeMat);
    cube.name = 'tesseractCube';
    coreGroup.add(cube);

    // 3. Triple Magnetic Gyroscope Rings
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.95, roughness: 0.15 });

    const gyro1 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.12, 16, 48), ringMat);
    gyro1.name = 'gyro1';
    coreGroup.add(gyro1);

    const gyro2 = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.12, 16, 48), ringMat);
    gyro2.name = 'gyro2';
    coreGroup.add(gyro2);

    const gyro3 = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.12, 16, 48), ringMat);
    gyro3.name = 'gyro3';
    coreGroup.add(gyro3);

    // Blinding Core Point Light
    const coreLight = new THREE.PointLight(0x00f0ff, 3.5, 14);
    coreGroup.add(coreLight);

    container.add(coreGroup);

    // Orbiting Maintenance Drones
    const droneGroup = new THREE.Group();
    droneGroup.name = 'reactorDrones';
    const dMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9 });
    for (let i = 0; i < 3; i++) {
      const drone = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), dMat);
      droneGroup.add(drone);
    }
    container.add(droneGroup);
  },
  update: (delta, elapsed, container) => {
    const core = container.getObjectByName('singularityCore');
    if (core) {
      // Tesseract rotating on multiple axes
      const tesseract = core.getObjectByName('tesseractCube');
      if (tesseract) {
        tesseract.rotation.x += delta * 1.5;
        tesseract.rotation.y += delta * 2.0;
        tesseract.scale.setScalar(1 + Math.sin(elapsed * 6) * 0.1);
      }

      // Gyroscopic rings spinning at different speeds
      const g1 = core.getObjectByName('gyro1');
      const g2 = core.getObjectByName('gyro2');
      const g3 = core.getObjectByName('gyro3');
      if (g1) g1.rotation.x += delta * 2.2;
      if (g2) g2.rotation.y += delta * 3.1;
      if (g3) g3.rotation.z += delta * 1.8;
    }

    // Orbiting service droids
    const drones = container.getObjectByName('reactorDrones');
    if (drones) {
      drones.children.forEach((d, idx) => {
        const angle = elapsed * 1.5 + (idx * Math.PI * 2) / 3;
        d.position.set(Math.cos(angle) * 4.2, 0.8 + Math.sin(angle * 2) * 1.2, -8 + Math.sin(angle) * 3.5);
      });
    }
  }
};

/**
 * 10. Sci-Fi: Bioluminescent Xenoflora Dome on Titan (Floor 3030)
 * An extraterrestrial biodome looking out onto Saturn's golden rings and orange methane seas,
 * packed with alien flora, pulsating spore pods, and floating bioluminescent jellyfish.
 */
const alienBiolabScene: FloorSceneDefinition = {
  id: 'alien_biolab',
  floorNumber: 3030,
  name: 'Floor 3030: Bioluminescent Xenoflora Dome on Titan',
  category: 'sci-fi',
  description: 'An extraterrestrial greenhouse dome on Saturn’s moon Titan. Pulsating alien spore bulbs breathe in low gravity while bioluminescent jellyfish float past panoramic ringed skies.',
  duration: 23,
  audioTheme: 'alien_biolab',
  skyColor: 0x7c2d12,
  fogColor: 0x9a3412,
  fogDensity: 0.02,
  lightColor: 0x22d3ee,
  lightIntensity: 1.6,
  init: (container) => {
    // Titan Alien Soil Floor
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -1.3, -10);
    container.add(ground);

    // Colossal Saturn with Rings visible in the sky!
    const saturnGroup = new THREE.Group();
    saturnGroup.position.set(8, 9, -22);

    const saturnMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    const saturnPlanet = new THREE.Mesh(new THREE.SphereGeometry(3.5, 32, 32), saturnMat);
    saturnGroup.add(saturnPlanet);

    const saturnRings = new THREE.Mesh(new THREE.RingGeometry(4.2, 7.5, 32), new THREE.MeshBasicMaterial({ color: 0xfef08a, side: THREE.DoubleSide, transparent: true, opacity: 0.85 }));
    saturnRings.rotation.x = Math.PI / 2.8;
    saturnGroup.add(saturnRings);

    container.add(saturnGroup);

    // Geodesic Dome Transparent Struts
    const domeMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(14, 16, 12), domeMat);
    dome.position.set(0, 0, -10);
    container.add(dome);

    // Giant Pulsating Alien Spore Plants
    const plantGroup = new THREE.Group();
    plantGroup.name = 'alienPlants';

    const alienMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.4 });
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });

    for (let i = -3; i <= 3; i += 2) {
      const plant = new THREE.Group();
      plant.position.set(i * 1.3, -1.3, -5.5 - Math.abs(i) * 0.8);

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 2.2, 8), alienMat);
      stem.position.y = 1.1;
      plant.add(stem);

      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), bulbMat);
      bulb.position.y = 2.2;
      bulb.name = 'sporeBulb';
      plant.add(bulb);

      plantGroup.add(plant);
    }
    container.add(plantGroup);

    // Floating Alien Spore Jellyfish
    const jellyGroup = new THREE.Group();
    jellyGroup.name = 'sporeJellyfish';
    const jellyMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      roughness: 0.2,
    });
    for (let i = 0; i < 4; i++) {
      const jelly = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), jellyMat);
      jelly.position.set((Math.random() - 0.5) * 6, 0.5 + Math.random() * 2, -6 - Math.random() * 4);
      jellyGroup.add(jelly);
    }
    container.add(jellyGroup);
  },
  update: (delta, elapsed, container) => {
    // Spore bulbs breathing (expanding/contracting)
    const plants = container.getObjectByName('alienPlants');
    if (plants) {
      plants.children.forEach((p, idx) => {
        const bulb = p.getObjectByName('sporeBulb');
        if (bulb) {
          const breath = 1 + Math.sin(elapsed * 2.5 + idx) * 0.25;
          bulb.scale.set(breath, breath * 1.1, breath);
        }
      });
    }

    // Floating jellyfish gently swimming in low gravity
    const jellies = container.getObjectByName('sporeJellyfish');
    if (jellies) {
      jellies.children.forEach((j, idx) => {
        j.position.y += Math.sin(elapsed * 2 + idx) * delta * 0.8;
        j.position.x += Math.cos(elapsed * 1.5 + idx) * delta * 0.4;
      });
    }
  }
};

export const EXTENDED_FLOOR_SCENES: FloorSceneDefinition[] = [
  penguinBaristaScene,
  catOrchestraScene,
  mannequinHallScene,
  cursedLaundromatScene,
  origamiWorldScene,
  upsideDownLoungeScene,
  sentientToastersScene,
  sumoBananasScene,
  quantumCoreScene,
  alienBiolabScene,
];

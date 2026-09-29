import * as THREE from 'three';

export type FloorCategory = 'comedic' | 'surreal' | 'horror' | 'absurd' | 'cosmic' | 'sci-fi' | 'nature' | 'nostalgic';

export interface FloorSceneDefinition {
  id: string;
  floorNumber: number | string;
  name: string;
  category: FloorCategory;
  description: string;
  duration: number; // in seconds (15-30s as requested)
  audioTheme: string;
  skyColor: number;
  fogColor: number;
  fogDensity?: number;
  lightColor?: number;
  lightIntensity?: number;
  init: (container: THREE.Group, parentScene: THREE.Scene) => void;
  update: (delta: number, elapsed: number, container: THREE.Group) => void;
  cleanup?: (container: THREE.Group, parentScene: THREE.Scene) => void;
}

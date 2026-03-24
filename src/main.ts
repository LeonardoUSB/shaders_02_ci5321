import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

import type { RasenganPhase } from './fases/fase';
// Importaremos las fases reales aquí más adelante
import { CompressionPhase } from './fases/compresion/compresion';
import { RotationPhase } from './fases/rotacion/rotacion';
import { ChaosPhase } from './fases/final/final';

class RasenganEngine {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private currentPhase: RasenganPhase | null = null;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 4; // Un poco más lejos para ver bien la compresión

        const canvas = document.querySelector('#main-canvas') as HTMLCanvasElement;
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.setupEventListeners();
        this.render();
    }

    public loadPhase(phase: RasenganPhase) {
        if (this.currentPhase) {
            this.scene.remove(this.currentPhase.container);
            this.currentPhase.dispose();
        }

        this.currentPhase = phase;
        this.scene.add(this.currentPhase.container);
    }

    private setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // --- CONEXIÓN DE BOTONES ---
        document.getElementById('btn-phase-1')?.addEventListener('click', () => {
            this.loadPhase(new CompressionPhase());
            this.updateActiveButton('btn-phase-1');
        });

        // Por ahora estos solo limpian o lanzan un log hasta que hagamos las otras fases
        document.getElementById('btn-phase-2')?.addEventListener('click', () => {
            this.loadPhase(new RotationPhase());
            this.updateActiveButton('btn-phase-2');
        });

        document.getElementById('btn-phase-3')?.addEventListener('click', () => {
            this.loadPhase(new ChaosPhase());
            this.updateActiveButton('btn-phase-3');
        });

    }

    private updateActiveButton(id: string) {
        document.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        document.getElementById(id)?.classList.add('active');
    }

    private render = () => {
        const time = performance.now() * 0.001;
        requestAnimationFrame(this.render);

        if (this.currentPhase) {
            this.currentPhase.update(time);
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Encendemos el motor
new RasenganEngine();

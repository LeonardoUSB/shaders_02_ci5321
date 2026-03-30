import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { RasenganPhase } from './fases/fase';
import { spiralPhase } from './fases/1_espiral/espiral';
// Importamos las otras fases por si decides activarlas luego
import { Espirales } from './fases/2_espirales/espirales';
import { ChaosPhase } from './fases/final/final';

class RasenganEngine {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls; // Añadido para interactividad
    private currentPhase: RasenganPhase | null = null;
    private startTime: number;

    constructor() {
        // 1. Configuración de Escena y Cámara
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#050505');

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 4);

        // 2. Setup del Renderer
        const canvas = document.querySelector('#main-canvas') as HTMLCanvasElement;
        this.renderer = new THREE.WebGLRenderer({ 
            canvas, 
            antialias: true,
            powerPreference: 'high-performance' 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 3. OrbitControls (Esencial para moverte alrededor de la partícula)
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.startTime = Date.now();
        this.setupEventListeners();
        this.render();
    }

    public loadPhase(phase: RasenganPhase) {
        // Limpiamos la fase anterior si existe
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
            // Ahora cargamos la versión de "una sola partícula"
            this.loadPhase(new spiralPhase());
            this.updateActiveButton('btn-phase-1');
        });

        document.getElementById('btn-phase-2')?.addEventListener('click', () => {
            this.loadPhase(new Espirales());
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
        // Calculamos el tiempo transcurrido en segundos
        const time = (Date.now() - this.startTime) / 1000;
        
        requestAnimationFrame(this.render);

        // Actualizamos controles de cámara (OrbitControls)
        this.controls.update();

        if (this.currentPhase) {
            // CAMBIO CLAVE: Enviamos tiempo Y cámara a la fase
            this.currentPhase.update(time, this.camera);
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Inicializamos el motor del Rasengan
new RasenganEngine();

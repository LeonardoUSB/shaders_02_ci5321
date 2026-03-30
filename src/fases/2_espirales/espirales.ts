import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import type { RasenganPhase } from '../fase';
import vertexShader from './vertex.glsl?raw';
import fragmentShader from './fragment.glsl?raw';

export class Espirales implements RasenganPhase{
    public container: THREE.Group;
    private geometry: THREE.BufferGeometry;
    private material: THREE.RawShaderMaterial;
    private points: THREE.Points;
    private gui: GUI;

    // Referencias visuales añadidas
    private gridHelper: THREE.GridHelper;
    private referenceCircle: THREE.LineLoop;

    private params = {
        speed: 5.0,
        attraction: 0.5,
        pointSize: 15.0,
        color: '#44aaff'
    };

    constructor() {
        this.container = new THREE.Group();
    
        // --- REFERENCIAS VISUALES ---
        
        // A. Cuadrícula de suelo (Grid)
        // Tamaño 10x10, con 10 divisiones. Color gris oscuro.
        this.gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
        this.gridHelper.position.y = -2; // La bajamos un poco para que no choque con la espiral
        this.container.add(this.gridHelper);

        // B. Círculo de referencia (Esqueleto)
        // Creamos un anillo de líneas en el plano XY con radio 2 (el radio inicial de la espiral)
        const circleGeometry = new THREE.CircleGeometry(2, 64); 
        // Eliminamos el vértice central para que solo quede el borde
        circleGeometry.deleteAttribute('normal');
        circleGeometry.deleteAttribute('uv');
        // Usamos solo los vértices del borde
        const edgeVertices = circleGeometry.attributes.position.array.slice(3); // Saltamos el centro (0,0,0)
        const edgeGeometry = new THREE.BufferGeometry();
        edgeGeometry.setAttribute('position', new THREE.BufferAttribute(edgeVertices, 3));
        
        const circleMaterial = new THREE.LineBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.5 });
        this.referenceCircle = new THREE.LineLoop(edgeGeometry, circleMaterial);
        this.container.add(this.referenceCircle);

        // --- SHADER ---

        // 1. GEOMETRÍA: Definimos 12 partículas (una por cada subplano principal)
        const count = 20;
        this.geometry = new THREE.BufferGeometry();
        
        // Creamos un ID único para cada partícula (0 a 11)
        const pIds = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            pIds[i] = i;
        }

        // Solo necesitamos el atributo del ID, la posición la calcula el Shader
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
        this.geometry.setAttribute('aId', new THREE.BufferAttribute(pIds, 1));

        // 2. MATERIAL: Enviamos los parámetros a la GPU
        this.material = new THREE.RawShaderMaterial({
            vertexShader,
            fragmentShader,
            glslVersion: THREE.GLSL3,
            transparent: true,
            blending: THREE.AdditiveBlending, // Efecto de brillo acumulativo
            uniforms: {
                u_time: { value: 0.0 },
                u_speed: { value: this.params.speed },
                u_attraction: { value: this.params.attraction },
                u_pointSize: { value: this.params.pointSize },
                u_color: { value: new THREE.Color(this.params.color) },
                projectionMatrix: { value: new THREE.Matrix4() },
                viewMatrix: { value: new THREE.Matrix4() },
                modelMatrix: { value: new THREE.Matrix4() },
            }
        });

        this.points = new THREE.Points(this.geometry, this.material);
        this.container.add(this.points);

        this.gui = new GUI({ title: 'Configuración: EspiralesPhase' });
        this.setupUI();

    }

    private setupUI() {
        this.gui.add(this.params, 'speed', 0, 20).name('Velocidad').onChange(v => this.material.uniforms.u_speed.value = v);
        this.gui.add(this.params, 'attraction', 0.1, 2.0).name('Convergencia').onChange(v => this.material.uniforms.u_attraction.value = v);
        this.gui.add(this.params, 'pointSize', 1, 50).name('Grosor').onChange(v => this.material.uniforms.u_pointSize.value = v);
    }

    public update(time: number, camera: THREE.PerspectiveCamera) {
        this.material.uniforms.u_time.value = time;
        this.material.uniforms.viewMatrix.value = camera.matrixWorldInverse;
        this.material.uniforms.projectionMatrix.value = camera.projectionMatrix;
    }

    public dispose() {
        this.gui.destroy();
        this.geometry.dispose();
        this.material.dispose();
    }
}

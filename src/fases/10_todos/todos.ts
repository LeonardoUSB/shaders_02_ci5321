import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import type { RasenganPhase } from '../fase';
import vertexShader from './vertex.glsl?raw';
import fragmentShader from './fragment.glsl?raw';

export class ChakraFull implements RasenganPhase {
    public container: THREE.Group;
    private geometry: THREE.BufferGeometry;
    private material: THREE.RawShaderMaterial;
    private points: THREE.Points;
    private gui: GUI;

    private params = {  
        // Sección Ruido
        noiseVisible: true,
        noiseSpeed: 0.5,
        // Sección Espirales
        spiralVisible: true,
        spiralSpeed: 4.0,
        // Sección Chakra Interno
        chakraVisible: true,
        chakraSpeed: 4.0,
        chakraFlow: 0.15,
        // Global
        pointSize: 8.0,
        color: '#44aaff',
        density: 1000000     // Total de partículas
    };

    constructor() {
        this.container = new THREE.Group();

        // 1. GEOMETRÍA: Creamos el "Enjambre de Partículas"
        const count = this.params.density;
        this.geometry = new THREE.BufferGeometry();

        const pIds = new Float32Array(count);
        const pOffsets = new Float32Array(count);
        const pTypes = new Float32Array(count); // 0: Ruido, 1: Giros, 2: Chakra Interno

        for (let i = 0; i < count; i++) {
            // ID para los switches (0-19)
            pIds[i] = i % 20; 
            
            // Offset aleatorio para que no salgan todas al mismo tiempo
            pOffsets[i] = Math.random();

            // DISTRIBUCIÓN DE ROLES:
            const rand = Math.random();
            if (rand < 0.3) {
                pTypes[i] = 0.0; // 40% son el enjambre caótico exterior
            } else if (rand < 0.5) {
                pTypes[i] = 1.0; // 30% son las viajeras espirales (giros)
            } else {
                pTypes[i] = 2.0; // 30% son el sistema circulatorio interno
            }
        }

        // Posiciones iniciales vacías (el Shader las calcula todas)
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
        this.geometry.setAttribute('aId', new THREE.BufferAttribute(pIds, 1));
        this.geometry.setAttribute('aOffset', new THREE.BufferAttribute(pOffsets, 1));
        this.geometry.setAttribute('aType', new THREE.BufferAttribute(pTypes, 1));

        // 2. MATERIAL: Configuración de renderizado de alta fidelidad
        this.material = new THREE.RawShaderMaterial({
            vertexShader,
            fragmentShader,
            glslVersion: THREE.GLSL3,
            transparent: true,
            blending: THREE.AdditiveBlending, // Clave para el efecto de brillo
            depthWrite: false,               // Evita que las partículas se tapen entre sí de forma fea
            uniforms: {
                u_time: { value: 0.0 },
                u_pointSize: { value: this.params.pointSize },
                u_color: { value: new THREE.Color(this.params.color) },
                // Uniforms de Control
                u_noiseSpeed: { value: this.params.noiseSpeed },
                u_spiralSpeed: { value: this.params.spiralSpeed },
                u_chakraSpeed: { value: this.params.chakraSpeed },
                u_chakraFlow: { value: this.params.chakraFlow },
                // Uniforms de Visibilidad
                u_showNoise: { value: 1.0 },
                u_showSpiral: { value: 1.0 },
                u_showChakra: { value: 1.0 },
                // Matrices
                projectionMatrix: { value: new THREE.Matrix4() },
                viewMatrix: { value: new THREE.Matrix4() },
                modelMatrix: { value: new THREE.Matrix4() },
            }
        });

        this.points = new THREE.Points(this.geometry, this.material);
        this.container.add(this.points);

        this.gui = new GUI({ title: 'Rasengan: Fusión Total' });
        this.setupUI();
    }

    private setupUI() {
        // SECCIÓN 1: RUIDO
        const noiseFolder = this.gui.addFolder('Enjambre Exterior (Ruido)');
        noiseFolder.add(this.params, 'noiseVisible').name('Activar').onChange(v => {
            this.material.uniforms.u_showNoise.value = v ? 1.0 : 0.0;
        });
        noiseFolder.add(this.params, 'noiseSpeed', 0, 2).name('Velocidad Ruido').onChange(v => {
            this.material.uniforms.u_noiseSpeed.value = v;
        });

        // SECCIÓN 2: ESPIRALES
        const spiralFolder = this.gui.addFolder('Viajeras (Espirales)');
        spiralFolder.add(this.params, 'spiralVisible').name('Activar').onChange(v => {
            this.material.uniforms.u_showSpiral.value = v ? 1.0 : 0.0;
        });
        spiralFolder.add(this.params, 'spiralSpeed', 0, 30).name('Vueltas').onChange(v => {
            this.material.uniforms.u_spiralSpeed.value = v;
        });

        // SECCIÓN 3: CHAKRA INTERNO
        const chakraFolder = this.gui.addFolder('Sistema Interno');
        chakraFolder.add(this.params, 'chakraVisible').name('Activar').onChange(v => {
            this.material.uniforms.u_showChakra.value = v ? 1.0 : 0.0;
        });
        chakraFolder.add(this.params, 'chakraSpeed', 0, 20).name('Vueltas Internas').onChange(v => {
            this.material.uniforms.u_chakraSpeed.value = v;
        });
        chakraFolder.add(this.params, 'chakraFlow', 0, 1).name('Atracción').onChange(v => {
            this.material.uniforms.u_chakraFlow.value = v;
        });

        // SECCIÓN 4: APARIENCIA GLOBAL
        const globalFolder = this.gui.addFolder('Apariencia Global');
        globalFolder.add(this.params, 'pointSize', 1, 40).name('Brillo / Tamaño').onChange(v => {
            this.material.uniforms.u_pointSize.value = v;
        });
        globalFolder.addColor(this.params, 'color').name('Color Chakra').onChange(v => {
            this.material.uniforms.u_color.value.set(v);
        });

        noiseFolder.open();
        spiralFolder.open();
        chakraFolder.open();
    }

    public update(time: number, camera: THREE.PerspectiveCamera) {
        // Actualizamos los uniforms por cada frame
        this.material.uniforms.u_time.value = time;
        this.material.uniforms.viewMatrix.value = camera.matrixWorldInverse;
        this.material.uniforms.projectionMatrix.value = camera.projectionMatrix;
        
        // Rotación extra al contenedor para darle dinamismo global
        this.points.rotation.y += 0.005;
        this.points.rotation.z += 0.002;
    }

    public dispose() {
        this.gui.destroy();
        this.geometry.dispose();
        this.material.dispose();
    }
        
}

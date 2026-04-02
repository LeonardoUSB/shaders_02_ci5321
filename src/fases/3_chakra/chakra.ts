import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import type { RasenganPhase } from '../fase';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';

export class Chakra implements RasenganPhase{
    public container: THREE.Group;
    private geometry: THREE.BufferGeometry;
    private material: THREE.RawShaderMaterial;
    private points: THREE.Points;
    private gui: GUI;

    
    // Referencias visuales añadidas
    private sphereHelper: THREE.Mesh;
    private axisHelper: THREE.AxesHelper;
    

    private params = {
        speed: 2.0,
        attraction: 0.5,
        pointSize: 3.0,
        color: '#44aaff',
        showHelpers: true 
    };

    constructor() {
        this.container = new THREE.Group();
    
        //  REFERENCIAS VISUALES (Helpers) 
                
        this.axisHelper = new THREE.AxesHelper(3);
        this.container.add(this.axisHelper);

        //Cargamos un shader sencillo ya hecho por three para la referencia de la esfera
        const sphereGeo = new THREE.SphereGeometry(2.0, 32, 32); 
        const sphereMat = new THREE.MeshBasicMaterial({ 
            color: 0x444444, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.2 
        });
        this.sphereHelper = new THREE.Mesh(sphereGeo, sphereMat);
        this.container.add(this.sphereHelper);

        //  SHADER

        //Definimos 20 direcciones
        const directions = 20;
        const particlesPerDirection = 500; // Particulas por direccion
        const count = directions * particlesPerDirection;

        this.geometry = new THREE.BufferGeometry();

        const pIds = new Float32Array(count);
        const pOffsets = new Float32Array(count)
        
        // Creamos un ID unico para cada particula 
        
        for (let i = 0; i < directions; i++) {
            for (let j = 0; j < particlesPerDirection; j++) {
                const index = i * particlesPerDirection + j;
                pIds[index] = i; // El ID de dirección (0-19)
                // El offset reparte las partículas a lo largo del hilo (de 0 a 1)
                pOffsets[index] = j / particlesPerDirection; 
            }
        }   

        // Solo necesitamos el atributo del ID, la posición la calcula el Shader
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
        this.geometry.setAttribute('aId', new THREE.BufferAttribute(pIds, 1));
        this.geometry.setAttribute('aOffset', new THREE.BufferAttribute(pOffsets, 1));

        
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

        this.gui = new GUI({ title: 'Configuración' });
        this.setupUI();

    }

    private setupUI() {
        const spiralFolder = this.gui.addFolder('Espiral');
        spiralFolder.add(this.params, 'speed', 0, 20).name('Velocidad').onChange(v => {
            this.material.uniforms.u_speed.value = v;
        });
        spiralFolder.add(this.params, 'attraction', 0.1, 2.0).name('Atracción').onChange(v => {
            this.material.uniforms.u_attraction.value = v;
        });
        spiralFolder.open();

        const particleFolder = this.gui.addFolder('Partícula');
        particleFolder.add(this.params, 'pointSize', 1, 100).name('Tamaño').onChange(v => {
            this.material.uniforms.u_pointSize.value = v;
        });
        particleFolder.addColor(this.params, 'color').name('Color').onChange(v => {
            this.material.uniforms.u_color.value.set(v);
        });
        particleFolder.open();
        this.gui.add(this.params, 'showHelpers').name('Mostrar Guías').onChange(v => {
            this.sphereHelper.visible = v;
            this.axisHelper.visible = v;
        
        });
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
        if (this.sphereHelper) {
            this.sphereHelper.geometry.dispose();
            (this.sphereHelper.material as THREE.Material).dispose();
        }
        this.axisHelper.dispose();
    }
}

import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import type { RasenganPhase } from '../fase';
import vertexShader from './vertex.glsl?raw';
import fragmentShader from './fragment.glsl?raw';

export class Ruido implements RasenganPhase {
    public container: THREE.Group;
    private geometry: THREE.BufferGeometry;
    private material: THREE.RawShaderMaterial;
    private points: THREE.Points;
    private gui: GUI;
    private sphereHelper: THREE.Mesh;
    private axisHelper: THREE.AxesHelper;

    private params = {
        speed: 0.5,        
        attraction: 1.5,   
        pointSize: 4.0,    
        color: '#44aaff',
        showHelper: true
    };

    constructor() {
        this.container = new THREE.Group();

        // Referencias Visuales
        this.axisHelper = new THREE.AxesHelper(3);
        this.container.add(this.axisHelper);

        const sphereGeo = new THREE.SphereGeometry(2.0, 32, 32); 
        const sphereMat = new THREE.MeshBasicMaterial({ 
            color: 0x444444, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.2 
        });
        this.sphereHelper = new THREE.Mesh(sphereGeo, sphereMat);
        this.container.add(this.sphereHelper);

        
        const axesCount = 10;
        const particlesPerAxis = 8000; 
        const count = axesCount * particlesPerAxis;

        const positions = new Float32Array(count * 3);
        const ids = new Float32Array(count);
        const offsets = new Float32Array(count);

        for (let i = 0; i < axesCount; i++) {
            for (let j = 0; j < particlesPerAxis; j++) {
                const index = i * particlesPerAxis + j;
                ids[index] = i;
                offsets[index] = j / particlesPerAxis; 
            }
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('aId', new THREE.BufferAttribute(ids, 1));
        this.geometry.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1));

        
        this.material = new THREE.RawShaderMaterial({
            vertexShader,
            fragmentShader,
            glslVersion: THREE.GLSL3,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
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

        this.gui = new GUI({ title: 'Fase 8: Ruido Superficial' });
        this.setupUI();
    }

    private setupUI() {
        this.gui.add(this.params, 'speed', 0, 5).name('Vel. Ruido').onChange(v => this.material.uniforms.u_speed.value = v);
        this.gui.add(this.params, 'attraction', 0.1, 10.0).name('Frec. Ruido').onChange(v => this.material.uniforms.u_attraction.value = v);
        this.gui.add(this.params, 'pointSize', 0.1, 20.0).name('Tamaño').onChange(v => this.material.uniforms.u_pointSize.value = v);
        this.gui.add(this.params, 'showHelper').name('Mostrar Guías').onChange(v => {
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

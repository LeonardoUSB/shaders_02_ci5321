import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import type { RasenganPhase } from '../fase';
import vertexShader from './vertex.glsl?raw';
import fragmentShader from './fragment.glsl?raw';

export class Espirales_Circulares implements RasenganPhase {
    public container: THREE.Group;
    private geometry: THREE.BufferGeometry;
    private material: THREE.RawShaderMaterial;
    private points: THREE.Points;
    private gui: GUI;
    private sphereHelper: THREE.Mesh; // Esfera de alambre
    private axisHelper: THREE.AxesHelper; // Ejes X, Y, Z

    private params = {
        speed: 10.0,      // Cantidad de giros de la espiral
        attraction: 0.2,   // Velocidad del viaje A -> B
        pointSize: 20.0,
        color: '#44aaff',
        showHelper: true
    };

    constructor() {
        this.container = new THREE.Group();

        //  REFERENCIAS VISUALES (Helpers) 
        
       
        this.axisHelper = new THREE.AxesHelper(3); // Tamaño 3
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

        

        const count = 10;
        const positions = new Float32Array(count * 3);
        const ids = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            ids[i] = i; // IDs del 0 al 9
        }

        this.geometry = new THREE.BufferGeometry();
         
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('aId', new THREE.BufferAttribute(ids, 1));

        
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

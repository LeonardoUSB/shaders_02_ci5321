import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import type { RasenganPhase } from '../fase';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';

export class Espiral_Circular implements RasenganPhase {
    public container: THREE.Group;
    private geometry: THREE.BufferGeometry;
    private material: THREE.RawShaderMaterial;
    private points: THREE.Points;
    private gui: GUI;

    // Referencias visuales añadidas
    private sphereHelper: THREE.Mesh;
    private axisHelper: THREE.AxesHelper;
    

    private params = {
        speed: 4.0,
        attraction: 0.5,
        pointSize: 30.0,
        color: '#44aaff',
        showHelper: true
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

        // GEOMETRIA:
        this.geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(3); // [0, 0, 0]
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        //  MATERIAL
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

        this.gui = new GUI({ title: 'Control Viajera' });
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

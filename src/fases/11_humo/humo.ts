import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import type { RasenganPhase } from '../fase';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';

export class Humo implements RasenganPhase {
    public container: THREE.Group;
    private geometry: THREE.BufferGeometry;
    private material: THREE.RawShaderMaterial;
    private points: THREE.Points;
    private gui: GUI;
    private coreSphere: THREE.Mesh;

    private params = {
        particleCount: 90000,
        pointSize: 50.0,
        emitSpeed: 0.1,
        expansion: 1.0,
        turbulence: 0.0,
        upward: 3.0,
        density: 0.1,
        color: '#8f9499',
        coreRadius: 0.05,
        centerYOffset: -1.5,
        showCore: false
    };

    constructor() {
        this.container = new THREE.Group();
        this.container.position.y = this.params.centerYOffset;

        const coreGeo = new THREE.SphereGeometry(this.params.coreRadius, 32, 32);
        const coreMat = new THREE.MeshStandardMaterial({
            color: 0x1d1f24,
            roughness: 1.0,
            metalness: 0.0,
            transparent: true,
            opacity: 0.85
        });
        this.coreSphere = new THREE.Mesh(coreGeo, coreMat);
        this.coreSphere.visible = this.params.showCore;
        this.container.add(this.coreSphere);

        const hemi = new THREE.HemisphereLight(0xbfc4cc, 0x08090b, 0.65);
        this.container.add(hemi);

        const dir = new THREE.DirectionalLight(0xffffff, 0.3);
        dir.position.set(2, 2, 2);
        this.container.add(dir);

        const count = this.params.particleCount;
        const positions = new Float32Array(count * 3);
        const seeds = new Float32Array(count * 3);
        const spawnOffsets = new Float32Array(count);

        const dirVec = new THREE.Vector3();

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            dirVec.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();

            // Posicion inicial sobre la superficie de la esfera nucleo
            positions[i3] = dirVec.x * this.params.coreRadius;
            positions[i3 + 1] = dirVec.y * this.params.coreRadius;
            positions[i3 + 2] = dirVec.z * this.params.coreRadius;

            // Semilla unica por particula para variaciones aleatorias en el shader
            seeds[i3] = Math.random();
            seeds[i3 + 1] = Math.random();
            seeds[i3 + 2] = Math.random();

            // Desfase temporal de emision.
            spawnOffsets[i] = Math.random();
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3));
        this.geometry.setAttribute('aSpawnOffset', new THREE.BufferAttribute(spawnOffsets, 1));

        this.material = new THREE.RawShaderMaterial({
            vertexShader,
            fragmentShader,
            glslVersion: THREE.GLSL3,
            transparent: true,
            depthWrite: false,
            blending: THREE.NormalBlending,
            uniforms: {
                u_time: { value: 0.0 },
                u_pointSize: { value: this.params.pointSize },
                u_emitSpeed: { value: this.params.emitSpeed },
                u_expansion: { value: this.params.expansion },
                u_turbulence: { value: this.params.turbulence },
                u_upward: { value: this.params.upward },
                u_density: { value: this.params.density },
                u_coreRadius: { value: this.params.coreRadius },
                u_color: { value: new THREE.Color(this.params.color) },
                projectionMatrix: { value: new THREE.Matrix4() },
                viewMatrix: { value: new THREE.Matrix4() },
                modelMatrix: { value: new THREE.Matrix4() }
            }
        });

        this.points = new THREE.Points(this.geometry, this.material);
        this.container.add(this.points);

        this.gui = new GUI({ title: 'Humo' });
        this.setupUI();
    }

    private setupUI() {
        this.gui.add(this.params, 'emitSpeed', 0.05, 1.0).name('Velocidad Emision').onChange(v => {
            this.material.uniforms.u_emitSpeed.value = v;
        });

        this.gui.add(this.params, 'expansion', 0.5, 5.0).name('Expansion').onChange(v => {
            this.material.uniforms.u_expansion.value = v;
        });

        this.gui.add(this.params, 'upward', 0.0, 3.0).name('Ascenso').onChange(v => {
            this.material.uniforms.u_upward.value = v;
        });

        this.gui.add(this.params, 'turbulence', 0.0, 2.0).name('Turbulencia').onChange(v => {
            this.material.uniforms.u_turbulence.value = v;
        });

        this.gui.add(this.params, 'density', 0.1, 1.0).name('Densidad').onChange(v => {
            this.material.uniforms.u_density.value = v;
        });

        this.gui.add(this.params, 'pointSize', 2.0, 50.0).name('Tamano Particula').onChange(v => {
            this.material.uniforms.u_pointSize.value = v;
        });

        this.gui.addColor(this.params, 'color').name('Color Humo').onChange(v => {
            this.material.uniforms.u_color.value.set(v);
        });

        this.gui.add(this.params, 'showCore').name('Mostrar Nucleo').onChange(v => {
            this.coreSphere.visible = v;
        });

        this.gui.add(this.params, 'centerYOffset', -2.0, 1.0).name('Altura Centro').onChange(v => {
            this.container.position.y = v;
        });
    }

    public update(time: number, camera: THREE.PerspectiveCamera) {
        this.material.uniforms.u_time.value = time;
        this.material.uniforms.viewMatrix.value = camera.matrixWorldInverse;
        this.material.uniforms.projectionMatrix.value = camera.projectionMatrix;
        this.coreSphere.scale.setScalar(1.0);
    }

    public dispose() {
        this.gui.destroy();
        this.geometry.dispose();
        this.material.dispose();
        this.coreSphere.geometry.dispose();
        (this.coreSphere.material as THREE.Material).dispose();
    }
}

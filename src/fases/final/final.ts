import * as THREE from 'three';
import type { RasenganPhase } from '../fase';
import vertexShader from './vertex.glsl?raw';
import fragmentShader from './fragment.glsl?raw';

export class ChaosPhase implements RasenganPhase {
    public container: THREE.Group;
    private geometry: THREE.BufferGeometry;
    private material: THREE.ShaderMaterial;

    constructor() {
        this.container = new THREE.Group();
        const count = 15000; // Más partículas para el efecto final

        this.geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const randoms = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Distribución: núcleo denso + hilos externos
            const isOuter = Math.random() > 0.7;
            const r = isOuter ? 0.8 + Math.random() * 0.7 : Math.random() * 0.8;
            
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            randoms[i] = Math.random();
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: { uTime: { value: 0 } },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const points = new THREE.Points(this.geometry, this.material);
        this.container.add(points);
    }

    update(time: number) {
        this.material.uniforms.uTime.value = time;
        // Rotación violenta del contenedor
        this.container.rotation.y = time * 2.0;
        this.container.rotation.z = time * 1.5;
    }

    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}

import * as THREE from 'three';
import type { RasenganPhase } from '../fase';
import vertexShader from './vertex.glsl?raw';
import fragmentShader from './fragment.glsl?raw';

export class RotationPhase implements RasenganPhase {
    public container: THREE.Group;
    private geometry: THREE.BufferGeometry;
    private material: THREE.ShaderMaterial;

    constructor() {
        this.container = new THREE.Group();
        const count = 8000;

        this.geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const randoms = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Creamos partículas en forma de "capas" o anillos
            const radius = 0.8 + Math.random() * 0.4; 
            const theta = Math.random() * Math.PI * 2;
            const phi = (Math.random() - 0.5) * Math.PI; // Inclinación aleatoria

            positions[i * 3] = radius * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi); // Un poco de altura
            positions[i * 3 + 2] = radius * Math.sin(theta);

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
        // Hacemos que todo el grupo rote un poco para añadir caos
        this.container.rotation.x = time * 0.2;
        this.container.rotation.z = time * 0.1;
    }

    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}

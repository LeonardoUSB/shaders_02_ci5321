import * as THREE from 'three';

export interface RasenganPhase {
    // El objeto que contiene todas las partículas de esta fase
    container: THREE.Group; 
    
    // Lo que pasa en cada frame (animación)
    update(time: number): void; 
    
    // Limpieza de memoria (importante para que no se trabe el PC)
    dispose(): void; 
}

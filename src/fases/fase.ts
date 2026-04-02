import * as THREE from 'three';
//Esta es la interfaz principal que deben cumplir todos los shaders para ser mostrados
export interface RasenganPhase {
    // El objeto que contiene todas las particulas de esta fase
    container: THREE.Group; 
    
    // Lo que pasa en cada frame 
    update(time: number, camera: THREE.PerspectiveCamera): void; 
    
    // Limpieza de memoria 
    dispose(): void; 
}

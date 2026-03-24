uniform float uTime;
attribute float aRandom; // Un número aleatorio único para cada partícula

void main() {
    vec3 pos = position;

    // Efecto de compresión: 
    // Usamos el tiempo y el valor aleatorio para que la partícula "vuelva" al centro
    float progress = mod(uTime * 0.5 + aRandom, 1.0); 
    
    // Multiplicamos la posición original por el progreso inverso (de 1.0 a 0.0)
    pos *= (1.0 - progress);

    // Proyectar la posición al espacio 3D de la pantalla
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Tamaño de la partícula (más grande cuanto más cerca de la cámara)
    gl_PointSize = 2.0 * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}

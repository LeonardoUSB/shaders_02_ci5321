uniform float uTime;
attribute float aRandom;
varying float vOpacity;

// Función de ruido simple para simular turbulencia
float noise(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
}

void main() {
    vec3 pos = position;
    
    // 1. Movimiento base de rotación muy rápida
    float angle = uTime * 10.0 * aRandom;
    pos.x += cos(angle + aRandom) * 0.2;
    pos.z += sin(angle + aRandom) * 0.2;
    
    // 2. El "Caos": Desplazamiento errático usando ruido
    float noiseFactor = noise(pos + uTime * 0.5);
    pos += (noiseFactor - 0.5) * 0.4; 

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Tamaño intermitente para efecto de "chispa"
    float sparkle = sin(uTime * 20.0 + aRandom * 10.0) * 0.5 + 0.5;
    gl_PointSize = (1.5 + sparkle) * (1.0 / -mvPosition.z);
    
    gl_Position = projectionMatrix * mvPosition;
    
    // Opacidad aleatoria para que parezcan hilos de energía
    vOpacity = sparkle * aRandom;
}

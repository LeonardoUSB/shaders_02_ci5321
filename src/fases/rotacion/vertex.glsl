uniform float uTime;
attribute float aRandom;
varying float vOpacity;

void main() {
    vec3 pos = position;
    
    // 1. Definimos una velocidad basada en el tiempo y el valor aleatorio
    float speed = uTime * (3.0 + aRandom * 2.0);
    
    // 2. Rotación en el plano XZ (Giro horizontal)
    float angle = speed;
    float c = cos(angle);
    float s = sin(angle);
    
    // Aplicamos una matriz de rotación simple
    float x = pos.x * c - pos.z * s;
    float z = pos.x * s + pos.z * c;
    
    pos.x = x;
    pos.z = z;

    // 3. Añadimos un pequeño bamboleo en Y para que no sea un disco perfecto
    pos.y += sin(uTime + aRandom * 10.0) * 0.1;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // El tamaño varía un poco para dar sensación de energía vibrante
    gl_PointSize = (2.0 + sin(uTime * 10.0 + aRandom) * 1.0) * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    
    vOpacity = 0.6 + sin(uTime * 5.0 + aRandom) * 0.4;
}

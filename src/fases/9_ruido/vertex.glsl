in float aId; 
in float aOffset; 

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float u_time;
uniform float u_speed;      
uniform float u_attraction; 
uniform float u_pointSize;

// Esto devuelve un valor "aleatorio" basado en un vector 3d
float hash(vec3 p) {
    p  = fract(p * 0.1031);
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
}

// Devuelve un punto en la esfera de forman randomizada
vec3 randomSpherePoint(vec3 seed) {
    float u = hash(seed);
    float v = hash(seed + 123.45);
    float theta = u * 6.283185;
    float phi = acos(2.0 * v - 1.0);
    return vec3(sin(phi) * cos(theta), sin(phi) * sin(theta), cos(phi));
}

void main() {
    vec3 seed = vec3(aId, aOffset, 0.0);
    vec3 pos = randomSpherePoint(seed);

    // Desplazamos la semilla
    // u_speed controla qué tan rápido cambia el ruido
    float noise = hash(pos + u_time * u_speed);
    
    // El ruido solo afecta un poco la dirección antes de normalizar
    vec3 finalPos = normalize(pos + (noise - 0.5) * u_attraction) * 2.0;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(finalPos, 1.0);
    
    // Tamaño aleatorio para romper la uniformidad visual
    float sizeVar = hash(seed + 50.0);
    gl_PointSize = u_pointSize * sizeVar * (1.0 / gl_Position.w);
}

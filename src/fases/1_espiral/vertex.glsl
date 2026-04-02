
// Matrices obligatorias
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

// Uniforms personalizados de tu clase
uniform float u_time;
uniform float u_speed;
uniform float u_attraction;
uniform float u_pointSize;

void main() {
    // Calculamos el progreso del ciclo (0.0 a 1.0)
    // El radio disminuye con el tiempo para acercarse al centro (0,0,0)
    float progress = mod(u_time * u_attraction, 1.0); 
    float r = 2.0 * (1.0 - progress); 
    
    // Calculamos el angulo de rotación
    float angle = u_time * u_speed;

    // Convertimos de coordenadas polares a cartesianas (X, Y)
    // Dejamos Z en 0.0 para una espiral 2D, o cámbialo para 3D
    vec3 newPos = vec3(
        r * cos(angle),
        r * sin(angle),
        0
    );
    
    // Transformaciones estandar de espacio
    vec4 modelPosition = modelMatrix * vec4(newPos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Tamaño de la particula
    gl_PointSize = u_pointSize;
}

// Atributos obligatorios para RawShaderMaterial
in vec3 position;

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
    // 1. Calculamos el progreso del ciclo (0.0 a 1.0)
    // El radio disminuye con el tiempo para acercarse al centro (0,0,0)
    float progress = mod(u_time * u_attraction, 1.0);
    float r = 2.0 * (1.0 - progress); 
    
    // 2. Calculamos el ángulo de rotación
    float angle = u_time * u_speed;

    // 3. Convertimos de coordenadas polares a cartesianas (X, Y)
    // Dejamos Z en 0.0 para una espiral 2D, o cámbialo para 3D
    vec3 newPos = vec3(
        r * cos(angle),
        r * sin(angle),
        0.0
    );

    // 4. Transformaciones estándar de espacio
    vec4 modelPosition = modelMatrix * vec4(newPos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // 5. Tamaño del punto (partícula)
    gl_PointSize = u_pointSize;
}

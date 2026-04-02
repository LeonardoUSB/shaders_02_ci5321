
in float aId; 
in float aOffset; // El lugar de la partícula en la fila

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float u_time;
uniform float u_speed;      
uniform float u_attraction; 
uniform float u_pointSize;

vec3 alignToVector(vec3 v, vec3 target) {
    vec3 t = normalize(target);
    vec3 up = abs(t.y) > 0.9 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
    vec3 right = normalize(cross(up, t));
    vec3 actualUp = cross(t, right);
    return v.x * right + v.y * actualUp + v.z * t;
}

void main() {
    
    float progress = mod(u_time  + aOffset, 1.0);
    float PI = 3.14159265;

    // Definimos los Ejes
    vec3 targetDir;
    int id = int(aId);
    switch(id) {
        case 0: targetDir = vec3(1.0, 0.0, 0.0); break;
        case 1: targetDir = vec3(0.0, 1.0, 0.0); break;
        case 2: targetDir = vec3(0.0, 0.0, 1.0); break;
        case 3: targetDir = vec3(-1.0, 0.0, 0.0); break;
        case 4: targetDir = vec3(0.0, -1.0, 0.0); break;
        case 5: targetDir = vec3(0.0, 0.0, -1.0); break;
        case 6: targetDir = vec3(1.0, 1.0, 1.0); break;
        case 7: targetDir = vec3(-1.0, 1.0, 1.0); break;
        case 8: targetDir = vec3(1.0, -1.0, 1.0); break;
        case 9: targetDir = vec3(1.0, 1.0, -1.0); break;
        default: targetDir = vec3(1.0, 0.0, 0.0); break;
    }

    // Movimiento alrededor del Eje
    float R = 2.0;
    float travelZ = R * cos(progress * PI); 
    float spiralAmp = R * sin(progress * PI);
    float angle = progress * u_speed * PI * 2.0;
    
    vec3 localPos = vec3(cos(angle) * spiralAmp, sin(angle) * spiralAmp, travelZ);

    // Mover hacia el eje
    vec3 finalPos = alignToVector(localPos, targetDir);

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(finalPos, 1.0);
    
    // Transparencia en los polos para que no se vea el "corte" de nacimiento
    float appearance = sin(progress * PI);
    gl_PointSize = u_pointSize * appearance * (1.0 / gl_Position.w);
}

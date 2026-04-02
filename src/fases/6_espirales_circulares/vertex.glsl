in vec3 position;
in float aId; 

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float u_time;
uniform float u_speed;      
uniform float u_attraction; 
uniform float u_pointSize;

// Funcion para orientar el movimiento local hacia un eje objetivo
vec3 alignToVector(vec3 v, vec3 target) {
    vec3 t = normalize(target);
    vec3 up = abs(t.y) > 0.9 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
    vec3 right = normalize(cross(up, t));
    vec3 actualUp = cross(t, right);
    return v.x * right + v.y * actualUp + v.z * t;
}

void main() {
    
    float progress = mod(u_time * u_attraction, 1.0);
    float PI = 3.14159265;

    // Definir 10 ejes de rotacion
    vec3 targetDir;
    int id = int(aId);

    switch(id) {
        // Ejes Principales
        
        case 0: targetDir = vec3(1.0, 0.0, 0.0); break;  // Eje X
        case 1: targetDir = vec3(0.0, 1.0, 0.0); break;  // Eje Y
        case 2: targetDir = vec3(0.0, 0.0, 1.0); break;  // Eje Z
        
        
        
        case 3: targetDir = vec3(-1.0, 0.0, 0.0); break; // Eje -X
        case 4: targetDir = vec3(0.0, -1.0, 0.0); break; // Eje -Y
        case 5: targetDir = vec3(0.0, 0.0, -1.0); break; // Eje -Z
        
        
        // Diagonales
        case 6: targetDir = vec3(1.0, 1.0, 1.0); break;
        case 7: targetDir = vec3(-1.0, 1.0, 1.0); break;
        case 8: targetDir = vec3(1.0, -1.0, 1.0); break;
        case 9: targetDir = vec3(1.0, 1.0, -1.0); break;
        
        default: targetDir = vec3(1.0, 0.0, 0.0); break;
        
    }

    // Generar espiral alrededor del circulo
    float R = 2.0;
    float travelZ = R * cos(progress * PI); 
    float spiralAmp = R * sin(progress * PI);
    float angle = progress * u_speed * PI * 2.0;
    
    vec3 localPos = vec3(cos(angle) * spiralAmp, sin(angle) * spiralAmp, travelZ);

    //Mover el giro al eje correspondiente
    vec3 finalPos = alignToVector(localPos, targetDir);

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(finalPos, 1.0);
    
    
    gl_PointSize = u_pointSize;
}

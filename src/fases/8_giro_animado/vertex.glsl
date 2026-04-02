in vec3 position;
in float aId; 
in float aOffset; 

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float u_time;
uniform float u_speed;      
uniform float u_attraction; 
uniform float u_pointSize;

vec3 rotateVector(vec3 v, float angleY, float angleZ) {
    float sY = sin(angleY);
    float cY = cos(angleY);
    v = vec3(v.x * cY + v.z * sY, v.y, -v.x * sY + v.z * cY);
    
    float sZ = sin(angleZ);
    float cZ = cos(angleZ);
    v = vec3(v.x * cZ - v.y * sZ, v.x * sZ + v.y * cZ, v.z);
    
    return v;
}

vec3 alignToVector(vec3 v, vec3 target) {
    vec3 t = normalize(target);
    vec3 up = abs(t.y) > 0.9 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
    vec3 right = normalize(cross(up, t));
    vec3 actualUp = cross(t, right);
    return v.x * right + v.y * actualUp + v.z * t;
}

void main() {
    float progress = mod(u_time * u_attraction + aOffset, 1.0);
    float PI = 3.14159265;

    // Definir los 10 ejes
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

    // Movimiento a lo largo del eje
    float R = 2.0;
    float travelZ = R * cos(progress * PI); 
    float spiralAmp = R * sin(progress * PI);
    float angle = progress * u_speed * PI * 2.0;
    
    vec3 localPos = vec3(cos(angle) * spiralAmp, sin(angle) * spiralAmp, travelZ);

    // Usamos el ID para crear variaciones en la velocidad y dirección
    // Multiplicamos u_time por valores que dependen de aId
    float idF = float(id);
    
    // Cada eje tendrá una velocidad ligeramente distinta (0.3, 0.35, 0.4...)
    // Y algunos rotaran en sentido contrario gracias al sin(idF)
    float rotSpeedY = 0.3 + (idF * 0.05); 
    float rotSpeedZ = 0.2 + (sin(idF) * 0.1); 

    float axisRotationY = u_time * rotSpeedY;
    float axisRotationZ = u_time * rotSpeedZ;
    
    vec3 rotatedTarget = rotateVector(targetDir, axisRotationY, axisRotationZ);

    // Mover hacia el eje objetivo
    vec3 finalPos = alignToVector(localPos, rotatedTarget);

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(finalPos, 1.0);
    
    float appearance = sin(progress * PI);
    gl_PointSize = u_pointSize * appearance * (1.0 / gl_Position.w);
}

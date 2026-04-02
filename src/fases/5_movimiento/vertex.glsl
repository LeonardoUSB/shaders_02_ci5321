

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float u_time;
uniform float u_speed;      
uniform float u_attraction; 
uniform float u_pointSize;

// Funcion para rotar un vector en los ejes Y y Z
vec3 rotateAxis(vec3 v, float angleY, float angleZ) {
    // Rotacion en Y
    float sY = sin(angleY);
    float cY = cos(angleY);
    v = vec3(v.x * cY + v.z * sY, v.y, -v.x * sY + v.z * cY);
    
    // Rotacion en Z
    float sZ = sin(angleZ);
    float cZ = cos(angleZ);
    v = vec3(v.x * cZ - v.y * sZ, v.x * sZ + v.y * cZ, v.z);
    
    return v;
}

void main() {
   
    float progress = mod(u_time , 1.0);
    float PI = 3.14159265;

    // Calculo de la espiral en el circulo 
    float R = 2.0; 
    float travelX = R * cos(progress * PI);
    float spiralAmplitude = R * sin(progress * PI);
    
    float angle = progress * u_speed * PI * 2.0;
    float z = sin(angle) * spiralAmplitude;
    float y = cos(angle) * spiralAmplitude;

    vec3 localPos = vec3(travelX, y, z); 

    //  Movimiento de Eje
    // Hacemos que el eje gire basándose en el tiempo global
    
    float axisRotationY = u_time * 0.5;
    float axisRotationZ = u_time * 0.3;
    
    vec3 rotatedPos = rotateAxis(localPos, axisRotationY, axisRotationZ);

    
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(rotatedPos, 1.0);
    
    gl_PointSize = u_pointSize ;
}

in vec3 position;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float u_time;
uniform float u_speed;      
uniform float u_pointSize;
uniform float u_attraction;

void main() {
    float progress = mod(u_time * u_attraction, 1.0);
    float PI = 3.14159265;

    //Movimiento alrededor del diametro (De R a -R en el eje X)
    float R = 2.0; 
    float travelX = R * cos(progress * PI);
    
    // Amplitud de la espiral
    float spiralAmplitude = R * sin(progress * PI);
    
    // Giro
    float angle = progress * u_speed * PI * 2.0;
    float z = sin(angle) * spiralAmplitude;
    float y = cos(angle) * spiralAmplitude;

    
    vec3 newPos = vec3(travelX, y, z); 

    
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPos, 1.0);
    
    
    gl_PointSize = u_pointSize ;
}

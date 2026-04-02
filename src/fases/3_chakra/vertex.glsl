
in float aId; 
in float aOffset;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float u_time;
uniform float u_speed;
uniform float u_attraction;
uniform float u_pointSize;

void main() {
    // Las particulas usan el mismo progreso global pero con un offset para que aparezcan a destiempo
    float progress = mod(u_time * u_attraction + aOffset, 1.0);
        
    
    float r = 2.0 * (1.0 - progress);
    
    float angle = (progress * 6.2831) * u_speed; 

    float s = sin(angle) * r;
    float c = cos(angle) * r;

    vec3 newPos;
    int id = int(aId);

    switch(id) {
        //  PLANO XZ 
        case 0: newPos = vec3(c, 0.0, s);   break; // +X
        case 1: newPos = vec3(-c, 0.0, -s);  break; // -X
        case 2: newPos = vec3(-s, 0.0, c);   break; // +Z
        case 3: newPos = vec3(s, 0.0, -c);   break; // -Z

        //  PLANO YZ 
        case 4: newPos = vec3(0.0, c, s);   break; // +Y
        case 5: newPos = vec3(0.0, -c, -s);  break; // -Y
        case 6: newPos = vec3(0.0, -s, c);   break; // +Z (en este plano)
        case 7: newPos = vec3(0.0, s, -c);   break; // -Z (en este plano)

        //  PLANO XY 
        case 8:  newPos = vec3(c, s, 0.0);   break; 
        case 9:  newPos = vec3(-c, -s, 0.0);  break;
        case 10: newPos = vec3(-s, c, 0.0);   break;
        case 11: newPos = vec3(s, -c, 0.0);   break;

        // PLANO INCLINADO A 
        case 12: newPos = vec3(c,  s,  c)* 0.707;  break; 
        case 13: newPos = vec3(-c, -s, -c)* 0.707; break;
        case 14: newPos = vec3(-s,  c, -s)* 0.707; break;
        case 15: newPos = vec3(s,  -c,  s)* 0.707; break;

        // PLANO INCLINADO B 
        case 16: newPos = vec3(c,  s, -c)* 0.707;  break; 
        case 17: newPos = vec3(-c, -s,  c)* 0.707; break;
        case 18: newPos = vec3(-s,  c,  s)* 0.707; break;
        case 19: newPos = vec3(s,  -c, -s)* 0.707; break;

        default: newPos = vec3(0.0); break;

    }

    
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPos, 1.0);
    gl_PointSize = u_pointSize;
}

    

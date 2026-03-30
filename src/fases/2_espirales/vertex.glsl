
in vec3 position;
in float aId; // El "DNI" de la partícula

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform float u_time;
uniform float u_speed;
uniform float u_attraction;
uniform float u_pointSize;

void main() {
    // 1. ELIMINAMOS el offset del tiempo para sincronizar el nacimiento
    // Ahora todas las partículas usan el mismo progreso global
    float progress = mod(u_time * u_attraction, 1.0);
    
    // 2. Todas tendrán el mismo radio en el mismo instante
    float r = 2.0 * (1.0 - progress);

    // 3. El ángulo también debe ser igual para todas (o desfasado solo si quieres)
    float angle = (progress * 6.2831) * u_speed; 

    float s = sin(angle) * r;
    float c = cos(angle) * r;

    vec3 newPos;

    // 2. ASIGNACIÓN DE PLANOS (Ejes X, Y, Z combinados)
    int id = int(aId);
    switch(id) {
        // --- PLANO XZ (Suelo / Horizontal) ---
        case 0: newPos = vec3(c, 0.0, s);   break; // +X
        case 1: newPos = vec3(-c, 0.0, -s);  break; // -X
        case 2: newPos = vec3(-s, 0.0, c);   break; // +Z
        case 3: newPos = vec3(s, 0.0, -c);   break; // -Z

        // --- PLANO YZ (Vertical / Lateral) ---
        // Aquí X siempre es 0.0, y usamos c y s para Y y Z
        case 4: newPos = vec3(0.0, c, s);   break; // +Y
        case 5: newPos = vec3(0.0, -c, -s);  break; // -Y
        case 6: newPos = vec3(0.0, -s, c);   break; // +Z (en este plano)
        case 7: newPos = vec3(0.0, s, -c);   break; // -Z (en este plano)

        case 8:  newPos = vec3(c, s, 0.0);   break; 
        case 9:  newPos = vec3(-c, -s, 0.0);  break;
        case 10: newPos = vec3(-s, c, 0.0);   break;
        case 11: newPos = vec3(s, -c, 0.0);   break;

        // --- PLANO INCLINADO A (Diagonal principal) ---
        // Aquí las partículas se mueven proporcionalmente en X, Y y Z
        case 12: newPos = vec3(c,  s,  c);  break; 
        case 13: newPos = vec3(-c, -s, -c); break;
        case 14: newPos = vec3(-s,  c, -s); break;
        case 15: newPos = vec3(s,  -c,  s); break;

        // --- PLANO INCLINADO B (Diagonal invertida) ---
        // Invertimos un eje para que cruce la otra dirección del volumen
        case 16: newPos = vec3(c,  s, -c);  break; 
        case 17: newPos = vec3(-c, -s,  c); break;
        case 18: newPos = vec3(-s,  c,  s); break;
        case 19: newPos = vec3(s,  -c, -s); break;

        default: newPos = vec3(0.0); break;

    }

    // 3. Transformación final
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPos, 1.0);
    gl_PointSize = u_pointSize;
}

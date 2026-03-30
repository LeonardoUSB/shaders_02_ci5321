precision mediump float;

// Recibimos el color desde los uniforms de la clase
uniform vec3 u_color;

// Salida obligatoria en GLSL 3.0
out vec4 fragColor;

void main() {
    // 1. Calculamos la distancia desde el centro del punto (0.5, 0.5)
    float dist = distance(gl_PointCoord, vec2(0.5));

    // 2. Creamos un efecto de "Soft Circular Particle"
    // En lugar de un corte seco con discard, usamos una caída suave (glow)
    if (dist > 0.5) {
        discard;
    }

    // 3. Intensidad de la luz: más brillante en el centro, se desvanece al borde
    float strength = 1.0 - (dist * 2.0);
    
    // Elevamos a una potencia para que el núcleo sea más denso
    strength = pow(strength, 2.0);

    // 4. Resultado final: Color de la GUI + opacidad basada en la fuerza
    // El AdditiveBlending en el TypeScript hará que brille donde se toquen
    fragColor = vec4(u_color, strength);
}

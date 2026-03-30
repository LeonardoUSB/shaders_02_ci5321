precision mediump float;

// Recibimos el color desde la GUI
uniform vec3 u_color;

// Salida de color obligatoria en GLSL 3.0
out vec4 fragColor;

void main() {
    // gl_PointCoord nos da las coordenadas dentro del cuadrado del punto (0.0 a 1.0)
    // Calculamos la distancia desde el centro (0.5, 0.5)
    float dist = distance(gl_PointCoord, vec2(0.5));

    // Si la distancia es mayor a 0.5, descartamos el píxel (crea el círculo)
    if (dist > 0.5) {
        discard;
    }

    // Suavizamos los bordes del círculo (opcional)
    float strength = 1.0 - (dist * 2.0);
    strength = pow(strength, 1.5); // Le da un toque más "brillante" en el centro

    fragColor = vec4(u_color, strength);
}

void main() {
    // Crear una forma circular (por defecto las partículas son cuadradas)
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard; // Tirar a la basura los píxeles fuera del círculo

    // Color azul neón con un degradado hacia el centro
    float strength = 1.0 - (dist * 2.0);
    gl_FragColor = vec4(0.0, 0.8, 1.0, strength);
}

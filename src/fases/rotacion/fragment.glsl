varying float vOpacity;

void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;

    // Color azul cian con la opacidad variable que viene del Vertex Shader
    gl_FragColor = vec4(0.0, 0.9, 1.0, vOpacity * (1.0 - dist * 2.0));
}

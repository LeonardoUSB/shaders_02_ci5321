varying float vOpacity;

void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;

    // Un azul más blanquecino para el centro de los rayos
    vec3 color = vec3(0.4, 0.9, 1.0);
    float glow = pow(1.0 - dist * 2.0, 2.0);
    
    gl_FragColor = vec4(color, vOpacity * glow);
}

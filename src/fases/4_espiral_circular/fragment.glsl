precision mediump float;

uniform vec3 u_color;
out vec4 fragColor;

void main() {
    vec2 uv = gl_PointCoord;
    float dist = distance(uv, vec2(0.5));
    float alpha = smoothstep(0.5, 0.1, dist);
    if (alpha < 0.01) discard;
    fragColor = vec4(u_color * alpha, alpha);
}

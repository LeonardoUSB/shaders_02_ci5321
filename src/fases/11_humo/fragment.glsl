precision highp float;

uniform vec3 u_color;

in float vAlpha;
in float vLife;

out vec4 fragColor;

void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);

    if (d > 0.5) {
        discard;
    }

    float core = smoothstep(0.5, 0.0, d);
    float soft = pow(core, 1.7);

    float lightness = mix(0.85, 1.05, vLife);
    vec3 col = u_color * lightness;

    float alpha = soft * vAlpha;

    if (alpha < 0.01) {
        discard;
    }

    fragColor = vec4(col, alpha);
}

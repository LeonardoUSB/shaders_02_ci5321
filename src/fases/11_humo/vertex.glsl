in vec3 position;
in vec3 aSeed;
in float aSpawnOffset;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float u_time;
uniform float u_pointSize;
uniform float u_emitSpeed;
uniform float u_expansion;
uniform float u_turbulence;
uniform float u_upward;
uniform float u_density;
uniform float u_coreRadius;

out float vAlpha;
out float vLife;

void main() {
    float age = fract(u_time * u_emitSpeed + aSpawnOffset);

    vec3 dir = normalize(position);

    float radial = u_coreRadius + age * u_expansion;

    float n1 = sin((aSeed.x + u_time * 0.7 + age * 8.0) * 6.2831);
    float n2 = cos((aSeed.y + u_time * 0.6 + age * 6.0) * 6.2831);
    float n3 = sin((aSeed.z + u_time * 0.5 + age * 10.0) * 6.2831);

    vec3 turbulence = vec3(n1, n2, n3) * (u_turbulence * (0.15 + age * 0.85));
    vec3 upward = vec3(0.0, age * age * u_upward, 0.0);

    vec3 worldPos = dir * radial + turbulence + upward;

    vec4 mvPosition = viewMatrix * modelMatrix * vec4(worldPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float perspective = 1.0 / max(0.25, -mvPosition.z);
    float seedMix = aSeed.x * 12.9898 + aSeed.y * 78.233 + aSeed.z * 37.719;
    float sizeRand = 0.75 + (0.5 + 0.5 * sin(seedMix)) * 0.75;

    gl_PointSize = u_pointSize * sizeRand * perspective * (0.35 + age * 1.15);

    float fadeIn = smoothstep(0.0, 0.12, age);
    float fadeOut = 1.0 - smoothstep(0.58, 1.0, age);
    vAlpha = fadeIn * fadeOut * u_density;
    vLife = age;
}

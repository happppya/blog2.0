// LensingEffect.ts
import { Effect } from 'postprocessing';
import { Uniform } from 'three';

const LensingShader = /* glsl */ `
  uniform float mass;
  uniform float innerRadius;
  uniform float outerRadius;
  uniform float aspect;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 p = uv - 0.5;
    p.x *= aspect;

    float r = length(p);
    
    if (r < outerRadius) {
      // Gravitational lensing equation approximation
      float distortion = mass * (outerRadius - r) / (outerRadius - innerRadius);
      p -= normalize(p) * distortion * 0.1; 
    }

    p.x /= aspect;
    vec2 bentUv = p + 0.5;

    // Mask the pure black singularity
    if (r < innerRadius) {
      outputColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
      outputColor = texture2D(inputBuffer, bentUv);
    }
  }
`;

export class LensingEffect extends Effect {
  constructor({ mass = 0.8, innerRadius = 0.08, outerRadius = 0.105, aspect = 1.0 }) {
    super('LensingEffect', LensingShader, {
      uniforms: new Map([
        ['mass', new Uniform(mass)],
        ['innerRadius', new Uniform(innerRadius)],
        ['outerRadius', new Uniform(outerRadius)],
        ['aspect', new Uniform(aspect)]
      ])
    });
  }
}
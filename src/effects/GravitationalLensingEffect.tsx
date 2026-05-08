import { Effect } from "postprocessing";
import { Uniform, Vector2 } from "three";

const glsl = `
uniform vec2 center;
uniform float mass;
uniform float aspect;
uniform float innerRadius;
uniform float outerRadius;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 dir = uv - center;
    dir.x *= aspect; 

    float dist = length(dir);

    if (dist < innerRadius || dist > outerRadius) {
        outputColor = inputColor;
        return;
    }

    float warp = (mass / dist) * 0.05; 
    
    float fadeIn = smoothstep(innerRadius, innerRadius + 0.03, dist);
    float fadeOut = smoothstep(outerRadius, outerRadius - 0.1, dist);
    
    vec2 warpVector = normalize(dir) * warp * (fadeIn * fadeOut);
    warpVector.x /= aspect; 

    vec2 warpedUV = uv - warpVector;
    outputColor = texture2D(inputBuffer, warpedUV);
}
`;

/**
 * WebGL post-processing effect for annular gravitational lensing.
 */
export class GravitationalLensingEffect extends Effect {
  /**
   * @param {Object} options
   * @param {Vector2} options.center Normalized screen coordinates (0.0 to 1.0).
   * @param {number} options.mass Intensity of the spatial distortion.
   * @param {number} options.aspect Screen aspect ratio.
   * @param {number} options.innerRadius Minimum normalized distance; distortion is 0 inside this.
   * @param {number} options.outerRadius Maximum normalized distance; distortion is 0 outside this.
   */
  constructor({ 
    center = new Vector2(0.5, 0.5), 
    mass = 0.15, 
    aspect = 1.0, 
    innerRadius = 0.1, 
    outerRadius = 0.4 
  } = {}) {
    super("GravitationalLensingEffect", glsl, {
      uniforms: new Map<string, Uniform>([
        ["center", new Uniform(center)],
        ["mass", new Uniform(mass)],
        ["aspect", new Uniform(aspect)],
        ["innerRadius", new Uniform(innerRadius)],
        ["outerRadius", new Uniform(outerRadius)],
      ]),
    });
  }
}
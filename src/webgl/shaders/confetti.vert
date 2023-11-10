#define PHONG

varying vec3 vViewPosition;
uniform float time;

#ifndef FLAT_SHADED

  varying vec3 vNormal;

#endif

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {
  #include <uv_vertex>
  #include <uv2_vertex>
  #include <color_vertex>

  #include <beginnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <defaultnormal_vertex>

#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED

  vNormal = normalize( transformedNormal );

#endif

  #include <begin_vertex>

  float deg = 20.0 * sin(position.y + time);
  float rad = deg * 3.14159 / 180.0;
  transformed.x *= sin(rad + (time / position.x)) / 2.0;
  transformed.z += sin(rad);

  vNormal.x *= sin(rad);

  #include <morphtarget_vertex>
  #include <skinning_vertex>
  #include <displacementmap_vertex>
  #include <project_vertex>
  #include <logdepthbuf_vertex>
  #include <clipping_planes_vertex>

  #include <worldpos_vertex>
  #include <envmap_vertex>
  #include <shadowmap_vertex>
  #include <fog_vertex>

}

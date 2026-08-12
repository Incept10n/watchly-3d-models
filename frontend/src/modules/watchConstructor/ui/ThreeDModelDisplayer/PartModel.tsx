import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { FC } from "react";

import type { Part, PartType } from "@/shared/types";

// Real watch parts are ~0.1m. Anything far bigger is a broken export
// (e.g. Blender's default 2m cube) that would break camera fit, so skip it.
const MAX_MODEL_DIMENSION = 0.5;

// Every part GLB bakes its own glass dome on top of the dial. The crystal part
// is the only one that should contribute glass; the others' copies sit at the
// same origin and re-sort when parts are swapped, making parts vanish or go
// see-through. Hide those, but keep logo/label materials (BLEND with alpha 1).
const GLASS_OPACITY_THRESHOLD = 0.95;

const isTranslucent = (material: THREE.Material) =>
  material.transparent && material.opacity < GLASS_OPACITY_THRESHOLD;

type PartModelProps = {
  part?: Part;
};

type LoadedModelProps = {
  url: string;
  partType: PartType;
};

const LoadedModel: FC<LoadedModelProps> = ({ url, partType }) => {
  const { scene } = useGLTF(url);

  const object = useMemo(() => {
    const size = new THREE.Box3()
      .setFromObject(scene)
      .getSize(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);

    if (maxDimension > MAX_MODEL_DIMENSION) {
      console.warn(
        `[ThreeDModelDisplayer] model "${url}" is ${maxDimension.toFixed(2)}m — skipping it`,
      );
      return null;
    }

    // Fresh object graph per mount so re-mounting a cached model is clean.
    const clone = scene.clone(true);

    if (partType !== "CRYSTAL") {
      // Collect glass meshes first (traversal order can't be mutated mid-walk),
      // then reparent their children up one level so only the glass geometry is
      // hidden — not the whole subtree (e.g. the blue bezel's ring is a child
      // of its glass mesh).
      const translucentMeshes: THREE.Mesh[] = [];
      clone.traverse((node) => {
        if (!(node as THREE.Mesh).isMesh) return;
        const mesh = node as THREE.Mesh;
        const material = Array.isArray(mesh.material)
          ? mesh.material[0]
          : mesh.material;
        if (material && isTranslucent(material)) {
          translucentMeshes.push(mesh);
        }
      });

      for (const mesh of translucentMeshes) {
        if (mesh.parent) {
          for (const child of [...mesh.children]) {
            mesh.parent.attach(child);
          }
        }
        mesh.visible = false;
      }
    }

    return clone;
  }, [scene, partType, url]);

  if (!object) return null;

  return <primitive object={object} />;
};

export const PartModel: FC<PartModelProps> = ({ part }) => {
  if (!part?.modelUrl) return null;

  return <LoadedModel url={part.modelUrl} partType={part.type} />;
};

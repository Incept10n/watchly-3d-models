import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { FC } from "react";

import type { Part } from "@/shared/types";

// Real watch parts are ~0.1m. Anything far bigger is a broken export
// (e.g. Blender's default 2m cube) that would break camera fit, so skip it.
const MAX_MODEL_DIMENSION = 0.5;

type PartModelProps = {
  part?: Part;
};

type LoadedModelProps = {
  url: string;
};

const LoadedModel: FC<LoadedModelProps> = ({ url }) => {
  const { scene } = useGLTF(url);

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

  return <primitive object={scene} />;
};

export const PartModel: FC<PartModelProps> = ({ part }) => {
  if (!part?.modelUrl) return null;

  return <LoadedModel url={part.modelUrl} />;
};

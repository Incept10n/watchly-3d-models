import {
  Component,
  Suspense,
  useLayoutEffect,
  useState,
  type FC,
  type ReactNode,
} from "react";
import clsx from "clsx";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import {
  Bounds,
  OrbitControls,
  PerspectiveCamera,
  useProgress,
} from "@react-three/drei";

import { Button } from "@/shared/ui/atoms/Button";

import { useWatchConstructor } from "../../store";
import { PartModel } from "./PartModel";

import styles from "./ThreeDModelDisplayer.module.scss";

type ThreeDModelDisplayerProps = {
  className?: string;
};

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// Metals (metalness ~1) reflect only the environment map — without one they
// render flat and dark. Provide an offline studio-like env (no network fetch),
// unlike drei's <Environment preset> which downloads an HDR at runtime.
const StudioEnvironment = () => {
  const { gl, scene } = useThree();

  useLayoutEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    /* eslint-disable react-hooks/immutability */
    scene.environment = environment;
    /* eslint-enable react-hooks/immutability */
    return () => {
      scene.environment = null;
      environment.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  return null;
};

export const ThreeDModelDisplayer: FC<ThreeDModelDisplayerProps> = ({
  className,
}) => {
  const { currentWatch } = useWatchConstructor();
  const { active, progress } = useProgress();
  const [autoRotate, setAutoRotate] = useState(true);
  const [boundsKey, setBoundsKey] = useState(0);

  const parts = Object.values(currentWatch).filter((part) => part?.modelUrl);

  const resetView = () => setBoundsKey((key) => key + 1);

  return (
    <div className={clsx(styles.modelContainer, className)}>
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault fov={45} position={[0, 0.3, 5]} />
        <StudioEnvironment />

        <ambientLight intensity={0.6} />
        <hemisphereLight intensity={0.5} />
        <directionalLight position={[5, 8, 6]} intensity={1.6} />

        <Bounds key={boundsKey} fit clip observe margin={0.95}>
          <Suspense fallback={null}>
            {parts.map((part) => (
              <ErrorBoundary key={`${part.type}-${part.id}`} fallback={null}>
                <PartModel part={part} />
              </ErrorBoundary>
            ))}
          </Suspense>
        </Bounds>

        <OrbitControls
          makeDefault
          enableDamping
          autoRotate={autoRotate}
          autoRotateSpeed={1.2}
        />
      </Canvas>

      {active && (
        <div className={styles.loader}>Loading {Math.round(progress)}%</div>
      )}

      <div className={styles.controls}>
        <Button type="button" onClick={() => setAutoRotate((value) => !value)}>
          {autoRotate ? "Остановить вращение" : "Возобновить вращение"}
        </Button>
        <Button type="button" onClick={resetView}>
          Сбросить камеру
        </Button>
      </div>
    </div>
  );
};

import { Component, Suspense, useState, type FC, type ReactNode } from "react";
import clsx from "clsx";
import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  OrbitControls,
  PerspectiveCamera,
  useProgress,
} from "@react-three/drei";

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

        <ambientLight intensity={0.6} />
        <hemisphereLight intensity={0.5} />
        <directionalLight position={[5, 8, 6]} intensity={1.6} />

        <Bounds key={boundsKey} fit clip observe margin={1.25}>
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
        <button type="button" onClick={() => setAutoRotate((value) => !value)}>
          {autoRotate ? "Stop rotation" : "Auto rotate"}
        </button>
        <button type="button" onClick={resetView}>
          Reset view
        </button>
      </div>
    </div>
  );
};

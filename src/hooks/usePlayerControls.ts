import { useEffect, useRef } from 'react';

export type Movement = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
};

export type MouseState = {
  angleY: number;     // horizontal orbit (radians)
  angleX: number;     // vertical tilt (radians)
};

/**
 * Ref-based keyboard + mouse input.
 * Mouse moves the camera orbit angle via pointer lock.
 * Keys reset on blur so they never get "stuck".
 */
export const usePlayerControls = () => {
  const movement = useRef<Movement>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  const mouse = useRef<MouseState>({
    angleY: 0,
    angleX: 0.3, // slight downward tilt
  });

  useEffect(() => {
    const set = (code: string, value: boolean) => {
      switch (code) {
        case 'KeyW': case 'ArrowUp':    movement.current.forward  = value; break;
        case 'KeyS': case 'ArrowDown':  movement.current.backward = value; break;
        case 'KeyA': case 'ArrowLeft':  movement.current.left     = value; break;
        case 'KeyD': case 'ArrowRight': movement.current.right    = value; break;
        case 'Space':                   movement.current.jump     = value; break;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') e.preventDefault();
      set(e.code, true);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      set(e.code, false);
    };

    const onBlur = () => {
      movement.current.forward  = false;
      movement.current.backward = false;
      movement.current.left     = false;
      movement.current.right    = false;
      movement.current.jump     = false;
    };

    // Mouse movement for camera orbit (works with pointer lock)
    const sensitivity = 0.003;
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        mouse.current.angleY -= e.movementX * sensitivity;
        mouse.current.angleX = Math.max(
          -0.5,
          Math.min(1.2, mouse.current.angleX - e.movementY * sensitivity)
        );
      }
    };

    // Click canvas to activate pointer lock
    const onClick = (e: MouseEvent) => {
      const canvas = (e.target as HTMLElement).closest('canvas');
      if (canvas && !document.pointerLockElement) {
        canvas.requestPointerLock();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) onBlur();
    });

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
    };
  }, []);

  return { movement, mouse };
};

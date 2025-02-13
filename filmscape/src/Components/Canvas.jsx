import React, { useRef } from 'react';
import { Stage, Layer, Rect } from 'react-konva';

const Canvas = () => {
  const stageRef = useRef(null);

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
    >
      <Layer>
        <Rect
          x={20}
          y={20}
          width={100}
          height={100}
          fill="red"
          draggable
        />
      </Layer>
    </Stage>
  );
};

export default Canvas; 
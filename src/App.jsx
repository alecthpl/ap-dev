import { useRef, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Stage, useGLTF, Text } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Vector3 } from 'three'

// camera controls - move with mouse movement
const Rig = () => {
  const { camera, mouse } = useThree()
  const vec = new Vector3()

  return useFrame(() => {
    camera.position.lerp(vec.set(mouse.x, mouse.y, camera.position.z), 0.1)
    camera.lookAt(0, 0, 0)
  })
}

const Box = () => {
  const boxRef = useRef()
  
  useFrame(({ mouse, viewport }) => {
    let x = (mouse.x * viewport.width) / 2.5
    let y = (mouse.y * viewport.height) / 2.5

    // set max values for x and y
    if (x > 2.65) {
      x = 2.65
    }

    if (y < -1.93) {
      y = -1.93
    }

    if (y > 0.53) {
      y = 0.53
    }

    boxRef.current.lookAt(x, y, 1)
  })

  return (
    <mesh position={[2.25, 0.8, 2.15]} rotation={[0, 180, 0]} ref={ boxRef }>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  )
}

const Link = () => {
  const linkRef = useRef()
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
  })

  return (
    <mesh
      position={[3.5, 2, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation()
        window.location = 'https://github.com/alecthpl'
      }}
    >
      <planeGeometry args={[2, 0.8]} />
      <Text
        scale={0.4}
        color="#000"
        position={[-0.1, -0.1, 0.2]}
      >
        GitHub
      </Text>
    </mesh>
  )
}

function App() {
  const monitor = useGLTF('./models/monitor.glb')
  const body = useGLTF('./models/body.glb')

  return (
    <>
      <EffectComposer>
        <Bloom mipmapBlur />
      </EffectComposer>

      <Rig />

      <group>
        <Text
          position={[4, 4, 0]}
          font="./fonts/bangers.ttf"
          scale={1.2}
          letterSpacing={0.2}
        >
          Alec Plummer
        </Text>
        <Text
          position={[3.7, 3, 0]}
          scale={0.6}
          font="./fonts/bangers.ttf"
          letterSpacing={0.1}
        >
          Software Engineer
        </Text>

        <Link />
      </group>

      <Stage
        shadows={{
          type: 'contact',
          opacity: 1,
          blur: 0.4,
          intensity: 20
        }}
      >
        <primitive object={monitor.scene} scale={1} position={[-3, -1.2, -6]} rotation={[0, 1, 0]}>
          <mesh position={[0.6, 3.4, 1.6]} rotation={[0, 0, 0]}>
            <planeGeometry args={[6.2, 5.1]} />
            <meshStandardMaterial color={[2.5, 5, 4]} toneMapped={false} />
          </mesh>
        </primitive>

        <group position={[1, 0, -6]}>
          <primitive object={body.scene} scale={0.5} position={[2, -1.35, 2]} rotation={[0, 180, 0]} />
          <meshStandardMaterial toneMapped={false} />
          <Box />
        </group>
      </Stage>
    </>
  )
}

export default App

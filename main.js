import './style.css'

import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('canvas')
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.setZ(30)

// transparent background color
renderer.setClearColor(0x000000, 0)

// lighting
const ambientLight = new THREE.AmbientLight(0xdfe6e9)
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(20, 20, 20)

scene.add(ambientLight, pointLight)

// stars
const randomizeNumber = (min, max) => {
  return 0.01 + (Math.random() * (0.1 - 0.01))
}

let stars = []
const addStar = () => {
  const geometry = new THREE.TetrahedronGeometry(
    randomizeNumber(5, 15),
    0
  )
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const star = new THREE.Mesh(geometry, material)

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))
  star.position.set(x, y, z)
  stars.push(star)
  scene.add(star)
}

Array(1000).fill().forEach(addStar)

const animate = () => {
  requestAnimationFrame(animate)

  // add animations here
  stars.forEach(star => {
    star.rotation.x += randomizeNumber(0.01, 0.1)
    star.rotation.y += randomizeNumber(0.01, 0.05)
  })

  camera.rotation.z -= 0.0001
  camera.rotation.y += 0.0001
  
  renderer.render(scene, camera)
}

animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
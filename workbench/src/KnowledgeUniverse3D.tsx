import { useEffect, useMemo, useRef } from 'react'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js'
import { SRGBColorSpace } from 'three/src/constants.js'
import { BufferGeometry } from 'three/src/core/BufferGeometry.js'
import { Raycaster } from 'three/src/core/Raycaster.js'
import { SphereGeometry } from 'three/src/geometries/SphereGeometry.js'
import { TorusGeometry } from 'three/src/geometries/TorusGeometry.js'
import { GridHelper } from 'three/src/helpers/GridHelper.js'
import { AmbientLight } from 'three/src/lights/AmbientLight.js'
import { DirectionalLight } from 'three/src/lights/DirectionalLight.js'
import { Color } from 'three/src/math/Color.js'
import { Vector2 } from 'three/src/math/Vector2.js'
import { Vector3 } from 'three/src/math/Vector3.js'
import { LineBasicMaterial } from 'three/src/materials/LineBasicMaterial.js'
import { LineDashedMaterial } from 'three/src/materials/LineDashedMaterial.js'
import { type Material } from 'three/src/materials/Material.js'
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial.js'
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial.js'
import { SpriteMaterial } from 'three/src/materials/SpriteMaterial.js'
import { Line } from 'three/src/objects/Line.js'
import { Mesh } from 'three/src/objects/Mesh.js'
import { Sprite } from 'three/src/objects/Sprite.js'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer.js'
import { Scene } from 'three/src/scenes/Scene.js'
import { CanvasTexture } from 'three/src/textures/CanvasTexture.js'
import { Group } from 'three/src/objects/Group.js'
import type { Object3D } from 'three/src/core/Object3D.js'
import type { UniverseLink, UniverseNode } from './generated/knowledgeUniverse.generated'

type KnowledgeUniverse3DProps = {
  nodes: UniverseNode[]
  links: UniverseLink[]
  selectedNodeId: string | null
  onSelectNode: (node: UniverseNode) => void
  onOpenNode?: (node: UniverseNode) => void
}

function labelSprite(text: string, color: string) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = 512
  canvas.height = 128

  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = 'rgba(255,255,255,0.9)'
    context.strokeStyle = color
    context.lineWidth = 5
    context.beginPath()
    context.roundRect(12, 26, 488, 72, 18)
    context.fill()
    context.stroke()
    context.fillStyle = '#202936'
    context.font = '600 36px Segoe UI, Arial, sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(text.slice(0, 22), 256, 64)
  }

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  const material = new SpriteMaterial({ map: texture, transparent: true })
  const sprite = new Sprite(material)
  sprite.scale.set(5.4, 1.35, 1)
  return sprite
}

function nodeRadius(node: UniverseNode) {
  if (node.kind === 'core') return 1.25
  if (node.kind === 'subject') return 0.72 + node.weight * 0.48
  if (node.kind === 'bridge') return 0.52
  return 0.28 + node.weight * 0.28
}

function linkMaterial(link: UniverseLink) {
  const opacity = link.type === 'sample_file' ? 0.26 : link.riskLevel === 'stable' ? 0.58 : 0.82
  const lineWidth = link.riskLevel === 'risk' ? 4 : link.riskLevel === 'lesson' ? 3 : link.riskLevel === 'watch' ? 2.4 : 1

  if (link.riskLevel === 'risk' || link.riskLevel === 'lesson' || link.riskLevel === 'watch') {
    return new LineDashedMaterial({
      color: link.color,
      dashSize: link.riskLevel === 'lesson' ? 0.52 : 0.95,
      gapSize: link.riskLevel === 'risk' ? 0.34 : 0.42,
      linewidth: lineWidth,
      transparent: true,
      opacity,
    })
  }

  return new LineBasicMaterial({
    color: link.color,
    linewidth: lineWidth,
    transparent: true,
    opacity,
  })
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function KnowledgeUniverse3D({
  nodes,
  links,
  selectedNodeId,
  onSelectNode,
  onOpenNode,
}: KnowledgeUniverse3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const selectRef = useRef(onSelectNode)
  const openRef = useRef<KnowledgeUniverse3DProps['onOpenNode']>(undefined)
  const selectedRef = useRef(selectedNodeId)

  const nodeById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes])

  useEffect(() => {
    selectRef.current = onSelectNode
    openRef.current = onOpenNode
    selectedRef.current = selectedNodeId
  }, [onOpenNode, onSelectNode, selectedNodeId])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new Scene()
    scene.background = new Color('#eef2f5')

    const camera = new PerspectiveCamera(52, mount.clientWidth / Math.max(mount.clientHeight, 1), 0.1, 1000)
    const cameraTarget = new Vector3(0, 0, 0)
    let cameraYaw = 0
    let cameraPitch = 0.4
    let cameraDistance = 56
    const updateCamera = () => {
      camera.position.set(
        cameraTarget.x + Math.sin(cameraYaw) * Math.cos(cameraPitch) * cameraDistance,
        cameraTarget.y + Math.sin(cameraPitch) * cameraDistance,
        cameraTarget.z + Math.cos(cameraYaw) * Math.cos(cameraPitch) * cameraDistance,
      )
      camera.lookAt(cameraTarget)
      mount.dataset.controlsTarget = cameraTarget.toArray().map((value) => value.toFixed(3)).join(',')
    }
    updateCamera()

    const renderer = new WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.outputColorSpace = SRGBColorSpace
    mount.appendChild(renderer.domElement)

    mount.dataset.panEnabled = 'true'
    mount.dataset.autoRotate = 'false'
    mount.dataset.controlMode = 'custom-left-pan-right-rotate'
    mount.dataset.maxTargetRadius = '48'

    const graphGroup = new Group()
    scene.add(graphGroup)

    const ambient = new AmbientLight('#ffffff', 2.4)
    const key = new DirectionalLight('#ffffff', 2.1)
    key.position.set(8, 16, 12)
    scene.add(ambient, key)

    const grid = new GridHelper(64, 16, '#c7d0d9', '#dfe5ea')
    grid.position.y = -11
    graphGroup.add(grid)

    const nodeMeshes: Mesh[] = []
    const selectedRing = new Mesh(
      new TorusGeometry(1.45, 0.045, 12, 72),
      new MeshBasicMaterial({ color: '#101828' }),
    )
    selectedRing.visible = false
    graphGroup.add(selectedRing)

    for (const link of links) {
      const source = nodeById.get(link.source)
      const target = nodeById.get(link.target)
      if (!source || !target) continue

      const geometry = new BufferGeometry().setFromPoints([
        new Vector3(...source.position),
        new Vector3(...target.position),
      ])
      const material = linkMaterial(link)
      const line = new Line(geometry, material)
      if (material instanceof LineDashedMaterial) line.computeLineDistances()
      graphGroup.add(line)
    }

    for (const node of nodes) {
      const geometry = new SphereGeometry(nodeRadius(node), 24, 16)
      const material = new MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: node.kind === 'file' ? 0.12 : 0.26,
        roughness: 0.48,
        metalness: 0.12,
      })
      const mesh = new Mesh(geometry, material)
      mesh.position.set(...node.position)
      mesh.userData.nodeId = node.id
      graphGroup.add(mesh)
      nodeMeshes.push(mesh)

      if (node.kind === 'core' || node.kind === 'subject' || node.kind === 'bridge') {
        const sprite = labelSprite(node.label, node.color)
        sprite.position.set(node.position[0], node.position[1] + nodeRadius(node) + 1.1, node.position[2])
        graphGroup.add(sprite)
      }
    }

    const raycaster = new Raycaster()
    const pointer = new Vector2()
    const pickNode = (event: PointerEvent | MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects(nodeMeshes, false)[0]
      if (!hit) return null
      const id = hit.object.userData.nodeId as string
      return nodeById.get(id) ?? null
    }

    const updateSelectedRing = () => {
      const selected = selectedRef.current
      if (!selected) {
        selectedRing.visible = false
        return
      }
      const mesh = nodeMeshes.find((item) => item.userData.nodeId === selected)
      if (!mesh) {
        selectedRing.visible = false
        return
      }
      const selectedNode = nodeById.get(selected)
      if (!selectedNode) return
      selectedRing.visible = true
      selectedRing.position.copy(mesh.position)
      selectedRing.scale.setScalar(Math.max(nodeRadius(selectedNode) * 1.15, 0.9))
      selectedRing.lookAt(camera.position)
    }

    let dragMode: 'pan' | 'rotate' | null = null
    let lastPointerX = 0
    let lastPointerY = 0
    const limitTarget = () => {
      if (cameraTarget.length() > 48) cameraTarget.setLength(48)
    }

    const onPointerDown = (event: PointerEvent) => {
      const node = pickNode(event)
      if (node) selectRef.current(node)
      dragMode = event.button === 2 ? 'rotate' : 'pan'
      lastPointerX = event.clientX
      lastPointerY = event.clientY
      renderer.domElement.setPointerCapture(event.pointerId)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!dragMode) return
      const dx = event.clientX - lastPointerX
      const dy = event.clientY - lastPointerY
      lastPointerX = event.clientX
      lastPointerY = event.clientY

      if (dragMode === 'rotate') {
        cameraYaw -= dx * 0.008
        cameraPitch = clamp(cameraPitch + dy * 0.006, -1.18, 1.18)
      } else {
        camera.updateMatrixWorld()
        const right = new Vector3().setFromMatrixColumn(camera.matrix, 0)
        const up = new Vector3().setFromMatrixColumn(camera.matrix, 1)
        const panScale = cameraDistance * 0.0016
        cameraTarget.addScaledVector(right, -dx * panScale)
        cameraTarget.addScaledVector(up, dy * panScale)
        limitTarget()
      }
      updateCamera()
    }

    const onPointerUp = (event: PointerEvent) => {
      dragMode = null
      if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId)
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      cameraDistance = clamp(cameraDistance * Math.exp(event.deltaY * 0.001), 18, 95)
      updateCamera()
    }

    const onDoubleClick = (event: MouseEvent) => {
      const node = pickNode(event)
      if (!node) return
      selectRef.current(node)
      openRef.current?.(node)
    }

    const onResize = () => {
      const width = mount.clientWidth
      const height = Math.max(mount.clientHeight, 1)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      updateCamera()
    }

    const onContextMenu = (event: MouseEvent) => event.preventDefault()

    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerup', onPointerUp)
    renderer.domElement.addEventListener('pointercancel', onPointerUp)
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false })
    renderer.domElement.addEventListener('dblclick', onDoubleClick)
    renderer.domElement.addEventListener('contextmenu', onContextMenu)
    window.addEventListener('resize', onResize)

    let frame = 0
    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      frame += 1
      selectedRing.rotation.z = frame * 0.015
      updateSelectedRing()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerup', onPointerUp)
      renderer.domElement.removeEventListener('pointercancel', onPointerUp)
      renderer.domElement.removeEventListener('wheel', onWheel)
      renderer.domElement.removeEventListener('dblclick', onDoubleClick)
      renderer.domElement.removeEventListener('contextmenu', onContextMenu)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      scene.traverse((object: Object3D) => {
        const disposable = object as Mesh | Line | Sprite
        if ('geometry' in disposable && disposable.geometry) disposable.geometry.dispose()
        if ('material' in disposable && disposable.material) {
          const materials = Array.isArray(disposable.material) ? disposable.material : [disposable.material]
          materials.forEach((material: Material) => material.dispose())
        }
      })
      mount.removeChild(renderer.domElement)
    }
  }, [links, nodeById, nodes])

  return <div className="universe-canvas" ref={mountRef} />
}

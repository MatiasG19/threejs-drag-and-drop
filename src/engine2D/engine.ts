import * as THREE from 'three'
import { Mesh, BoxGeometry, MeshBasicMaterial } from 'three'
import { DragControls } from './dragControls'

export class Engine2D {
  private renderer!: THREE.WebGLRenderer
  private scene!: THREE.Scene
  private camera!: THREE.OrthographicCamera
  private objects: THREE.Mesh<BoxGeometry>[] = []
  private dragControls!: DragControls

  constructor(canvas: HTMLCanvasElement) {
    // Scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xffffff)
    this.scene.scale.set(1, 1, 1)

    // Light
    const light = new THREE.AmbientLight(0xffffff)
    this.scene.add(light)

    // Axes
    const axesHelper = new THREE.AxesHelper(400)
    this.scene.add(axesHelper)

    // Camera
    const frustumSize = 1000
    const aspect = window.innerWidth / window.innerHeight
    this.camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      1,
      1000
    )

    // this.camera = new THREE.OrthographicCamera(
    //   //   canvas.width / -2,
    //   //   canvas.width / -2,
    //   //   canvas.height / -2,
    //   //   canvas.height / -2,
    //   window.innerWidth / -2,
    //   window.innerWidth / 2,
    //   window.innerHeight / 2,
    //   window.innerHeight / -2,
    //   1,
    //   2000
    // )
    this.camera.position.x = 0
    this.camera.position.y = -10
    this.camera.position.z = 1000

    // Box
    const geometry = new THREE.BoxGeometry(100, 50, 400)
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
    const box = new THREE.Mesh(geometry, material)
    box.position.x = 20
    box.position.y = 20
    box.position.z = 10

    this.scene.add(box)
    this.objects.push(box)

    // Box2
    const geometry2 = new THREE.BoxGeometry(100, 50, 400)
    const material2 = new THREE.MeshBasicMaterial({ color: 0xff5500 })
    const box2 = new THREE.Mesh(geometry2, material2)
    box2.position.x = 100
    box2.position.y = 20
    box2.position.z = 10

    this.scene.add(box2)
    this.objects.push(box2)

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.render(this.scene, this.camera)

    window.addEventListener('resize', this.resize.bind(this))

    // Enable drag controls
    this.enableDragControls()
  }

  private enableDragControls() {
    this.dragControls = new DragControls(
      this.objects,
      this.camera,
      this.renderer.domElement
    )
    this.dragControls.addEventListener(
      'dragstart',
      this.onPointerDown.bind(this)
    )
    this.dragControls.addEventListener('drag', this.onMove.bind(this))
    this.dragControls.addEventListener('dragend', this.onPointerUp.bind(this))
  }

  private onPointerDown(event: THREE.Event) {
    const object = this.objects.filter((o) => o == event.object)[0] as Mesh<
      BoxGeometry,
      MeshBasicMaterial
    >
    object.material.color.addScalar(0.5)
    this.renderer.render(this.scene, this.camera)
  }

  private onMove() {
    this.renderer.render(this.scene, this.camera)
  }

  private onPointerUp(event: THREE.Event) {
    const object = this.objects.filter((o) => o == event.object)[0] as Mesh<
      BoxGeometry,
      MeshBasicMaterial
    >
    object.material.color.addScalar(-0.5)
    this.renderer.render(this.scene, this.camera)
  }

  private resize() {
    // this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.render(this.scene, this.camera)
  }

  public dispose() {
    this.dragControls.removeEventListener(
      'dragstart',
      this.onPointerDown.bind(this)
    )
    this.dragControls.removeEventListener('drag', this.onMove.bind(this))
    this.dragControls.removeEventListener(
      'dragend',
      this.onPointerUp.bind(this)
    )
    this.dragControls.dispose()
  }
}

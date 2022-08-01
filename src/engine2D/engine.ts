import * as THREE from 'three'
import { BoxGeometry } from 'three'
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

        // Light
        const light = new THREE.AmbientLight(0xffffff)
        this.scene.add(light)

        // Axes
        const axesHelper = new THREE.AxesHelper(400);
        this.scene.add(axesHelper);

        // Camera
        this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 2000)
        this.camera.position.x = -15;
        this.camera.position.y = -10;
        this.camera.position.z = 1000;

        // Box
        const geometry = new THREE.BoxGeometry(400, 400, 400)
        const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
        const box = new THREE.Mesh(geometry, material)
        box.position.x = 20
        box.position.y = 20
        box.position.z = 10

        this.scene.add(box)
        this.objects.push(box)

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.render(this.scene, this.camera)

        // Enable drag controls
        this.enableDragControls()
    }

    private enableDragControls() {
        this.dragControls = new DragControls(this.objects, this.camera, this.renderer.domElement)
        this.dragControls.addEventListener('dragstart', this.onPointerDown.bind(this))
        this.dragControls.addEventListener('drag', this.onMove.bind(this))
        this.dragControls.addEventListener('dragend', this.onPointerUp.bind(this))
    }

    private onPointerDown(event: THREE.Event) {
        const object = this.objects.filter(o => o == event.object)[0]
        // console.log(object)
        const material = new THREE.MeshLambertMaterial({ color: 0x009992 })
        // object.material= material
        // object.material.emissive.set(0x009992)
        object.material.color = new THREE.Color(0x009992)
        this.renderer.render(this.scene, this.camera)
    }

    private onMove() {
        this.renderer.render(this.scene, this.camera)
    }

    private onPointerUp(event: THREE.Event) {
        const object = this.objects.filter(o => o == event.object)[0]
        object.material.color = new THREE.Color(0x0000ff)
        this.renderer.render(this.scene, this.camera)
    }

    private resize() {

    }

    public dispose() {
        this.dragControls.removeEventListener('dragstart', this.onPointerDown.bind(this))
        this.dragControls.removeEventListener('drag', this.onMove.bind(this))
        this.dragControls.removeEventListener('dragend', this.onPointerUp.bind(this))
        this.dragControls.dispose()
    }
}
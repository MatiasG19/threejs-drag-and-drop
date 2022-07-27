import * as THREE from 'three'

export class Engine2D {
    private renderer!: THREE.WebGLRenderer
    private scene!: THREE.Scene
    private camera!: THREE.OrthographicCamera

    constructor(canvas: HTMLCanvasElement) {
        // Scene
        this.scene = new THREE.Scene()

        const light = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(light)

        // Camera
        this.camera = new THREE.OrthographicCamera()

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.render(this.scene, this.camera);
    }
}
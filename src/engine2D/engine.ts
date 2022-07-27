import * as THREE from 'three'

export class Engine2D {
    private renderer!: THREE.WebGLRenderer
    private scene!: THREE.Scene
    private camera!: THREE.OrthographicCamera

    constructor(canvas: HTMLCanvasElement) {
        // Scene
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0xffffff)

        const light = new THREE.AmbientLight(0xffffff)
        this.scene.add(light)

        // Camera
        this.camera = new THREE.OrthographicCamera( window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 2000 )
        this.camera.position.x = -15;
        this.camera.position.y = -10;
        this.camera.position.z = 1000;

        // Box
        const geometry = new THREE.BoxGeometry(400, 400, 400)
        const material = new THREE.MeshBasicMaterial( { color: 0x0000ff })
        const box = new THREE.Mesh(geometry, material);
        this.scene.add(box)

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.render(this.scene, this.camera);
    }

    private resize() {

    }
}
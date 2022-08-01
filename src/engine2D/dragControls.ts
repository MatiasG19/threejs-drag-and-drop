import * as THREE from 'three'
import { EventDispatcher } from 'three'

export class DragControls extends EventDispatcher {

    private raycaster = new THREE.Raycaster()
    private selected!: THREE.Object3D | null

    private pointer = new THREE.Vector2()

    private objects!: THREE.Mesh[]
    private camera!: THREE.Camera
    private canvas!: HTMLCanvasElement

    constructor(objects: THREE.Mesh[], camera: THREE.Camera, canvas: HTMLCanvasElement ) {
        super();

        this.objects = objects
        this.camera = camera
        this.canvas = canvas

        this.activate()
    }

    private activate() {
        this.canvas.addEventListener('pointerdown', this.pointerDown.bind(this))
        this.canvas.addEventListener('pointermove', this.pointerMove.bind(this))
        this.canvas.addEventListener('pointercancel', this.pointerCancel.bind(this))
        this.canvas.addEventListener('pointerup', this.pointerCancel.bind(this))
    }

    private pointerDown(event: PointerEvent) {
        this.updatePointer(event)

        this.raycaster.setFromCamera(this.pointer, this.camera)
        this.selected = this.raycaster.intersectObjects(this.objects)[0].object
        if(this.selected)
            this.dispatchEvent({ type: 'dragstart', object: this.selected })
    }

    private pointerMove(event: PointerEvent) {
        if(this.selected) {
            this.updatePointer(event)
            this.selected.position.x = event.clientX - window.innerWidth / 2
            this.selected.position.y = -event.clientY + window.innerHeight / 2
            this.selected.position.z = 0

    
            this.dispatchEvent({ type: 'drag', object: this.selected })
        }
    }

    private pointerCancel(event: PointerEvent) {
        this.dispatchEvent({ type: 'dragend', object: this.selected })
        this.selected = null

    }

    private updatePointer(event: PointerEvent) {
        this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    public dispose() {
        this.canvas.removeEventListener('pointerdown', this.pointerDown.bind(this))
        this.canvas.removeEventListener('pointermove', this.pointerMove.bind(this))
        this.canvas.removeEventListener('pointercancel', this.pointerCancel.bind(this))
        this.canvas.removeEventListener('pointerup', this.pointerCancel.bind(this))
    }
}
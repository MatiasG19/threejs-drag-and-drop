import * as THREE from 'three'
import { EventDispatcher, Matrix4, Plane, Vector3 } from 'three'

export class DragControls extends EventDispatcher {

    private raycaster = new THREE.Raycaster()
    private selected!: THREE.Object3D | null


    private _plane = new Plane();
    private _offset = new Vector3();
    private _intersection = new Vector3();
    private _worldPosition = new Vector3();
    private _inverseMatrix = new Matrix4();

    private pointer = new THREE.Vector2()

    private objects!: THREE.Mesh[]
    private camera!: THREE.Camera
    private canvas!: HTMLCanvasElement

    constructor(objects: THREE.Mesh[], camera: THREE.Camera, canvas: HTMLCanvasElement) {
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
        if (this.selected) {
            this._plane.setFromNormalAndCoplanarPoint( this.camera.getWorldDirection( this._plane.normal ), this._worldPosition.setFromMatrixPosition( this.selected.matrixWorld ) );

            if ( this.raycaster.ray.intersectPlane( this._plane, this._intersection ) ) {

                this._inverseMatrix.copy( this.selected.parent.matrixWorld ).invert();
                this._offset.copy( this._intersection ).sub( this._worldPosition.setFromMatrixPosition( this.selected.matrixWorld ) );

            }
            this.dispatchEvent({ type: 'dragstart', object: this.selected })
        }
    }

    private pointerMove(event: PointerEvent) {
        if (this.selected) {
            this.updatePointer(event)
            this.raycaster.setFromCamera(this.pointer, this.camera)

            // this.selected.position.x = event.clientX - window.innerWidth / 2
            // this.selected.position.y = -event.clientY + window.innerHeight / 2
            // this.selected.position.z = 0

            if (this.raycaster.ray.intersectPlane(this._plane, this._intersection)) {

                this.selected.position.copy(this._intersection.sub(this._offset).applyMatrix4(this._inverseMatrix));

            }


            this.dispatchEvent({ type: 'drag', object: this.selected })
        }
    }

    private pointerCancel(event: PointerEvent) {
        this.dispatchEvent({ type: 'dragend', object: this.selected })
        this.selected = null

    }

    private updatePointer(event: PointerEvent) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    public dispose() {
        this.canvas.removeEventListener('pointerdown', this.pointerDown.bind(this))
        this.canvas.removeEventListener('pointermove', this.pointerMove.bind(this))
        this.canvas.removeEventListener('pointercancel', this.pointerCancel.bind(this))
        this.canvas.removeEventListener('pointerup', this.pointerCancel.bind(this))
    }
}
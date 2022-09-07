import * as THREE from 'three'
import { BoxGeometry, EventDispatcher, Matrix4, Plane, Vector3 } from 'three'
import { checkCollsion } from './collision'

export class DragControls extends EventDispatcher {
  private raycaster = new THREE.Raycaster()
  private selected!: THREE.Mesh<BoxGeometry> | null

  private _plane = new Plane()
  private _offset = new Vector3()
  private _intersection = new Vector3()
  private _worldPosition = new Vector3()
  private _inverseMatrix = new Matrix4()

  private pointer = new THREE.Vector2()

  constructor(
    private objects: THREE.Mesh<BoxGeometry>[],
    private camera: THREE.Camera,
    private canvas: HTMLCanvasElement
  ) {
    super()

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
    const intersections = this.raycaster.intersectObjects(this.objects)
    if (intersections.length > 0) {
      this.selected = intersections[0].object
      this._plane.setFromNormalAndCoplanarPoint(
        this.camera.getWorldDirection(this._plane.normal),
        this._worldPosition.setFromMatrixPosition(this.selected.matrixWorld)
      )

      if (this.raycaster.ray.intersectPlane(this._plane, this._intersection)) {
        this._inverseMatrix.copy(this.selected.parent.matrixWorld).invert()
        this._offset
          .copy(this._intersection)
          .sub(
            this._worldPosition.setFromMatrixPosition(this.selected.matrixWorld)
          )

        console.log(this.selected.position.x)
        console.log(this.selected.position.y)
      }
      this.dispatchEvent({ type: 'dragstart', object: this.selected })
    }
  }

  private pointerMove(event: PointerEvent) {
    if (this.selected) {
      this.updatePointer(event)
      this.raycaster.setFromCamera(this.pointer, this.camera)

      if (this.raycaster.ray.intersectPlane(this._plane, this._intersection)) {
        this.selected.position.copy(
          this._intersection.sub(this._offset).applyMatrix4(this._inverseMatrix)
        )
      }

      checkCollsion(this.objects, this.selected)

      this.dispatchEvent({ type: 'drag', object: this.selected })
    }
  }

  private pointerCancel(event: PointerEvent) {
    if (this.selected)
      this.dispatchEvent({ type: 'dragend', object: this.selected })
    this.selected = null
  }

  private updatePointer(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect()

    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.pointer.y = (-(event.clientY - rect.top) / rect.height) * 2 + 1
  }

  public dispose() {
    this.canvas.removeEventListener('pointerdown', this.pointerDown.bind(this))
    this.canvas.removeEventListener('pointermove', this.pointerMove.bind(this))
    this.canvas.removeEventListener(
      'pointercancel',
      this.pointerCancel.bind(this)
    )
    this.canvas.removeEventListener('pointerup', this.pointerCancel.bind(this))
  }
}

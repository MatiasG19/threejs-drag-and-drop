import { Mesh, BoxGeometry, MeshBasicMaterial, Vector3 } from 'three'

export function checkCollsion(
  objects: THREE.Mesh<BoxGeometry>[],
  selected: THREE.Mesh<BoxGeometry>
) {
  objects.forEach((object) => {
    if (selected === object) return

    const selectedWidth = selected.geometry.parameters.width
    const selectedHeight = selected.geometry.parameters.height

    const selectedRect = new BoundingRect()
    selectedRect.left = selected.position.x - selectedWidth / 2
    selectedRect.right = selected.position.x + selectedWidth / 2
    selectedRect.top = selected.position.y + selectedHeight / 2
    selectedRect.bottom = selected.position.y - selectedHeight / 2

    const objectWidth = object.geometry.parameters.width
    const objectHeight = object.geometry.parameters.height

    const objectRect = new BoundingRect()
    objectRect.left = object.position.x - objectWidth / 2
    objectRect.right = object.position.x + objectWidth / 2
    objectRect.top = object.position.y + objectHeight / 2
    objectRect.bottom = object.position.y - objectHeight / 2

    if (objectRect.left - selectedWidth < 0) objectRect.left = -100000000
    if (objectRect.bottom - selectedHeight < 0) objectRect.bottom = -100000000

    const directionX = Math.abs(selected.position.x - object.position.x)
    const directionY = Math.abs(selected.position.y - object.position.y)

    // console.log(selectedRect)
    // console.log(objectRect)
    if (
      (directionX >= directionY && objectRect.bottom >= 0) ||
      objectRect.left < 0
    ) {
      if (
        (selectedRect.bottom <= objectRect.top &&
          selectedRect.bottom >= objectRect.bottom) ||
        (selectedRect.top <= objectRect.top &&
          selectedRect.top >= objectRect.bottom)
      ) {
        if (
          selectedRect.left >= objectRect.left &&
          selectedRect.left <= objectRect.right
        ) {
          selected.position.x =
            object.position.x +
            object.geometry.parameters.width / 2 +
            selectedWidth / 2
        } else if (
          selectedRect.right >= objectRect.left &&
          selectedRect.right <= objectRect.right
        ) {
          if (objectRect.bottom - selectedHeight < 0)
            selected.position.x = objectRect.right + selectedWidth / 2
          else
            selected.position.x =
              object.position.x -
              object.geometry.parameters.width / 2 -
              selectedWidth / 2
        }
      }
    } else {
      if (
        (selectedRect.left <= objectRect.right &&
          selectedRect.left >= objectRect.left) ||
        (selectedRect.right <= objectRect.right &&
          selectedRect.right >= objectRect.left) ||
        (selectedRect.right <= objectRect.right &&
          selectedRect.left >= objectRect.left) ||
        (selectedRect.right > objectRect.right &&
          selectedRect.left < objectRect.left)
      ) {
        if (
          selectedRect.top >= objectRect.bottom &&
          selectedRect.top <= objectRect.top
        ) {
          if (objectRect.bottom - selectedHeight < 0)
            selected.position.y =
              object.position.y +
              object.geometry.parameters.height / 2 +
              selectedHeight / 2
          else
            selected.position.y =
              object.position.y -
              object.geometry.parameters.height / 2 -
              selectedHeight / 2
        } else if (
          selectedRect.bottom >= objectRect.bottom &&
          selectedRect.bottom <= objectRect.top
        ) {
          selected.position.y =
            object.position.y +
            object.geometry.parameters.height / 2 +
            selectedHeight / 2
        }
      }
    }
  })
}

class BoundingRect {
  left!: number
  right!: number
  top!: number
  bottom!: number
}

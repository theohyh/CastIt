import { Scene, FreeCamera, Vector3, CreateCapsule } from "@babylonjs/core";
import { PhysicsCharacterController } from "@babylonjs/core/Physics/v2";
import { MeshBuilder } from "@babylonjs/core/Meshes";
import { Mesh } from "@babylonjs/core/Meshes";
import { KeyboardEventTypes } from "@babylonjs/core/Events";
import { Quaternion } from "@babylonjs/core/Maths";


export class PlayerController {
  private mesh: Mesh;
  private characterController: PhysicsCharacterController;
  inputDirection: Vector3;
  characterOrientation: Quaternion;

  constructor(private scene: Scene, private camera: FreeCamera) {
    this.scene = scene;
    this.camera = camera;
    this._setupInput();
    this._createPlayer();
  }

  _createPlayer(): void {

    this.inputDirection = new Vector3(0, -0.5, 0);
    this.characterOrientation = Quaternion.Identity();

    this.mesh = MeshBuilder.CreateCapsule("player", {
      height: 1.8,
      radius: 0.6
    }, this.scene);

    //this.mesh.position = new Vector3(0, 5, 0);

    this.characterController = new PhysicsCharacterController(
      new Vector3(0, 5, 0),
      {
        capsuleHeight: 1.8,
        capsuleRadius: 0.6
      },
      this.scene
    );

    this.scene.registerBeforeRender(() => {

      const pos = this.characterController.getPosition();
      this.mesh.position.copyFrom(pos);
      this.camera.position.copyFrom(pos);

    });
    this._updatePhysics();
  }
  _setupInput(): void {
    this.scene.onKeyboardObservable.add((kbInfo) => {
      switch (kbInfo.type) {
        case KeyboardEventTypes.KEYDOWN:
          if (kbInfo.event.key == 'z') this.inputDirection.z = 1;
          if (kbInfo.event.key == 's') this.inputDirection.z = -1;
          if (kbInfo.event.key == 'q') this.inputDirection.x = -1;
          if (kbInfo.event.key == 'd') this.inputDirection.x = 1;
          break;
        case KeyboardEventTypes.KEYUP:
          if (kbInfo.event.key == 'z') this.inputDirection.z = 0;
          if (kbInfo.event.key == 's') this.inputDirection.z = 0;
          if (kbInfo.event.key == 'q') this.inputDirection.x = 0;
          if (kbInfo.event.key == 'd') this.inputDirection.x = 0;
          break;
      }
    });
  }
  /*
  _update(): void {
    if (!this.scene.deltaTime) return;
    const dt = this.scene.deltaTime / 1000;
    const forward = this.camera.getForwardRay().direction;
    forward.y = 0;
    forward.normalize();
    const right = Vector3.Cross(forward, Vector3.Up()).normalize();

    const moveDir = Vector3.Zero();
    if (this.inputMap["w"]) {
      moveDir.addInPlace(forward);
    }
    if (this.inputMap["s"]) moveDir.addInPlace(forward.scale(-1));
    if (this.inputMap["a"]) moveDir.addInPlace(right.scale(-1));
    if (this.inputMap["d"]) moveDir.addInPlace(right);

    if (moveDir.lengthSquared() === 0) {

      return;
    }

    moveDir.normalize();
    moveDir.scaleInPlace(5);

    const surfaceInfo = this.player.checkSupport(dt, Vector3.Down());

    const currentVelocity = this.player.getVelocity();

    const newVelocity = this.player.calculateMovement(
      dt,
      forward,
      surfaceInfo.averageSurfaceNormal,
      currentVelocity,
      surfaceInfo.averageSurfaceVelocity,
      moveDir,
      Vector3.Up()
    );

    this.player.setVelocity(newVelocity);
    this.player.integrate(dt, surfaceInfo, new Vector3(0, -9.81, 0));
  }
  */

  _updatePhysics(): void {
    this.scene.onAfterPhysicsObservable.add(() => {
      if (this.scene.deltaTime == undefined) return;
      const dt = this.scene.deltaTime / 1000;
      if (dt == 0) return;

      Quaternion.FromEulerAnglesToRef(0, this.camera.rotation.y, 0, this.characterOrientation);

      const displacement = this.inputDirection.scale(dt * 2).applyRotationQuaternion(this.characterOrientation);
      this.characterController.moveWithCollisions(displacement);
    });
  }
}

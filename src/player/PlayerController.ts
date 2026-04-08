import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import { PhysicsShapeType } from "@babylonjs/core/Physics/v2/IPhysicsEnginePlugin";
import {
  PhysicsCharacterController,
  CharacterSupportedState,
} from "@babylonjs/core/Physics/v2/characterController";
import { SpellInterface } from "./spell/SpellInterface";
import { FireBallSpell } from "./spell/FireBallSpell";
import { PointerEventTypes } from "@babylonjs/core";

export class PlayerController {
  private GRAVITY = new Vector3(0, -9.81, 0);
  private JUMP_VELOCITY = 5.0;
  private MOVE_SPEED = 10.0;
  private CAPSULE_HEIGHT = 1.8;
  private CAPSULE_RADIUS = 0.4;
  private CAMERA_HEIGHT_OFFSET = this.CAPSULE_HEIGHT * 0.5 - 0.1;

  private characterController: PhysicsCharacterController;

  private inputMap: Record<string, boolean> = {};
  private wantJump: boolean = false;
  private isJumping: boolean = false;
  private currentSpell: SpellInterface = new FireBallSpell("fireBall");

  constructor(private scene: Scene, private camera: FreeCamera) {
    this.scene = scene;
    this.camera = camera;
    this._createPlayer();
    this._setupInput();
    this._updatePhysics();
  }

  _createPlayer(): void {
    const startPosition = new Vector3(0, 2, -5);
    this.characterController = new PhysicsCharacterController(
      startPosition,
      {
        capsuleHeight: this.CAPSULE_HEIGHT,
        capsuleRadius: this.CAPSULE_RADIUS,
      },
      this.scene
    );
    this.characterController.maxSlopeCosine = Math.cos(Math.PI * (50 / 180)); // 50 deg max slope
    this.characterController.keepDistance = 0.05;
    this.characterController.maxCharacterSpeedForSolver = 10;
    this.characterController.acceleration = 0.08;
    this.characterController.maxAcceleration = 50;
  }

  _setupInput(): void {
    this.scene.onKeyboardObservable.add((kbInfo) => {
      const key = kbInfo.event.key.toLowerCase();
      if (kbInfo.type === 1) {
        this.inputMap[key] = true;
        if (key === ' ') this.wantJump = true;
        //if (key === 'f') this._castCurrentSpell();
      } else {
        this.inputMap[key] = false;
      }
    });
    this.scene.onPointerObservable.add(() => {
      this._castCurrentSpell();
    }, PointerEventTypes.POINTERDOWN)
  }

  _updatePhysics(): void {
    this.scene.onBeforePhysicsObservable.add(() => {
      if (this.scene.deltaTime === undefined) return;
      const dt = this.scene.deltaTime / 1000.0;
      if (dt <= 0) return;

      const forward = this.camera.getDirection(Vector3.Forward());
      forward.y = 0;
      forward.normalize();

      const right = this.camera.getDirection(Vector3.Right());
      right.y = 0;
      right.normalize();
      const desiredDirection = Vector3.Zero();
      if (this.inputMap["z"]) desiredDirection.addInPlace(forward);
      if (this.inputMap["s"]) desiredDirection.subtractInPlace(forward);
      if (this.inputMap["q"]) desiredDirection.subtractInPlace(right);
      if (this.inputMap["d"]) desiredDirection.addInPlace(right);

      if (desiredDirection.lengthSquared() > 0) {
        desiredDirection.normalize();
      }
      const desiredVelocity = desiredDirection.scale(this.MOVE_SPEED);

      const surfaceInfo = this.characterController.checkSupport(dt, this.GRAVITY.normalizeToNew());
      let isGround = surfaceInfo.supportedState === CharacterSupportedState.SUPPORTED;

      const currentVelocity = this.characterController.getVelocity();

      if (this.isJumping && currentVelocity.y <= 0) {
        this.isJumping = false;
      }

      if (this.wantJump && isGround) {
        this.isJumping = true;
        this.wantJump = false;
        currentVelocity.y = this.JUMP_VELOCITY;
      } else {
        this.wantJump = false;
      }

      if (this.isJumping) {
        isGround = false;
      }

      let newVelocity: Vector3;

      if (isGround) {
        newVelocity = this.characterController.calculateMovement(
          dt,
          forward,
          surfaceInfo.averageSurfaceNormal,
          currentVelocity,
          surfaceInfo.averageSurfaceVelocity,
          desiredVelocity,
          Vector3.Up()
        );
      } else {
        newVelocity = currentVelocity.clone();
        newVelocity.addInPlace(this.GRAVITY.scale(dt));

        const airControl = 0.3;
        newVelocity.x += desiredVelocity.x * airControl * dt;
        newVelocity.z += desiredVelocity.z * airControl * dt;
      }

      this.characterController.setVelocity(newVelocity);
      this.characterController.integrate(dt, surfaceInfo, this.GRAVITY);

      const charPos = this.characterController.getPosition();
      this.camera.position.set(
        charPos.x,
        charPos.y + this.CAMERA_HEIGHT_OFFSET,
        charPos.z
      );

    })
  }
  _castCurrentSpell() {
    console.log("ok");
    const dir: Vector3 = this.camera.getDirection(Vector3.Forward());
    const pos: Vector3 = this.camera.position.add(dir.scale(1));
    this.currentSpell.cast(this.scene, pos, dir);
  }


}

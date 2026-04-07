import { Scene } from "@babylonjs/core/scene";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { PhysicsAggregate } from "@babylonjs/core/Physics/v2/physicsAggregate";
import { PhysicsShapeType } from "@babylonjs/core/Physics/";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Mesh } from "@babylonjs/core";
import { Vector3 } from "@babylonjs/core";



export class Ground {
  constructor(private scene: Scene) {
    this.scene = scene;
    this._createGround();
    this._createSphere();
    this._createWallZ();
    this._createWallX();
  }

  _createGround(): void {
    const mesh = MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, this.scene);
    const aggregate = new PhysicsAggregate(mesh, PhysicsShapeType.BOX, { mass: 0 }, this.scene);
    aggregate.body.startAsleep = true;
  }

  _createSphere(): void {
    const mesh = MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, this.scene);
    mesh.position.y = 4;

    new PhysicsAggregate(mesh, PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.75 }, this.scene);
  }

  _createWall(name: string): Mesh {
    const wall = MeshBuilder.CreatePlane(name, { width: 50, height: 10 }, this.scene);
    const material = new StandardMaterial("wall_material", this.scene);
    wall.material = material;
    material.diffuseColor = new Color3(0, 0, 0);
    return wall;
  }
  _createWallZ(): void {
    const wall = this._createWall("wallZ");
    wall.position.y = 5;
    wall.position.z = 25;
    const aggregate = new PhysicsAggregate(wall, PhysicsShapeType.BOX, { mass: 0 }, this.scene);
    aggregate.body.startAsleep = true;
  }
  _createWallX(): void {
    const wall = this._createWall("wallX");
    wall.position.y = 5;
    wall.position.x = 25;
    wall.rotate(new Vector3(0, 1, 0), Math.PI / 2);
    const aggregate = new PhysicsAggregate(wall, PhysicsShapeType.BOX, { mass: 0 }, this.scene);
    aggregate.body.startAsleep = true;

  }
}

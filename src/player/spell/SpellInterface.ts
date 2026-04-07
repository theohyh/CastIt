import { Scene, Vector3 } from "@babylonjs/core";

export interface SpellInterface {
  readonly name: String;

  cast(scene: Scene, origin: Vector3, direction: Vector3): void;
}


import { SpellInterface } from "./SpellInterface";
import {
  Scene, Camera, Vector3, StandardMaterial, MeshBuilder, Color3, PhysicsAggregate, PhysicsShapeType, ParticleHelper,
  NodeParticleSystemSet,
} from "@babylonjs/core";

export class FireBallSpell implements SpellInterface {

  constructor(
    readonly name: String
  ) { }

  cast(scene: Scene, origin: Vector3, direction: Vector3): void {
    const fireball = MeshBuilder.CreateSphere("fireball", { diameter: 0.5 }, scene);

    // 2. Le positionner au niveau de l'origine passée en paramètre (ex: le joueur)
    fireball.position = origin.clone();

    // 3. Ajouter un matériau (couleur rouge / feu)
    const material = new StandardMaterial("fireMaterial", scene);
    material.emissiveColor = new Color3(1, 0.2, 0); // Rend la boule lumineuse
    fireball.material = material;

    //const fireParticle = ParticleHelper.CreateDefault(fireball, 2000, scene);
    //fireParticle.start();

    NodeParticleSystemSet.ParseFromFileAsync("fireBallParticle", "particle/nodeParticleSystemSet.json")
      .then((particleSet) => {
        return particleSet.buildAsync(scene);
      })
      .then((fireParticle) => {
        fireParticle.emitterNode = fireball;
        fireParticle.start();
      })
      .catch((error) => {
        console.log("loading particle failed", error);
      });

    // 4. Ajouter la physique pour que le sort réagisse aux collisions
    const aggregate = new PhysicsAggregate(fireball, PhysicsShapeType.SPHERE, { mass: 1 }, scene);

    // 5. Appliquer une vitesse au sort dans la direction voulue
    const speed = 25; // Vitesse du sort
    const velocity = direction.scale(speed);
    aggregate.body.setLinearVelocity(velocity);
    aggregate.body.setGravityFactor(0);

    // 6. Nettoyer la scène (détruire le sort) après 2 secondes pour optimiser la mémoire
    setTimeout(() => {
      fireball.dispose();
    }, 2000);
  }

}

const entities = new Set(["user", "ticket", "organization"]);

export type Entity = "user" | "ticket" | "organization";

export function assertIsKnownEntity(
  entityMaybe: string
): asserts entityMaybe is Entity {
  if (!entities.has(entityMaybe)) {
    throw new Error(`Unknown entity "${entityMaybe}".`);
  }
}

/** Pure navigation shared by the world runtime and its physics checks. */
export type NavigationPoint = Readonly<{ x: number; z: number }>;
export type NavigationBounds = Readonly<{ minX: number; maxX: number; minZ: number; maxZ: number }>;
export type SolidRect = NavigationBounds;
export type CircleObstacle = Readonly<{ x: number; z: number; radius: number }>;

const finitePoint = (point: NavigationPoint) => Number.isFinite(point.x) && Number.isFinite(point.z);
const copy = (point: NavigationPoint): NavigationPoint => ({ x: point.x, z: point.z });
const distance = (a: NavigationPoint, b: NavigationPoint) => Math.hypot(b.x - a.x, b.z - a.z);
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** Wall volumes follow the footprint, leaving an actual opening on the front (max Z). */
export function createInnWalls(footprint: NavigationBounds, doorCenter = 5, doorWidth = 3.3, wallThickness = .6): SolidRect[] {
  const thickness = Math.max(.05, Math.min(wallThickness, (footprint.maxX - footprint.minX) / 3, (footprint.maxZ - footprint.minZ) / 3));
  const left = clamp(doorCenter - doorWidth / 2, footprint.minX + thickness, footprint.maxX - thickness);
  const right = clamp(doorCenter + doorWidth / 2, left, footprint.maxX - thickness);
  return [
    { minX: footprint.minX, maxX: footprint.minX + thickness, minZ: footprint.minZ, maxZ: footprint.maxZ },
    { minX: footprint.maxX - thickness, maxX: footprint.maxX, minZ: footprint.minZ, maxZ: footprint.maxZ },
    { minX: footprint.minX, maxX: footprint.maxX, minZ: footprint.minZ, maxZ: footprint.minZ + thickness },
    { minX: footprint.minX, maxX: left, minZ: footprint.maxZ - thickness, maxZ: footprint.maxZ },
    { minX: right, maxX: footprint.maxX, minZ: footprint.maxZ - thickness, maxZ: footprint.maxZ },
  ];
}

export function isPositionBlocked(position: NavigationPoint, radius: number, bounds: NavigationBounds, rects: readonly SolidRect[] = [], circles: readonly CircleObstacle[] = []): boolean {
  if (!finitePoint(position) || !Number.isFinite(radius) || radius < 0) return true;
  if (position.x < bounds.minX + radius || position.x > bounds.maxX - radius || position.z < bounds.minZ + radius || position.z > bounds.maxZ - radius) return true;
  for (const rectangle of rects) {
    const nearestX = clamp(position.x, rectangle.minX, rectangle.maxX);
    const nearestZ = clamp(position.z, rectangle.minZ, rectangle.maxZ);
    if (Math.hypot(position.x - nearestX, position.z - nearestZ) < radius ||
      position.x > rectangle.minX && position.x < rectangle.maxX && position.z > rectangle.minZ && position.z < rectangle.maxZ) return true;
  }
  return circles.some(obstacle => Math.hypot(position.x - obstacle.x, position.z - obstacle.z) < radius + obstacle.radius);
}

/** Substeps stop a long frame crossing a thin wall; independent axes let the player slide. */
export function moveWithCollisions(position: NavigationPoint, delta: NavigationPoint, radius: number, bounds: NavigationBounds, rects: readonly SolidRect[] = [], circles: readonly CircleObstacle[] = []): NavigationPoint {
  if (!finitePoint(position) || !finitePoint(delta) || !Number.isFinite(radius) || radius <= 0) return finitePoint(position) ? copy(position) : { x: 0, z: 0 };
  const maxStep = Math.min(.12, radius * .45);
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(delta.x), Math.abs(delta.z)) / maxStep));
  // The engine supplies frame-sized displacements. Reject accidental unbounded work.
  if (steps > 10000) return copy(position);
  let next = copy(position);
  const stepX = delta.x / steps, stepZ = delta.z / steps;
  for (let step = 0; step < steps; step++) {
    const alongX = { x: next.x + stepX, z: next.z };
    if (!isPositionBlocked(alongX, radius, bounds, rects, circles)) next = alongX;
    const alongZ = { x: next.x, z: next.z + stepZ };
    if (!isPositionBlocked(alongZ, radius, bounds, rects, circles)) next = alongZ;
  }
  return next;
}

export type TrailFollower = Readonly<{
  update: (playerPosition: NavigationPoint) => NavigationPoint;
  reset: (position: NavigationPoint) => void;
  getPosition: () => NavigationPoint;
  getRetainedPointCount: () => number;
  dispose: () => void;
}>;

/**
 * Follow a travelled polyline, rather than interpolating across its corners.
 * Only the short tail behind the player is retained. Tiny input jitter is ignored.
 */
export function createTrailFollower(initialPosition: NavigationPoint, spacing = 1.8): TrailFollower {
  let follower = finitePoint(initialPosition) ? copy(initialPosition) : { x: 0, z: 0 };
  let points: NavigationPoint[] = [copy(follower)];
  let disposed = false;
  const gap = Number.isFinite(spacing) ? clamp(spacing, .1, 12) : 1.8;
  const minimumSegment = .005;
  const maximumPoints = Math.ceil(gap / minimumSegment) + 4;

  return {
    update(playerPosition) {
      if (disposed || !finitePoint(playerPosition)) return copy(follower);
      const last = points[points.length - 1];
      const segmentLength = distance(last, playerPosition);
      // Movement comes from frame-sized physics steps. A discontinuity must not
      // teleport an animal across the landscape or through a building.
      if (segmentLength < minimumSegment || segmentLength > 6) return copy(follower);
      const before = points[points.length - 2];
      const ax = before ? last.x - before.x : 0, az = before ? last.z - before.z : 0;
      const bx = playerPosition.x - last.x, bz = playerPosition.z - last.z;
      // Remove only collinear forward samples. Reversals and corners remain in the trail.
      if (before && ax * bx + az * bz > 0 && Math.abs(ax * bz - az * bx) < 1e-7) points[points.length - 1] = copy(playerPosition);
      else points.push(copy(playerPosition));

      let length = 0;
      for (let index = 1; index < points.length; index++) length += distance(points[index - 1], points[index]);
      let advance = Math.max(0, length - gap);
      while (advance > 1e-9 && points.length > 1) {
        const segment = distance(points[0], points[1]);
        if (segment <= advance + 1e-9) { advance -= segment; points.shift(); }
        else {
          const ratio = advance / segment;
          points[0] = { x: points[0].x + (points[1].x - points[0].x) * ratio, z: points[0].z + (points[1].z - points[0].z) * ratio };
          advance = 0;
        }
      }
      follower = copy(points[0]);
      // With the minimum segment and short retained tail this is normally unreachable.
      // It also bounds unusual oscillating floating-point inputs supplied by a device.
      while (points.length > maximumPoints) points.splice(1, 1);
      return copy(follower);
    },
    reset(position) {
      if (disposed || !finitePoint(position)) return;
      follower = copy(position); points = [copy(position)];
    },
    getPosition: () => copy(follower),
    getRetainedPointCount: () => points.length,
    dispose() { if (!disposed) { disposed = true; points = []; } },
  };
}

import { EditorialBlueprint } from '../types/blueprint';
import { alternativesClusterBlueprint } from './alternatives-cluster.blueprint';

const blueprints: Record<string, EditorialBlueprint> = {
  'alternatives-cluster': alternativesClusterBlueprint,
};

export function getEditorialBlueprint(idOrCluster?: string): EditorialBlueprint {
  if (!idOrCluster) {
    return alternativesClusterBlueprint;
  }
  const key = idOrCluster.toLowerCase().includes('alternative') ? 'alternatives-cluster' : idOrCluster;
  return blueprints[key] || alternativesClusterBlueprint;
}

export { alternativesClusterBlueprint };

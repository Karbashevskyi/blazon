/**
 * Heraldic tinctures (colors and metals) as defined in classical heraldry.
 * Extending with string allows custom/non-standard tinctures.
 */
export type HeraldricTincture =
  | 'or' // metal: gold / yellow
  | 'argent' // metal: silver / white
  | 'gules' // colour: red
  | 'azure' // colour: blue
  | 'sable' // colour: black
  | 'vert' // colour: green
  | 'purpure' // colour: purple
  | 'sanguine' // stain: blood red
  | 'tenné' // stain: orange-tawny
  | (string & Record<never, never>); // escape hatch for custom tinctures

/**
 * Classification of a coat of arms by the type of entity it represents.
 */
export type CoatType = 'national' | 'regional' | 'municipal' | 'historical' | 'ecclesiastical' | 'other';

/**
 * The administrative or geographic level of the entity the coat represents.
 */
export type AdministrativeLevel = 'national' | 'state' | 'county' | 'city' | 'district' | 'village';

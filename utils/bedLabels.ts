// mirrors the web app's BEDS constant (src/utils/constants.js)
export const BED_LABELS: Record<string, string> = {
  frontBunkLeft: 'Front Bunk Left',
  backBunkLeft: 'Back Bunk Left',
  frontCotLeft: 'Front Cot Left',
  backCotLeft: 'Back Cot Left',
  frontLoftLeft: 'Front Loft Left',
  backLoftLeft: 'Back Loft Left',
  frontBunkRight: 'Front Bunk Right',
  backBunkRight: 'Back Bunk Right',
  frontCotRight: 'Front Cot Right',
  backCotRight: 'Back Cot Right',
  frontLoftRight: 'Front Loft Right',
  backLoftRight: 'Back Loft Right',
};

export function getBedLabel(bedName: string) {
  return BED_LABELS[bedName] || bedName;
}

import { UNASSIGNED_TEAM } from './timelineImport';
import type { Department } from '../types';

// Stable, distinct colors for timeline teams. Picked to read on the dark theme
// and to stay clear of the green/red used for done/overdue rows.
// Ordered so neighbouring slots differ in hue as much as possible.
const TEAM_PALETTE = [
  '#60a5fa', // blue
  '#fbbf24', // amber
  '#e879f9', // fuchsia
  '#2dd4bf', // teal
  '#fb923c', // orange
  '#a78bfa', // violet
  '#a3e635', // lime
  '#f472b6', // pink
  '#22d3ee', // cyan
  '#fde68a', // pale yellow
  '#818cf8', // indigo
  '#fca5a5', // salmon
];

export const UNASSIGNED_TEAM_COLOR = '#8b90a8';

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Team names from Excel vary in case/spacing ("VLive  MKT" vs "vlive mkt"). */
export function teamKey(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function findDepartment(
  departments: Department[] | undefined,
  team: string,
): Department | undefined {
  const key = teamKey(team);
  return departments?.find((d) => teamKey(d.name) === key);
}

/**
 * Teams set up as a Bộ phận use its color. Others take their hashed palette
 * slot, or the next free one on a clash, so a team keeps its color as long as
 * the set of teams doesn't change.
 */
export function buildTeamColors(
  teams: Iterable<string>,
  departments: Department[] = [],
): Map<string, string> {
  const colors = new Map<string, string>();
  const taken = new Set<number>();
  const sorted = [...new Set(teams)].sort((a, b) => a.localeCompare(b, 'vi'));
  for (const team of sorted) {
    const dept = findDepartment(departments, team);
    if (dept) {
      colors.set(team, dept.color);
      continue;
    }
    if (team === UNASSIGNED_TEAM) {
      colors.set(team, UNASSIGNED_TEAM_COLOR);
      continue;
    }
    let slot = hash(team.toLowerCase()) % TEAM_PALETTE.length;
    for (let i = 0; i < TEAM_PALETTE.length && taken.has(slot); i++)
      slot = (slot + 1) % TEAM_PALETTE.length;
    taken.add(slot);
    colors.set(team, TEAM_PALETTE[slot]);
  }
  return colors;
}

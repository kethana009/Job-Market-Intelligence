export interface Dicts {
  occupations: string[];
  metros: string[];
  exp_bands: string[];
  salary_bands: string[];
}

// Compact format: [id, occ_idx, metro_idx, exp_idx, sal_band_idx, sal_mid, skill_ids]
export type CompactPosting = [number, number, number, number, number, number | null, number[]];

export interface PostingsData {
  dicts: Dicts;
  postings: CompactPosting[];
}

export interface Skill {
  id: number;
  name: string;
  category: string;
}

export interface SkillPair {
  pair: string;
  skill_a: string;
  skill_b: string;
  postings_together: number;
  n_a: number;
  n_b: number;
  lift: number;
  jaccard: number;
}

export interface FilterState {
  occupation: string;
  metro: string;
  expBand: string;
  salaryBand: string;
  skillCategory: string;
}

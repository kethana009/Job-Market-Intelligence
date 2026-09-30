import { PostingsData, Skill, SkillPair, FilterState, CompactPosting } from '@/types/data';

export function filterPostings(
  data: PostingsData,
  filters: FilterState,
  skillMap: Map<number, Skill>
): CompactPosting[] {
  const { dicts, postings } = data;
  const occIdx = filters.occupation !== 'ALL' ? dicts.occupations.indexOf(filters.occupation) : -1;
  const metroIdx = filters.metro !== 'ALL' ? dicts.metros.indexOf(filters.metro) : -1;
  const expIdx = filters.expBand !== 'ALL' ? dicts.exp_bands.indexOf(filters.expBand) : -1;
  const salIdx = filters.salaryBand !== 'ALL' ? dicts.salary_bands.indexOf(filters.salaryBand) : -1;
  const cat = filters.skillCategory !== 'ALL' ? filters.skillCategory : null;

  return postings.filter(p => {
    if (occIdx !== -1 && p[1] !== occIdx) return false;
    if (metroIdx !== -1 && p[2] !== metroIdx) return false;
    if (expIdx !== -1 && p[3] !== expIdx) return false;
    if (salIdx !== -1 && p[4] !== salIdx) return false;

    if (cat) {
      // Must contain at least one skill in selected category
      const pSkills = p[6];
      let hasCatSkill = false;
      for (const sid of pSkills) {
        const sk = skillMap.get(sid);
        if (sk && sk.category === cat) {
          hasCatSkill = true;
          break;
        }
      }
      if (!hasCatSkill) return false;
    }

    return true;
  });
}

export function computeOverviewMetrics(
  filteredPostings: CompactPosting[],
  dicts: PostingsData['dicts'],
  skillsList: Skill[]
) {
  const totalPostings = filteredPostings.length;
  const skillMap = new Map(skillsList.map(s => [s.id, s]));

  // Skill counts & unique skills
  const skillCounts = new Map<number, number>();
  let salarySum = 0;
  let salaryCount = 0;

  const occCounts = new Map<number, number>();
  const metroCounts = new Map<number, number>();
  const expCounts = new Map<number, number>();
  const salBandCounts = new Map<number, number>();

  for (const p of filteredPostings) {
    // p = [id, occ, metro, exp, sal_band, sal_mid, skills]
    const occ = p[1];
    const metro = p[2];
    const exp = p[3];
    const salBand = p[4];
    const salMid = p[5];
    const sks = p[6];

    occCounts.set(occ, (occCounts.get(occ) || 0) + 1);
    metroCounts.set(metro, (metroCounts.get(metro) || 0) + 1);
    expCounts.set(exp, (expCounts.get(exp) || 0) + 1);
    salBandCounts.set(salBand, (salBandCounts.get(salBand) || 0) + 1);

    if (salMid !== null && !isNaN(salMid)) {
      salarySum += salMid;
      salaryCount++;
    }

    for (const sid of sks) {
      skillCounts.set(sid, (skillCounts.get(sid) || 0) + 1);
    }
  }

  const uniqueSkillsCount = skillCounts.size;
  const avgSalary = salaryCount > 0 ? (salarySum / salaryCount).toFixed(2) : '0';

  // Format Occupation breakdown
  const postingsByOccupation = dicts.occupations
    .map((name, idx) => {
      const count = occCounts.get(idx) || 0;
      return {
        name,
        count,
        percentage: totalPostings > 0 ? Number(((count / totalPostings) * 100).toFixed(1)) : 0
      };
    })
    .sort((a, b) => b.count - a.count);

  // Format City breakdown
  const postingsByCity = dicts.metros
    .map((name, idx) => {
      const count = metroCounts.get(idx) || 0;
      return {
        name,
        count,
        percentage: totalPostings > 0 ? Number(((count / totalPostings) * 100).toFixed(1)) : 0
      };
    })
    .sort((a, b) => b.count - a.count);

  // Format Experience breakdown
  const expDistribution = dicts.exp_bands
    .map((name, idx) => {
      const count = expCounts.get(idx) || 0;
      return {
        name,
        count,
        percentage: totalPostings > 0 ? Number(((count / totalPostings) * 100).toFixed(1)) : 0
      };
    })
    .sort((a, b) => b.count - a.count);

  // Salary Order
  const preferredSalOrder = ['<3L', '3-6L', '6-10L', '10-20L', '20L+', 'Not disclosed'];
  const salaryBandDistribution = dicts.salary_bands
    .map((name, idx) => {
      const count = salBandCounts.get(idx) || 0;
      return {
        name,
        count,
        percentage: totalPostings > 0 ? Number(((count / totalPostings) * 100).toFixed(1)) : 0
      };
    })
    .sort((a, b) => {
      const idxA = preferredSalOrder.indexOf(a.name);
      const idxB = preferredSalOrder.indexOf(b.name);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return b.count - a.count;
    });

  // Top skill overall
  let topSkill = { name: 'N/A', count: 0, percentage: 0 };
  let maxSkillCount = 0;
  skillCounts.forEach((count, sid) => {
    if (count > maxSkillCount) {
      maxSkillCount = count;
      const sk = skillMap.get(sid);
      if (sk) {
        topSkill = {
          name: sk.name,
          count,
          percentage: totalPostings > 0 ? Number(((count / totalPostings) * 100).toFixed(1)) : 0
        };
      }
    }
  });

  // Insights
  const topOcc = postingsByOccupation[0] || { name: 'N/A', count: 0, percentage: 0 };
  const topCity = postingsByCity[0] || { name: 'N/A', count: 0, percentage: 0 };
  const salaryPct = totalPostings > 0 ? ((salaryCount / totalPostings) * 100).toFixed(1) : '0';

  return {
    totalPostings,
    uniqueSkillsCount,
    avgSalary,
    salaryCount,
    salaryPct,
    postingsByOccupation,
    postingsByCity,
    expDistribution,
    salaryBandDistribution,
    keyInsights: {
      topCategory: topOcc.name,
      topCategoryPct: topOcc.percentage,
      topCity: topCity.name,
      topCityCount: topCity.count,
      topSkillName: topSkill.name,
      topSkillCount: topSkill.count,
      topSkillPct: topSkill.percentage,
      salaryPct
    }
  };
}

export function computeSkillsDemandMetrics(
  filteredPostings: CompactPosting[],
  skillsList: Skill[],
  selectedCategory: string = 'ALL'
) {
  const totalPostings = filteredPostings.length;
  const skillMap = new Map(skillsList.map(s => [s.id, s]));

  const skillCounts = new Map<number, number>();
  const categoryCounts = new Map<string, number>();

  for (const p of filteredPostings) {
    const sks = p[6];
    const seenCategoriesInPosting = new Set<string>();

    for (const sid of sks) {
      skillCounts.set(sid, (skillCounts.get(sid) || 0) + 1);
      const sk = skillMap.get(sid);
      if (sk) {
        seenCategoriesInPosting.add(sk.category);
      }
    }

    for (const cat of seenCategoriesInPosting) {
      categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
    }
  }

  // Top skills array
  let skillsDemand = skillsList
    .map(sk => {
      const count = skillCounts.get(sk.id) || 0;
      return {
        id: sk.id,
        name: sk.name,
        category: sk.category,
        count,
        percentage: totalPostings > 0 ? Number(((count / totalPostings) * 100).toFixed(1)) : 0
      };
    })
    .filter(sk => countSkillMatch(sk, selectedCategory))
    .sort((a, b) => b.count - a.count);

  const top20Skills = skillsDemand.slice(0, 20);

  // Category distribution
  const categoryDistribution = Array.from(categoryCounts.entries())
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalPostings > 0 ? Number(((count / totalPostings) * 100).toFixed(1)) : 0
    }))
    .sort((a, b) => b.count - a.count);

  const mostDemandedSkill = skillsDemand[0] || null;

  return {
    top20Skills,
    categoryDistribution,
    mostDemandedSkill,
    totalPostings
  };
}

function countSkillMatch(sk: { category: string }, catFilter: string) {
  if (catFilter === 'ALL') return true;
  return sk.category === catFilter;
}

export function computeSkillsRolesMatrix(
  filteredPostings: CompactPosting[],
  dicts: PostingsData['dicts'],
  skillsList: Skill[],
  selectedRole: string = 'ALL'
) {
  const skillMap = new Map(skillsList.map(s => [s.id, s]));
  const occPostingsCount = new Map<number, number>();
  const occSkillMatrix = new Map<string, number>(); // key: "occIdx-skillId"

  const overallSkillCounts = new Map<number, number>();

  for (const p of filteredPostings) {
    const occIdx = p[1];
    const sks = p[6];

    occPostingsCount.set(occIdx, (occPostingsCount.get(occIdx) || 0) + 1);

    for (const sid of sks) {
      overallSkillCounts.set(sid, (overallSkillCounts.get(sid) || 0) + 1);
      const key = `${occIdx}-${sid}`;
      occSkillMatrix.set(key, (occSkillMatrix.get(key) || 0) + 1);
    }
  }

  // Find top 15 skills overall in filtered dataset
  const top15SkillIds = skillsList
    .map(sk => ({ id: sk.id, count: overallSkillCounts.get(sk.id) || 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)
    .map(s => s.id);

  const top15Skills = top15SkillIds.map(sid => skillMap.get(sid)!);

  // Build matrix data for heatmap
  // Rows = top15Skills, Columns = dicts.occupations
  const heatmapData = top15Skills.map(sk => {
    const rowObj: Record<string, any> = {
      skillId: sk.id,
      skillName: sk.name,
      category: sk.category
    };

    dicts.occupations.forEach((occName, occIdx) => {
      const key = `${occIdx}-${sk.id}`;
      const count = occSkillMatrix.get(key) || 0;
      const occTotal = occPostingsCount.get(occIdx) || 0;
      const pct = occTotal > 0 ? Number(((count / occTotal) * 100).toFixed(1)) : 0;
      rowObj[occName] = pct;
      rowObj[`${occName}_count`] = count;
      rowObj[`${occName}_total`] = occTotal;
    });

    return rowObj;
  });

  // Top 10 skills for selected role
  let roleTopSkills: { name: string; category: string; count: number; percentage: number }[] = [];
  const activeRoleName = selectedRole !== 'ALL' ? selectedRole : dicts.occupations[0];
  const activeRoleIdx = dicts.occupations.indexOf(activeRoleName);

  if (activeRoleIdx !== -1) {
    const roleTotal = occPostingsCount.get(activeRoleIdx) || 0;
    roleTopSkills = skillsList
      .map(sk => {
        const key = `${activeRoleIdx}-${sk.id}`;
        const count = occSkillMatrix.get(key) || 0;
        return {
          name: sk.name,
          category: sk.category,
          count,
          percentage: roleTotal > 0 ? Number(((count / roleTotal) * 100).toFixed(1)) : 0
        };
      })
      .filter(s => s.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  return {
    occupations: dicts.occupations,
    top15Skills,
    heatmapData,
    selectedRole: activeRoleName,
    roleTopSkills
  };
}

export function computeCitiesExperienceMetrics(
  filteredPostings: CompactPosting[],
  dicts: PostingsData['dicts']
) {
  const totalPostings = filteredPostings.length;
  const metroCounts = new Map<number, number>();
  const expCounts = new Map<number, number>();

  // Salary by Experience & Occupation
  const expSalSum = new Map<number, number>();
  const expSalCount = new Map<number, number>();

  const occSalSum = new Map<number, number>();
  const occSalCount = new Map<number, number>();

  // Occupation breakdown per City (Top 5 metros)
  const metroOccCounts = new Map<string, number>();

  for (const p of filteredPostings) {
    const occIdx = p[1];
    const metroIdx = p[2];
    const expIdx = p[3];
    const salMid = p[5];

    metroCounts.set(metroIdx, (metroCounts.get(metroIdx) || 0) + 1);
    expCounts.set(expIdx, (expCounts.get(expIdx) || 0) + 1);

    const mOccKey = `${metroIdx}-${occIdx}`;
    metroOccCounts.set(mOccKey, (metroOccCounts.get(mOccKey) || 0) + 1);

    if (salMid !== null && !isNaN(salMid)) {
      expSalSum.set(expIdx, (expSalSum.get(expIdx) || 0) + salMid);
      expSalCount.set(expIdx, (expSalCount.get(expIdx) || 0) + 1);

      occSalSum.set(occIdx, (occSalSum.get(occIdx) || 0) + salMid);
      occSalCount.set(occIdx, (occSalCount.get(occIdx) || 0) + 1);
    }
  }

  // Top Cities
  const topCities = dicts.metros
    .map((name, idx) => ({
      name,
      count: metroCounts.get(idx) || 0,
      percentage: totalPostings > 0 ? Number((((metroCounts.get(idx) || 0) / totalPostings) * 100).toFixed(1)) : 0
    }))
    .sort((a, b) => b.count - a.count);

  // Top 5 Metros for breakdown
  const top5MetroIndices = topCities.slice(0, 5).map(c => dicts.metros.indexOf(c.name));

  const occDistributionByCity = top5MetroIndices.map(mIdx => {
    const cityName = dicts.metros[mIdx];
    const item: Record<string, any> = { city: cityName };
    dicts.occupations.forEach((occName, occIdx) => {
      const key = `${mIdx}-${occIdx}`;
      item[occName] = metroOccCounts.get(key) || 0;
    });
    return item;
  });

  // Experience Distribution
  const expDistribution = dicts.exp_bands
    .map((name, idx) => ({
      name,
      count: expCounts.get(idx) || 0,
      percentage: totalPostings > 0 ? Number((((expCounts.get(idx) || 0) / totalPostings) * 100).toFixed(1)) : 0
    }))
    .sort((a, b) => b.count - a.count);

  // Avg Salary by Experience Band
  const avgSalaryByExp = dicts.exp_bands
    .map((name, idx) => {
      const sum = expSalSum.get(idx) || 0;
      const count = expSalCount.get(idx) || 0;
      const avg = count > 0 ? Number((sum / count).toFixed(2)) : 0;
      return { name, avgSalary: avg, count };
    })
    .filter(item => item.count > 0);

  // Avg Salary by Occupation Group
  const avgSalaryByOccupation = dicts.occupations
    .map((name, idx) => {
      const sum = occSalSum.get(idx) || 0;
      const count = occSalCount.get(idx) || 0;
      const avg = count > 0 ? Number((sum / count).toFixed(2)) : 0;
      return { name, avgSalary: avg, count };
    })
    .filter(item => item.count > 0)
    .sort((a, b) => b.avgSalary - a.avgSalary);

  return {
    topCities,
    occDistributionByCity,
    expDistribution,
    avgSalaryByExp,
    avgSalaryByOccupation,
    occupations: dicts.occupations
  };
}

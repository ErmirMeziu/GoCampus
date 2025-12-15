export const calculateCategoryInsights = (groups = []) => {
  if (!Array.isArray(groups) || groups.length === 0) {
    return {
      barData: { labels: [], values: [] },
      topGroups: [],
    };
  }

  const counts = {};

  groups.forEach((group) => {
    if (
      typeof group.category === "string" &&
      group.category.trim().length > 0
    ) {
      const key = group.category.trim();
      counts[key] = (counts[key] || 0) + 1;
    } else {
      counts["Uncategorized"] = (counts["Uncategorized"] || 0) + 1;
    }
  });

  const labels = Object.keys(counts);
  const values = labels.map((l) => counts[l]);

  const sorted = labels
    .map((label) => ({ label, count: counts[label] }))
    .sort((a, b) => b.count - a.count);

  const icons = ["flame", "people", "star", "trophy", "rocket"];

  const topGroups = sorted.slice(0, 3).map((item, index) => ({
    icon: icons[index % icons.length],
    name: item.label,
    stat: `${item.count} groups`,
  }));

  return {
    barData: { labels, values },
    topGroups,
  };
};

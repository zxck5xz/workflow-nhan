const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  console.error("Usage: node ua-arch-analyze.js <input.json> <output.json>");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const { fileNodes, importEdges, allEdges } = data;

// A. Directory Grouping
function getDirectoryGroups(nodes) {
  if (nodes.length === 0) return {};
  
  // Find common prefix
  const paths = nodes.filter(n => n.filePath).map(n => n.filePath);
  if (paths.length === 0) return { root: nodes.map(n => n.id) };
  
  let commonPrefix = "";
  if (paths.length > 1) {
    const sortedPaths = [...paths].sort();
    const first = sortedPaths[0].split('/');
    const last = sortedPaths[sortedPaths.length - 1].split('/');
    let i = 0;
    while (i < first.length && i < last.length && first[i] === last[i]) {
      i++;
    }
    commonPrefix = first.slice(0, i).join('/');
    if (commonPrefix) commonPrefix += "/";
  }

  const groups = {};
  nodes.forEach(node => {
    let group = "root";
    if (node.filePath) {
      const relativePath = node.filePath.startsWith(commonPrefix) 
        ? node.filePath.slice(commonPrefix.length) 
        : node.filePath;
      const parts = relativePath.split('/');
      group = parts[0] || "root";
    }
    if (!groups[group]) groups[group] = [];
    groups[group].push(node.id);
  });
  return groups;
}

const directoryGroups = getDirectoryGroups(fileNodes);

// B. Node Type Grouping
const nodeTypeGroups = {};
fileNodes.forEach(node => {
  if (!nodeTypeGroups[node.type]) nodeTypeGroups[node.type] = [];
  nodeTypeGroups[node.type].push(node.id);
});

// C. Import Adjacency Matrix / Fan-In / Fan-Out
const fileFanIn = {};
const fileFanOut = {};
const adjList = {};

fileNodes.forEach(node => {
  fileFanIn[node.id] = 0;
  fileFanOut[node.id] = 0;
  adjList[node.id] = [];
});

importEdges.forEach(edge => {
  if (adjList[edge.source]) {
    adjList[edge.source].push(edge.target);
    fileFanOut[edge.source]++;
  }
  if (fileFanIn[edge.target] !== undefined) {
    fileFanIn[edge.target]++;
  }
});

// D. Cross-Category Dependency Analysis
const crossCategoryEdges = [];
const typeEdgeCounts = {};

allEdges.forEach(edge => {
  const sourceNode = fileNodes.find(n => n.id === edge.source);
  const targetNode = fileNodes.find(n => n.id === edge.target);
  if (sourceNode && targetNode) {
    const key = `${sourceNode.type}->${targetNode.type}:${edge.type}`;
    typeEdgeCounts[key] = (typeEdgeCounts[key] || 0) + 1;
  }
});

Object.entries(typeEdgeCounts).forEach(([key, count]) => {
  const [types, edgeType] = key.split(':');
  const [fromType, toType] = types.split('->');
  crossCategoryEdges.push({ fromType, toType, edgeType, count });
});

// E. Inter-Group Import Frequency
const groupToFile = {};
const fileToGroup = {};
Object.entries(directoryGroups).forEach(([group, files]) => {
  groupToFile[group] = files;
  files.forEach(fId => fileToGroup[fId] = group);
});

const interGroupImports = [];
const groupImportCounts = {};

importEdges.forEach(edge => {
  const fromGroup = fileToGroup[edge.source];
  const toGroup = fileToGroup[edge.target];
  if (fromGroup && toGroup && fromGroup !== toGroup) {
    const key = `${fromGroup}->${toGroup}`;
    groupImportCounts[key] = (groupImportCounts[key] || 0) + 1;
  }
});

Object.entries(groupImportCounts).forEach(([key, count]) => {
  const [from, to] = key.split('->');
  interGroupImports.push({ from, to, count });
});

// F. Intra-Group Import Density
const intraGroupDensity = {};
Object.keys(directoryGroups).forEach(group => {
  let internalEdges = 0;
  let totalEdges = 0;
  importEdges.forEach(edge => {
    const fromG = fileToGroup[edge.source];
    const toG = fileToGroup[edge.target];
    if (fromG === group || toG === group) {
      totalEdges++;
      if (fromG === group && toG === group) {
        internalEdges++;
      }
    }
  });
  intraGroupDensity[group] = {
    internalEdges,
    totalEdges,
    density: totalEdges > 0 ? internalEdges / totalEdges : 0
  };
});

// G. Directory Pattern Matching
const PATTERNS = {
  api: [/routes/, /api/, /controllers/, /endpoints/, /handlers/, /serializers/, /controller/, /routers/, /blueprints/],
  service: [/services/, /core/, /lib/, /domain/, /logic/, /composables/, /mailers/, /jobs/, /channels/, /internal/],
  data: [/models/, /db/, /data/, /persistence/, /repository/, /entities/, /migrations/, /sql/, /database/, /schema/, /entity/],
  ui: [/components/, /views/, /pages/, /ui/, /layouts/, /screens/],
  middleware: [/middleware/, /plugins/, /interceptors/, /guards/],
  utility: [/utils/, /helpers/, /common/, /shared/, /tools/, /templatetags/, /pkg/],
  config: [/config/, /constants/, /env/, /settings/, /management/, /commands/, /wsgi/, /asgi/],
  test: [/__tests__/, /test/, /tests/, /spec/, /specs/],
  types: [/types/, /interfaces/, /schemas/, /contracts/, /dtos/, /dto/, /request/, /response/],
  hooks: [/hooks/],
  state: [/store/, /state/, /reducers/, /actions/, /slices/],
  assets: [/assets/, /static/, /public/],
  entry: [/cmd/, /bin/]
};

const patternMatches = {};
Object.keys(directoryGroups).forEach(group => {
  for (const [label, regexes] of Object.entries(PATTERNS)) {
    if (regexes.some(re => re.test(group))) {
      patternMatches[group] = label;
      break;
    }
  }
});

// H. Deployment Topology Detection
const infraPatterns = [/Dockerfile/, /docker-compose/, /k8s/, /kubernetes/, /helm/, /charts/, /terraform/, /tf/, /Makefile/];
const ciPatterns = [/\.github\/workflows/, /\.gitlab-ci\.yml/, /Jenkinsfile/];
const infraFiles = fileNodes.filter(n => 
  infraPatterns.some(re => re.test(n.filePath || '')) || 
  ciPatterns.some(re => re.test(n.filePath || ''))
).map(n => n.filePath);

const deploymentTopology = {
  hasDockerfile: fileNodes.some(n => n.name === 'Dockerfile'),
  hasCompose: fileNodes.some(n => n.name.startsWith('docker-compose')),
  hasK8s: fileNodes.some(n => (n.filePath || '').includes('k8s') || (n.filePath || '').includes('kubernetes')),
  hasTerraform: fileNodes.some(n => (n.filePath || '').endsWith('.tf')),
  hasCI: fileNodes.some(n => (n.filePath || '').includes('.github/workflows')),
  infraFiles
};

// I. Data Pipeline Detection
const dataPipeline = {
  schemaFiles: fileNodes.filter(n => (n.filePath || '').endsWith('.sql') || (n.filePath || '').endsWith('.prisma') || (n.filePath || '').endsWith('.graphql')).map(n => n.filePath),
  migrationFiles: fileNodes.filter(n => (n.filePath || '').includes('migrations')).map(n => n.filePath),
  dataModelFiles: fileNodes.filter(n => (n.filePath || '').includes('models') || (n.filePath || '').includes('entities')).map(n => n.filePath),
  apiHandlerFiles: fileNodes.filter(n => (n.filePath || '').includes('routes') || (n.filePath || '').includes('controllers')).map(n => n.filePath)
};

// J. Documentation Coverage
const groupsWithDocs = Object.keys(directoryGroups).filter(group => {
  const filesInGroup = directoryGroups[group];
  return filesInGroup.some(fId => {
    const node = fileNodes.find(n => n.id === fId);
    return node && (node.type === 'document' || (node.name && node.name.toLowerCase() === 'readme.md'));
  });
});

const docCoverage = {
  groupsWithDocs: groupsWithDocs.length,
  totalGroups: Object.keys(directoryGroups).length,
  coverageRatio: Object.keys(directoryGroups).length > 0 ? groupsWithDocs.length / Object.keys(directoryGroups).length : 0,
  undocumentedGroups: Object.keys(directoryGroups).filter(g => !groupsWithDocs.includes(g))
};

// K. Dependency Direction
const dependencyDirection = [];
const groupPairs = {};

interGroupImports.forEach(imp => {
  const pairKey = [imp.from, imp.to].sort().join('<->');
  if (!groupPairs[pairKey]) groupPairs[pairKey] = { [imp.from]: 0, [imp.to]: 0 };
  groupPairs[pairKey][imp.from] += imp.count;
});

Object.entries(groupPairs).forEach(([pairKey, counts]) => {
  const [g1, g2] = pairKey.split('<->');
  if (counts[g1] > counts[g2]) {
    dependencyDirection.push({ dependent: g1, dependsOn: g2 });
  } else if (counts[g2] > counts[g1]) {
    dependencyDirection.push({ dependent: g2, dependsOn: g1 });
  }
});

// L. File Stats
const nodeTypeCounts = {};
Object.entries(nodeTypeGroups).forEach(([type, files]) => {
  nodeTypeCounts[type] = files.length;
});

const fileStats = {
  totalFileNodes: fileNodes.length,
  filesPerGroup: Object.fromEntries(Object.entries(directoryGroups).map(([g, f]) => [g, f.length])),
  nodeTypeCounts
};

const results = {
  scriptCompleted: true,
  directoryGroups,
  nodeTypeGroups,
  crossCategoryEdges,
  interGroupImports,
  intraGroupDensity,
  patternMatches,
  deploymentTopology,
  dataPipeline,
  docCoverage,
  dependencyDirection,
  fileStats,
  fileFanIn,
  fileFanOut
};

fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
console.log("Analysis completed successfully.");

// 1. Node counts by type
MATCH (n) 
RETURN labels(n)[0] AS label, count(n) AS count 
ORDER BY count DESC;

// 2. Relationship counts by type
MATCH ()-[r]->() 
RETURN type(r) AS type, count(r) AS count 
ORDER BY count DESC;

// 3. Total graph size
MATCH (n) WITH count(n) AS total_nodes
MATCH ()-[r]->() WITH total_nodes, count(r) AS total_relationships
RETURN total_nodes, total_relationships;

// 4. Specific enrichment verification
// Check how many Papers have associated Methods
MATCH (p:Paper)-[:USES_METHOD]->(m:Method)
RETURN count(DISTINCT p) AS papers_with_methods, count(m) AS total_methods_found;

// Check how many Papers have associated Results
MATCH (p:Paper)-[:REPORTS_RESULT]->(r:Result)
RETURN count(DISTINCT p) AS papers_with_results, count(r) AS total_results_found;

// 5. Connectivity metrics
MATCH (n)
RETURN labels(n)[0] AS label, avg(size((n)--())) AS avg_degree
ORDER BY avg_degree DESC;

// Useful Cypher Queries for Knowledge Graph Exploration

// 1. Get Top Methods used across all papers
MATCH (p:Paper)-[:USES_METHOD]->(m:Method)
RETURN m.name, count(p) as usage_count
ORDER BY usage_count DESC;

// 2. Find Brain Regions associated with Alzheimer's Disease
MATCH (d:Disease {name: "Alzheimer"})<-[:STUDIES_DISEASE]-(p:Paper)-[:INVOLVES_REGION]->(r:BrainRegion)
RETURN DISTINCT r.name;

// 3. See Results for a specific paper (e.g., paper_001)
MATCH (p:Paper {id: "paper_001"})-[:REPORTS_RESULT]->(res:Result)
RETURN res.text;

// 4. Graph Density Metrics
MATCH (n)
WITH count(n) as total_nodes
MATCH ()-[r]->()
RETURN total_nodes, count(r) as total_relationships, 
       toFloat(count(r)) / (total_nodes * (total_nodes - 1)) as density;

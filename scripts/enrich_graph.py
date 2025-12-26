import os
import json
from neo4j import GraphDatabase

class GraphEnricher:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def enrich(self, knowledge_dir):
        with self.driver.session() as session:
            for filename in sorted(os.listdir(knowledge_dir)):
                if filename.endswith(".json"):
                    paper_id = os.path.splitext(filename)[0]
                    print(f"Enriching graph with knowledge from {paper_id}...")
                    
                    with open(os.path.join(knowledge_dir, filename), 'r') as f:
                        data = json.load(f)
                    
                    # 1. Methods
                    for method_name in data.get("methods", []):
                        session.run("""
                            MERGE (m:Method {name: $name})
                            WITH m
                            MATCH (p:Paper {id: $id})
                            MERGE (p)-[:USES_METHOD]->(m)
                        """, name=method_name, id=paper_id)
                    
                    # 2. Brain Regions
                    for region_name in data.get("brain_regions", []):
                        session.run("""
                            MERGE (r:BrainRegion {name: $name})
                            WITH r
                            MATCH (p:Paper {id: $id})
                            MERGE (p)-[:INVOLVES_REGION]->(r)
                        """, name=region_name, id=paper_id)
                    
                    # 3. Results (Storing as nodes for now as per schema)
                    for i, result_text in enumerate(data.get("results", [])):
                        result_id = f"{paper_id}_res_{i}"
                        session.run("""
                            MERGE (r:Result {id: $res_id})
                            SET r.text = $text
                            WITH r
                            MATCH (p:Paper {id: $id})
                            MERGE (p)-[:REPORTS_RESULT]->(r)
                        """, res_id=result_id, text=result_text, id=paper_id)
                        
                    # 4. Diseases (Additional ones found via NLP)
                    for disease_name in data.get("diseases", []):
                        session.run("""
                            MERGE (d:Disease {name: $name})
                            WITH d
                            MATCH (p:Paper {id: $id})
                            MERGE (p)-[:STUDIES_DISEASE]->(d)
                        """, name=disease_name, id=paper_id)

                    # 5. Citations (Storing as a property on the Paper node)
                    citations = list(data.get("citations", []))
                    if citations:
                        session.run("""
                            MATCH (p:Paper {id: $id})
                            SET p.citations = $citations
                        """, id=paper_id, citations=citations)

                    # 6. Cross-Paper References (Establishing :CITES relationships)
                    referenced_papers = data.get("referenced_papers", [])
                    for ref_id in referenced_papers:
                        if ref_id != paper_id: # Avoid self-citation
                            session.run("""
                                MATCH (p1:Paper {id: $p1_id})
                                MATCH (p2:Paper {id: $p2_id})
                                MERGE (p1)-[:CITES]->(p2)
                            """, p1_id=paper_id, p2_id=ref_id)

    def get_metrics(self):
        with self.driver.session() as session:
            metrics = session.run("""
                MATCH (n)
                WITH count(n) as total_nodes
                MATCH ()-[r]->()
                WITH total_nodes, count(r) as total_relationships
                MATCH (p:Paper)
                WITH total_nodes, total_relationships, count(p) as paper_nodes
                MATCH (m:Method)
                WITH total_nodes, total_relationships, paper_nodes, count(m) as method_nodes
                MATCH (res:Result)
                WITH total_nodes, total_relationships, paper_nodes, method_nodes, count(res) as result_nodes
                MATCH (d:Disease)
                WITH total_nodes, total_relationships, paper_nodes, method_nodes, result_nodes, count(d) as disease_nodes
                MATCH (reg:BrainRegion)
                RETURN 
                    total_nodes, 
                    total_relationships, 
                    paper_nodes, 
                    method_nodes, 
                    result_nodes, 
                    disease_nodes, 
                    count(reg) as region_nodes
            """).single()
            
            return {
                "total_nodes": metrics["total_nodes"],
                "total_relationships": metrics["total_relationships"],
                "paper_nodes": metrics["paper_nodes"],
                "method_nodes": metrics["method_nodes"],
                "result_nodes": metrics["result_nodes"],
                "disease_nodes": metrics["disease_nodes"],
                "region_nodes": metrics["region_nodes"]
            }

if __name__ == "__main__":
    uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    user = os.getenv("NEO4J_USER", "neo4j")
    password = os.getenv("NEO4J_PASSWORD", "password123")
    
    enricher = GraphEnricher(uri, user, password)
    
    try:
        enricher.enrich("outputs/extracted_knowledge")
        
        metrics = enricher.get_metrics()
        print("\nPost-Enrichment Metrics:")
        print(json.dumps(metrics, indent=2))
        
        os.makedirs("report", exist_ok=True)
        with open("report/post_enrichment_metrics.json", 'w') as f:
            json.dump(metrics, f, indent=2)
            
    finally:
        enricher.close()

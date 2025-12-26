import os
import json
from neo4j import GraphDatabase

class ScienceGraph:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def clear_database(self):
        with self.driver.session() as session:
            session.run("MATCH (n) DETACH DELETE n")
        print("Database cleared.")

    def run_cypher_file(self, file_path):
        with open(file_path, 'r') as f:
            cypher = f.read()
            # Split by semicolon and filter empty strings
            statements = [s.strip() for s in cypher.split(';') if s.strip()]
            
            with self.driver.session() as session:
                for statement in statements:
                    session.run(statement)
        print(f"Executed Cypher script: {file_path}")

    def load_papers(self, metadata_dir):
        with self.driver.session() as session:
            for filename in os.listdir(metadata_dir):
                if filename.endswith('.json'):
                    with open(os.path.join(metadata_dir, filename), 'r') as f:
                        data = json.load(f)
                        session.run("""
                            MERGE (p:Paper {id: $id})
                            SET p.title = $title,
                                p.primary_topic = $primary_topic,
                                p.source = $source,
                                p.file_path = $file_path
                        """, id=data['paper_id'], 
                             title=data['title'], 
                             primary_topic=data['primary_topic'],
                             source=data['source'],
                             file_path=data['file_path'])
                        
                        # Also create Disease nodes if any
                        for disease_name in data['diseases']:
                            session.run("""
                                MERGE (d:Disease {name: $name})
                                WITH d
                                MATCH (p:Paper {id: $id})
                                MERGE (p)-[:STUDIES_DISEASE]->(d)
                            """, name=disease_name, id=data['paper_id'])
                            
        print(f"Loaded papers from {metadata_dir}")

    def get_metrics(self):
        with self.driver.session() as session:
            nodes = session.run("MATCH (n) RETURN count(n) as count").single()['count']
            rels = session.run("MATCH ()-[r]->() RETURN count(r) as count").single()['count']
            
            # More specific counts
            paper_count = session.run("MATCH (p:Paper) RETURN count(p) as count").single()['count']
            disease_count = session.run("MATCH (d:Disease) RETURN count(d) as count").single()['count']
            
            return {
                "total_nodes": nodes,
                "total_relationships": rels,
                "paper_nodes": paper_count,
                "disease_nodes": disease_count
            }

if __name__ == "__main__":
    uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    user = os.getenv("NEO4J_USER", "neo4j")
    password = os.getenv("NEO4J_PASSWORD", "password123")
    
    graph = ScienceGraph(uri, user, password)
    
    try:
        # Step 0: Clear DB
        graph.clear_database()
        
        # Step 3.1: Run schema
        graph.run_cypher_file("queries/neo4j_schema.cypher")
        
        # Step 3.2: Load papers
        graph.load_papers("outputs/metadata")
        
        # Step 3.3: Capture metrics
        metrics = graph.get_metrics()
        print("\nBaseline Metrics:")
        print(json.dumps(metrics, indent=2))
        
        os.makedirs("report", exist_ok=True)
        with open("report/baseline_metrics.json", 'w') as f:
            json.dump(metrics, f, indent=2)
            
    finally:
        graph.close()

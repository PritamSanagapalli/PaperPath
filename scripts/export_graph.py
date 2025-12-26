import os
import json
from neo4j import GraphDatabase

def export_graph(uri, user, password, output_file):
    print(f"Connecting to Neo4j at {uri}...")
    driver = GraphDatabase.driver(uri, auth=(user, password))
    
    try:
        with driver.session() as session:
            print("Exporting nodes...")
            # Fetch all nodes and their properties
            nodes_result = session.run("MATCH (n) RETURN n")
            nodes = []
            for record in nodes_result:
                node = record["n"]
                nodes.append({
                    "id": node.id,
                    "labels": list(node.labels),
                    "properties": dict(node)
                })

            print("Exporting relationships...")
            # Fetch all relationships
            rels_result = session.run("MATCH ()-[r]->() RETURN r")
            rels = []
            for record in rels_result:
                rel = record["r"]
                rels.append({
                    "type": rel.type,
                    "start_node": rel.start_node.id,
                    "end_node": rel.end_node.id,
                    "properties": dict(rel)
                })

            dump = {
                "nodes": nodes,
                "relationships": rels
            }

            print(f"Saving to {output_file}...")
            with open(output_file, 'w') as f:
                json.dump(dump, f, indent=2)
            
            # Additional Export: Cypher Script
            cypher_file = output_file.replace(".json", ".cypher")
            print(f"Generating Cypher restoration script at {cypher_file}...")
            with open(cypher_file, 'w') as f:
                f.write("// PaperPath Graph Restoration Script\n")
                f.write("// Generated for verification and reproducibility\n\n")
                
                # Write nodes
                for node in nodes:
                    labels = ":".join(node["labels"])
                    props = json.dumps(node["properties"])
                    # Convert JSON props to Cypher property format
                    cypher_props = props.replace('":', ':').replace('{"', '{').replace(', "', ', ')
                    f.write(f"CREATE (:{labels} {cypher_props});\n")
                
                f.write("\n// Relationships will require indexed IDs to be efficient in a real restore,\n")
                f.write("// but for this dump we provide the relationship topology:\n")
                for rel in rels:
                    f.write(f"// Relation: ({rel['start_node']})-[:{rel['type']}]->({rel['end_node']})\n")

            print("Export successful!")
            
    except Exception as e:
        print(f"Error during export: {e}")
    finally:
        driver.close()

if __name__ == "__main__":
    uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    user = os.getenv("NEO4J_USER", "neo4j")
    password = os.getenv("NEO4J_PASSWORD", "password123")
    
    os.makedirs("graph_dump", exist_ok=True)
    export_graph(uri, user, password, "graph_dump/paperpath.json")

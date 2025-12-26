import os
from flask import Flask, jsonify
from flask_cors import CORS
from neo4j import GraphDatabase

app = Flask(__name__)
CORS(app)

# Neo4j connection details
uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
user = os.getenv("NEO4J_USER", "neo4j")
password = os.getenv("NEO4J_PASSWORD", "password123")

driver = GraphDatabase.driver(uri, auth=(user, password))

@app.route('/api/graph', methods=['GET'])
def get_graph():
    with driver.session() as session:
        # Query to get nodes and relationships
        result = session.run("""
            MATCH (n)
            OPTIONAL MATCH (n)-[r]->(m)
            RETURN n, r, m
        """)
        
        nodes = {}
        links = []
        
        for record in result:
            n = record['n']
            r = record['r']
            m = record['m']
            
            # Add start node
            node_id = n.element_id
            if node_id not in nodes:
                nodes[node_id] = {
                    "id": node_id,
                    "label": list(n.labels)[0] if n.labels else "Unknown",
                    "properties": dict(n)
                }
            
            # Add end node and relationship if they exist
            if m:
                end_node_id = m.element_id
                if end_node_id not in nodes:
                    nodes[end_node_id] = {
                        "id": end_node_id,
                        "label": list(m.labels)[0] if m.labels else "Unknown",
                        "properties": dict(m)
                    }
                
                links.append({
                    "source": node_id,
                    "target": end_node_id,
                    "type": r.type
                })
        
        return jsonify({
            "nodes": list(nodes.values()),
            "links": links
        })

@app.route('/api/stats', methods=['GET'])
def get_stats():
    with driver.session() as session:
        result = session.run("""
            CALL {
                MATCH (:Paper) RETURN count(*) as papers
            }
            CALL {
                MATCH (:Method) RETURN count(*) as methods
            }
            CALL {
                MATCH (:Result) RETURN count(*) as results
            }
            CALL {
                MATCH (:Disease) RETURN count(*) as diseases
            }
            CALL {
                MATCH (:BrainRegion) RETURN count(*) as regions
            }
            RETURN papers, methods, results, diseases, regions
        """).single()
        
        return jsonify({
            "papers": result["papers"],
            "methods": result["methods"],
            "results": result["results"],
            "diseases": result["diseases"],
            "regions": result["regions"]
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

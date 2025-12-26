import os
import subprocess
import time
import json
from neo4j import GraphDatabase

def run_script(script_name):
    print(f"\n>>> Running {script_name}...")
    result = subprocess.run(["python3", script_name], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error running {script_name}:")
        print(result.stderr)
        return False
    print(result.stdout)
    return True

def main():
    print("=== Scientific Article Knowledge Graph Enhancement Pipeline ===")
    
    # Phase 1: Metadata
    if not run_script("scripts/generate_metadata.py"): return

    # Phase 3: Baseline Initialization (Requires Neo4j to be up)
    print("Checking Neo4j connection...")
    uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    user = os.getenv("NEO4J_USER", "neo4j")
    password = os.getenv("NEO4J_PASSWORD", "password123")
    
    connected = False
    retries = 5
    while not connected and retries > 0:
        try:
            driver = GraphDatabase.driver(uri, auth=(user, password))
            driver.verify_connectivity()
            connected = True
            driver.close()
        except Exception:
            print(f"Neo4j not ready, retrying in 5s... ({retries} retries left)")
            time.sleep(5)
            retries -= 1
            
    if not connected:
        print("Could not connect to Neo4j. Ensure docker-compose up -d is running.")
        return

    if not run_script("scripts/initialize_baseline.py"): return

    # Phase 4: Text Extraction
    if not run_script("scripts/extract_text.py"): return

    # Phase 5: NLP Extraction
    if not run_script("scripts/extract_knowledge.py"): return

    # Phase 6: Enrichment
    if not run_script("scripts/enrich_graph.py"): return

    # Phase 7: Validation
    if not run_script("scripts/generate_report.py"): return

    # Phase 8: Export
    if not run_script("scripts/export_graph.py"): return

    print("\n=== Pipeline Completed Successfully ===")
    print("Final report generated: report/enhancement_report.md")
    print("Graph dump generated: graph_dump/paperpath.json")

if __name__ == "__main__":
    main()

# PaperPath

**A Neuro-Scientific Knowledge Graph Explorer**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Neo4j 5.12+](https://img.shields.io/badge/Neo4j-5.12+-green.svg)](https://neo4j.com/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)

---

## Overview

PaperPath is an end-to-end research intelligence platform that transforms unstructured scientific literature into a structured, navigable, and high-fidelity knowledge graph. By leveraging Natural Language Processing (NLP) and graph theory, the system enables researchers to discover hidden connections between diseases, brain regions, methodologies, and experimental results.

### The Challenge

The modern scientific landscape produces thousands of papers daily, creating an information overload that traditional literature review methods cannot address. Critical connections between studies remain hidden in isolated documents, and manual review processes create significant bottlenecks in research workflows.

### The Solution

PaperPath addresses these challenges through automated knowledge extraction and graph-based visualization. The platform processes raw PDF documents, extracts semantic entities and relationships using advanced NLP techniques, stores the structured data in a high-performance graph database, and provides interactive 2D/3D visualization interfaces for exploration and discovery.

---

## Core Capabilities

### Automated Knowledge Extraction

The specialized extraction engine processes raw PDF documents and converts them into canonical knowledge artifacts using spaCy-driven entity recognition with specialized PhraseMatcher logic for identifying brain regions and research methodologies. The system employs heuristic result mining through contextual analysis to extract significant findings and statistical observations from full-text bodies, and implements citation graphing using pattern matching for academic citations to build cross-reference networks between papers.

### High-Performance Graph Storage

The system utilizes Neo4j with a multi-layered schema designed for academic inquiry. Paper nodes serve as the central anchor point for all extracted data, while distinct entity node classes represent methods, results, diseases, and brain regions. Explicit semantic links such as USES_METHOD, STUDIES_REGION, and HAS_RESULT create a comprehensive relational mapping.

### Immersive Interactive Visualization

A next-generation frontend built for complex data exploration provides 2D/3D force-directed rendering with toggling between flat maps for clarity and spatial 3D models for density analysis. The glassmorphism UI offers a high-contrast, blur-filtered interface optimized for long research sessions, and real-time filtering allows instant isolation of specific node types or keyword searches.

---

## Technology Stack

### Backend and NLP
- **Python 3.11+**: Core processing and pipeline orchestration
- **spaCy (en_core_web_sm)**: Natural language processing for entity extraction and phrase matching
- **Neo4j 5.12+**: Graph database for high-performance relationship mapping
- **pdfplumber**: High-fidelity PDF text extraction
- **Flask**: Lightweight REST API serving graph data to the frontend

### Frontend
- **React 19**: Modern component-based UI framework
- **Tailwind CSS v4**: Utility-first styling with high-performance glassmorphism effects
- **react-force-graph (2D/3D)**: Canvas and WebGL accelerated graph visualization
- **Lucide React**: Premium iconography for the research interface

### DevOps and Verification
- **Docker & Docker Compose**: Containerized environment for database and processor
- **jq**: Command-line JSON processor for data validation
- **Cypher-Shell**: CLI for direct Neo4j interaction and restoration

---

## Project Architecture

### Directory Structure

```
PaperPath/
├── data/                       # Input PDF research papers
├── scripts/                    # Core Pipeline Scripts
│   ├── generate_metadata.py   # Extract PDF metadata
│   ├── extract_text.py         # PDF to plain text converter
│   ├── initialize_baseline.py # Setup baseline graph
│   ├── extract_knowledge.py   # NLP-driven entity extraction
│   ├── enrich_graph.py         # Populate graph with entities
│   ├── generate_report.py     # Comparative metrics generator
│   └── export_graph.py         # Generate verifiable graph dump
├── queries/                    # Cypher queries for audit
│   ├── neo4j_schema.cypher    # Database schema & constraints
│   ├── metrics.cypher          # Before/after comparison metrics
│   └── queries.cypher          # Research queries
├── graph_dump/                 # Verifiable Graph Data
│   ├── paperpath.json          # Portable JSON snapshot
│   └── paperpath.cypher        # Cypher restoration script
├── report/                     # Assessment Deliverables
│   ├── enhancement_report.md   # Before/after comparison
│   ├── extraction_logic.md     # NLP logic documentation
│   ├── baseline_metrics.json   # Raw baseline counts
│   └── post_enrichment_metrics.json # Raw final counts
├── outputs/                    # Intermediate Pipeline Data
│   ├── metadata/               # Processed paper metadata
│   ├── text_corpus/            # Extracted plain text
│   └── extracted_knowledge/    # JSON entities from NLP
├── backend/                    # Flask API
├── frontend/                   # React explorer
├── docker-compose.yml          # Container orchestration
└── main.py                     # Full pipeline orchestrator
```

### System Architecture

```
┌─────────────────┐
│  PDF Documents  │
│    (data/)      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│   Metadata Extraction       │
│   generate_metadata.py      │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   Text Extraction           │
│   extract_text.py           │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   NLP Processing            │
│   extract_knowledge.py      │
│   - Entity Recognition      │
│   - Result Mining           │
│   - Citation Parsing        │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   Graph Enrichment          │
│   enrich_graph.py           │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   Neo4j Database            │
│   - Papers (Nodes)          │
│   - Entities (Nodes)        │
│   - Relationships (Edges)   │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   Flask REST API            │
│   backend/app.py            │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│   React Frontend            │
│   - 2D/3D Visualization     │
│   - Interactive Explorer    │
└─────────────────────────────┘
```

---

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- 8GB+ RAM recommended
- Modern web browser (Chrome, Firefox, Edge)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/paperpath.git
cd paperpath
```

**2. Add research papers**
```bash
mkdir -p data/
# Place your PDF files in the data/ directory
```

**3. Launch the complete ecosystem**
```bash
docker-compose up --build
```

**4. Access the system**
- Frontend: http://localhost:8080
- Backend API: http://localhost:5001
- Neo4j Browser: http://localhost:7474 (credentials: neo4j/password123)

### Development Setup

#### Backend Pipeline

```bash
# Install Python dependencies
pip install spacy neo4j flask python-dotenv pdfplumber
python -m spacy download en_core_web_sm

# Run the complete pipeline
python main.py
```

#### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

#### Individual Pipeline Components

```bash
# Generate paper metadata
python3 scripts/generate_metadata.py

# Extract text from PDFs
python3 scripts/extract_text.py

# Run NLP extraction
python3 scripts/extract_knowledge.py

# Initialize baseline and enrich graph
python3 scripts/initialize_baseline.py
python3 scripts/enrich_graph.py

# Generate comparison report
python3 scripts/generate_report.py

# Export graph data
python3 scripts/export_graph.py
```

---

## Verification and Assessment

### Reproducing the Graph Enhancement

To verify the enhancement from baseline to enriched state:

```bash
# Initialize baseline graph (papers only)
python3 scripts/initialize_baseline.py

# Enrich graph with extracted entities
python3 scripts/enrich_graph.py

# Generate comparative analysis report
python3 scripts/generate_report.py

# Export verifiable data
python3 scripts/export_graph.py
```

### Auditing the Graph

The graph can be audited using Cypher queries located in `queries/metrics.cypher`. These queries provide raw counts for nodes and relationships, verifiable via the Neo4j Browser at http://localhost:7474.

### Quick Restoration

To verify the final graph without running the complete extraction pipeline, use the provided Cypher restoration script.

**Using Docker (Recommended)**

```bash
# Start a fresh Neo4j container
docker run -d --name neo4j-restore \
  -p7474:7474 -p7687:7687 \
  -e NEO4J_AUTH=neo4j/password123 \
  neo4j:5

# Wait 15 seconds for startup, then load the graph
docker exec -i neo4j-restore cypher-shell \
  -u neo4j -p password123 < graph_dump/paperpath.cypher

# Verify with metrics query
docker exec -i neo4j-restore cypher-shell \
  -u neo4j -p password123 < queries/metrics.cypher
```

**Using Local Neo4j**

```bash
cypher-shell -u <user> -p <pass> < graph_dump/paperpath.cypher
cypher-shell -u <user> -p <pass> < queries/metrics.cypher
```

### Data Verifiability

A complete dump of the enriched graph is provided in `graph_dump/paperpath.json`. This file contains every node, relationship, and property extracted during the process, ensuring reproducible results.

---

## Graph Enhancement Results

The enrichment pipeline achieved significant improvements across all metrics:

| Metric | Baseline | Enriched | Improvement |
|--------|----------|----------|-------------|
| Total Nodes | 46 | 299 | +253 (+550%) |
| Total Relationships | 26 | 491 | +465 (+1788%) |
| Disease Nodes | 7 | 20 | +13 (+186%) |
| Method Nodes | 0 | 19 | +19 (new) |
| Result Nodes | 0 | 203 | +203 (new) |
| Brain Region Nodes | 0 | 18 | +18 (new) |

---

## Key Features

### Advanced Search and Filtering

The system provides instant search functionality accessible via the `/` keyboard shortcut. Node type filtering allows isolation of papers, methods, results, diseases, or brain regions, with real-time results updating as you type.

### Interactive Visualization

Toggle between 2D force-directed graphs and 3D spatial representations for different analytical perspectives. Node interaction reveals detailed information with syntax-highlighted JSON displays. Smooth camera animations and zoom controls enable focused exploration, with responsive design optimized for desktop and tablet viewing.

### Knowledge Extraction Capabilities

The NLP engine recognizes 23+ anatomical brain structures including hippocampus, amygdala, and prefrontal cortex. It identifies 20+ research methods such as fMRI, EEG, deep learning, and graph theory. Automatic disease classification detects neurological conditions, while citation network mapping establishes cross-references between papers.

---

## Configuration

### Environment Variables

```bash
# Neo4j Connection
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password123

# Backend API
FLASK_PORT=5001
FLASK_HOST=0.0.0.0

# Processing Options
BATCH_SIZE=10
PARALLEL_WORKERS=4
```

### Docker Configuration

The project includes optimized Docker configurations with multi-stage builds for efficient image sizes, health checks for service dependencies, volume mounting for persistent data storage, and network isolation for enhanced security.

### Custom Entity Lists

Edit the seed lists in `scripts/extract_knowledge.py` to customize entity recognition:

```python
BRAIN_REGIONS = [
    "Hippocampus", "Amygdala", "Prefrontal Cortex",
    # Add domain-specific anatomical terms
]

METHODS = [
    "fMRI", "EEG", "Deep Learning", "Graph Theory",
    # Add methodology terms relevant to your research
]
```

---

## Advanced Usage

### Batch Processing

Process large collections efficiently with parallel execution:

```bash
python scripts/extract_knowledge.py --batch-size 50 --parallel 4
```

### Export Options

Export graph data for external analysis in multiple formats:

```bash
# Export to GraphML
curl http://localhost:5001/api/export?format=graphml > graph.xml

# Export to JSON
curl http://localhost:5001/api/export?format=json > graph.json

# Export to CSV
curl http://localhost:5001/api/export?format=csv > graph.csv
```

### Custom Visualizations

The frontend accepts URL parameters for customized views:

```
http://localhost:8080/?mode=3d&layout=hierarchical&filter=fMRI
```

### Cypher Query Examples

Access Neo4j Browser and execute research queries:

```cypher
// Find all papers using fMRI methodology
MATCH (p:Paper)-[:USES_METHOD]->(m:Method {name: "fMRI"})
RETURN p, m

// Discover shortest path between research areas
MATCH path = shortestPath(
  (p1:Paper {title: "Study A"})-[*]-(p2:Paper {title: "Study B"})
)
RETURN path

// Find papers studying specific brain regions
MATCH (p:Paper)-[:STUDIES_REGION]->(r:BrainRegion)
WHERE r.name IN ["Hippocampus", "Amygdala"]
RETURN p.title, r.name

// Identify most-cited papers
MATCH (p:Paper)-[:CITES]->(cited:Paper)
RETURN cited.title, COUNT(*) as citations
ORDER BY citations DESC
LIMIT 10
```

---

## Performance Optimizations

### NLP Pipeline

The system employs spaCy PhraseMatcher for efficient entity recognition, parallel processing for multi-document extraction, streaming text processing for memory management, and caching of intermediate results to reduce redundant computation.

### Graph Database

Neo4j optimization includes indexed properties for query performance, efficient relationship type definitions for traversal patterns, batch operations for bulk node and relationship creation, and connection pooling through the Neo4j driver.

### Frontend

React performance optimization utilizes memoization through useMemo and useCallback hooks, efficient virtual DOM rendering updates, hardware-accelerated canvas graphics, and code splitting with lazy loading for large datasets.

---

## Testing and Validation

### Graph Metrics Validation

The system performs node count verification, relationship integrity checks, citation network validation, and entity extraction accuracy assessment to ensure data quality.

### Frontend Performance

Memoized state management prevents unnecessary re-renders. Optimized graph algorithms ensure smooth visualization performance. Efficient UI update patterns maintain responsiveness even with large datasets.

---

## Security Considerations

The platform implements Neo4j authentication for secure database access, input validation with sanitized PDF processing, CORS configuration for controlled API access, and Docker container isolation for network security.

---

## Troubleshooting

### Neo4j Connection Issues

```bash
# Check Neo4j logs
docker-compose logs neo4j

# Verify database accessibility
docker exec -it paperpath-neo4j cypher-shell

# Reset database if needed
docker-compose down -v
docker-compose up --build
```

### PDF Processing Errors

Ensure PDFs are text-based rather than scanned images. Check file permissions in the `data/` directory. Review processor logs with `docker-compose logs processor`. For scanned documents, consider implementing OCR preprocessing.

### Performance Optimization for Large Datasets

For collections exceeding 1000 papers, increase Neo4j heap size in `docker-compose.yml`, enable pagination in the frontend, consider Neo4j Enterprise for clustering capabilities, and implement incremental processing strategies.

---

## Roadmap

### Version 2.0 (In Development)

- LLM integration for advanced entity extraction using transformer models
- Real-time collaboration features for multi-user graph editing
- Advanced analytics including graph centrality and clustering algorithms
- Multiple export formats: GraphML, CSV, JSON-LD, RDF
- Mobile-responsive interface optimization
- Plugin architecture for extensible extraction modules

### Future Vision

- Multi-language support for international research papers
- Integration with reference managers (Zotero, Mendeley, EndNote)
- AI-powered research recommendations based on citation patterns
- Automated contradiction detection between conflicting results
- Trend prediction algorithms for emerging research areas
- OCR support for scanned documents

---

## Documentation

Comprehensive documentation is available throughout the project:

- **API Reference**: Backend endpoints documented in `backend/app.py`
- **NLP Engine**: Extraction logic detailed in `report/extraction_logic.md`
- **Graph Schema**: Neo4j model defined in `queries/neo4j_schema.cypher`
- **Enhancement Report**: Comparative analysis in `report/enhancement_report.md`
- **User Guide**: Interactive tutorial in the frontend interface

---

## Contributing

Contributions are welcome and appreciated. To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Implement your changes with appropriate tests
4. Ensure all tests pass and code follows style guidelines
5. Update documentation as needed
6. Submit a pull request with a clear description of changes

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## Citation

If you use PaperPath in your research, please cite:

```bibtex
@software{paperpath2025,
  title={PaperPath: A Neuro-Scientific Knowledge Graph Explorer},
  author={Your Name},
  year={2025},
  publisher={GitHub},
  url={https://github.com/yourusername/paperpath},
  note={An end-to-end research intelligence platform for scientific literature analysis}
}
```

---

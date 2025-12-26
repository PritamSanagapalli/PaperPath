# PaperPath: Neuro-Scientific Knowledge Graph Explorer 🔬🧠

**PaperPath** is an end-to-end research intelligence platform that transforms unstructured scientific literature into a structured, navigable, and high-fidelity Knowledge Graph. By leveraging Natural Language Processing (NLP) and Graph Theory, it enables researchers to discover hidden connections between diseases, brain regions, methodologies, and experimental results.

## 🛠️ Technologies & Tools

### **Backend & NLP**
- **Python 3.11+**: Core processing and pipeline orchestration.
- **spaCy (en_core_web_sm)**: Natural Language Processing for entity extraction and phrase matching.
- **Neo4j 5.12+**: Graph database for high-performance relationship mapping.
- **pdfplumber**: High-fidelity PDF text extraction.
- **Flask**: Lightweight REST API serving graph data to the frontend.

### **Frontend**
- **React 19**: Modern component-based UI framework.
- **Tailwind CSS v4**: Utility-first styling with high-performance glassmorphism effects.
- **react-force-graph (2D/3D)**: Canvas and WebGL accelerated graph visualization.
- **Lucide React**: Premium iconography for the research interface.

### **DevOps & Verification**
- **Docker & Docker Compose**: Containerized environment for database and processor.
- **jq**: Command-line JSON processor for data validation.
- **Cypher-Shell**: CLI for direct Neo4j interaction and restoration.

## 🏗️ Project Architecture

### Directory Structure (Aligned to Assignment Requirements)
```
PaperPath/
├── data/                  # Input PDF research papers (raw data)
├── scripts/               # Core Pipeline Scripts (Parsing & Ingestion)
│   ├── generate_metadata.py # Step 1: Extract PDF metadata
│   ├── extract_text.py    # Step 2: PDF to plain text converter
│   ├── initialize_baseline.py # Step 3: Setup baseline graph (Papers only)
│   ├── extract_knowledge.py # Step 4: NLP-driven entity/result extraction
│   ├── enrich_graph.py    # Step 5: Populate graph with extracted entities
│   ├── generate_report.py # Step 6: Comparative metrics generator
│   └── export_graph.py    # Step 7: Generates verifiable graph dump
├── queries/               # Cypher queries for audit & analysis
│   ├── neo4j_schema.cypher # Database schema & constraints
│   ├── metrics.cypher      # Metrics for before/after comparison
│   └── queries.cypher      # Useful research queries
├── graph_dump/            # Verifiable Graph Data snapshots
│   ├── paperpath.json     # Portable JSON snapshot of the graph
│   └── paperpath.cypher   # Cypher restoration script
├── report/                # Assessment Deliverables & Metrics
│   ├── enhancement_report.md # Before/After comparison report
│   ├── extraction_logic.md   # Detailed NLP logic documentation
│   ├── baseline_metrics.json # Raw baseline counts
│   └── post_enrichment_metrics.json # Raw final counts
├── outputs/               # Intermediate Pipeline Data (Auto-generated)
│   ├── metadata/          # Processed paper metadata
│   ├── text_corpus/       # Extracted plain text from PDFs
│   └── extracted_knowledge/# JSON entities from NLP engine
├── backend/               # Flask API support
├── frontend/              # React interactive explorer
├── docker-compose.yml     # Container orchestration
└── main.py                # Full pipeline orchestrator
```

## 📊 Verification & Assessment Guide

### 1. Reproducing the Graph Enhancement
To verify the enhancement from baseline to enriched state, run:
```bash
# 1. Initialize Baseline (Papers only)
python3 scripts/initialize_baseline.py

# 2. Enrich Graph (Add Methods, Results, Regions)
python3 scripts/enrich_graph.py

# 3. Generate Comparison Report
python3 scripts/generate_report.py

# 4. Export Verifiable Data
python3 scripts/export_graph.py
```

### 2. Auditing the Graph
The graph can be audited using the Cypher queries located in `queries/metrics.cypher`. These queries provide raw counts for nodes and relationships, verifiable via the Neo4j Browser (http://localhost:7474).

### 3. Quick Restoration (Verification)
If you wish to verify the final graph without running the extraction pipeline, use the provided Cypher restoration script:

#### Using Docker (Recommended)
1. Start a fresh Neo4j container:
   ```bash
   docker run -d --name neo4j-restore -p7474:7474 -p7687:7687 -e NEO4J_AUTH=neo4j/password123 neo4j:5
   ```
2. Wait 15 seconds for startup, then load the graph:
   ```bash
   docker exec -i neo4j-restore cypher-shell -u neo4j -p password123 < graph_dump/paperpath.cypher
   ```
3. Run the metrics query to verify:
   ```bash
   docker exec -i neo4j-restore cypher-shell -u neo4j -p password123 < queries/metrics.cypher
   ```

#### Using Local Neo4j
```bash
cypher-shell -u <user> -p <pass> < graph_dump/paperpath.cypher
cypher-shell -u <user> -p <pass> < queries/metrics.cypher
```

### 4. Data Verifiability
A full dump of the enriched graph is provided in `graph_dump/paperpath.json`. This file contains every node, relationship, and property extracted during the process, ensuring the results are reproducible.

## 🌟 Core Capabilities

### 1. Automated Knowledge Extraction (NLP Pipeline)
Our specialized extraction engine processes raw PDF documents and converts them into canonical knowledge artifacts using:
- **spaCy-driven Entity Recognition**: Specialized `PhraseMatcher` logic for identifying **Brain Regions** and **Research Methodologies**.
- **Heuristic Result Mining**: Contextual analysis to extract significant findings and statistical observations from full-text bodies.
- **Citation Graphing**: Pattern matching for academic citations to build a cross-reference network between papers.

### 2. High-Performance Graph Storage
Utilizes **Neo4j** with a multi-layered schema designed for academic inquiry:
- **Paper Nodes**: The central anchor point for all extracted data.
- **Entity Nodes**: Distinct classes for `Method`, `Result`, `Disease`, and `BrainRegion`.
- **Relational Mapping**: Explicit semantic links like `[:USES_METHOD]`, `[:STUDIES_REGION]`, and `[:HAS_RESULT]`.

### 3. Immersive Interactive Visualization
A next-generation frontend built for complex data exploration:
- **2D/3D Force-Directed Rendering**: Toggle between flat maps for clarity and spatial 3D models for density analysis.
- **Glassmorphism UI**: A high-contrast, blur-filtered interface optimized for long research sessions.
- **Real-time Filtering**: Instantly isolate specific node types or search for keywords using the `/` shortcut.

### Core Components

#### **Backend & Pipeline**
- **Orchestrator (`main.py`)**: Manages the multi-phase lifecycle (Metadata → Extraction → NLP → Enrichment → Reporting)
- **Knowledge Engine (`extract_knowledge.py`)**: Uses spaCy `en_core_web_sm` to perform entity extraction and result mining
- **API Layer (`backend/app.py`)**: Flask-based REST service serving graph topology and real-time statistics

#### **Frontend**
- **Framework**: React 19 with Tailwind CSS v4
- **Visualization**: `react-force-graph-2d/3d` for canvas-accelerated rendering
- **Interactivity**: Custom hooks for camera control, node selection, and syntax-highlighted data panels

## 🚦 Getting Started

### Prerequisites
- Docker & Docker Compose
- Python 3.8+ (for local development)
- Node.js 18+ (for frontend development)

### Quick Start (Docker Compose)
The fastest way to launch the entire ecosystem:
```bash
docker-compose up --build
```

**Access Points:**
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5001
- **Neo4j Browser**: http://localhost:7474 (login: neo4j/password123)

### Development Setup

#### 1. Backend Pipeline
```bash
# Install Python dependencies
pip install spacy neo4j flask python-dotenv
python -m spacy download en_core_web_sm

# Run the complete pipeline
python main.py
```

#### 2. Frontend Development
```bash
cd frontend
npm install
npm run dev
```

#### 3. Individual Components
```bash
# Generate paper metadata
python3 scripts/generate_metadata.py

# Extract text from PDFs
python3 scripts/extract_text.py

# Run NLP extraction
python3 scripts/extract_knowledge.py

# Enrich Neo4j graph
python3 scripts/initialize_baseline.py
python3 scripts/enrich_graph.py

# Generate comparison report
python3 scripts/generate_report.py

# Export graph data
python3 scripts/export_graph.py
```

## 📊 Graph Enhancement Results

Our enrichment pipeline achieved significant improvements:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Total Nodes | 46 | 299 | +253 |
| Total Relationships | 26 | 491 | +465 |
| Disease Nodes | 7 | 20 | +13 |
| Method Nodes | 0 | 19 | +19 |
| Result Nodes | 0 | 203 | +203 |
| BrainRegion Nodes | 0 | 18 | +18 |

## 🎯 Key Features

### Advanced Search
- **Instant Search**: Press `/` to open the floating search bar
- **Node Type Filtering**: Filter by Papers, Methods, Results, Diseases, or Brain Regions
- **Real-time Results**: See search results update as you type

### Interactive Visualization
- **2D/3D Toggle**: Switch between 2D force-directed graphs and 3D spatial representations
- **Node Interaction**: Click nodes to see detailed information with syntax-highlighted JSON
- **Camera Controls**: Smooth animations and zoom controls for focused exploration
- **Responsive Design**: Optimized for desktop and tablet viewing

### Knowledge Extraction
- **Brain Regions**: 23+ anatomical structures (hippocampus, amygdala, prefrontal cortex, etc.)
- **Research Methods**: 20+ techniques (fMRI, EEG, deep learning, graph theory, etc.)
- **Disease Classification**: Automatic identification of neurological conditions
- **Citation Networks**: Cross-reference mapping between papers

## 🔧 Configuration

### Environment Variables
```bash
# Neo4j Connection
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password123

# Backend API
FLASK_PORT=5001
FLASK_HOST=0.0.0.0
```

### Docker Configuration
The project includes optimized Docker configurations:
- **Multi-stage builds** for efficient image sizes
- **Health checks** for service dependencies
- **Volume mounting** for persistent data
- **Network isolation** for security

## 🧪 Testing & Validation

### Graph Metrics Validation
- Node count verification
- Relationship integrity checks
- Citation network validation
- Entity extraction accuracy

### Frontend Performance
- Memoized state management
- Optimized re-renders
- Efficient graph algorithms
- Responsive UI updates

## 📈 Performance Optimizations

### NLP Pipeline
- **spaCy PhraseMatcher**: Efficient entity recognition
- **Parallel Processing**: Multi-document extraction
- **Memory Management**: Streaming text processing
- **Caching**: Intermediate result storage

### Graph Database
- **Indexed Properties**: Optimized query performance
- **Relationship Types**: Efficient traversal patterns
- **Batch Operations**: Bulk node/relationship creation
- **Connection Pooling**: Neo4j driver optimization

### Frontend
- **React Memoization**: useMemo and useCallback hooks
- **Virtual DOM**: Efficient rendering updates
- **Canvas Acceleration**: Hardware-accelerated graphics
- **Code Splitting**: Lazy loading for large datasets

## 🔒 Security Considerations

- **Neo4j Authentication**: Secure database access
- **Input Validation**: Sanitized PDF processing
- **CORS Configuration**: Controlled API access
- **Container Isolation**: Docker network security

## 🚀 Future Enhancements

- **LLM Integration**: Advanced entity extraction using transformer models
- **Real-time Collaboration**: Multi-user graph editing
- **Advanced Analytics**: Graph centrality and clustering algorithms
- **Export Formats**: Multiple data export options (GraphML, CSV, JSON-LD)
- **Mobile Support**: Responsive mobile interface
- **Plugin Architecture**: Extensible extraction modules

## 📚 Documentation

- **API Reference**: Backend endpoints documented in `backend/app.py`
- **NLP Engine**: Extraction logic detailed in `report/extraction_logic.md`
- **Graph Schema**: Neo4j model defined in `queries/neo4j_schema.cypher`
- **Enhancement Report**: Comparative analysis in `report/enhancement_report.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **spaCy**: Natural language processing framework
- **Neo4j**: Graph database platform
- **React Force Graph**: Interactive graph visualization
- **Tailwind CSS**: Utility-first CSS framework
- **Research Community**: Scientific papers used for development

---

**PaperPath** - Transforming scientific literature into actionable knowledge graphs. 🔬✨
>>>>>>> 3b6501b (Complete Project Setup: Pipeline, NLP Extraction, Neo4j Enriched Graph, and Verifiable Deliverables)

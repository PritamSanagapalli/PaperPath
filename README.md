# PaperPath

<div align="center">

![PaperPath Logo](https://img.shields.io/badge/PaperPath-Knowledge_Graph-blueviolet?style=for-the-badge)

**A Neuro-Scientific Knowledge Graph Explorer**

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Neo4j](https://img.shields.io/badge/Neo4j-5.12+-008CC1?style=flat-square&logo=neo4j&logoColor=white)](https://neo4j.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![spaCy](https://img.shields.io/badge/spaCy-NLP-09A3D5?style=flat-square&logo=spacy&logoColor=white)](https://spacy.io/)

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Documentation](#-documentation) • [Demo](#-demo)

</div>

---

## 📖 Table of Contents

- [What is PaperPath?](#-what-is-paperpath)
- [Key Features](#-key-features)
- [Demo](#-demo)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Pipeline Workflow](#-pipeline-workflow)
- [Technology Stack](#-technology-stack)
- [Configuration](#-configuration)
- [Advanced Usage](#-advanced-usage)
- [Graph Enhancement](#-graph-enhancement)
- [API Reference](#-api-reference)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)

---

## 🧬 What is PaperPath?

<details open>
<summary><b>Click to expand</b></summary>

PaperPath transforms the way researchers interact with scientific literature by converting isolated PDF documents into an **interconnected knowledge graph**. Using advanced Natural Language Processing (NLP) and graph theory, it automatically extracts and visualizes relationships between:

- 🧠 **Brain Regions** (Hippocampus, Amygdala, Prefrontal Cortex, etc.)
- 🔬 **Research Methods** (fMRI, EEG, Deep Learning, Graph Theory, etc.)
- 🏥 **Diseases** (Alzheimer's, Parkinson's, Depression, etc.)
- 📊 **Results** (Statistical findings, experimental outcomes)
- 📚 **Citations** (Cross-reference networks between papers)

### The Problem

```
📄 Paper 1 → 📄 Paper 2 → 📄 Paper 3 → 📄 Paper N...
   ↓            ↓            ↓            ↓
Isolated    Disconnected   Hidden      Lost
Knowledge   Insights       Patterns    Connections
```

### The Solution

```
        📄 Paper 1
       /  |  \
      /   |   \
   🧠    🔬    🏥
    \    |    /
     \   |   /
      📄 Paper 2 ←→ 📄 Paper 3
           ↓
      Connected Knowledge
```

</details>

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🤖 Intelligent Extraction
- **23+ Brain Regions** recognized
- **20+ Research Methods** identified
- **Statistical Results** mined automatically
- **Citation Networks** built dynamically

</td>
<td width="50%">

### 🎨 Interactive Visualization
- **2D/3D Toggle** for different perspectives
- **Real-time Search** with `/` shortcut
- **Glassmorphism UI** for clarity
- **Smooth Animations** and camera controls

</td>
</tr>
<tr>
<td width="50%">

### 🗄️ Graph Database
- **Neo4j Powered** for fast queries
- **Relationship-First** data model
- **Cypher Queries** for advanced analysis
- **Verifiable Exports** in JSON/Cypher

</td>
<td width="50%">

### 🐳 Production Ready
- **Docker Compose** one-command deploy
- **Modular Pipeline** for easy customization
- **Health Checks** for service reliability
- **Scalable Architecture** from laptop to cloud

</td>
</tr>
</table>

---

## 🎬 Demo

<details open>
<summary><b>📸 Click to see screenshots</b></summary>

### 2D Visualization Mode
![PaperPath 2D View](https://raw.githubusercontent.com/PritamSanagapalli/PaperPath/main/screenshot-2d.png)

The 2D view provides a clear, force-directed layout perfect for detailed navigation and exploration. Features include:
- **Color-coded nodes** by type (Papers, Methods, Results, Diseases, Brain Regions)
- **Interactive filters** on the left sidebar
- **Real-time statistics** showing node counts
- **Search functionality** with keyboard shortcut (`/`)
- **Smooth zoom and pan** controls

---

### 3D Visualization Mode
![PaperPath 3D View](https://raw.githubusercontent.com/PritamSanagapalli/PaperPath/main/screenshot-3d.png)

The 3D view offers an immersive spatial perspective for cluster analysis and pattern discovery. Features include:
- **Spatial depth** revealing research clusters
- **Node tooltips** showing content previews
- **Camera controls** for 360° exploration
- **Flying navigation** through the knowledge graph
- **Density visualization** of research areas

---

### Key Interface Elements

**Sidebar Stats:**
- 📄 **39 Papers** - Core research documents
- 🔬 **19 Methods** - Research techniques identified
- 📊 **203 Results** - Extracted findings
- 🧠 **18 Regions** - Brain areas studied
- 🏥 **20 Diseases** - Conditions researched

**Filter System:**
Toggle visibility by node type to focus your exploration on specific aspects of the research landscape.

</details>

---

## 🚀 Quick Start

### One-Command Deploy

```bash
# Clone and launch in 3 commands
git clone https://github.com/yourusername/paperpath.git
cd paperpath
docker-compose up --build
```

**That's it!** Open your browser:
- 🌐 Frontend: http://localhost:8080
- 🔧 Backend API: http://localhost:5001
- 🗄️ Neo4j Browser: http://localhost:7474 (neo4j/password123)

### Manual Setup

<details>
<summary><b>🔧 Click for detailed installation</b></summary>

#### Prerequisites
```bash
# Check your installations
docker --version          # Docker 20.10+
docker-compose --version  # Docker Compose 1.29+
python --version          # Python 3.11+
node --version            # Node.js 18+
```

#### Backend Setup
```bash
# Install Python dependencies
pip install spacy neo4j flask python-dotenv pdfplumber

# Download spaCy model
python -m spacy download en_core_web_sm

# Run pipeline
python main.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Add Your Papers
```bash
# Create data directory
mkdir -p data/

# Copy your PDFs
cp /path/to/your/papers/*.pdf data/

# Process them
python scripts/extract_knowledge.py
python scripts/enrich_graph.py
```

</details>

---

## 🏗️ Architecture

<details>
<summary><b>📐 Click to see system architecture</b></summary>

```
┌─────────────────────────────────────────────────────────────┐
│                      PaperPath System                        │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐
│ PDF Papers   │
│  (data/)     │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────┐
│   EXTRACTION PIPELINE                    │
├──────────────────────────────────────────┤
│  1. Metadata Generator                   │
│     └─→ extract title, authors, year    │
│                                          │
│  2. Text Extractor                       │
│     └─→ PDF to plain text               │
│                                          │
│  3. NLP Processor                        │
│     ├─→ Entity Recognition (spaCy)      │
│     ├─→ Result Mining (heuristics)      │
│     └─→ Citation Parsing (regex)        │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│   NEO4J GRAPH DATABASE                   │
├──────────────────────────────────────────┤
│  Nodes:                                  │
│  • Papers (46 → 299)                     │
│  • Methods (0 → 19)                      │
│  • Results (0 → 203)                     │
│  • BrainRegions (0 → 18)                 │
│  • Diseases (7 → 20)                     │
│                                          │
│  Relationships:                          │
│  • USES_METHOD (26 → 491)                │
│  • STUDIES_REGION                        │
│  • HAS_RESULT                            │
│  • CITES                                 │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│   FLASK REST API                         │
├──────────────────────────────────────────┤
│  GET  /api/graph                         │
│  GET  /api/node/:id                      │
│  GET  /api/search?q=query                │
│  GET  /api/export?format=json            │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│   REACT FRONTEND                         │
├──────────────────────────────────────────┤
│  • Force-Directed Layout (2D/3D)         │
│  • Real-time Filtering                   │
│  • Node Details Panel                    │
│  • Syntax-Highlighted JSON               │
└──────────────────────────────────────────┘
```

</details>

---

## 🔄 Pipeline Workflow

<details>
<summary><b>⚙️ Click to see complete pipeline</b></summary>

### Step-by-Step Execution

```bash
# Step 1: Generate Metadata
python scripts/generate_metadata.py
# Output: outputs/metadata/*.json

# Step 2: Extract Text
python scripts/extract_text.py
# Output: outputs/text_corpus/*.txt

# Step 3: Initialize Baseline Graph
python scripts/initialize_baseline.py
# Creates: Papers + Disease nodes only

# Step 4: Extract Knowledge (NLP)
python scripts/extract_knowledge.py
# Output: outputs/extracted_knowledge/*.json

# Step 5: Enrich Graph
python scripts/enrich_graph.py
# Adds: Methods, Results, BrainRegions

# Step 6: Generate Report
python scripts/generate_report.py
# Output: report/enhancement_report.md

# Step 7: Export Graph
python scripts/export_graph.py
# Output: graph_dump/paperpath.{json,cypher}
```

### Or Run Everything at Once

```bash
python main.py  # Executes all steps sequentially
```

</details>

---

## 🛠️ Technology Stack

<table>
<tr>
<th>Layer</th>
<th>Technology</th>
<th>Purpose</th>
</tr>
<tr>
<td><b>NLP</b></td>
<td>
  <img src="https://img.shields.io/badge/spaCy-09A3D5?style=flat-square&logo=spacy&logoColor=white" alt="spaCy"/>
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"/>
</td>
<td>Entity extraction, phrase matching</td>
</tr>
<tr>
<td><b>Database</b></td>
<td>
  <img src="https://img.shields.io/badge/Neo4j-008CC1?style=flat-square&logo=neo4j&logoColor=white" alt="Neo4j"/>
</td>
<td>Graph storage, relationship queries</td>
</tr>
<tr>
<td><b>Backend</b></td>
<td>
  <img src="https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white" alt="Flask"/>
</td>
<td>REST API, data serving</td>
</tr>
<tr>
<td><b>Frontend</b></td>
<td>
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
</td>
<td>Interactive UI, graph visualization</td>
</tr>
<tr>
<td><b>DevOps</b></td>
<td>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker"/>
</td>
<td>Containerization, orchestration</td>
</tr>
</table>

---

## ⚙️ Configuration

<details>
<summary><b>🔧 Environment Variables</b></summary>

Create a `.env` file:

```bash
# Neo4j Configuration
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password123

# Backend Configuration
FLASK_PORT=5001
FLASK_HOST=0.0.0.0
FLASK_DEBUG=false

# Processing Configuration
BATCH_SIZE=10
PARALLEL_WORKERS=4
LOG_LEVEL=INFO

# Frontend Configuration
VITE_API_URL=http://localhost:5001
VITE_NEO4J_URI=bolt://localhost:7687
```

</details>

<details>
<summary><b>🎯 Custom Entity Lists</b></summary>

Edit `scripts/extract_knowledge.py`:

```python
# Brain Regions (Add your domain-specific terms)
BRAIN_REGIONS = [
    "Hippocampus",
    "Amygdala",
    "Prefrontal Cortex",
    "Basal Ganglia",
    # Add more...
]

# Research Methods
METHODS = [
    "fMRI",
    "EEG",
    "Deep Learning",
    "Graph Theory",
    # Add more...
]

# Statistical Keywords
STATISTICAL_KEYWORDS = [
    "p < 0.05",
    "significant",
    "correlation",
    # Add more...
]
```

</details>

---

## 🎓 Advanced Usage

### 🔍 Cypher Query Examples

<details>
<summary><b>Click for query cookbook</b></summary>

```cypher
// 1. Find all papers using fMRI
MATCH (p:Paper)-[:USES_METHOD]->(m:Method {name: "fMRI"})
RETURN p.title, p.year
ORDER BY p.year DESC

// 2. Discover connections between papers
MATCH path = shortestPath(
  (p1:Paper {title: "Study A"})-[*]-(p2:Paper {title: "Study B"})
)
RETURN path

// 3. Find papers studying Alzheimer's with fMRI
MATCH (p:Paper)-[:STUDIES_DISEASE]->(d:Disease {name: "Alzheimer's"})
MATCH (p)-[:USES_METHOD]->(m:Method {name: "fMRI"})
RETURN p.title, p.year

// 4. Most-cited papers
MATCH (p:Paper)-[:CITES]->(cited:Paper)
RETURN cited.title, COUNT(*) as citations
ORDER BY citations DESC
LIMIT 10

// 5. Papers studying specific brain regions
MATCH (p:Paper)-[:STUDIES_REGION]->(r:BrainRegion)
WHERE r.name IN ["Hippocampus", "Amygdala"]
RETURN p.title, COLLECT(r.name) as regions

// 6. Find research gaps (methods never used for a disease)
MATCH (d:Disease {name: "Parkinson's"})
MATCH (m:Method)
WHERE NOT EXISTS {
  MATCH (:Paper)-[:STUDIES_DISEASE]->(d)
  MATCH (:Paper)-[:USES_METHOD]->(m)
}
RETURN m.name as unused_method

// 7. Co-occurrence analysis
MATCH (p:Paper)-[:STUDIES_REGION]->(r1:BrainRegion)
MATCH (p)-[:STUDIES_REGION]->(r2:BrainRegion)
WHERE r1 <> r2
RETURN r1.name, r2.name, COUNT(p) as co_occurrences
ORDER BY co_occurrences DESC
LIMIT 20
```

</details>

### 📊 Export Options

```bash
# Export to JSON
curl http://localhost:5001/api/export?format=json > graph.json

# Export to GraphML (for Gephi/Cytoscape)
curl http://localhost:5001/api/export?format=graphml > graph.xml

# Export to CSV
curl http://localhost:5001/api/export?format=csv > graph.csv

# Export specific node types
curl http://localhost:5001/api/export?format=json&type=Method > methods.json
```

### 🚄 Batch Processing

```bash
# Process large collections
python scripts/extract_knowledge.py \
  --batch-size 50 \
  --parallel 4 \
  --output outputs/batch_1/

# Process specific PDFs
python scripts/extract_knowledge.py \
  --input data/subset/*.pdf
```

---

## 📈 Graph Enhancement

<details open>
<summary><b>📊 Before & After Metrics</b></summary>

| Metric | Baseline | Enriched | Improvement |
|--------|----------|----------|-------------|
| **Total Nodes** | 46 | 299 | +253 (⬆️ 550%) |
| **Total Relationships** | 26 | 491 | +465 (⬆️ 1788%) |
| **Disease Nodes** | 7 | 20 | +13 (⬆️ 186%) |
| **Method Nodes** | 0 | 19 | +19 (✨ new) |
| **Result Nodes** | 0 | 203 | +203 (✨ new) |
| **BrainRegion Nodes** | 0 | 18 | +18 (✨ new) |

### Visual Comparison

**Baseline Graph**
```
📄 ─── 📄 ─── 📄
│       │       │
🏥     🏥     🏥
```

**Enriched Graph**
```
    📄 ─── 🔬 ─── 📄
   /│\     │     /│\
  / │ \    │    / │ \
🧠 🏥 📊  🔬  🧠 🏥 📊
  \ │ /    │    \ │ /
   \│/     │     \│/
    📄 ─── 🔬 ─── 📄
```

</details>

---

## 📡 API Reference

<details>
<summary><b>🔌 Click for API endpoints</b></summary>

### Base URL
```
http://localhost:5001/api
```

### Endpoints

#### Get Full Graph
```http
GET /graph
```

**Response:**
```json
{
  "nodes": [
    {
      "id": "paper_1",
      "type": "Paper",
      "title": "Study of Brain Networks",
      "year": 2023
    }
  ],
  "links": [
    {
      "source": "paper_1",
      "target": "method_1",
      "type": "USES_METHOD"
    }
  ]
}
```

#### Get Node Details
```http
GET /node/:id
```

**Response:**
```json
{
  "id": "paper_1",
  "type": "Paper",
  "properties": {
    "title": "Study of Brain Networks",
    "year": 2023,
    "authors": ["Smith J", "Doe A"]
  },
  "relationships": [
    {
      "type": "USES_METHOD",
      "target": "method_1"
    }
  ]
}
```

#### Search
```http
GET /search?q=fMRI&type=Method
```

**Response:**
```json
{
  "results": [
    {
      "id": "method_1",
      "type": "Method",
      "name": "fMRI",
      "count": 15
    }
  ]
}
```

#### Export
```http
GET /export?format=json
```

**Formats:** `json`, `graphml`, `csv`, `cypher`

</details>

---

## 🐛 Troubleshooting

<details>
<summary><b>❌ Neo4j won't start</b></summary>

```bash
# Check logs
docker-compose logs neo4j

# Common fix: Clear volumes
docker-compose down -v
docker-compose up --build

# Verify connection
docker exec -it paperpath-neo4j cypher-shell -u neo4j -p password123
```

</details>

<details>
<summary><b>❌ PDF processing fails</b></summary>

```bash
# Check if PDFs are text-based (not scanned)
pdftotext data/paper.pdf - | head

# Check permissions
ls -la data/

# View processor logs
docker-compose logs processor

# Try individual file
python scripts/extract_text.py --input data/specific_paper.pdf
```

</details>

<details>
<summary><b>❌ Frontend shows no data</b></summary>

```bash
# Check backend is running
curl http://localhost:5001/api/graph

# Check Neo4j has data
docker exec -it paperpath-neo4j cypher-shell -u neo4j -p password123
# Run: MATCH (n) RETURN COUNT(n);

# Rebuild frontend
cd frontend
npm run build
```

</details>

<details>
<summary><b>❌ Slow performance with large datasets</b></summary>

```bash
# Increase Neo4j memory in docker-compose.yml
NEO4J_dbms_memory_heap_initial__size=2G
NEO4J_dbms_memory_heap_max__size=4G

# Enable pagination in frontend (config.js)
PAGINATION_SIZE=100

# Create database indexes
# In Neo4j Browser:
CREATE INDEX paper_title FOR (p:Paper) ON (p.title);
CREATE INDEX method_name FOR (m:Method) ON (m.name);
```

</details>

---

## 🗺️ Roadmap

### ✅ Version 1.0 (Current)
- [x] PDF text extraction
- [x] NLP entity recognition
- [x] Neo4j graph storage
- [x] 2D/3D visualization
- [x] Docker containerization
- [x] Export functionality

### 🚧 Version 2.0 (In Development)
- [ ] LLM-powered extraction (GPT-4, Claude)
- [ ] Real-time collaboration
- [ ] Advanced analytics (centrality, clustering)
- [ ] Mobile responsive interface
- [ ] OCR for scanned documents
- [ ] Multi-language support

### 🔮 Future Vision
- [ ] Automated literature review generation
- [ ] Research gap identification
- [ ] Trend prediction algorithms
- [ ] Integration with Zotero/Mendeley
- [ ] Contradiction detection
- [ ] AI research recommendations

---

## 🤝 Contributing

<details>
<summary><b>🎯 How to contribute</b></summary>

### We Welcome Contributions!

**Ways to contribute:**
- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the repository

### Contribution Workflow

```bash
# 1. Fork the repository
gh repo fork yourusername/paperpath

# 2. Create a feature branch
git checkout -b feature/amazing-feature

# 3. Make your changes
# ... code, code, code ...

# 4. Run tests
python -m pytest tests/

# 5. Commit with clear message
git commit -m "Add: Amazing feature that does X"

# 6. Push to your fork
git push origin feature/amazing-feature

# 7. Open a Pull Request
gh pr create --title "Add amazing feature" --body "Description..."
```

### Code Style

- **Python**: Follow PEP 8
- **JavaScript**: Use ESLint config
- **Commits**: Use conventional commits (feat:, fix:, docs:)

</details>

---

## 📬 Contact & Support

<div align="center">

### Get Help

[![Documentation](https://img.shields.io/badge/Docs-Read-blue?style=for-the-badge)](./report/)
[![Issues](https://img.shields.io/badge/Issues-Report-red?style=for-the-badge)](https://github.com/yourusername/paperpath/issues)
[![Discussions](https://img.shields.io/badge/Discuss-Forum-green?style=for-the-badge)](https://github.com/yourusername/paperpath/discussions)

</div>

---

<div align="center">

### Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/paperpath&type=Date)](https://star-history.com/#yourusername/paperpath&Date)

---

**Built with ❤️ for the research community**

*Transforming scientific literature into actionable knowledge graphs*

[⬆ Back to top](#paperpath)

</div>

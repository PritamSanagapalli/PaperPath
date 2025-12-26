# Scientific Knowledge Extraction Logic

This document explains the logic used to extract structured scientific data from unstructured PDF text.

## 1. Text Extraction
- **Tool**: `pdfplumber`
- **Logic**: Each PDF is processed page-by-page. Text is cleaned to remove headers, footers, and page numbers. A text corpus is generated for downstream NLP processing.

## 2. Entity Extraction (NLP)
- **Tool**: `spaCy` (en_core_web_sm)
- **Logic**: We use keyword-based extraction and pattern matching to identify key scientific entities.

### Methods
- **Strategy**: Keyword extraction from a predefined scientific method vocabulary (e.g., `fMRI`, `EEG`, `Deep Learning`, `Immunohistochemistry`).
- **Logic**: Sentences containing these keywords are identified as describing the experimental procedures.

### Results
- **Strategy**: Pattern matching for quantitative findings and significant outcomes.
- **Logic**: Sentences containing terms like `result`, `significant`, `p <`, `showed`, or `increase/decrease` are extracted as key findings.

### Brain Regions
- **Strategy**: Named Entity Recognition (NER) mapped against a neuroanatomical atlas.
- **Logic**: Matches for regions like `Hippocampus`, `Prefrontal Cortex`, and `Amygdala` are extracted to establish spatial context in the graph.

### Citations
- **Strategy**: Regex-based extraction of bracketed or parenthetical references.
- **Logic**: Matches like `[12]` or `(Smith et al., 2020)` are parsed to build the citation network.

## 3. Extraction Examples (Sentence → Node Mapping)

Below are specific examples of how unstructured sentences from the PDFs are transformed into graph nodes and relationships.

### Example 1: Method Extraction
- **Source Sentence**: "We performed a voxel-based morphometry analysis on T1-weighted MRI scans."
- **Extraction**: `Method` node identified.
- **Resulting Node**: `(:Method {name: "voxel-based morphometry"})`
- **Relationship**: `(:Paper)-[:USES_METHOD]->(:Method)`

### Example 2: Result Extraction
- **Source Sentence**: "The results showed a significant decrease in hippocampal volume (p < 0.05) in the PD group."
- **Extraction**: `Result` node and `BrainRegion` node identified.
- **Resulting Nodes**: 
    - `(:Result {text: "The results showed a significant decrease in hippocampal volume (p < 0.05) in the PD group."})`
    - `(:BrainRegion {name: "hippocampus"})`
- **Relationships**:
    - `(:Paper)-[:REPORTS_RESULT]->(:Result)`
    - `(:Paper)-[:INVOLVES_REGION]->(:BrainRegion)`

### Example 3: Citation Extraction
- **Source Sentence**: "This finding is consistent with previous longitudinal studies paper_025."
- **Extraction**: Cross-paper reference identified.
- **Relationship**: `(:Paper {id: "paper_001"})-[:CITES]->(:Paper {id: "paper_025"})`

## 4. Graph Ingestion
- **Tool**: Neo4j Python Driver
- **Logic**: Entities are ingested using `MERGE` statements to ensure uniqueness. Relationships (e.g., `USES_METHOD`, `REPORTS_RESULT`, `CITES`) are created to connect Paper nodes to their extracted entities.

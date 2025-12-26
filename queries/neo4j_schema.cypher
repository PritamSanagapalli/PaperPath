// Phase 2: Graph Ontology & Schema Design
// Constraints for Uniqueness

CREATE CONSTRAINT paper_id_unique IF NOT EXISTS FOR (p:Paper) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT method_name_unique IF NOT EXISTS FOR (m:Method) REQUIRE m.name IS UNIQUE;
CREATE CONSTRAINT disease_name_unique IF NOT EXISTS FOR (d:Disease) REQUIRE d.name IS UNIQUE;
CREATE CONSTRAINT region_name_unique IF NOT EXISTS FOR (r:BrainRegion) REQUIRE r.name IS UNIQUE;

// Optional: Indexes for faster lookup
CREATE INDEX paper_title_index IF NOT EXISTS FOR (p:Paper) ON (p.title);

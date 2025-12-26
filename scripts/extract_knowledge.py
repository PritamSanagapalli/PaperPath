import os
import json
import spacy
import re
from spacy.matcher import PhraseMatcher

# Seed lists
BRAIN_REGIONS = [
    "hippocampus", "amygdala", "prefrontal cortex", "thalamus", "cerebellum", 
    "basal ganglia", "striatum", "caudate", "putamen", "globus pallidus",
    "substantia nigra", "cortex", "white matter", "gray matter", "ventricles",
    "temporal lobe", "frontal lobe", "parietal lobe", "occipital lobe",
    "cingulate gyrus", "corpus callosum", "pedunculopontine nucleus"
]

METHODS = [
    "fmri", "mri", "eeg", "pet", "ct", "dti", "diffusion tensor imaging",
    "machine learning", "deep learning", "cnn", "graph theory", "statistical analysis",
    "t-test", "anova", "regression", "classification", "segmentation",
    "voxel-based morphometry", "independent component analysis", "ica",
    "functional connectivity", "dynamic causal modeling", "dcm"
]

DISEASES = [
    "parkinson", "alzheimer", "huntington", "epilepsy", "schizophrenia",
    "depression", "anxiety", "autism", "multiple sclerosis", "stroke",
    "dementia", "tremor", "bradykinesia", "rigidity", "dystonia"
]

class KnowledgeExtractor:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        self.region_matcher = PhraseMatcher(self.nlp.vocab, attr="LOWER")
        self.region_matcher.add("BRAIN_REGION", [self.nlp.make_doc(text) for text in BRAIN_REGIONS])
        
        self.method_matcher = PhraseMatcher(self.nlp.vocab, attr="LOWER")
        self.method_matcher.add("METHOD", [self.nlp.make_doc(text) for text in METHODS])

        self.disease_matcher = PhraseMatcher(self.nlp.vocab, attr="LOWER")
        self.disease_matcher.add("DISEASE", [self.nlp.make_doc(text) for text in DISEASES])

    def extract(self, text):
        doc = self.nlp(text)
        
        results = {
            "methods": set(),
            "results": [],
            "diseases": set(),
            "brain_regions": set(),
            "citations": set(),
            "referenced_papers": set() # For cross-linking
        }
        
        # 1. Extract Entities using PhraseMatcher
        matches = self.region_matcher(doc)
        for match_id, start, end in matches:
            results["brain_regions"].add(doc[start:end].text.lower())
            
        matches = self.method_matcher(doc)
        for match_id, start, end in matches:
            results["methods"].add(doc[start:end].text.lower())

        matches = self.disease_matcher(doc)
        for match_id, start, end in matches:
            results["diseases"].add(doc[start:end].text.lower())
            
        # 2. Extract Results and Citations using sentence analysis
        for sent in doc.sents:
            sent_text = sent.text.strip()
            
            # Basic Result extraction
            if any(kw in sent_text.lower() for kw in ["significant", "finding", "result", "p <", "observed"]):
                if len(sent_text) > 30 and len(sent_text) < 300: # Heuristic for quality
                    results["results"].append(sent_text)
            
            # Basic Citation extraction (e.g., [12], (Smith et al., 2020))
            citation_matches = re.findall(r'\[\d+\]|\([A-Z][a-z]+ et al\., \d{4}\)', sent_text)
            for cm in citation_matches:
                results["citations"].add(cm)

            # Look for cross-paper references (e.g., paper_001, paper_025)
            paper_refs = re.findall(r'paper_(\d{3})', sent_text)
            for ref in paper_refs:
                results["referenced_papers"].add(f"paper_{ref}")

        # Convert sets to lists for JSON serialization
        results["methods"] = list(results["methods"])
        results["brain_regions"] = list(results["brain_regions"])
        results["diseases"] = list(results["diseases"])
        results["citations"] = list(results["citations"])
        results["referenced_papers"] = list(results["referenced_papers"])
        results["results"] = results["results"][:10] # Limit to top 10 results
        
        return results

def process_corpus(corpus_dir, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    extractor = KnowledgeExtractor()
    
    for filename in sorted(os.listdir(corpus_dir)):
        if filename.endswith(".txt"):
            paper_id = os.path.splitext(filename)[0]
            print(f"Extracting knowledge from {paper_id}...")
            
            with open(os.path.join(corpus_dir, filename), 'r') as f:
                text = f.read()
            
            # Only process first 10000 characters to save time and memory for this task
            # Scientific papers can be long, but most key info is in abstract/intro/methods
            knowledge = extractor.extract(text[:15000]) 
            
            with open(os.path.join(output_dir, f"{paper_id}.json"), 'w') as f:
                json.dump(knowledge, f, indent=2)

if __name__ == "__main__":
    process_corpus("outputs/text_corpus", "outputs/extracted_knowledge")

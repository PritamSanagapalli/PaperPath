import os
import json
import re

def title_from_filename(filename):
    # Remove extension
    name = os.path.splitext(filename)[0]
    # Replace hyphens with spaces and capitalize
    title = name.replace('-', ' ').title()
    # Handle some acronyms or special cases if needed
    title = title.replace('Cnn', 'CNN').replace('Fmri', 'fMRI').replace('Eeg', 'EEG').replace('Pet', 'PET')
    return title

def generate_metadata(data_root, metadata_dir):
    if not os.path.exists(metadata_dir):
        os.makedirs(metadata_dir)
    
    mapping = {}
    paper_count = 0
    
    # Sort folders and files for deterministic ID assignment
    folders = sorted([d for d in os.listdir(data_root) if os.path.isdir(os.path.join(data_root, d))])
    
    for folder in folders:
        folder_path = os.path.join(data_root, folder)
        files = sorted([f for f in os.listdir(folder_path) if f.endswith('.pdf')])
        
        primary_topic = folder.replace('-', ' ').title()
        
        for file in files:
            paper_count += 1
            paper_id = f"paper_{paper_count:03d}"
            file_path = os.path.join(folder, file)
            
            metadata = {
                "paper_id": paper_id,
                "title": title_from_filename(file),
                "primary_topic": primary_topic,
                "secondary_topics": [],
                "expected_methods": [],
                "diseases": [],
                "source": "Local Dataset (derived from PubMed Central)",
                "file_path": file_path
            }
            
            # Simple disease inference from title
            diseases = []
            for d in ['alzheimer', 'parkinson', 'epilepsy', 'autism', 'dyslexia', 'schizophrenia', 'bipolar']:
                if d in metadata['title'].lower():
                    diseases.append(d.title())
            metadata['diseases'] = list(set(diseases))
            
            # Save individual metadata file
            with open(os.path.join(metadata_dir, f"{paper_id}.json"), 'w') as f:
                json.dump(metadata, f, indent=2)
            
            mapping[paper_id] = file_path
            print(f"Generated metadata for {paper_id}: {metadata['title']}")
            
    # Save mapping file
    with open("outputs/paper_mapping.json", 'w') as f:
        json.dump(mapping, f, indent=2)
    
    print(f"\nTotal papers processed: {paper_count}")
    print(f"Mapping saved to outputs/paper_mapping.json")

if __name__ == "__main__":
    data_dir = os.path.abspath("data")
    metadata_dir = os.path.abspath("outputs/metadata")
    generate_metadata(data_dir, metadata_dir)

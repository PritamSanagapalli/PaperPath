import os
import json
import pdfplumber
import re

def normalize_text(text):
    # Remove multiple newlines and spaces
    text = re.sub(r'\s+', ' ', text)
    # Basic cleaning of common artifacts
    text = text.replace('\x00', '') # Remove null characters
    return text.strip()

def extract_from_pdfs(mapping_file, data_root, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    with open(mapping_file, 'r') as f:
        mapping = json.load(f)
        
    for paper_id, relative_path in mapping.items():
        pdf_path = os.path.join(data_root, relative_path)
        output_path = os.path.join(output_dir, f"{paper_id}.txt")
        
        if os.path.exists(output_path):
            print(f"Skipping {paper_id}, text already extracted.")
            continue
            
        print(f"Extracting text from {paper_id} ({relative_path})...")
        try:
            full_text = []
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        full_text.append(text)
            
            cleaned_text = normalize_text("\n".join(full_text))
            
            with open(output_path, 'w') as f:
                f.write(cleaned_text)
                
        except Exception as e:
            print(f"Error extracting {paper_id}: {str(e)}")

if __name__ == "__main__":
    mapping_file = "outputs/paper_mapping.json"
    data_root = "data"
    output_dir = "outputs/text_corpus"
    
    extract_from_pdfs(mapping_file, data_root, output_dir)

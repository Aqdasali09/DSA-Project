import pandas as pd
import json
from lexicon import preprocess_text

def create_forward_index(data, searchable_fields):
    """
    Create forward index for each document based on searchable fields, 
    using integer-based document IDs that increment.
    
    :param data: List of dictionaries containing dataset rows.
    :param searchable_fields: List of fields to include in the forward index.
    :return: Forward index as a dictionary mapping document IDs (integers) to tokens.
    """
    forward_index = {}
    doc_id_counter = 1  # Start document ID from 1
    
    for row in data:
        doc_id = doc_id_counter  # Assign current integer document ID
        all_tokens = []
        
        # Process all searchable fields for the document
        for field in searchable_fields:
            all_tokens.extend(preprocess_text(row.get(field, "")))
        
        forward_index[doc_id] = list(set(all_tokens))  # Avoid duplicate tokens
        row['doc_id'] = doc_id  # Assign doc_id to the row
        doc_id_counter += 1  # Increment document ID for the next document

    return forward_index, data

def create_details_json(data, output_file):
    """
    Create a details.json file with the name, doc_id, artists, and album_name of each song.
    
    :param data: List of dictionaries containing dataset rows with doc_id assigned.
    :param output_file: Path to the output JSON file.
    """
    details = []
    for row in data:
        details.append({
            "name": row.get("name", "Unknown") if pd.notna(row.get("name")) else "Unknown",
            "doc_id": row["doc_id"],
            "artists": row.get("artists", "Unknown") if pd.notna(row.get("artists")) else "Unknown",
            "album_name": row.get("album_name", "Unknown") if pd.notna(row.get("album_name")) else "Unknown"
        })
    with open(output_file, 'w') as f:
        json.dump(details, f, indent=4)
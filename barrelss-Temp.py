import os
import csv
from collections import defaultdict

def create_barrels_by_ids(lexicon, inverted_index, barrel_size, output_dir="barrels"):
    """
    Create barrels based on lexicon IDs for O(1) retrieval.
    
    :param lexicon: Dictionary mapping terms to incremental IDs.
    :param inverted_index: Dictionary mapping terms to document IDs.
    :param barrel_size: Number of terms per barrel.
    :param output_dir: Directory to save the barrels.
    :return: None
    """
    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Create barrels based on lexicon IDs
    max_id = max(lexicon.values())  # Get the highest lexicon ID
    num_barrels = (max_id // barrel_size) + 1  # Determine the number of barrels
    barrels = [defaultdict(list) for _ in range(num_barrels)]  # Initialize barrels
    
    # Assign terms and document IDs to barrels
    for term, doc_ids in inverted_index.items():
        term_id = lexicon[term]  # Get the lexicon ID of the term
        barrel_index = term_id // barrel_size  # Determine which barrel the term belongs to
        barrels[barrel_index][term_id] = doc_ids  # Store the term ID and document IDs
    
    # Save each barrel to a CSV file
    for i, barrel in enumerate(barrels):
        barrel_file = os.path.join(output_dir, f"barrel_{i + 1}.csv")
        with open(barrel_file, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(["Term ID", "Document IDs"])
            for term_id, doc_ids in barrel.items():
                writer.writerow([term_id, ",".join(map(str, doc_ids))])
    
    print(f"Barrels created and saved in directory: {output_dir}")

def search_in_barrels(term, lexicon, barrel_size, output_dir="barrels"):
    """
    Search for a term in the barrels using its lexicon ID.
    
    :param term: The term to search for.
    :param lexicon: Dictionary mapping terms to incremental IDs.
    :param barrel_size: Number of terms per barrel.
    :param output_dir: Directory where the barrels are stored.
    :return: Document IDs containing the term.
    """
    if term not in lexicon:
        return []  # Term not found
    
    # Get the term ID and determine the barrel
    term_id = lexicon[term]
    barrel_index = term_id // barrel_size
    barrel_file = os.path.join(output_dir, f"barrel_{barrel_index + 1}.csv")
    
    # Search for the term in the barrel
    with open(barrel_file, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if int(row["Term ID"]) == term_id:
                return row["Document IDs"].split(",")  # Return document IDs as a list
    
    return []  # Term not found in the barrel

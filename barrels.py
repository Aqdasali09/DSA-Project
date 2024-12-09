import os
import json
from collections import defaultdict
import re

class BarrelIndexer:
    def __init__(self, num_barrels):
        # Initialize barrels as dictionaries
        self.num_barrels = num_barrels
        self.barrels = [defaultdict(list) for _ in range(num_barrels)]

    def _hash_function(self, term):
        # A simple hash function to assign a term to a barrel
        return hash(term) % self.num_barrels

    def preprocess_text(self, text):
        # Preprocess text (e.g., lowercasing, removing punctuation)
        return re.sub(r'\W+', ' ', text.lower()).split()

    def add_document(self, doc_id, lyrics):
        # Tokenize and process the lyrics
        terms = self.preprocess_text(lyrics)
        for term in terms:
            barrel_index = self._hash_function(term)
            self.barrels[barrel_index][term].append(doc_id)

    def save_barrels(self, directory):
        # Save each barrel as a separate JSON file
        os.makedirs(directory, exist_ok=True)
        for i, barrel in enumerate(self.barrels):
            file_path = os.path.join(directory, f"barrel_{i}.json")
            with open(file_path, 'w') as f:
                json.dump(barrel, f)

    def load_barrels(self, directory):
        # Load barrels from JSON files
        for i in range(self.num_barrels):
            file_path = os.path.join(directory, f"barrel_{i}.json")
            with open(file_path, 'r') as f:
                self.barrels[i] = json.load(f)

    def query(self, term):
        # Search for a term in the appropriate barrel
        barrel_index = self._hash_function(term)
        return self.barrels[barrel_index].get(term, [])

# Example usage
if __name__ == "__main__":
    indexer = BarrelIndexer(num_barrels=10)

    # Sample dataset (replace with actual dataset processing)
    songs = [
        {"id": 1, "lyrics": "Hello, it's me. I was wondering if after all these years."},
        {"id": 2, "lyrics": "Never gonna give you up, never gonna let you down."},
        {"id": 3, "lyrics": "Let it go, let it go, can't hold it back anymore."}
    ]

    # Add documents to the index
    for song in songs:
        indexer.add_document(song["id"], song["lyrics"])

    # Save barrels to disk
    indexer.save_barrels("barrels")

    # Load barrels from disk
    indexer.load_barrels("barrels")

    # Query the index
    search_term = "let"
    results = indexer.query(search_term)
    print(f"Documents containing '{search_term}': {results}")

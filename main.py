import pandas as pd
from lexicon import create_lexicon
from forward_index import create_forward_index
from inverted_index import InvertedIndex

# Define searchable fields
SEARCHABLE_FIELDS = ["lyrics", "album_name", "artists", "name"]

# Load dataset
file_path = "songs.csv"  # Path to your CSV file
data = pd.read_csv(file_path).to_dict(orient="records")  # Convert to list of dictionaries

# Generate lexicon and forward index
lexicon = create_lexicon(data, SEARCHABLE_FIELDS)
forward_index = create_forward_index(data, SEARCHABLE_FIELDS)

# Save lexicon to CSV
lexicon_df = pd.DataFrame([(term, docs) for term, docs in lexicon.items()], columns=["Term", "Word IDs"])
lexicon_df.to_csv("lexicon.csv", index=False)

# Save forward index to CSV
forward_index_df = pd.DataFrame(list(forward_index.items()), columns=["Document ID", "Terms"])
forward_index_df.to_csv("forward_index.csv", index=False)

# Generate inverted index
inverted_index = InvertedIndex()
inverted_index.build(forward_index)

# Save inverted index to CSV
inverted_index.save_to_csv("inverted_index.csv")

# Test inverted index search functionality
term_to_search = "love"  # Example term to search
print(f"Documents containing the term '{term_to_search}': {inverted_index.search(term_to_search)}")

print("Lexicon, forward indexing, and inverted indexing have been saved to CSV files.")

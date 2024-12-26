# Main indexing script
import pandas as pd
from lexicon import create_lexicon
from forward_index import create_forward_index, create_details_json
from inverted_index import InvertedIndex

# Define searchable fields
SEARCHABLE_FIELDS = ["lyrics", "album_name", "artists", "name"]

def preprocess_data():
    # Load dataset
    file_path = "songs.csv"
    data = pd.read_csv(file_path).to_dict(orient="records")

    # Generate lexicon and forward index
    lexicon = create_lexicon(data, SEARCHABLE_FIELDS)
    forward_index, updated_data = create_forward_index(data, SEARCHABLE_FIELDS)

    # Save lexicon to CSV
    lexicon_df = pd.DataFrame([(term, word_id) for term, word_id in lexicon.items()], columns=["Term", "Word IDs"])
    lexicon_df.to_csv("lexicon.csv", index=False)

    # Save forward index to CSV
    forward_index_df = pd.DataFrame(list(forward_index.items()), columns=["Document ID", "Terms"])
    forward_index_df.to_csv("forward_index.csv", index=False)

    # Create and save details.json
    create_details_json(updated_data, "details.json")

    # Generate and save inverted index with barrels
    inverted_index = InvertedIndex()
    inverted_index.build(forward_index, lexicon)
    inverted_index.save_to_barrels("barrels")  # Save barrels to a folder

    # Generate the full inverted index CSV
    inverted_index.save_to_csv("inverted_index.csv")

    print("Lexicon, forward indexing, inverted indexing, and barrels have been saved to CSV files.")
    print("Details have been saved to details.json.")

if __name__ == "__main__":
    preprocess_data()
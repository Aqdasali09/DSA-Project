import csv
from collections import defaultdict
from barrels import Barrels

class InvertedIndex:
    def __init__(self, barrel_size=1000):
        """
        Initialize the InvertedIndex with the given barrel size.
        :param barrel_size: Number of terms per barrel.
        """
        self.index = defaultdict(list)  # Default dictionary to store terms and document IDs
        self.barrels = Barrels(barrel_size)  # Initialize the barrels with the given size

    def build(self, forward_index, lexicon):
        """
        Build the inverted index and partition it into barrels.
        :param forward_index: Dictionary mapping document IDs to lists of terms.
        :param lexicon: Dictionary mapping terms to word IDs.
        """
        for doc_id, terms in forward_index.items():
            for term in set(terms):  # Avoid adding the same term multiple times in the same document
                word_id = lexicon.get(term)  # Get the word ID for the term from the lexicon
                if word_id is not None:
                    self.index[term].append(doc_id)  # Add document ID to the inverted index for the term
                    self.barrels.add_to_barrel(term, word_id, self.index[term])  # Add term to the correct barrel

    def save_to_barrels(self, folder_path):
        """
        Save the inverted index barrels as CSV files.
        :param folder_path: Directory where barrel CSV files will be saved.
        """
        self.barrels.save_barrels(folder_path)

    def search(self, term, lexicon):
        """
        Search for a term in the inverted index using barrels.
        :param term: The term to search for.
        :param lexicon: The lexicon mapping terms to word IDs.
        :return: List of document IDs containing the term.
        """
        word_id = lexicon.get(term)  # Get the word ID for the term from the lexicon
        if word_id is None:
            return []  # Term not found in lexicon
        return self.barrels.search(term, word_id)  # Search in the appropriate barrel and return the results

    def save_to_csv(self, file_path):
        """
        Save the full inverted index to a CSV file (not using barrels).
        :param file_path: Path to save the CSV file.
        """
        # Prepare data to write to CSV: each row contains a term and a list of document IDs.
        with open(file_path, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(["Term", "Document IDs"])  # Write header

            for term, doc_ids in self.index.items():
                writer.writerow([term, ",".join(map(str, doc_ids))])  # Write term and document IDs

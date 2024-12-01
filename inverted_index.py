import csv
from collections import defaultdict

class InvertedIndex:
    def __init__(self):
        # Dictionary to store the inverted index. Default is an empty list.
        self.index = defaultdict(list)

    def build(self, forward_index):
        """
        Build the inverted index from the forward index.
        :param forward_index: Dictionary mapping document IDs to lists of terms.
        """
        # Iterate over all documents and their terms to build the inverted index
        for doc_id, terms in forward_index.items():
            # Use set to avoid processing duplicate terms in the same document
            for term in set(terms):
                self.index[term].append(doc_id)

    def save_to_csv(self, file_path):
        """
        Save the inverted index to a CSV file.
        :param file_path: Path to the CSV file.
        """
        # Prepare rows for CSV file: each row contains a term and the corresponding document IDs as a comma-separated string.
        with open(file_path, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(["Term", "Document IDs"])  # Writing header

            for term, doc_ids in self.index.items():
                writer.writerow([term, ",".join(map(str, doc_ids))])  # Writing term and doc_ids

    def search(self, term):
        """
        Search for a term in the inverted index.
        :param term: The term to search for.
        :return: List of document IDs containing the term.
        """
        # Return the list of document IDs that contain the term or an empty list if not found
        return self.index.get(term, [])

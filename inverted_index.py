class InvertedIndex:
    def __init__(self):
        # Dictionary to store the inverted index
        self.index = {}

    def build(self, forward_index):
        """
        Build the inverted index from the forward index.
        :param forward_index: Dictionary mapping document IDs to lists of terms.
        """
        for doc_id, terms in forward_index.items():
            for term in terms:
                if term not in self.index:
                    self.index[term] = []
                self.index[term].append(doc_id)

    def save_to_csv(self, file_path):
        """
        Save the inverted index to a CSV file.
        :param file_path: Path to the CSV file.
        """
        import pandas as pd
        rows = [{"Term": term, "Document IDs": ",".join(map(str, doc_ids))} for term, doc_ids in self.index.items()]
        df = pd.DataFrame(rows)
        df.to_csv(file_path, index=False)

    def search(self, term):
        """
        Search for a term in the inverted index.
        :param term: The term to search for.
        :return: List of document IDs containing the term.
        """
        return self.index.get(term, [])

import os
import csv
from collections import defaultdict
from math import ceil

class Barrels:
    def __init__(self, barrel_size=1000):
        """
        Initialize the Barrels system.
        :param barrel_size: Number of terms per barrel.
        """
        self.barrel_size = barrel_size  # Terms per barrel
        self.barrels = defaultdict(dict)  # Map barrel_id to a dictionary {term: document IDs}

    def calculate_barrel_id(self, word_id):
        """
        Calculate the barrel ID for a given word ID.
        :param word_id: The word ID.
        :return: The barrel ID.
        """
        return word_id // self.barrel_size

    def add_to_barrel(self, term, word_id, doc_ids):
        """
        Add a term and its document IDs to the correct barrel.
        If the term already exists in the barrel, update it with the latest document IDs.
        :param term: The term to be added.
        :param word_id: The word ID of the term.
        :param doc_ids: The document IDs where this term appears.
        """
        barrel_id = self.calculate_barrel_id(word_id)  # Get the barrel ID
        if term in self.barrels[barrel_id]:
            # Union existing document IDs with new ones (avoid duplicates)
            self.barrels[barrel_id][term] = self.barrels[barrel_id][term].union(doc_ids)
        else:
            # Add term with its document IDs
            self.barrels[barrel_id][term] = set(doc_ids)

    def save_barrels(self, folder_path):
        """
        Save the barrels as separate CSV files.
        :param folder_path: Directory where barrel CSV files will be saved.
        """
        if os.path.exists(folder_path):
            for file in os.listdir(folder_path):
                if file.startswith("barrel_") and file.endswith(".csv"):
                    os.remove(os.path.join(folder_path, file))

        os.makedirs(folder_path, exist_ok=True)

        # Save each barrel as a new CSV file
        for barrel_id, terms in self.barrels.items():
            file_path = os.path.join(folder_path, f"barrel_{barrel_id}.csv")
            with open(file_path, mode="w", newline="", encoding="utf-8") as file:
                writer = csv.writer(file)
                writer.writerow(["Term", "Document IDs"])
                for term, doc_ids in terms.items():
                    writer.writerow([term, ",".join(map(str, sorted(doc_ids)))])

    def search(self, term, word_id):
        """
        Search for a term in the correct barrel.
        :param term: The term to search for.
        :param word_id: The word ID associated with the term.
        :return: A list of document IDs containing the term.
        """
        barrel_id = self.calculate_barrel_id(word_id)
        if term in self.barrels[barrel_id]:
            return list(self.barrels[barrel_id][term])  # Return document IDs as a list
        return []  # Term not found

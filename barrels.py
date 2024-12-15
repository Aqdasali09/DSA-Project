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
        self.barrels = defaultdict(list)  # Map barrel_id to list of (term, doc_ids)
        self.num_barrels = 0

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
        # Convert doc_ids list to a set to avoid duplication
        existing_doc_ids = set(doc_ids)  # Ensure that doc_ids are unique

        # Create a list to store the new entries for this barrel
        new_entries = []
        found = False  # Flag to check if the term already exists in the barrel

        # Iterate through existing entries in the barrel
        for existing_term, existing_doc_ids_str in self.barrels[barrel_id]:
            if existing_term == term:
                found = True
                # Convert the existing comma-separated doc_ids string to a set of integers
                existing_doc_ids_list = set(map(int, existing_doc_ids_str.split(',')))

                # Union the existing doc IDs with the new ones (avoiding duplicates)
                combined_doc_ids = existing_doc_ids_list.union(existing_doc_ids)

                # Add the combined doc IDs to the new entries list
                new_entries.append((term, ','.join(map(str, sorted(combined_doc_ids)))))  # Update the entry with the new document IDs
            else:
                # Keep the non-duplicate terms
                new_entries.append((existing_term, existing_doc_ids_str))

        if not found:
            # If the term doesn't exist, add it with the document IDs as a comma-separated string
            new_entries.append((term, ','.join(map(str, sorted(existing_doc_ids)))))

        # Update the barrel with the new entries
        self.barrels[barrel_id] = new_entries

    def save_barrels(self, folder_path):
        """
        Save the barrels as separate CSV files.
        Before saving new data, remove old barrel files to prevent appending.
        :param folder_path: Directory where barrel CSV files will be saved.
        """
        # Remove old barrel files before saving new ones
        if os.path.exists(folder_path):
            for file in os.listdir(folder_path):
                if file.startswith("barrel_") and file.endswith(".csv"):
                    os.remove(os.path.join(folder_path, file))

        os.makedirs(folder_path, exist_ok=True)  # Create the folder if it doesn't exist

        # Save each barrel as a new CSV file
        for barrel_id, entries in self.barrels.items():
            file_path = os.path.join(folder_path, f"barrel_{barrel_id}.csv")
            with open(file_path, mode="w", newline="", encoding="utf-8") as file:
                writer = csv.writer(file)
                writer.writerow(["Term", "Document IDs"])  # Write header
                writer.writerows(entries)  # Write the terms and document IDs for this barrel

    def search(self, term, word_id):
        """
        Search for a term in the correct barrel.
        :param term: The term to search for.
        :param word_id: The word ID associated with the term.
        :return: A list of unique document IDs containing the term.
        """
        barrel_id = self.calculate_barrel_id(word_id)  # Calculate which barrel to search in
        results = set()  # Use a set to ensure unique document IDs

        # Find the term in the correct barrel
        for term_entry, doc_id in self.barrels[barrel_id]:
            if term_entry == term:
                results.add(doc_id)  # Add document ID to the set (set handles duplicates automatically)

        return sorted(results)  # Convert the set to a sorted list
import os
import csv
from collections import defaultdict

class Barrels:
    def __init__(self, barrel_size=1000):
        self.barrel_size = barrel_size
        self.barrels = defaultdict(dict)

    def calculate_barrel_id(self, word_id):
        return word_id // self.barrel_size

    def add_to_barrel(self, term, word_id, doc_ids):
        barrel_id = self.calculate_barrel_id(word_id)
        if term in self.barrels[barrel_id]:
            self.barrels[barrel_id][term] = self.barrels[barrel_id][term].union(doc_ids)
        else:
            self.barrels[barrel_id][term] = set(doc_ids)

    def save_barrels(self, folder_path):
        if os.path.exists(folder_path):
            for file in os.listdir(folder_path):
                if file.startswith("barrel_") and file.endswith(".csv"):
                    os.remove(os.path.join(folder_path, file))

        os.makedirs(folder_path, exist_ok=True)

        for barrel_id, terms in self.barrels.items():
            file_path = os.path.join(folder_path, f"barrel_{barrel_id}.csv")
            with open(file_path, mode="w", newline="", encoding="utf-8") as file:
                writer = csv.writer(file)
                writer.writerow(["Term", "Document IDs"])
                for term, doc_ids in terms.items():
                    writer.writerow([term, ",".join(map(str, sorted(doc_ids)))])

    def load_barrels(self, folder_path):
        if not os.path.exists(folder_path):
            raise FileNotFoundError(f"Folder {folder_path} does not exist")

        for file in os.listdir(folder_path):
            if file.startswith("barrel_") and file.endswith(".csv"):
                barrel_id = int(file.split("_")[1].split(".")[0])
                file_path = os.path.join(folder_path, file)
                with open(file_path, mode="r", newline="", encoding="utf-8") as file:
                    reader = csv.reader(file)
                    next(reader)  # Skip header
                    for row in reader:
                        term, doc_ids = row
                        self.barrels[barrel_id][term] = set(map(int, doc_ids.split(",")))

    def search(self, term, word_id):
        barrel_id = self.calculate_barrel_id(word_id)
        if term in self.barrels[barrel_id]:
            return list(self.barrels[barrel_id][term])
        return []

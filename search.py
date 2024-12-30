# Search script
from inverted_index import InvertedIndex
import pandas as pd
from collections import defaultdict
import re
from fuzzywuzzy import process
import json

# Load lexicon
lexicon = pd.read_csv("lexicon.csv").set_index("Term")["Word IDs"].to_dict()

# Load details.json
with open("details.json", "r") as f:
    details = json.load(f)
doc_id_to_details = {item["doc_id"]: item for item in details}

# Hybrid Search Engine Class
class HybridSearchEngine:
    def __init__(self, inverted_index, lexicon):
        self.inverted_index = inverted_index
        self.lexicon = lexicon

    def parse_query(self, query):
        """Parse query into terms, phrases, and Boolean operators."""
        phrases = re.findall(r'"(.*?)"', query)  # Extract quoted phrases
        terms = re.sub(r'"(.*?)"', "", query).split()  # Remaining terms
        return phrases, terms

    def phrase_search(self, phrase):
        """Perform phrase search."""
        words = phrase.split()
        if len(words) < 2:
            return self.inverted_index.search(words[0], self.lexicon)

        result_docs = set(self.inverted_index.search(words[0], self.lexicon))
        for word in words[1:]:
            next_docs = set(self.inverted_index.search(word, self.lexicon))
            result_docs &= next_docs  # Only keep common documents
        return result_docs

    def boolean_search(self, terms):
        """Perform Boolean search with AND/OR operators."""
        result_set = set()
        current_operator = "AND"

        for term in terms:
            if term.upper() in ["AND", "OR", "NOT"]:
                current_operator = term.upper()
            else:
                term_docs = set(self.inverted_index.search(term, self.lexicon))
                if current_operator == "AND":
                    result_set &= term_docs if result_set else term_docs
                elif current_operator == "OR":
                    result_set |= term_docs
                elif current_operator == "NOT":
                    result_set -= term_docs
        return result_set

    def ranked_search(self, query_terms):
        doc_scores = defaultdict(float)
        for term in query_terms:
            if term in self.lexicon:
                term_docs = self.inverted_index.search(term, self.lexicon)
                
                # Ensure term_docs is iterable as document IDs
                if isinstance(term_docs, list):
                    for doc_id in term_docs:
                        doc_scores[doc_id] += 1  # Add term frequency (TF) score
                elif isinstance(term_docs, dict):  # If positions are returned
                    idf = 1  # Replace with actual IDF calculation if available
                    for doc_id, positions in term_docs.items():
                        tf = len(positions)
                        doc_scores[doc_id] += tf * idf
        return sorted(doc_scores.items(), key=lambda x: x[1], reverse=True)

    def fuzzy_match(self, term, threshold=80):
        """Fuzzy match a term to the closest term in the lexicon."""
        best_match = process.extractOne(term, self.lexicon.keys())
        
        return best_match[0] if best_match and best_match[1] >= threshold else term

    def search(self, query):
        """Perform a hybrid search."""
        phrases, terms = self.parse_query(query)

        # Phrase search results
        phrase_results = set()
        for phrase in phrases:
            phrase_results |= self.phrase_search(phrase)

        # Boolean search results
        boolean_results = self.boolean_search(terms)

        # Fuzzy match terms
        fuzzy_terms = [self.fuzzy_match(term) for term in terms]

        # Ranked results
        ranked_results = self.ranked_search(fuzzy_terms)

        # Combine results
        final_results = phrase_results | boolean_results
        return final_results, ranked_results

    def map_doc_ids_to_details(self, doc_ids):
        """Map document IDs to details using details.json."""
        return [doc_id_to_details.get(doc_id, {"id":"unknown","name": "Unknown", "artists": "Unknown", "album_name": "Unknown"}) for doc_id in doc_ids]

    def map_ranked_results_to_details(self, ranked_results):
        """Map ranked results to details using details.json."""
        return [(doc_id_to_details.get(doc_id, {"id":"unknown","name": "Unknown", "artists": "Unknown", "album_name": "Unknown"}), score) for doc_id, score in ranked_results]

# Initialize hybrid search engine
inverted_index = InvertedIndex()
inverted_index.load_from_barrels(r".\barrels")  # Load barrels from folder
hybrid_engine = HybridSearchEngine(inverted_index, lexicon)

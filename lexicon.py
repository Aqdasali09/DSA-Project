import re
import nltk
from collections import defaultdict
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Download required NLTK data if not already downloaded(uncomment it)
# nltk.download('punkt')
# nltk.download('stopwords')
# nltk.download('wordnet')
# nltk.download('punkt_tab')

def preprocess_text(text):
    """
    Preprocess text: lowercase, remove punctuation, tokenize, remove stopwords, and lemmatize.
    """
    if not isinstance(text, str):
        return []
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    tokens = word_tokenize(text)  # Tokenize
    tokens = [word for word in tokens if word not in stopwords.words('english')]  # Remove stopwords

    # Initialize lemmatizer
    lemmatizer = WordNetLemmatizer()

    # Lemmatize each token
    tokens = [lemmatizer.lemmatize(word) for word in tokens]

    return tokens

def create_lexicon(data, searchable_fields):
    """
    Create a lexicon with unique IDs for each word.
    :param data: List of dictionaries containing dataset rows.
    :param searchable_fields: List of fields to include in the lexicon.
    :return: Lexicon dictionary with terms as keys and unique IDs as values.
    """
    lexicon = {}  # Store words and their unique IDs
    id_counter = 1  # Start IDs from 1

    for row in data:
        for field in searchable_fields:
            tokens = preprocess_text(row.get(field, ""))
            for token in set(tokens):  # Avoid processing duplicate words in the same row
                if token not in lexicon:
                    lexicon[token] = id_counter  # Assign a unique ID to the token
                    id_counter += 1  # Increment the ID counter

    return lexicon

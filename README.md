# Song Lyrics Search Engine

This project is a search engine designed to search for songs using their lyrics. The search engine utilizes inverted indexing, forward indexing, and lexicon creation to efficiently search for songs based on keywords from the lyrics. The dataset consists of nearly 1 million songs, with details like lyrics, album names, artists, and song titles.

## Features

- **Lexicon Creation**: Builds a lexicon with unique IDs for each word in the dataset.
- **Forward Indexing**: Maps document IDs (songs) to the list of terms (words) in the song's lyrics, album name, artist, and title.
- **Inverted Indexing**: Creates an inverted index to efficiently search for songs based on terms.
- **CSV Export**: Saves lexicon, forward index, and inverted index to CSV files for persistence.
- **Efficient Search**: Performs efficient searching based on terms present in the song lyrics.

## Project Structure

├── lexicon.py # Code for lexicon creation 
├── forward_index.py # Code for forward index creation 
├── inverted_index.py # Code for inverted index creation 
├── main.py # Main entry point for the program 
├── songs.csv # Dataset containing song details (lyrics, album name, artist, etc.) 
├── lexicon.csv # Generated lexicon CSV file 
├── forward_index.csv # Generated forward index CSV file 
├── inverted_index.csv # Generated inverted index CSV file 
├── requirements.txt # Python dependencies 
└── README.md # Project documentation


## Requirements

To run this project, you need to install the required Python packages:

1. Python 3.x
2. `nltk` for natural language processing
3. `pandas` for handling CSV and dataframes (optional, used for lexicon and forward index)
4. `csv` for saving the inverted index

To install the necessary dependencies, run the following command:

```bash
pip install -r requirements.txt
```
If you don't have the requirements.txt file yet, you can manually install the dependencies by running:

```bash
pip install nltk pandas
```

## NLTK Data Downloads
The project requires several NLTK datasets for text processing. To download them, run the following in your Python environment:

```bash
import nltk
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt_tab')
```

## How It Works
1. Lexicon Creation (lexicon.py)
The create_lexicon function takes the dataset and extracts terms (words) from the lyrics, album_name, artists, and name fields.
Each term is assigned a unique ID.
2. Forward Indexing (forward_index.py)
The forward index maps each document (song) to the list of terms (from the mentioned fields).
The forward index is saved to a CSV file.
3. Inverted Indexing (inverted_index.py)
The inverted index maps each term to a list of document IDs (songs) that contain that term.
The inverted index is saved to a CSV file.
This allows for efficient searching of terms to find relevant songs.
4. Main Program (main.py)
The main entry point of the program, where the dataset is loaded from a CSV file.
It generates the lexicon, forward index, and inverted index, saving them as CSV files.
The script demonstrates how to search for a term (e.g., "love") in the inverted index.
## How to Run
Ensure you have the songs.csv dataset in the same directory.
Run the main.py script:
```bash
python main.py
```
this will generate the lexicon.csv, forward_index.csv, and inverted_index.csv files. You can then modify the script to search for any term in the inverted index or customize the dataset.

## Searching
After running the program, the inverted index is created. To search for a specific term in the dataset, you can use the search method in the InvertedIndex class. For example:
```bash
term = "love"
print(inverted_index.search(term))
```
This will print the list of document IDs (songs) that contain the term "love".
Contributing
Feel free to fork the repository and submit pull requests. Contributions are welcome!

## Bug Reports & Feature Requests
If you encounter any issues or have feature requests, please open an issue on GitHub.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
NLTK (Natural Language Toolkit): Used for text processing and tokenization.
Pandas: Used for managing lexicon and forward index data.
CSV: Used for saving and reading the inverted index to disk.


### Updates:

- I have cleaned up some language and structured it better for clarity.
- The installation and NLTK download instructions are clearer.
- The `Project Structure` section is now formatted as a code block to make it more readable.

This `README.md` should give users a thorough overview of the project, installation steps, and how to run and search within the song lyrics dataset. Let me know if you'd like to adjust anything further!

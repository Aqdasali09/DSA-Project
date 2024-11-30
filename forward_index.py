from lexicon import preprocess_text

def create_forward_index(data, searchable_fields):
    """
    Create forward index for each document based on searchable fields, 
    using integer-based document IDs that increment.
    
    :param data: List of dictionaries containing dataset rows.
    :param searchable_fields: List of fields to include in the forward index.
    :return: Forward index as a dictionary mapping document IDs (integers) to tokens.
    """
    forward_index = {}
    doc_id_counter = 1  # Start document ID from 1
    
    for row in data:
        doc_id = doc_id_counter  # Assign current integer document ID
        all_tokens = []
        
        # Process all searchable fields for the document
        for field in searchable_fields:
            all_tokens.extend(preprocess_text(row.get(field, "")))
        
        forward_index[doc_id] = list(set(all_tokens))  # Avoid duplicate tokens
        doc_id_counter += 1  # Increment document ID for the next document

    return forward_index

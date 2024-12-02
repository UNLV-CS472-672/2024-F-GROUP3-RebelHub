# Comments/filter.py
# Language Filter for inappropriate language
def inappropriate_language_filter(message):
    # Notes: Does not matter if the word is uppercase or lowercase
    # Also, crap will be used as an example
    disallowed_words = ["fuck", "bitch", "asshole", "shit","crap"]  
    for word in disallowed_words:
        if word in message.lower():
            return True
    return False
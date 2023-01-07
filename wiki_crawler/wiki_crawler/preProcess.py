import html
import nltk
import re
import string
import sys
import unicodedata
import unidecode
from nltk import word_tokenize
from nltk.corpus import stopwords, wordnet
from nltk.stem import WordNetLemmatizer

nltk.download("punkt", quiet=True)
nltk.download("stopwords", quiet=True)
nltk.download("averaged_perceptron_tagger", quiet=True)
nltk.download("wordnet", quiet=True)
nltk.download("omw-1.4", quiet=True)

stop_words = set(stopwords.words("english"))
stop_words.remove("no")
stop_words.remove("nor")
stop_words.remove("not")


def decontracted(phrase: str) -> str:
    # specific
    phrase = re.sub(r"won\'t", "will not", phrase)
    phrase = re.sub(r"can\'t", "can not", phrase)

    # general
    phrase = re.sub(r"n\'t", " not", phrase)
    phrase = re.sub(r"\'re", " are", phrase)
    phrase = re.sub(r"\'s", " is", phrase)
    phrase = re.sub(r"\'d", " would", phrase)
    phrase = re.sub(r"\'ll", " will", phrase)
    phrase = re.sub(r"\'t", " not", phrase)
    phrase = re.sub(r"\'ve", " have", phrase)
    phrase = re.sub(r"\'m", " am", phrase)
    return phrase


def get_wordnet_pos(word: str):
    """Map POS tag to first character lemmatize() accepts"""
    tag = nltk.pos_tag([word])[0][1][0].upper()
    tag_dict = {
        "J": wordnet.ADJ,
        "N": wordnet.NOUN,
        "V": wordnet.VERB,
        "R": wordnet.ADV,
    }

    return tag_dict.get(tag, wordnet.NOUN)


# Init the Wordnet Lemmatizer
lemmatizer = WordNetLemmatizer()

translator = str.maketrans("", "", string.punctuation)


def normalizeStr(value: str) -> str:
    value = value.encode("utf-8", "ignore").decode()
    value = unidecode.unidecode(value)
    value = unicodedata.normalize("NFKD", value)

    value = html.unescape(value)
    value = re.sub("<.*?>|&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});", "", value)

    value = re.sub(r"\ +", " ", value)
    return value


def preProcessStr(value: str) -> str:
    value = normalizeStr(value)
    value = decontracted(value)

    value = re.sub(r"\[\ *\d*\ *\]", " ", value)
    value = re.sub(r"\[\ *[a-zA-Z]\ *\]", " ", value)
    value = value.translate(translator)

    value = " ".join(
        [
            lemmatizer.lemmatize(word.lower(), get_wordnet_pos(word.lower()))
            for word in word_tokenize(value)
            if not word.lower() in stop_words
        ]
    )

    value = re.sub(r"\ +", " ", value)
    value = value.strip()
    print(value)
    sys.stdout.flush()  # Return printed output back to Node.js server
    return value


if __name__ == "__main__":
    preProcessStr(sys.argv[1])

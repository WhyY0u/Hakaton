import pandas as pd
from sentence_transformers import SentenceTransformer, util
import spacy
import torch
import re
from flask import Flask, request, jsonify

app = Flask(__name__)

model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
nlp = spacy.load("ru_core_news_sm")

df = pd.read_csv('towns.csv')  
cities = df['City'].str.lower().tolist()

def normalize_city_name(city):
    return city.rstrip('аеёиоуыэюя')

normalized_cities = set(normalize_city_name(city) for city in cities)

def extract_entities(resume_text):
    doc = nlp(resume_text)
    
    entities = {
        'PERSON': '',
        'ORG': '',
        'LOC': '',
        'EXPERIENCE': ''  
    }

    # Извлечение сущностей с помощью spacy
    for ent in doc.ents:
        if ent.label_ in entities:
            if ent.label_ == "LOC" and ent.text.lower() in normalized_cities:
                if entities["LOC"] == '':
                    entities["LOC"] = ent.text
            elif ent.label_ == "PERSON" and ent.text.lower() not in normalized_cities:
                if entities["PERSON"] == '':
                    entities["PERSON"] = ent.text
            else:
                if entities[ent.label_] == '':
                    entities[ent.label_] = ent.text

    # Для поиска опыта (например, "3 года", "5 лет")
    experience_pattern = r'(\d{1,2})[-\s]?(год|лет|года)'  
    experience_matches = re.findall(experience_pattern, resume_text)

    for match in experience_matches:
        years = match[0]  
        if entities['EXPERIENCE'] == '':  # Если уже есть опыт, то не добавляем
            entities['EXPERIENCE'] = f"{years} лет"

    # Поиск имен с помощью регулярных выражений
    name_pattern = r"([А-ЯЁ][а-яё]+(?: [А-ЯЁ][а-яё]+)*)"
    name_matches = re.findall(name_pattern, resume_text)

    for match in name_matches:
        if match not in ["Работала", "Имею", "Проживаю"] and match.lower() not in normalized_cities:
            if entities['PERSON'] == '':
                entities['PERSON'] = match

    # Возвращаем результат
    return entities


@app.route('/process', methods=['POST'])
def process_resume():
    data = request.get_json()
    query = data.get("query")
    resume_text = data.get("resume_text")

    query_embedding = model.encode(query, convert_to_tensor=True)
    resume_embedding = model.encode(resume_text, convert_to_tensor=True)

    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    query_embedding = query_embedding.to(device)
    resume_embedding = resume_embedding.to(device)

    cosine_similarity = util.pytorch_cos_sim(query_embedding, resume_embedding)[0][0].item()

    entities = extract_entities(resume_text)

    result = {
        "similarity_score": cosine_similarity,
        "entities": entities
    }
    print(result)

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)

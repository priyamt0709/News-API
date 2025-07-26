from flask import Flask, jsonify, request, render_template
import requests
import os
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()  # Load .env file

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
BASE_URL = "https://gnews.io/api/v4/search"

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Python News API powered by GNews!"})

@app.route('/news-ui')
def news_ui():
    return render_template("index.html")

@app.route('/news', methods=['GET'])
def get_news():
    query = request.args.get('q', 'India')  # Default query
    lang = request.args.get('lang', 'en')   # Default language is English

    params = {
        'token': NEWS_API_KEY,
        'q': query,
        'lang': lang,
        'max': 10,
    }

    print("➡ GNews request params:", params)
    response = requests.get(BASE_URL, params=params)
    data = response.json()
    print("🔁 GNews response:", data)

    if response.status_code != 200 or 'articles' not in data:
        return jsonify({"error": "Failed to fetch news", "details": data}), 500

    articles = data["articles"]
    news_list = [
        {
            "title": article.get("title"),
            "source": article.get("source", {}).get("name"),
            "url": article.get("url"),
            "publishedAt": article.get("publishedAt")
        } for article in articles
    ]

    return jsonify(news_list), 200

if __name__ == '__main__':
    print("✅ Starting Flask server on http://127.0.0.1:5000")
    app.run(debug=True)

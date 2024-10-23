import requests
from bs4 import BeautifulSoup
import html2text
from urllib.parse import urlparse
import openai
import os

def extract_with_gpt(text):
    client = openai.OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
    
    system_prompt = """You are a helpful assistant that extracts the main article content from web pages.
    Extract only the main article content, removing navigation, headers, footers, ads, and other irrelevant content.
    Format the response in clean markdown."""
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Extract and format the main article content from this HTML content:\n\n{text}"}
            ],
            max_tokens=1500,
            temperature=0.3
        )
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"Error using GPT for content extraction: {str(e)}")

def scrape_and_convert(url):
    # Validate URL
    parsed_url = urlparse(url)
    if not parsed_url.scheme or not parsed_url.netloc:
        raise ValueError("Invalid URL")

    # Scrape the content
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        raise ConnectionError(f"Failed to fetch the URL: {e}")

    # Parse HTML
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # First convert to markdown using html2text
    h = html2text.HTML2Text()
    h.ignore_links = False
    initial_markdown = h.handle(str(soup))
    
    # Then use GPT to extract and clean the content
    try:
        markdown_content = extract_with_gpt(initial_markdown)
        return markdown_content
    except Exception as e:
        # Fallback to regular html2text if GPT fails
        return initial_markdown

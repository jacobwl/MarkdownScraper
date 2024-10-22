import requests
from bs4 import BeautifulSoup
import html2text
from urllib.parse import urlparse

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

    # Convert to Markdown
    h = html2text.HTML2Text()
    h.ignore_links = False
    markdown_content = h.handle(str(soup))

    return markdown_content

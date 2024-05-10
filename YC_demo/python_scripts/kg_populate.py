from gensim.models import KeyedVectors
from gensim.test.utils import datapath, get_tmpfile
from gensim.scripts.glove2word2vec import glove2word2vec
import networkx as nx

# Load pre-trained GloVe vectors
glove_path = r"YC_demo\data\glove.42B.300d.w2vformat.txt"  # Replace with your GloVe file path
# tmp_file = get_tmpfile(r"YC_demo\data\test_word2vec.txt")
# _ = glove2word2vec(glove_path, tmp_file)
model = KeyedVectors.load_word2vec_format(glove_path)

# Define function to get related words with similarity score
def get_related(word, top_n=10):
  try:
    related = model.most_similar(word, topn=top_n)
    return [(term, score) for term, score in related]
  except KeyError:
    return []

# Enhanced Knowledge Graph Structure
G = nx.DiGraph()

# 1. Entities for Fashion Items, Colors, Patterns
fashion_items = ["dress", "shirt", "jeans", "shoes", "bag"]
colors = ["red", "blue", "green", "black", "white"]
patterns = ["floral", "striped", "polka_dot", "checkered"]

for item in fashion_items:
  G.add_node(item, type='item')
for color in colors:
  G.add_node(color, type='color') 
for pattern in patterns:
  G.add_node(pattern, type='pattern') 

# 2. Relationships 
# Add edges between fashion items and related words
for term in fashion_items:
  related_words = get_related(term)
  print(related_words)
  for related, score in related_words:
    G.add_edge(term, related, weight=score)

# Add edges between items and colors/patterns (example)
G.add_edge("dress", "floral", type='has_pattern')
G.add_edge("dress", "red", type='has_color')
G.add_edge("jeans", "blue", type='has_color')
# ... add more relationships based on your knowledge

# 3. Representing "Goes Well With"
G.add_edge("dress", "shoes", type="goes_with")
G.add_edge("jeans", "shirt", type="goes_with") 
# ... add more of these relationships

# Function to update edge weight based on user preference
def update_preference(source, target, weight_delta):
  if G.has_edge(source, target):
    current_weight = G[source][target]["weight"]
    new_weight = max(0, current_weight + weight_delta)
    G[source][target]["weight"] = new_weight

# Example usage (replace with your preference extraction logic)
user_likes = ["floral dress", "skinny jeans"]
user_dislikes = ["cargo pants", "chunky sneakers"]

for term in user_likes:
  for node in G.nodes():
    if term in node:
      update_preference(node, term.split()[0], 1)  # Increase weight for liked terms

for term in user_dislikes:
  for node in G.nodes():
    if term in node:
      update_preference(node, term.split()[0], -0.5)  # Decrease weight for disliked terms

# Enhanced Recommendations
def get_recommendations(term, top_n=5):
  recommendations = []
  if G._node[term]['type'] == 'item':
    # Recommend colors, patterns, and other items it goes with
    for nbr, attr_dict in G.adj[term].items():  # Use adj for efficiency
      recommendations.append((nbr, attr_dict)) 
  return recommendations[:top_n] 

# Example usage
recommendations = get_recommendations("dress", top_n=3)
print(f"Recommendations for dress: {recommendations}")

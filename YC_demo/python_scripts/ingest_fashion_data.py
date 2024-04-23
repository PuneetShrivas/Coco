import pandas as pd
import requests
from requests.auth import HTTPBasicAuth

# Load fashion data from CSV
fashion_data = pd.read_csv('data\Fashion Dataset.csv')

# Define Elasticsearch host and credentials
host = 'https://f77e9ecefe814585930113a5846889a6.us-central1.gcp.cloud.es.io:443'
username = 'elastic'
password = 'ZoKdYJsOhbAWAFTQVnSV4xBe'

# Iterate over each row in the dataframe and upload to Elasticsearch
index_name = 'fashion_index'
for index, row in fashion_data.iterrows():
    record = row.to_dict()
    
    # Define Elasticsearch API endpoint
    url = f"{host}/{index_name}/_doc"
    
    try:
        # Make request to Elasticsearch API with authentication
        response = requests.post(url, json=record, auth=HTTPBasicAuth(username, password))
        if response.status_code == 201:
            print(f"Record uploaded successfully: {response.json()}")
        else:
            print(f"Failed to upload record: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Failed to upload record: {e}")

print("Upload completed.")
    
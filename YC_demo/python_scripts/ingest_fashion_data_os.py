import pandas as pd
import requests
from requests.auth import HTTPBasicAuth

# Load fashion data from CSV (Update path as needed)
fashion_data = pd.read_csv('data/Fashion Dataset.csv')

# OpenSearch credentials and endpoint
host = 'https://search-cocoproductsearch-b26gqvdt6jzgl4npxobu5itiaq.aos.eu-north-1.on.aws'  # Your OpenSearch endpoint
username = 'cocosearchuser' # Your OpenSearch master username (from Secrets Manager)
password = 'Puneet@32' # Your OpenSearch master password (from Secrets Manager)

# New index name
index_name = 'fashion_index'  # Choose a different name than the existing one

# Iterate over each row and upload to OpenSearch
for index, row in fashion_data.iterrows():
    record = row.to_dict()

    # Define OpenSearch API endpoint (PUT for creating/updating documents)
    url = f"{host}/{index_name}/_doc/" 

    try:
        # Make request to OpenSearch API with authentication
        response = requests.post    (url, json=record, auth=HTTPBasicAuth(username, password))

        if response.status_code == 201:
            print(f"Record uploaded successfully: {response.json()}")
        else:
            print(f"Failed to upload record: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Failed to upload record: {e}")

print("Upload completed.")

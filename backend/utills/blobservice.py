from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
import os
 
# Replace with your Azure Blob Storage connection string and container name
AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=transcribedblobstorage;AccountKey=1Z7yKPP5DLbxnoHdh7NmHgwg3dFLaDiYHUELdid7dzfzR6/DvkZnnzpJ30lrXIMhtD5GYKo+71jP+AStC1TEvA==;EndpointSuffix=core.windows.net"
# CONTAINER_NAME = "akasa"
CONTAINER_NAME = "ai-rep-platform"
 
class AzureBlobManager:
    def __init__(self, connection_string, container_name):
        self.blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        self.container_client = self.blob_service_client.get_container_client(container_name)
 
        # Create the container if it doesn't exist
        if not self.container_client.exists():
            self.container_client.create_container()
            print(f"Container '{container_name}' created.")
        else:
            print(f"Container '{container_name}' already exists.")
 
    # Create or Upload a file
    def upload_file(self, blob_name, file):
        try:
            blob_client = self.container_client.get_blob_client(blob_name)
            # with open(file_path, "rb") as file:
            pdf_url = blob_client.upload_blob(file, overwrite=True)
            return blob_client.url
            # print(f"File '{file_path}' uploaded to blob '{blob_name}'.")
        except Exception as e:
            print(f"Error uploading file: {e}")
 
    # Read or Download a file
    def download_file(self, blob_name, download_path):
        try:
            blob_client = self.container_client.get_blob_client(blob_name)
            with open(download_path, "wb") as file:
                file.write(blob_client.download_blob().readall())
            print(f"Blob '{blob_name}' downloaded to '{download_path}'.")
        except Exception as e:
            print(f"Error downloading file: {e}")
 
    # Update a file (re-upload with the same blob name)
    def update_file(self, blob_name, new_file_path):
        self.upload_file(blob_name, new_file_path)
 
    # Delete a file
    def delete_file(self, blob_name):
        try:
            blob_client = self.container_client.get_blob_client(blob_name)
            blob_client.delete_blob()
            print(f"Blob '{blob_name}' deleted.")
        except Exception as e:
            print(f"Error deleting blob: {e}")
 
    # List all files in the container
    def list_files(self):
        try:
            blobs = self.container_client.list_blobs()
            print("Files in the container:")
            for blob in blobs:
                print(f"- {blob.name}")
        except Exception as e:
            print(f"Error listing blobs: {e}")


azure_blob_manager = AzureBlobManager(AZURE_STORAGE_CONNECTION_STRING, CONTAINER_NAME) 
# # Example Usage
# if __name__ == "__main__":
#     azure_blob_manager = AzureBlobManager(AZURE_STORAGE_CONNECTION_STRING, CONTAINER_NAME)
 
    # File paths for testing
    # local_file_path = "path/to/local/file.txt"
    # upload_blob_name = "uploaded-file.txt"
    # download_file_path = "path/to/downloaded/file.txt"
 
    # CRUD Operations
    # azure_blob_manager.upload_file(upload_blob_name, local_file_path)
    # azure_blob_manager.list_files()
    # azure_blob_manager.download_file(upload_blob_name, download_file_path)
    # azure_blob_manager.update_file(upload_blob_name, local_file_path)  # Example of updating
    # azure_blob_manager.delete_file(upload_blob_name)
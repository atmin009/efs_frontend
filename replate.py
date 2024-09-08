import os
import re

def replace_text_in_file(file_path, search_text, replace_text):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    new_content = content.replace(search_text, replace_text)
    
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(new_content)

def replace_text_in_directory(directory_path, search_text, replace_text):
    for root, dirs, files in os.walk(directory_path):
        for file in files:
            file_path = os.path.join(root, file)
            try:
                replace_text_in_file(file_path, search_text, replace_text)
                print(f'Replaced text in {file_path}')
            except Exception as e:
                print(f'Failed to replace text in {file_path}: {e}')

# Parameters
directory_path = ''  # Replace with your directory path
search_text = 'localhost'
replace_text = '203.146.252.157'

replace_text_in_directory(directory_path, search_text, replace_text)

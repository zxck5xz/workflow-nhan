import pandas as pd
import os

def load_excel_example(file_path):
    print(f"--- Loading: {os.path.basename(file_path)} ---")
    
    # Load the first sheet
    try:
        df = pd.read_excel(file_path)
        print("\nFirst 5 rows:")
        print(df.head())
        
        print("\nColumns:")
        print(df.columns.tolist())
        
        # Load all sheets
        all_sheets = pd.read_excel(file_path, sheet_name=None)
        print(f"\nSheet names: {list(all_sheets.keys())}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    example_file = "doc/sample_game_notes.xlsx"
    if os.path.exists(example_file):
        load_excel_example(example_file)
    else:
        print(f"File not found: {example_file}")

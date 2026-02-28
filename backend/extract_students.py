import pdfplumber
import json
import os
import re

pdf_path = r"d:\Projects\Personal\aura-integrity-engine\data\roll_call.pdf"
output_path = r"d:\Projects\Personal\aura-integrity-engine\backend\extracted_students.json"

students = []
enroll_pattern = re.compile(r"^\d{11}$")

try:
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            table = page.extract_table()
            if table:
                print(f"Page {i+1}: Table found.")
                for row in table:
                    # Robust check: Is the second column a valid enrollment number?
                    if row and len(row) >= 5:
                        enroll = str(row[1]).strip()
                        if enroll_pattern.match(enroll):
                            students.append(row)
                        else:
                            # Maybe it's a header or empty row
                            pass

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(students, f, indent=4)
    print(f"Extracted {len(students)} verified students to {output_path}")

except Exception as e:
    print(f"Error: {e}")

import pdfplumber

pdf_path = r"c:\Users\hackersike123\OneDrive\Documents\TracNghiem_CSDL1_204 2.pdf"
output_txt = r"c:\Users\hackersike123\OneDrive\Documents\testweb\output.txt"

with pdfplumber.open(pdf_path) as pdf:
    text = ""
    for page in pdf.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"

with open(output_txt, "w", encoding="utf-8") as f:
    f.write(text)

print("Đã trích xuất xong văn bản sang output.txt")
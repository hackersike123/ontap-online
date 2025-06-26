import re
import json

input_file = "output.txt"
output_file = "questions.json"

with open(input_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

questions = []
current = {}
options = []

for line in lines:
    line = line.strip()
    # Nhận diện câu hỏi bắt đầu bằng số và dấu chấm
    if re.match(r"^\d+\.", line):
        if current and options:
            current["options"] = options
            questions.append(current)
        current = {"question": line}
        options = []
    # Nhận diện đáp án bắt đầu bằng A., B., C., D.
    elif re.match(r"^[A-D]\.", line):
        options.append(line)
    # Nhận diện đáp án đúng (ví dụ: "Đáp án: A")
    elif "Đáp án:" in line:
        answer = re.findall(r"Đáp án: ([A-D])", line)
        if answer:
            current["answer"] = answer[0]
# Thêm câu hỏi cuối cùng
if current and options:
    current["options"] = options
    questions.append(current)

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print("Đã chuyển đổi xong sang questions.json")
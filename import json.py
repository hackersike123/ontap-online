import json

# Danh sách đáp án đúng, thứ tự phải khớp với thứ tự câu hỏi trong file
answers = [
    "A", "C", "D", "A", "A", "A", "B", "C", "D", "A", "B", "D", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "D", "A", "A", "B", "B", "B", "B", "C", "A", "B", "A", "A", "A", "A", "A", "A", "A", "A", "A", "B", "A", "A", "A", "A", "C", "D", "D", "B", "B", "C", "B", "C", "A", "B", "C", "B", "C", "A", "C", "C", "C", "B", "C", "A", "D", "A", "B", "B", "C", "A", "D", "C", "B", "A", "B", "B", "B", "C", "C", "A", "D", "C", "C", "A", "C", "C", "C", "C", "A", "B", "A", "A", "A", "A", "A", "C", "D", "B", "A", "C", "A", "B", "B", "C", "A", "D", "C", "B", "A", "B", "D", "A", "B", "C", "C", "A", "A", "D", "C", "D", "B", "A", "C", "B", "B", "B", "B", "B", "C", "D", "D", "B", "D", "B", "B", "C", "D", "B", "B", "A", "B", "D", "B", "B", "D", "A", "D", "D", "C", "B", "C", "D", "C", "B", "B", "A", "B", "C", "D", "C", "C", "B", "A", "C", "B", "C", "C", "C", "C", "A", "C", "B", "C", "A", "C", "C", "B", "A", "C", "D", "C", "A", "A", "B", "A", "B", "C", "D", "B", "C", "A", "C", "B", "A", "B", "C", "B", "C", "C"
]

with open("questions.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for i, ans in enumerate(answers):
    if i < len(data):
        data[i]["answer"] = ans

with open("questions.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Đã thêm đáp án đúng vào file questions.json")
ans_str = "a c d a a a b c d a b d a a a a a a a a a a a a a d a a b b b b c a b a a a a a a a a a b a a a a c d d b b c b c a b c b c a c c c b c a d a b b c a d c b a b b b c c a d c c a c c c c a b a a a a a c d b a c a b b c a d c b a b d a b c c a a d c d b a c b b b b b c d d b d b b c d b b a b d b b d a d d c b c d c b b a b c d c c b a c b c c c c a c b c a c c b a c d c a a b a b c d b c a c b a b c b c c"
ans_list = ['"{}"'.format(x.upper()) for x in ans_str.split() if x.strip() in ['a','b','c','d','A','B','C','D']]
print(", ".join(ans_list))
print("Số đáp án:", len(ans_list))
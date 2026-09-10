from pathlib import Path
import json
import pdfplumber

root = Path(__file__).resolve().parents[1]
results = []
for volume in (1, 2):
    pdf = root / 'challenge' / 'output' / 'pdf' / f'challenge-concepts-round{volume}.pdf'
    doc = pdfplumber.open(pdf)
    behavior_count = 40 if volume == 1 else 39
    expected_solution_rows = behavior_count * 3
    assert len(doc.pages) == 83, (volume, 'pages', len(doc.pages))
    assert '정답과 풀이' in (doc.pages[62].extract_text() or ''), (volume, 'answer cover is not page 63')

    response_fields = 0
    for index in range(2, 62):
        page = doc.pages[index]
        words = page.extract_words()
        answers = [word for word in words if word['text'].rstrip(':') == '답']
        assert len(answers) in (0, 1, 2), (volume, index + 1, 'response fields', len(answers))
        assert all(word['bottom'] < page.height - 36 for word in answers), (volume, index + 1, 'response near footer')
        if len(answers) == 2:
            assert abs(answers[0]['top'] - answers[1]['top']) > 100, (volume, index + 1, 'response collision')
        response_fields += len(answers)

    solution_rows = 0
    for index in range(63, 83):
        text = doc.pages[index].extract_text() or ''
        assert '행동유형' in text, (volume, index + 1, 'missing behavior heading')
        rows = text.count('대표유형 · 기본') + text.count('유제 · 한 단계') + text.count('REVIEW')
        expected_rows = 3 if volume == 2 and index == 82 else 6
        assert rows == expected_rows, (volume, index + 1, 'solution rows', rows)
        assert text.count('정답') >= expected_rows, (volume, index + 1, 'missing answers')
        solution_rows += rows

    assert response_fields == expected_solution_rows, (volume, response_fields)
    assert solution_rows == expected_solution_rows, (volume, solution_rows)
    results.append({'volume': volume, 'pages': len(doc.pages), 'response_fields': response_fields, 'answer_cover': 63, 'solution_rows': solution_rows, 'passed': True})
    doc.close()

report = {'passed': True, 'volumes': results}
out = root / 'output' / 'qa' / 'challenge-concepts-two'
out.mkdir(parents=True, exist_ok=True)
(out / 'pdf-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(report, ensure_ascii=False, indent=2))

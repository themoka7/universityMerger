#!/usr/bin/env python3
"""merger-schedule.html(Artifact 소스)을 GitHub Pages용 단독 HTML로 감싼다.

Artifact로 게시할 때는 플랫폼이 <!doctype>·<head>·<body> 골격을 붙여 주지만,
Pages나 로컬 파일로 열 때는 그 골격이 없으므로 여기서 직접 만든다.
출력: docs/index.html
"""
import pathlib

ROOT = pathlib.Path(__file__).parent
body = (ROOT / "merger-schedule.html").read_text(encoding="utf-8")

# <title> 과 폰트 <link> 는 head 로 올린다. Artifact 플랫폼은 body 안에 있어도
# 알아서 처리하지만, 일반 브라우저에서는 head 에 있어야 정석이다.
head_extra = []
for line in list(body.splitlines()):
    if line.startswith("<title>") or line.startswith("<link "):
        head_extra.append(line)
        body = body.replace(line + "\n", "", 1)
head_extra = "\n".join(head_extra)

SHELL = """<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="대학 통합 추진 과제를 단계·부서·기간별로 정리한 일정판">
%s
<style>:root{color-scheme:light dark}body{margin:0}img{max-width:100%%}[hidden]{display:none!important}</style>
</head>
<body>
%s
</body>
</html>
"""

out = ROOT / "docs"
out.mkdir(exist_ok=True)
(out / "index.html").write_text(SHELL % (head_extra, body), encoding="utf-8")
(out / ".nojekyll").write_text("", encoding="utf-8")
print("docs/index.html 생성 완료 (%.0f KB)" % ((out / "index.html").stat().st_size / 1024))

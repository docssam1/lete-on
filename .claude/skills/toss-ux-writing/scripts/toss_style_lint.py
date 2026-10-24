#!/usr/bin/env python3
"""Heuristic linter for Toss-inspired Korean UX writing.

This script intentionally reports style risks, not absolute errors. Use it as a review assistant.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Iterable, List


@dataclass
class Finding:
    line: int
    column: int
    severity: str
    rule: str
    message: str
    excerpt: str
    suggestion: str


RULES = [
    {
        "id": "register-formal",
        "severity": "major",
        "pattern": r"(합니다|됩니다|되었습니다|십시오|바랍니다|가능합니다|불가합니다|필요합니다)",
        "message": "formal register found; product UX copy should usually use 해요체.",
        "suggestion": "Convert to 해요체: 해요/돼요/할 수 있어요/필요해요.",
    },
    {
        "id": "do-not-use-doeeoyo",
        "severity": "critical",
        "pattern": r"되어요",
        "message": "`되어요` is too long/stiff for this style.",
        "suggestion": "Use `돼요`, or rewrite actively if passive is not an exception.",
    },
    {
        "id": "passive-risk",
        "severity": "minor",
        "pattern": r"(됐어요|되었어요|됩니다|되나요|되어|변경됐|설정됐|등록됐|선택됐|처리됐|완료됐)",
        "message": "possible passive/stative wording; active voice may be clearer.",
        "suggestion": "Try active verbs such as 했어요, 바꿨어요, 설정했어요, 등록했어요.",
    },
    {
        "id": "over-honorific",
        "severity": "major",
        "pattern": r"(시겠어요|시나요|셨나요|하시겠|해주시겠|계시나요|계세요|계신|여쭤|여쭙|께)",
        "message": "over-honorific wording can feel ceremonial rather than casually respectful.",
        "suggestion": "Use 할까요/있나요/확인할게요/에게, or rewrite with the target information as subject.",
    },
    {
        "id": "negative-risk",
        "severity": "minor",
        "pattern": r"(할 수 없어요|쓸 수 없어요|받을 수 없어요|안 돼요|없어요|불가|금지|제한)",
        "message": "negative wording found; check whether positive condition framing would guide recovery better.",
        "suggestion": "If the user has a path forward, rewrite as `[조건]하면 ...할 수 있어요`. Keep negative for hard blocks or reassurance.",
    },
    {
        "id": "dialog-cancel",
        "severity": "major",
        "pattern": r"취소",
        "message": "`취소` can imply an in-progress user action will be cancelled.",
        "suggestion": "Use `닫기` for a dialog dismiss button unless the operation is truly cancelled.",
    },
    {
        "id": "noun-stack",
        "severity": "minor",
        "pattern": r"[가-힣A-Za-z0-9]+\s+(안내|확인|입력|신청|조회|이용|가입|결제|등록|변경|해지|인증|충전|발급|전환|선택|동의|환불|지급|처리|완료|실패|오류|예정)",
        "message": "possible noun stack/nominalization; verbs may feel friendlier.",
        "suggestion": "Try a verb or cause clause: `정보를 입력해요`, `잔액이 부족해서`, `계좌 만들기`.",
    },
    {
        "id": "generic-cta",
        "severity": "minor",
        "pattern": r"^(확인|진행|제출|동의|업데이트)$",
        "message": "generic CTA label found.",
        "suggestion": "Name the action: 확인하기, 계속하기, 보내기, 동의하기, 업데이트하기, etc.",
    },
]


def iter_lines(text: str) -> Iterable[tuple[int, str]]:
    for idx, line in enumerate(text.splitlines() or [text], start=1):
        yield idx, line


def lint_text(text: str) -> List[Finding]:
    findings: List[Finding] = []
    for line_no, line in iter_lines(text):
        for rule in RULES:
            flags = re.MULTILINE
            for match in re.finditer(rule["pattern"], line.strip() if rule["id"] == "generic-cta" else line, flags):
                column = match.start() + 1
                excerpt = match.group(0)
                if rule["id"] == "noun-stack":
                    first_token = excerpt.split()[0]
                    if first_token.endswith(("을", "를", "이", "가", "은", "는", "도", "만", "에", "에서")):
                        continue
                findings.append(
                    Finding(
                        line=line_no,
                        column=column,
                        severity=rule["severity"],
                        rule=rule["id"],
                        message=rule["message"],
                        excerpt=excerpt,
                        suggestion=rule["suggestion"],
                    )
                )
    return findings


def read_input(targets: list[str]) -> str:
    if not targets:
        return sys.stdin.read()
    chunks = []
    for target in targets:
        path = Path(target)
        if path.exists():
            chunks.append(path.read_text(encoding="utf-8"))
        else:
            chunks.append(target)
    return "\n".join(chunks)


def render_markdown(findings: List[Finding]) -> str:
    if not findings:
        return "✅ Toss-style linter found no obvious risks."
    lines = ["# Toss UX Writing Lint Findings", "", "| Severity | Line | Rule | Excerpt | Suggestion |", "|---|---:|---|---|---|"]
    for f in findings:
        excerpt = f.excerpt.replace("|", "\\|")
        suggestion = f.suggestion.replace("|", "\\|")
        lines.append(f"| {f.severity} | {f.line}:{f.column} | {f.rule} | `{excerpt}` | {suggestion} |")
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Lint Korean UX copy for Toss-inspired style risks.")
    parser.add_argument("targets", nargs="*", help="Text snippets or UTF-8 files. Reads stdin when omitted.")
    parser.add_argument("--format", choices=["text", "json", "markdown"], default="text")
    parser.add_argument("--fail-on", choices=["none", "minor", "major", "critical"], default="none", help="Exit non-zero when findings at or above severity exist.")
    args = parser.parse_args(argv)

    text = read_input(args.targets)
    findings = lint_text(text)

    if args.format == "json":
        print(json.dumps([asdict(f) for f in findings], ensure_ascii=False, indent=2))
    elif args.format == "markdown":
        print(render_markdown(findings))
    else:
        if not findings:
            print("OK: no obvious Toss-style risks found")
        for f in findings:
            print(f"{f.severity.upper()} {f.line}:{f.column} {f.rule}: {f.excerpt} — {f.suggestion}")

    if args.fail_on != "none":
        order = {"minor": 1, "major": 2, "critical": 3}
        threshold = order[args.fail_on]
        if any(order[f.severity] >= threshold for f in findings):
            return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

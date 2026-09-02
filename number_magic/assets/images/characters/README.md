# 캐릭터 PNG 놓는 자리

작화지시서(`number_magic/캐릭터-작화지시서.md`)대로 받은 **PNG 12장을 이 폴더에 그대로** 넣습니다.

```
king.png  sage.png  greek.png  scholar.png  wig.png  boy.png
girl.png  shepherd.png  scribe.png  merchant.png  astronomer.png  numi.png
```

파일명이 곧 `scripts/comic-helpers.js`의 함수 이름입니다. 12장이 다 들어오면
그 함수 12개를 PNG를 얹는 코드로 바꾸고 `node scripts/build-comics.js`를 돌리면
만화 95편 380컷에 한 번에 반영됩니다(만화 소스는 무수정).

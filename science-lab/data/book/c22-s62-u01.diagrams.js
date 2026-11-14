// 수평면·수직 막대·실의 관계를 나타내는 개념도. 실제 측정 자료가 아니다.
export const altitudeDevice=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 550" role="img" aria-label="수직 막대의 끝과 그림자 끝을 이은 실이 수평 받침과 이루는 각을 태양 고도로 표시한 개념도">
<rect x="30" y="20" width="840" height="510" rx="8" fill="#fdfbf5" stroke="#c9bda2"/>
<text x="60" y="62" font-family="Pretendard,sans-serif" font-size="27" font-weight="700" fill="#191511">수평면과 햇빛 방향 사이의 각을 읽어요</text>
<path d="M125 440 L790 440 L835 479 L170 479 Z" fill="#e9f0e7" stroke="#c9bda2" stroke-width="2"/>
<path d="M280 440 L650 440" stroke="#c9bda2" stroke-width="14"/>
<rect x="272" y="120" width="16" height="320" rx="4" fill="#b99665" stroke="#7a6f5c" stroke-width="2"/>
<path d="M280 120 L650 440" stroke="#2f6b4a" stroke-width="3"/>
<path d="M230 76.756757 L740 517.837838" stroke="#b4512e" stroke-width="3" stroke-dasharray="9 7"/>
<path d="M719.64 510.81 L740 517.837838 L730.10 498.71" stroke="#b4512e" stroke-width="3" fill="none"/>
<path d="M280 420 L300 420 L300 440" stroke="#191511" fill="none" stroke-width="2"/>
<path d="M560 440 Q560 406.47 581.9258 381.124" stroke="#2f6b4a" fill="none" stroke-width="4"/>
<circle cx="280" cy="120" r="6" fill="#2f6b4a"/><circle cx="650" cy="440" r="6" fill="#2f6b4a"/>
<g font-family="Pretendard,sans-serif" font-size="23" fill="#191511">
<text x="95" y="230">수직 막대</text><path d="M205 225 L268 250" stroke="#7a6f5c"/>
<text x="310" y="124">막대 끝</text>
<text x="420" y="219">햇빛의 방향</text>
<text x="305" y="334">두 끝을 잇는 실</text>
<text x="520" y="367" fill="#2f6b4a">태양 고도</text>
<text x="637" y="416">그림자 끝</text>
<text x="335" y="504">수평 받침</text>
</g></svg>`;
export const altitudeDeviceModel=Object.freeze({rodTop:[280,120],rodBase:[280,440],shadowTip:[650,440],height:320,shadowLength:370,angleAt:'shadow-tip',reference:'horizontal',kind:'concept-not-observation'});

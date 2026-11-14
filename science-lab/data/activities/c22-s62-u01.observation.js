// Numerical facts directly read from the official KASI calculators on 2026-10-21.
// Calculated ephemeris, not student observation; keep the separately displayed precisions.
export const location={name:'서울특별시',latitude:37.54980,longitude:126.9671,latitudeParameter:'37.54980',longitudeParameter:'126.9671',timeZone:'KST (UTC+9)',display:'동경 126도 58분 1초 / 북위 37도 32분 59초'};
const address='%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C';
export const seasonData=[
 {id:'spring',season:'봄',date:'2026-03-20',sunrise:'06:36',noon:'12:39',sunset:'18:43',sourceDayMinutes:726,shownTimeDifferenceMinutes:727,altitudeDms:[52,15,55.27],altitude:52.3,azimuthDms:[179,43,33.58]},
 {id:'summer',season:'여름',date:'2026-06-21',sunrise:'05:11',noon:'12:33',sunset:'19:56',sourceDayMinutes:885,shownTimeDifferenceMinutes:885,altitudeDms:[75,53,9.71],altitude:75.9,azimuthDms:[179,10,46.40]},
 {id:'autumn',season:'가을',date:'2026-09-23',sunrise:'06:20',noon:'12:24',sunset:'18:28',sourceDayMinutes:728,shownTimeDifferenceMinutes:728,altitudeDms:[52,23,40.48],altitude:52.4,azimuthDms:[179,44,30.59]},
 {id:'winter',season:'겨울',date:'2026-12-22',sunrise:'07:43',noon:'12:30',sunset:'17:17',sourceDayMinutes:573,shownTimeDifferenceMinutes:574,altitudeDms:[29,0,38.44],altitude:29.0,azimuthDms:[179,51,52.43]}
].map(row=>({...row,sourceUrl:`https://astro.kasi.re.kr/kor/life/pageView/9?lat=37.54980&lng=126.9671&date=${row.date}&address=${address}`,altitudeUrl:`https://astro.kasi.re.kr/kor/life/pageView/10?useElevation=1&lat=37.54980&lng=126.9671&elevation=0&output_range=2&date=${row.date}&hour=12&minute=${row.noon.split(':')[1]}&second=0&address=${address}`}));
export const dataNotes={kind:'한국천문연구원 계산 자료',readOn:'2026-10-21',altitudeLabel:'남중 무렵 고도',precision:'일출·일몰·남중 시각은 분 단위 표시예요. 그 남중 시각의 초를 0으로 둔 고도를 소수 첫째 자리로 나타냈어요. 정확한 남중 순간의 최댓값을 측정한 것은 아니에요.',dayLength:'표시된 일몰−일출은 근삿낮길이예요. 사이트가 따로 표시한 낮길이와 봄·겨울에는 1분 차이가 있어요. 두 값을 고치거나 합치지 않아요.',limits:'같은 서울 지점의 네 날짜 비교예요. 실제 날씨·기온·학생 실측 자료가 아니며 춘추분의 실제 낮길이를 정확히 12시간으로 강제하지 않아요.'};
export function timeDifference(sunrise,sunset){const minutes=s=>{if(!/^\d{2}:\d{2}$/.test(s))throw Error('시각 표기를 확인해요.');const [h,m]=s.split(':').map(Number);if(h>23||m>59)throw Error('시각 범위를 확인해요.');return h*60+m;};return minutes(sunset)-minutes(sunrise);}
export const durationText=n=>`${Math.floor(n/60)}시간 ${n%60}분`;

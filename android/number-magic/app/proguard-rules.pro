# 웹 화면이 부르는 다리(window.NMAndroid) 메서드 이름을 지키기 위해.
-keepclassmembers class kr.co.gfield.numbermagic.MainActivity$Bridge {
    @android.webkit.JavascriptInterface <methods>;
}

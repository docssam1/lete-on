package kr.co.gfield.numbermagic;

import android.Manifest;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import org.json.JSONObject;

/**
 * 수의 마법 안드로이드 앱(2026-10-28). 사이트(lete-on.gfieldacademy.net/number_magic)를 앱 창으로 연다 —
 * 내용은 사이트가 바뀌면 앱을 다시 깔지 않아도 바로 바뀐다. 인터넷 없이 여는 것은 사이트의 서비스 워커(sw.js)가 맡는다.
 * 앱만 더 하는 일: 매일 공부 알림(window.NMAndroid), 화면 꺼짐 방지, 학습지 인쇄(window.print → 안드로이드 인쇄), 뒤로 가기.
 */
public class MainActivity extends Activity {
    static final String HOST = "lete-on.gfieldacademy.net";
    private static final String START_URL = "https://" + HOST + "/number_magic/access.html?source=apk";
    private static final String[] OWN_HOSTS = {HOST, "docssam1.github.io"};
    private static final int FILE_CHOOSER_REQUEST = 2201;
    private static final int NOTIFY_PERMISSION_REQUEST = 2203;

    private FrameLayout root;
    private WebView webView;
    private ProgressBar progressBar;
    private View statusBox;
    private View customView;
    private WebChromeClient.CustomViewCallback customViewCallback;
    private ValueCallback<Uri[]> filePathCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        root = findViewById(R.id.root);
        webView = findViewById(R.id.web_view);
        progressBar = findViewById(R.id.progress_bar);
        statusBox = findViewById(R.id.status_box);
        findViewById(R.id.retry_button).setOnClickListener(v -> {
            statusBox.setVisibility(View.GONE);
            String url = webView.getUrl();
            webView.loadUrl(url == null || url.startsWith("about:") ? START_URL : url);
        });

        Reminder.ensureChannel(this);
        configureWebView();

        if (savedInstanceState == null) {
            webView.loadUrl(START_URL);
        } else {
            webView.restoreState(savedInstanceState);
        }
    }

    private void configureWebView() {
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        s.setJavaScriptCanOpenWindowsAutomatically(false);
        s.setSupportMultipleWindows(false);
        s.setTextZoom(100);   // 휴대폰 글자 크기 설정이 학습지 칸을 깨뜨리지 않게
        s.setUserAgentString(s.getUserAgentString() + " GFIELDNumberMagic/" + BuildConfig.VERSION_NAME);

        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);

        webView.setKeepScreenOn(true);   // 문제를 생각하는 동안 화면이 꺼지지 않게(앱이 앞에 있을 때만)
        webView.addJavascriptInterface(new Bridge(), "NMAndroid");
        webView.setWebViewClient(new NmWebViewClient());
        webView.setWebChromeClient(new NmWebChromeClient());
        webView.setDownloadListener((url, ua, cd, mime, len) -> openExternal(Uri.parse(url)));
    }

    /** 웹 화면이 부르는 다리 — window.NMAndroid */
    private class Bridge {
        @JavascriptInterface
        public String version() { return BuildConfig.VERSION_NAME; }

        @JavascriptInterface
        public String getReminder() {
            try {
                JSONObject o = new JSONObject();
                o.put("on", Reminder.isOn(MainActivity.this));
                o.put("hour", Reminder.hour(MainActivity.this));
                o.put("minute", Reminder.minute(MainActivity.this));
                o.put("permission", notificationsAllowed());
                return o.toString();
            } catch (Exception e) {
                return "{}";
            }
        }

        @JavascriptInterface
        public String setReminder(int hour, int minute) {
            if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return "error";
            Reminder.save(MainActivity.this, true, hour, minute);
            Reminder.schedule(MainActivity.this);
            if (!notificationsAllowed()) {
                runOnUiThread(() -> requestPermissions(
                        new String[]{Manifest.permission.POST_NOTIFICATIONS}, NOTIFY_PERMISSION_REQUEST));
                return "asked";
            }
            return "ok";
        }

        @JavascriptInterface
        public String cancelReminder() {
            Reminder.cancel(MainActivity.this);
            return "ok";
        }

        @JavascriptInterface
        public void print(String title) {
            runOnUiThread(() -> printPage(title));
        }
    }

    private boolean notificationsAllowed() {
        return Build.VERSION.SDK_INT < 33
                || checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED;
    }

    private void printPage(String title) {
        PrintManager pm = (PrintManager) getSystemService(Context.PRINT_SERVICE);
        if (pm == null) return;
        String name = (title == null || title.trim().isEmpty()) ? getString(R.string.app_name) : title.trim();
        PrintDocumentAdapter adapter = webView.createPrintDocumentAdapter(name);
        pm.print(name, adapter, new PrintAttributes.Builder()
                .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                .build());
    }

    private void tellPage(String type, boolean value) {
        webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('nm-android',{detail:{type:'" + type + "',value:" + value + "}}))", null);
    }

    private class NmWebViewClient extends WebViewClient {
        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            progressBar.setVisibility(View.VISIBLE);
            statusBox.setVisibility(View.GONE);
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            progressBar.setVisibility(View.GONE);
            // 웹 화면의 「인쇄」 단추(window.print)가 안드로이드 인쇄 창을 열게
            view.evaluateJavascript("(function(){if(window.NMAndroid&&!window.__nmPrint){window.__nmPrint=1;window.print=function(){NMAndroid.print(document.title||'')};}})()", null);
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            return handleNavigation(request.getUrl());
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            if (request.isForMainFrame()) {
                progressBar.setVisibility(View.GONE);
                statusBox.setVisibility(View.VISIBLE);
            }
        }
    }

    /** 우리 사이트는 앱 안에서, 다른 사이트·전화·메일·카카오톡 링크는 바깥 앱으로. */
    private boolean handleNavigation(Uri uri) {
        String scheme = uri.getScheme();
        if (scheme == null || scheme.equals("about") || scheme.equals("blob") || scheme.equals("data")) return false;
        if (scheme.equals("https") || scheme.equals("http")) {
            String host = uri.getHost();
            for (String own : OWN_HOSTS) {
                if (own.equalsIgnoreCase(host)) return false;
            }
        }
        openExternal(uri);
        return true;
    }

    private void openExternal(Uri uri) {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (ActivityNotFoundException e) {
            Toast.makeText(this, R.string.no_app_for_link, Toast.LENGTH_SHORT).show();
        }
    }

    private class NmWebChromeClient extends WebChromeClient {
        @Override
        public void onProgressChanged(WebView view, int newProgress) {
            progressBar.setProgress(newProgress);
            progressBar.setVisibility(newProgress >= 100 ? View.GONE : View.VISIBLE);
        }

        @Override
        public void onShowCustomView(View view, CustomViewCallback callback) {
            if (customView != null) {
                callback.onCustomViewHidden();
                return;
            }
            customView = view;
            customViewCallback = callback;
            root.addView(view, new FrameLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
            webView.setVisibility(View.GONE);
        }

        @Override
        public void onHideCustomView() {
            hideCustomView();
        }

        @Override
        public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
            if (filePathCallback != null) filePathCallback.onReceiveValue(null);
            filePathCallback = callback;
            try {
                startActivityForResult(params.createIntent(), FILE_CHOOSER_REQUEST);
                return true;
            } catch (ActivityNotFoundException e) {
                filePathCallback = null;
                Toast.makeText(MainActivity.this, R.string.no_file_picker, Toast.LENGTH_SHORT).show();
                return false;
            }
        }
    }

    private void hideCustomView() {
        if (customView == null) return;
        root.removeView(customView);
        customView = null;
        webView.setVisibility(View.VISIBLE);
        if (customViewCallback != null) {
            customViewCallback.onCustomViewHidden();
            customViewCallback = null;
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != FILE_CHOOSER_REQUEST || filePathCallback == null) return;
        filePathCallback.onReceiveValue(resultCode == RESULT_OK
                ? WebChromeClient.FileChooserParams.parseResult(resultCode, data) : null);
        filePathCallback = null;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == NOTIFY_PERMISSION_REQUEST) {
            boolean granted = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
            if (granted) Reminder.schedule(this);
            tellPage("notify-permission", granted);
        }
    }

    @Override
    public void onBackPressed() {
        if (customView != null) {
            hideCustomView();
        } else if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
    }

    @Override
    protected void onPause() {
        webView.onPause();
        CookieManager.getInstance().flush();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.removeJavascriptInterface("NMAndroid");
            webView.stopLoading();
            webView.setWebChromeClient(null);
            webView.setWebViewClient(null);
            webView.destroy();
        }
        super.onDestroy();
    }
}

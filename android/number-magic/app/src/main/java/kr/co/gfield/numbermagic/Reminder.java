package kr.co.gfield.numbermagic;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;

import java.util.Calendar;

/** 매일 공부 알림 — 이 기기 안에서만 울린다(서버·푸시 없음). 설정은 SharedPreferences 에 두고, 껐다 켜면 BootReceiver 가 다시 건다. */
final class Reminder {
    static final String CHANNEL = "study";
    private static final String PREFS = "nm_reminder";
    private static final int REQUEST = 3301;

    private Reminder() {}

    static SharedPreferences prefs(Context c) {
        return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    static boolean isOn(Context c) { return prefs(c).getBoolean("on", false); }
    static int hour(Context c) { return prefs(c).getInt("hour", 17); }
    static int minute(Context c) { return prefs(c).getInt("minute", 0); }

    static void save(Context c, boolean on, int hour, int minute) {
        prefs(c).edit().putBoolean("on", on).putInt("hour", hour).putInt("minute", minute).apply();
    }

    static void ensureChannel(Context c) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        if (nm == null || nm.getNotificationChannel(CHANNEL) != null) return;
        NotificationChannel ch = new NotificationChannel(
                CHANNEL, c.getString(R.string.channel_name), NotificationManager.IMPORTANCE_DEFAULT);
        ch.setDescription(c.getString(R.string.channel_description));
        nm.createNotificationChannel(ch);
    }

    private static PendingIntent pending(Context c) {
        Intent i = new Intent(c, ReminderReceiver.class);
        return PendingIntent.getBroadcast(c, REQUEST, i,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    /** 다음 그 시각(지났으면 내일)부터 하루마다. 정확한 시각 권한이 필요 없게 「대략」 알람을 쓴다(몇 분 늦을 수 있다). */
    static void schedule(Context c) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        am.cancel(pending(c));
        if (!isOn(c)) return;
        Calendar next = Calendar.getInstance();
        next.set(Calendar.HOUR_OF_DAY, hour(c));
        next.set(Calendar.MINUTE, minute(c));
        next.set(Calendar.SECOND, 0);
        next.set(Calendar.MILLISECOND, 0);
        if (next.getTimeInMillis() <= System.currentTimeMillis() + 1000) next.add(Calendar.DAY_OF_YEAR, 1);
        am.setInexactRepeating(AlarmManager.RTC_WAKEUP, next.getTimeInMillis(), AlarmManager.INTERVAL_DAY, pending(c));
    }

    static void cancel(Context c) {
        save(c, false, hour(c), minute(c));
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am != null) am.cancel(pending(c));
    }
}

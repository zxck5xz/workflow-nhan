import { useEffect, useState } from 'react';
import { apiService, type NotificationSettings } from '../../data/apiService';
import { Button } from '../common';

/** Deadline reminders (3 ngày / 1 ngày trước) for the signed-in admin. */
export function NotificationSection() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    apiService
      .getNotificationSettings()
      .then(setSettings)
      .catch((e: Error) => setMessage({ ok: false, text: e.message }));
  }, []);

  const update = (patch: Partial<NotificationSettings>) =>
    setSettings((s) => (s ? { ...s, ...patch } : s));

  const run = async (action: () => Promise<string>) => {
    setBusy(true);
    setMessage(null);
    try {
      setMessage({ ok: true, text: await action() });
    } catch (e) {
      setMessage({ ok: false, text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const save = () =>
    run(async () => {
      if (settings) setSettings(await apiService.saveNotificationSettings(settings));
      return 'Đã lưu';
    });

  const test = () =>
    run(async () => {
      if (settings) await apiService.saveNotificationSettings(settings);
      const results = await apiService.testNotification();
      return results
        .map(
          (r) =>
            `${r.channel === 'telegram' ? 'Telegram' : 'Email'}: ${r.ok ? 'đã gửi' : `lỗi — ${r.error}`}`,
        )
        .join(' · ');
    });

  return (
    <div className="setup-section">
      <div className="setup-section__header">
        <h3>🔔 Thông báo deadline</h3>
      </div>
      <div className="setup-section__body">
        {!settings ? (
          <p className="setup-section__empty">{message?.text ?? 'Đang tải...'}</p>
        ) : (
          <div className="notify-form">
            <p className="notify-form__hint">
              Gửi cho admin khi task chưa xong còn 3 ngày và còn 1 ngày tới deadline (8h sáng mỗi
              ngày).
            </p>
            <label className="notify-form__row">
              <input
                type="checkbox"
                checked={settings.emailEnabled}
                onChange={(e) => update({ emailEnabled: e.target.checked })}
              />
              <span>Email tới {settings.email || 'email đăng ký tài khoản'}</span>
            </label>
            <label className="notify-form__row">
              <input
                type="checkbox"
                checked={settings.telegramEnabled}
                onChange={(e) => update({ telegramEnabled: e.target.checked })}
              />
              <span>Telegram</span>
            </label>
            {settings.telegramEnabled && (
              <div className="form-group">
                <input
                  className="form-input"
                  value={settings.telegramChatId}
                  onChange={(e) => update({ telegramChatId: e.target.value })}
                  placeholder="Chat ID, VD: 123456789"
                />
                <div className="editable-list__item-meta">
                  Nhắn tin cho bot một lần, rồi lấy Chat ID qua @userinfobot.
                </div>
              </div>
            )}
            <div className="notify-form__actions">
              <Button variant="primary" size="sm" onClick={save} disabled={busy}>
                Lưu
              </Button>
              <Button
                size="sm"
                onClick={test}
                disabled={busy || !(settings.emailEnabled || settings.telegramEnabled)}
              >
                Gửi thử
              </Button>
            </div>
            {message && (
              <div
                className="editable-list__item-meta"
                style={{ color: message.ok ? 'var(--color-success)' : 'var(--color-danger)' }}
              >
                {message.text}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState, type FormEvent } from 'react';

type Mode = 'login' | 'register';

export function AuthDialog({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<Mode>('login');
  const [message, setMessage] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const elements = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href]'));
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.closest('[hidden]')) document.querySelector<HTMLButtonElement>('.site-header__hamburger')?.focus();
      else previousFocus?.focus();
    };
  }, [onClose]);

  function switchMode(next: Mode) { setMode(next); setMessage(''); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (mode === 'register' && data.get('password') !== data.get('confirmPassword')) {
      setMessage('Mật khẩu xác nhận chưa khớp. Vui lòng kiểm tra lại.');
      return;
    }
    setMessage('Tính năng tài khoản đang được chuẩn bị. Vui lòng quay lại sau.');
  }

  return (
    <div className="auth-overlay" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title" ref={dialogRef}>
        <button className="auth-close" type="button" onClick={onClose} aria-label="Đóng">×</button>
        <div className="auth-intro">
          <img src="./logo.png" alt="FutureLearn" className="auth-logo" />
          <h2 id="auth-title">{mode === 'login' ? 'Chào mừng bạn trở lại!' : 'Bắt đầu hành trình học tập'}</h2>
          <p>{mode === 'login' ? 'Đăng nhập để tiếp tục khám phá cùng FutureLearn.' : 'Tạo tài khoản để cùng FutureLearn khám phá điều mới mỗi ngày.'}</p>
        </div>
        <div className="auth-tabs" aria-label="Chọn hình thức tài khoản">
          <button type="button" className={mode === 'login' ? 'is-active' : ''} aria-pressed={mode === 'login'} onClick={() => switchMode('login')}>Đăng nhập</button>
          <button type="button" className={mode === 'register' ? 'is-active' : ''} aria-pressed={mode === 'register'} onClick={() => switchMode('register')}>Đăng ký</button>
        </div>
        <form className="auth-form" onSubmit={submit} key={mode}>
          {mode === 'register' && <label>Họ và tên<input name="name" autoComplete="name" required placeholder="Nhập họ và tên" /></label>}
          <label>Email<input name="email" type="email" autoComplete="email" required placeholder="Nhập email của bạn" /></label>
          <label>Mật khẩu<input name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={mode === 'register' ? 8 : undefined} placeholder={mode === 'register' ? 'Ít nhất 8 ký tự' : 'Nhập mật khẩu'} /></label>
          {mode === 'register' && <label>Xác nhận mật khẩu<input name="confirmPassword" type="password" autoComplete="new-password" required minLength={8} placeholder="Nhập lại mật khẩu" /></label>}
          {message && <p className="auth-message" role="status">{message}</p>}
          <button className="auth-submit" type="submit">{mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}</button>
        </form>
        <p className="auth-switch">{mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'} <button type="button" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Đăng ký' : 'Đăng nhập'}</button></p>
      </div>
    </div>
  );
}

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuthDialog } from './AuthDialog';

afterEach(cleanup);

describe('account dialog', () => {
  it('validates confirmation and explains that the account service is not available', () => {
    render(<AuthDialog onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Đăng ký', pressed: false }));
    fireEvent.change(screen.getByLabelText('Họ và tên'), { target: { value: 'An Nguyen' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'an@example.com' } });
    fireEvent.change(screen.getByLabelText('Mật khẩu'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Xác nhận mật khẩu'), { target: { value: 'different123' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Tạo tài khoản' }).closest('form')!);
    expect(screen.getByRole('status').textContent).toContain('chưa khớp');
    fireEvent.change(screen.getByLabelText('Xác nhận mật khẩu'), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Tạo tài khoản' }).closest('form')!);
    expect(screen.getByRole('status').textContent).toContain('đang được chuẩn bị');
  });

  it('closes with Escape and returns focus', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    const close = vi.fn();
    const view = render(<AuthDialog onClose={close} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(close).toHaveBeenCalledOnce();
    view.unmount();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });
});

import { useState, type FormEvent } from 'react';
import type { useSectionMotion } from '../../hooks/useSectionMotion';

const inputFields = [
  { id: 'consultation-name', name: 'full_name', type: 'text', autoComplete: 'name', label: 'Họ và tên', error: 'Vui lòng nhập họ và tên.' },
  { id: 'consultation-phone', name: 'phone_number', type: 'tel', autoComplete: 'tel', label: 'Số điện thoại', error: 'Vui lòng nhập đúng 10 chữ số điện thoại.' },
  { id: 'consultation-class', name: 'consultation_class', type: 'text', autoComplete: 'off', label: 'Lớp cần tư vấn', error: 'Vui lòng nhập lớp cần tư vấn.' },
];

const errorMessages: Record<string, string> = Object.fromEntries([
  ...inputFields.map(field => [field.id, field.error]),
  ['consultation-channel', 'Vui lòng chọn nơi bố mẹ biết đến FutureLearn.'],
]);

type MotionProps = ReturnType<typeof useSectionMotion>['props'];
type FormControl = HTMLInputElement | HTMLSelectElement;

function isFormControl(target: EventTarget): target is FormControl {
  return target instanceof HTMLInputElement || target instanceof HTMLSelectElement;
}

export function ConsultationForm({ motionProps }: { motionProps: MotionProps }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');

  function validateField(field: FormControl) {
    const id = field.id;
    const message = field.checkValidity() ? '' : errorMessages[id];
    setErrors(previous => ({ ...previous, [id]: message }));
  }

  function handleInput(event: FormEvent<HTMLFormElement>) {
    const field = event.target;
    if (!isFormControl(field)) return;
    if (field.id === 'consultation-phone') field.value = field.value.replace(/\D/g, '').slice(0, 10);
    if (errors[field.id]) validateField(field);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = Array.from(event.currentTarget.elements).filter(isFormControl);
    const nextErrors = Object.fromEntries(fields.map(field => [field.id, field.checkValidity() ? '' : errorMessages[field.id]]));
    setErrors(nextErrors);
    const firstInvalid = fields.find(field => nextErrors[field.id]);
    if (firstInvalid) {
      setStatus('Vui lòng kiểm tra lại các thông tin còn thiếu.');
      firstInvalid.focus();
      return;
    }
    setStatus('Biểu mẫu đã hợp lệ và sẵn sàng kết nối hệ thống tiếp nhận tư vấn.');
  }

  return (
    <form className="consultation-form" data-consultation-form noValidate onSubmit={handleSubmit} onChange={handleInput} onBlur={event => { if (isFormControl(event.target)) validateField(event.target); }}>
      {inputFields.map((field, index) => (
        <div key={field.id} {...motionProps('consultation-form__field', 'rise', index + 1)}>
          <label className="visually-hidden" htmlFor={field.id}>{field.label}</label>
          <input
            id={field.id} name={field.name} type={field.type} autoComplete={field.autoComplete}
            placeholder={field.label} required aria-describedby={`${field.id}-error`}
            aria-invalid={errors[field.id] === undefined ? undefined : Boolean(errors[field.id])}
            {...(field.type === 'tel' ? { inputMode: 'numeric', pattern: '[0-9]{10}', minLength: 10, maxLength: 10 } as const : {})}
          />
          <span id={`${field.id}-error`} className="consultation-form__error" data-error-for={field.id}>{errors[field.id]}</span>
        </div>
      ))}
      <div {...motionProps('consultation-form__field consultation-form__field--select', 'rise', 4)}>
        <label className="visually-hidden" htmlFor="consultation-channel">Bố mẹ biết đến FutureLearn qua đâu?</label>
        <select id="consultation-channel" name="channel" required defaultValue="" aria-describedby="consultation-channel-error" aria-invalid={errors['consultation-channel'] === undefined ? undefined : Boolean(errors['consultation-channel'])}>
          <option value="" disabled>Bố mẹ biết đến FutureLearn qua đâu?</option>
          <option value="ambassador">Đại sứ</option>
          <option value="advertising">Quảng cáo</option>
          <option value="school">Nhà trường</option>
          <option value="other">Khác</option>
        </select>
        <i className="fa-solid fa-angle-down" aria-hidden="true" />
        <span id="consultation-channel-error" className="consultation-form__error" data-error-for="consultation-channel">{errors['consultation-channel']}</span>
      </div>
      <button {...motionProps('consultation-form__submit', 'pop', 5)} type="submit">Đăng ký ngay!</button>
      <p className="consultation-form__status" data-consultation-status aria-live="polite">{status}</p>
    </form>
  );
}

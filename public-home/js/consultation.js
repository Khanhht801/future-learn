(function () {
    "use strict";

    const form = document.querySelector("[data-consultation-form]");

    if (!form) {
        return;
    }

    const status = form.querySelector("[data-consultation-status]");
    const fields = Array.from(form.querySelectorAll("input, select"));
    const phoneField = form.querySelector("#consultation-phone");

    const messages = {
        "consultation-name": "Vui lòng nhập họ và tên.",
        "consultation-phone": "Vui lòng nhập đúng 10 chữ số điện thoại.",
        "consultation-class": "Vui lòng nhập lớp cần tư vấn.",
        "consultation-channel": "Vui lòng chọn nơi bố mẹ biết đến FutureLearn."
    };

    function showFieldState(field) {
        const error = form.querySelector(`[data-error-for="${field.id}"]`);
        const isValid = field.checkValidity();

        field.setAttribute("aria-invalid", String(!isValid));

        if (error) {
            error.textContent = isValid ? "" : messages[field.id];
        }

        return isValid;
    }

    phoneField.addEventListener("input", () => {
        phoneField.value = phoneField.value.replace(/\D/g, "").slice(0, 10);
    });

    fields.forEach((field) => {
        field.addEventListener("blur", () => showFieldState(field));
        field.addEventListener("input", () => {
            if (field.getAttribute("aria-invalid") === "true") {
                showFieldState(field);
            }
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const firstInvalidField = fields.find((field) => !showFieldState(field));

        if (firstInvalidField) {
            status.textContent = "Vui lòng kiểm tra lại các thông tin còn thiếu.";
            firstInvalidField.focus();
            return;
        }

        status.textContent = "Biểu mẫu đã hợp lệ và sẵn sàng kết nối hệ thống tiếp nhận tư vấn.";
    });
})();

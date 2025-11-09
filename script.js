function toggle() {
    document.body.classList.toggle("dark");
    const theme = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", theme);
}

window.onload = () => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") document.body.classList.add("dark");
};

document.addEventListener('DOMContentLoaded', () => {

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const userIdRegex = /^[a-zA-Z0-9_]{5,20}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    const nameRegex = /^[a-zA-Z\s]{3,}$/;
    const messageRegex = /.{10,}/;
    const titleRegex = /.{3,}/;
    const otpRegex = /^\d{6}$/;
    const identifierRegex = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})|^[a-zA-Z0-9_]{5,20}$/;

    const validateField = (input, regex, message) => {
        const feedback = input.nextElementSibling;
        const value = input.value.trim();

        if (value === '') {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            feedback.textContent = `This field is required.`;
            return false;
        }

        if (regex && !regex.test(value)) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            feedback.textContent = message;
            return false;
        }

        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        return true;
    };

    const validateSignupForm = (form) => {
        let isValid = true;

        isValid &= validateField(document.getElementById('signupName'), nameRegex, 'Name is required and must contain only letters/spaces.');
        isValid &= validateField(document.getElementById('signupEmail'), emailRegex, 'Please enter a valid email address.');
        isValid &= validateField(document.getElementById('signupUserId'), userIdRegex, 'User ID must be 5-20 characters long (letters, numbers, underscores).');
        isValid &= validateField(document.getElementById('signupPassword'), passwordRegex, 'Password must be 8+ characters, include at least one letter and one number.');

        const passwordInput = document.getElementById('signupPassword');
        const confirmInput = document.getElementById('confirmPassword');
        const confirmFeedback = confirmInput.nextElementSibling;

        let isConfirmValid = validateField(confirmInput, passwordRegex, 'Confirmation password does not meet complexity requirements.');

        if (isConfirmValid && passwordInput.value !== confirmInput.value) {
            confirmInput.classList.add('is-invalid');
            confirmInput.classList.remove('is-valid');
            confirmFeedback.textContent = 'Passwords do not match.';
            isValid = false;
        } else if (!isConfirmValid) {
            isValid = false;
        }
        return isValid;
    };

    const validateLoginForm = (form) => {
        let isValid = true;
        isValid &= validateField(document.getElementById('loginIdentifier'), identifierRegex, 'Please enter a valid Email or User ID (5+ chars).');
        isValid &= validateField(document.getElementById('loginPassword'), passwordRegex, 'Password must be 8+ characters, include at least one letter and one number.');
        return isValid;
    };

    const validateAdminLoginForm = (form) => {
        const identifierInput = document.getElementById('adminLoginEmail');
        const passwordInput = document.getElementById('adminLoginPassword');

        let isValid = true;
        isValid &= validateField(identifierInput, identifierRegex, 'Please enter a valid Email or User ID (5+ chars).');
        isValid &= validateField(passwordInput, passwordRegex, 'Password must be 8+ characters, include at least one letter and one number.');

        if (isValid) {
            if (identifierInput.value === 'admin@website.com' && passwordInput.value === 'password123') {
                window.location.href = 'admin_dashboard.html';
                return true;
            } else {
                alert('Invalid credentials. (Hint: use admin@website.com and password123)');
                identifierInput.classList.add('is-invalid');
                passwordInput.classList.add('is-invalid');
                return false;
            }
        }
        return false;
    };

    const validateContactForm = (form) => {
        let isValid = true;
        isValid &= validateField(document.getElementById('contactName'), nameRegex, 'Name is required and must contain only letters/spaces.');
        isValid &= validateField(document.getElementById('contactEmail'), emailRegex, 'Please enter a valid email address.');
        isValid &= validateField(document.getElementById('contactSubject'), titleRegex, 'Subject must be at least 3 characters.');
        isValid &= validateField(document.getElementById('contactMessage'), messageRegex, 'Message must be at least 10 characters long.');
        return isValid;
    };

    const validateUploadForm = (form) => {
        let isValid = true;
        isValid &= validateField(document.getElementById('imageTitle'), titleRegex, 'Title must be at least 3 characters.');

        const fileInput = document.getElementById('imageFile');
        if (fileInput.files.length === 0) {
            fileInput.classList.add('is-invalid');
            isValid = false;
        } else {
            fileInput.classList.remove('is-invalid');
        }

        const selectInput = document.getElementById('collectionSelect');
        if (selectInput.value === '') {
            selectInput.classList.add('is-invalid');
            isValid = false;
        } else {
            selectInput.classList.remove('is-invalid');
        }
        return isValid;
    };

    const validateChangeEmailForm = (form) => {
        let isValid = true;
        isValid &= validateField(document.getElementById('currentPasswordEmail'), passwordRegex, 'Password must be 8+ characters.');
        isValid &= validateField(document.getElementById('newEmail'), emailRegex, 'Please enter a valid new email address.');

        const newEmailInput = document.getElementById('newEmail');
        const confirmNewEmailInput = document.getElementById('confirmNewEmail');

        let isConfirmValid = validateField(confirmNewEmailInput, emailRegex, 'Confirmation email is invalid.');

        if (isConfirmValid && newEmailInput.value !== confirmNewEmailInput.value) {
            confirmNewEmailInput.classList.add('is-invalid');
            confirmNewEmailInput.nextElementSibling.textContent = 'Emails do not match.';
            isValid = false;
        } else if (!isConfirmValid) {
            isValid = false;
        }
        return isValid;
    };

    const validateResetPasswordForm = (form) => {
        const oldPw = document.getElementById('oldPassword').value;
        const newPw = document.getElementById('newPassword').value;
        const otpEmail = document.getElementById('otpEmail').value;
        const otpCode = document.getElementById('otpCode').value;
        const newPwOtp = document.getElementById('newPasswordOtp').value;

        let option1Used = oldPw !== '' || newPw !== '';
        let option2Used = otpEmail !== '' || otpCode !== '' || newPwOtp !== '';

        if (!option1Used && !option2Used) {
            alert("Please fill out one of the password reset options.");
            return false;
        }
        if (option1Used && option2Used) {
            alert("Please use only one password reset option (Old Password OR OTP).");
            return false;
        }

        let isValid = true;

        if (option1Used) {
            isValid &= validateField(document.getElementById('oldPassword'), passwordRegex, 'Old password must be 8+ characters.');
            isValid &= validateField(document.getElementById('newPassword'), passwordRegex, 'New password must be 8+ characters.');
        } else if (option2Used) {
            isValid &= validateField(document.getElementById('otpEmail'), emailRegex, 'Please enter a valid email.');
            isValid &= validateField(document.getElementById('otpCode'), otpRegex, 'OTP must be exactly 6 digits.');
            isValid &= validateField(document.getElementById('newPasswordOtp'), passwordRegex, 'New password must be 8+ characters.');
        }
        return isValid;
    };

    const formValidators = {
        'signupForm': validateSignupForm,
        'loginForm': validateLoginForm,
        'adminLoginForm': validateAdminLoginForm,
        'contactForm': validateContactForm,
        'uploadForm': validateUploadForm,
        'changeEmailForm': validateChangeEmailForm,
        'resetPasswordForm': validateResetPasswordForm,
    };

    const forms = document.querySelectorAll('.needs-validation');

    forms.forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add('was-validated');

            const formId = form.id;
            let isValid = false;

            if (formValidators[formId]) {
                isValid = formValidators[formId](form);
            }

            if (isValid && formId !== 'adminLoginForm') {
                alert(`${formId.replace('Form', '')} successful! (Simulated submission)`);
            }
        });
    });
});
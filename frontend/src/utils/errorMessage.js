

const KNOWN_MESSAGES = {
    "This field is required.": "این فیلد الزامی است.",
    "This field may not be blank.": "این فیلد نمی‌تواند خالی باشد.",
    "This field may not be null.": "این فیلد نمی‌تواند خالی باشد.",
    "A valid number is required.": "لطفاً یک عدد معتبر وارد کنید.",
    "A valid integer is required.": "لطفاً یک عدد صحیح معتبر وارد کنید.",
    "Enter a valid URL.": "لطفاً یک آدرس (URL) معتبر وارد کنید.",
    "Enter a valid email address.": "لطفاً یک ایمیل معتبر وارد کنید.",
    "Invalid page.": "شماره صفحه معتبر نیست.",
    "Not found.": "موردی یافت نشد.",
    "Authentication credentials were not provided.":
        "برای انجام این عملیات باید وارد حساب کاربری خود شوید.",
    "You do not have permission to perform this action.":
        "شما اجازه انجام این عملیات را ندارید.",
    "Given token not valid for any token type":
        "نشست شما منقضی شده است. لطفاً دوباره وارد شوید.",
    "No active account found with the given credentials":
        "نام کاربری یا رمز عبور اشتباه است.",
};

function translateKnownMessage(message) {

    if (typeof message !== "string") return null;

    if (KNOWN_MESSAGES[message]) {
        return KNOWN_MESSAGES[message];
    }


    if (/greater than or equal to/i.test(message)) {
        return "مقدار وارد شده باید بزرگ‌تر یا مساوی حد مجاز باشد.";
    }

    if (/less than or equal to/i.test(message)) {
        return "مقدار وارد شده باید کوچک‌تر یا مساوی حد مجاز باشد.";
    }

    if (/no more than \d+ characters/i.test(message)) {
        return "تعداد کاراکترهای وارد شده بیش از حد مجاز است.";
    }

    if (/at least \d+ characters/i.test(message)) {
        return "تعداد کاراکترهای وارد شده کمتر از حد مجاز است.";
    }

    return null;

}

export function getErrorMessage(
    error,
    fallback = "خطایی رخ داد. لطفاً دوباره تلاش کنید."
) {

    if (!error?.response) {


        return "ارتباط با سرور برقرار نشد. اتصال اینترنت یا در دسترس بودن سرور را بررسی کنید.";

    }

    const { status, data } = error.response;

    if (status === 401) {
        return "نشست شما منقضی شده یا نامعتبر است. لطفاً دوباره وارد شوید.";
    }

    if (status === 403) {
        return "شما اجازه انجام این عملیات را ندارید.";
    }

    if (status >= 500) {
        return "خطای داخلی سرور. لطفاً بعداً دوباره تلاش کنید.";
    }

    if (typeof data === "string") {
        return translateKnownMessage(data) ?? fallback;
    }

    if (typeof data?.detail === "string") {
        return translateKnownMessage(data.detail) ?? fallback;
    }


    if (data && typeof data === "object") {

        const firstEntry = Object.values(data)[0];

        const rawMessage = Array.isArray(firstEntry)
            ? firstEntry[0]
            : firstEntry;

        const translated = translateKnownMessage(rawMessage);

        if (translated) return translated;

    }

    return fallback;

}
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 生成随机密码
 * @param length 密码长度
 * @param useUppercase 是否包含大写字母
 * @param useLowercase 是否包含小写字母
 * @param useNumbers 是否包含数字
 * @param useSpecialChars 是否包含特殊字符
 * @param excludeChars 需要排除的字符
 * @returns 生成的随机密码
 * const password = generatePassword(12, true, true, true, true, "!@#$%");
 * 使用示例
 * console.log(passw
 */
function generatePassword(length: number, 
                          useUppercase: boolean = true, 
                          useLowercase: boolean = true,
                          useNumbers: boolean = true,
                          useSpecialChars: boolean = false,
                          excludeChars: string = ""): string {

    // 定义字符集
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    // 根据选择构建字符集
    let charSet = "";
    if (useUppercase) charSet += uppercaseChars;
    if (useLowercase) charSet += lowercaseChars;
    if (useNumbers) charSet += numberChars;
    if (useSpecialChars) charSet += specialChars;

    // 移除排除的字符
    charSet = charSet.split('').filter(char => !excludeChars.includes(char)).join('');

    // 确保字符集非空
    if (charSet.length === 0) {
        throw new Error("Character set is empty after excluding specified characters.");
    }

    // 生成随机密码
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charSet.length);
        password += charSet[randomIndex];
    }

    return password;
}
ord);

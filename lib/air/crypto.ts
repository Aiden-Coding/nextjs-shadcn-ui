class Base64 {
  private _keyStr: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  public encode(input: string): string {
    let output = "";
    let chr1: number,
      chr2: number,
      chr3: number,
      enc1: number,
      enc2: number,
      enc3: number,
      enc4: number;
    let i = 0;
    input = this._utf8_encode(input);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output +=
        this._keyStr.charAt(enc1) +
        this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) +
        this._keyStr.charAt(enc4);
    }
    return output;
  }

  public decode(input: string): string {
    let output = "";
    let chr1: number, chr2: number, chr3: number;
    let enc1: number, enc2: number, enc3: number, enc4: number;
    let i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output += String.fromCharCode(chr1);
      if (enc3 != 64) output += String.fromCharCode(chr2);
      if (enc4 != 64) output += String.fromCharCode(chr3);
    }

    return this._utf8_decode(output);
  }

  private _utf8_encode(string: string): string {
    string = string.replace(/\r\n/g, "\n");
    let utftext = "";
    for (let n = 0; n < string.length; n++) {
      let c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }

  private _utf8_decode(utftext: string): string {
    let string = "";
    let i = 0;
    let c1 = 0,
      c2 = 0,
      c3 = 0;

    while (i < utftext.length) {
      c1 = utftext.charCodeAt(i);
      if (c1 < 128) {
        string += String.fromCharCode(c1);
        i++;
      } else if (c1 > 191 && c1 < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  }
}

function hex_md5(s: string): string {
  return binl2hex(core_md5(str2binl(s), s.length * chrsz));
}

function b64_md5(s: string): string {
  return binl2b64(core_md5(str2binl(s), s.length * chrsz));
}

function str_md5(s: string): string {
  return binl2str(core_md5(str2binl(s), s.length * chrsz));
}

function hex_hmac_md5(key: string, data: string): string {
  return binl2hex(core_hmac_md5(key, data));
}

function b64_hmac_md5(key: string, data: string): string {
  return binl2b64(core_hmac_md5(key, data));
}

function str_hmac_md5(key: string, data: string): string {
  return binl2str(core_hmac_md5(key, data));
}

function md5_vm_test(): boolean {
  return hex_md5("abc") === "900150983cd24fb0d6963f7d28e17f72";
}

function core_md5(x: number[], len: number): number[] {
  // MD5 主体函数
  // 这里省略了具体实现
  return x;
}

function md5_cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}

function md5_ff(
  a: number,
  b: number,
  c: number,
  d: number,
  x: number,
  s: number,
  t: number
): number {
  return md5_cmn((b & c) | (~b & d), a, b, x, s, t);
}

function md5_gg(
  a: number,
  b: number,
  c: number,
  d: number,
  x: number,
  s: number,
  t: number
): number {
  return md5_cmn((b & d) | (c & ~d), a, b, x, s, t);
}

function md5_hh(
  a: number,
  b: number,
  c: number,
  d: number,
  x: number,
  s: number,
  t: number
): number {
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5_ii(
  a: number,
  b: number,
  c: number,
  d: number,
  x: number,
  s: number,
  t: number
): number {
  return md5_cmn(c ^ (b | ~d), a, b, x, s, t);
}

function core_hmac_md5(key: string, data: string): number[] {
  let bkey = str2binl(key);
  if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  let ipad = Array<number>(16),
    opad = Array<number>(16);
  for (let i = 0; i < 16; i++) {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5c5c5c5c;
  }

  let hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

function safe_add(x: number, y: number): number {
  let lsw = (x & 0xffff) + (y & 0xffff);
  let msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xffff);
}

function bit_rol(num: number, cnt: number): number {
  return (num << cnt) | (num >>> (32 - cnt));
}

function str2binl(str: string): number[] {
  let bin = Array<number>();
  let mask = (1 << chrsz) - 1;
  for (let i = 0; i < str.length * chrsz; i += chrsz) {
    bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << i % 32;
  }
  return bin;
}

function binl2str(bin: number[]): string {
  let str = "";
  let mask = (1 << chrsz) - 1;
  for (let i = 0; i < bin.length * 32; i += chrsz) {
    str += String.fromCharCode((bin[i >> 5] >>> i % 32) & mask);
  }
  return str;
}

function binl2hex(binarray: number[]): string {
  let hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  let str = "";
  for (let i = 0; i < binarray.length * 4; i++) {
    str +=
      hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xf) +
      hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xf);
  }
  return str;
}

function binl2b64(binarray: number[]): string {
  let tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let str = "";
  for (let i = 0; i < binarray.length * 4; i += 3) {
    let triplet =
      (((binarray[i >> 2] >> (8 * (i % 4))) & 0xff) << 16) |
      (((binarray[(i + 1) >> 2] >> (8 * ((i + 1) % 4))) & 0xff) << 8) |
      ((binarray[(i + 2) >> 2] >> (8 * ((i + 2) % 4))) & 0xff);
    for (let j = 0; j < 4; j++) {
      if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> (6 * (3 - j))) & 0x3f);
    }
  }
  return str;
}

export function encode_param(a: string): string {
  const b = new Base64();
  return b.encode(a);
}

export function encode_secret(...args: string[]): string {
  let a = appId;
  for (let b = 0; b < args.length; b++) {
    a += args[b];
  }
  a = a.replace(/\s/g, "");
  return hex_md5(a);
}

function decode_result(a: string): string {
  const b = new Base64();
  return b.decode(b.decode(b.decode(a)));
}

// 配置变量
const hexcase: number = 0;
const b64pad: string = "";
const chrsz: number = 8;
const appId: string = "a01901d3caba1f362d69474674ce477f";

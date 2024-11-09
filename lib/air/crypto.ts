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

function core_md5(a: number[], b: number): number[] {
  var c, d, e, f, g, h, i, j, k;
  for (
    a[b >> 5] |= 128 << b % 32,
      a[(((b + 64) >>> 9) << 4) + 14] = b,
      c = 1732584193,
      d = -271733879,
      e = -1732584194,
      f = 271733878,
      g = 0;
    g < a.length;
    g += 16
  )
    (h = c),
      (i = d),
      (j = e),
      (k = f),
      (c = md5_ff(c, d, e, f, a[g + 0], 7, -680876936)),
      (f = md5_ff(f, c, d, e, a[g + 1], 12, -389564586)),
      (e = md5_ff(e, f, c, d, a[g + 2], 17, 606105819)),
      (d = md5_ff(d, e, f, c, a[g + 3], 22, -1044525330)),
      (c = md5_ff(c, d, e, f, a[g + 4], 7, -176418897)),
      (f = md5_ff(f, c, d, e, a[g + 5], 12, 1200080426)),
      (e = md5_ff(e, f, c, d, a[g + 6], 17, -1473231341)),
      (d = md5_ff(d, e, f, c, a[g + 7], 22, -45705983)),
      (c = md5_ff(c, d, e, f, a[g + 8], 7, 1770035416)),
      (f = md5_ff(f, c, d, e, a[g + 9], 12, -1958414417)),
      (e = md5_ff(e, f, c, d, a[g + 10], 17, -42063)),
      (d = md5_ff(d, e, f, c, a[g + 11], 22, -1990404162)),
      (c = md5_ff(c, d, e, f, a[g + 12], 7, 1804603682)),
      (f = md5_ff(f, c, d, e, a[g + 13], 12, -40341101)),
      (e = md5_ff(e, f, c, d, a[g + 14], 17, -1502002290)),
      (d = md5_ff(d, e, f, c, a[g + 15], 22, 1236535329)),
      (c = md5_gg(c, d, e, f, a[g + 1], 5, -165796510)),
      (f = md5_gg(f, c, d, e, a[g + 6], 9, -1069501632)),
      (e = md5_gg(e, f, c, d, a[g + 11], 14, 643717713)),
      (d = md5_gg(d, e, f, c, a[g + 0], 20, -373897302)),
      (c = md5_gg(c, d, e, f, a[g + 5], 5, -701558691)),
      (f = md5_gg(f, c, d, e, a[g + 10], 9, 38016083)),
      (e = md5_gg(e, f, c, d, a[g + 15], 14, -660478335)),
      (d = md5_gg(d, e, f, c, a[g + 4], 20, -405537848)),
      (c = md5_gg(c, d, e, f, a[g + 9], 5, 568446438)),
      (f = md5_gg(f, c, d, e, a[g + 14], 9, -1019803690)),
      (e = md5_gg(e, f, c, d, a[g + 3], 14, -187363961)),
      (d = md5_gg(d, e, f, c, a[g + 8], 20, 1163531501)),
      (c = md5_gg(c, d, e, f, a[g + 13], 5, -1444681467)),
      (f = md5_gg(f, c, d, e, a[g + 2], 9, -51403784)),
      (e = md5_gg(e, f, c, d, a[g + 7], 14, 1735328473)),
      (d = md5_gg(d, e, f, c, a[g + 12], 20, -1926607734)),
      (c = md5_hh(c, d, e, f, a[g + 5], 4, -378558)),
      (f = md5_hh(f, c, d, e, a[g + 8], 11, -2022574463)),
      (e = md5_hh(e, f, c, d, a[g + 11], 16, 1839030562)),
      (d = md5_hh(d, e, f, c, a[g + 14], 23, -35309556)),
      (c = md5_hh(c, d, e, f, a[g + 1], 4, -1530992060)),
      (f = md5_hh(f, c, d, e, a[g + 4], 11, 1272893353)),
      (e = md5_hh(e, f, c, d, a[g + 7], 16, -155497632)),
      (d = md5_hh(d, e, f, c, a[g + 10], 23, -1094730640)),
      (c = md5_hh(c, d, e, f, a[g + 13], 4, 681279174)),
      (f = md5_hh(f, c, d, e, a[g + 0], 11, -358537222)),
      (e = md5_hh(e, f, c, d, a[g + 3], 16, -722521979)),
      (d = md5_hh(d, e, f, c, a[g + 6], 23, 76029189)),
      (c = md5_hh(c, d, e, f, a[g + 9], 4, -640364487)),
      (f = md5_hh(f, c, d, e, a[g + 12], 11, -421815835)),
      (e = md5_hh(e, f, c, d, a[g + 15], 16, 530742520)),
      (d = md5_hh(d, e, f, c, a[g + 2], 23, -995338651)),
      (c = md5_ii(c, d, e, f, a[g + 0], 6, -198630844)),
      (f = md5_ii(f, c, d, e, a[g + 7], 10, 1126891415)),
      (e = md5_ii(e, f, c, d, a[g + 14], 15, -1416354905)),
      (d = md5_ii(d, e, f, c, a[g + 5], 21, -57434055)),
      (c = md5_ii(c, d, e, f, a[g + 12], 6, 1700485571)),
      (f = md5_ii(f, c, d, e, a[g + 3], 10, -1894986606)),
      (e = md5_ii(e, f, c, d, a[g + 10], 15, -1051523)),
      (d = md5_ii(d, e, f, c, a[g + 1], 21, -2054922799)),
      (c = md5_ii(c, d, e, f, a[g + 8], 6, 1873313359)),
      (f = md5_ii(f, c, d, e, a[g + 15], 10, -30611744)),
      (e = md5_ii(e, f, c, d, a[g + 6], 15, -1560198380)),
      (d = md5_ii(d, e, f, c, a[g + 13], 21, 1309151649)),
      (c = md5_ii(c, d, e, f, a[g + 4], 6, -145523070)),
      (f = md5_ii(f, c, d, e, a[g + 11], 10, -1120210379)),
      (e = md5_ii(e, f, c, d, a[g + 2], 15, 718787259)),
      (d = md5_ii(d, e, f, c, a[g + 9], 21, -343485551)),
      (c = safe_add(c, h)),
      (d = safe_add(d, i)),
      (e = safe_add(e, j)),
      (f = safe_add(f, k));
  return Array(c, d, e, f);
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

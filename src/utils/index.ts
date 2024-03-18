export function convertBigIntToString(obj: any): any {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (typeof obj[key] === "bigint") {
        obj[key] = obj[key].toString();
      } else if (typeof obj[key] === "object") {
        obj[key] = convertBigIntToString(obj[key]);
      }
    }
  }

  return obj;
}

export function bigIntToNumber(bigIntValue: bigint): number {
  if (
    bigIntValue >= Number.MIN_SAFE_INTEGER &&
    bigIntValue <= Number.MAX_SAFE_INTEGER
  ) {
    return Number(bigIntValue);
  } else {
    return +bigIntValue.toString();
  }
}

export function weiToEther(wei: bigint): number {
  const ether = bigIntToNumber(wei) / 10 ** 18;
  return ether;
}

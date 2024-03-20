import {
  bigIntToNumber,
  unixTimestampToDateString,
  weiToEther,
} from "../../../utils";

describe("Utility Function - bigIntToNumber", () => {
  it("should convert bigInt to number within safe range", () => {
    const result = bigIntToNumber(BigInt(Number.MAX_SAFE_INTEGER));

    expect(result).toEqual(Number.MAX_SAFE_INTEGER);
  });

  it("should handle bigInt outside safe range", () => {
    const result = bigIntToNumber(BigInt(Number.MAX_SAFE_INTEGER + 1));

    expect(result).toEqual(Number.MAX_SAFE_INTEGER + 1);
  });
});

describe("Utility Function - weiToEther", () => {
  it("should convert wei to ether", () => {
    const result = weiToEther(BigInt(1000000000000000000)); // 1 ether in wei

    expect(result).toEqual(1);
  });
});

describe("Utility Function - unixTimestampToDateString", () => {
  it("should convert unix timestamp to Date object", () => {
    const timestamp = BigInt(Date.now());

    const result = unixTimestampToDateString(timestamp);

    expect(result).toBeInstanceOf(Date);
  });
});

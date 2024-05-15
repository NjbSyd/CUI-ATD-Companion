const formatInput = (text, previousText, departments) => {
  const maxLength = 12;
  const currentYear = new Date().getFullYear().toString();
  const yearTenPlaceDigit = parseInt(currentYear[2], 10);
  const yearUnitPlaceDigit = parseInt(currentYear[3], 10);
  const isCurrentYearSeptember = new Date().getMonth() >= 8;

  if (text.length > maxLength) {
    return text.slice(0, maxLength);
  }

  if (text.length < previousText.length) {
    return text.toUpperCase();
  }

  // Handle text pasting
  if (text.length > previousText.length + 1) {
    return previousText.toUpperCase();
  }

  // Handle text input
  if (text.length === 1) {
    return handleFirstCharInput(text);
  }
  if (text.length === 2) {
    return handleSecondCharInput(text);
  }
  if (text.length === 3) {
    return handleYearTenPlaceDigitInput(text, yearTenPlaceDigit);
  }
  if (text.length === 4) {
    return handleYearUnitPlaceDigitInput(
      text,
      yearUnitPlaceDigit,
      yearTenPlaceDigit,
      isCurrentYearSeptember,
    );
  }
  if (text.length === 5 || text.length === 9) {
    return formatWithHyphen(text, departments);
  }
  //for index 6,7,8 the input must be an alphabet a-z, and for index 10,11,12 the input must be a digit 0-9
  if (text.length === 6 || text.length === 7 || text.length === 8) {
    return handleAlphabetInput(text, departments);
  }
  if (text.length === 10 || text.length === 11 || text.length === 12) {
    return handleDigitInput(text);
  }
  return text.toUpperCase();
};

const handleFirstCharInput = (text) => {
  const char = text[0].toUpperCase();
  if (char === "F") {
    return "FA";
  }
  if (char === "S") {
    return "SP";
  }
  return "";
};
const handleSecondCharInput = (text) => {
  const char = text.toUpperCase();
  if (char === "FA" || char === "SP") {
    return char;
  }
  return handleFirstCharInput(text[0]);
};

const handleYearTenPlaceDigitInput = (text, yearTenPlaceDigit) => {
  const digit = parseInt(text[2], 10);
  if (isNaN(digit) || digit > yearTenPlaceDigit) {
    return text.slice(0, 2);
  }
  return text;
};

const handleYearUnitPlaceDigitInput = (
  text,
  yearUnitPlaceDigit,
  yearTenPlaceDigit,
  isCurrentYearSeptember,
) => {
  const unitPlace = parseInt(text[3], 10);
  const tenPlace = parseInt(text[2], 10);
  if (tenPlace < yearTenPlaceDigit && !isNaN(unitPlace)) {
    return text;
  }
  if (
    isNaN(unitPlace) ||
    (unitPlace >= yearUnitPlaceDigit && !isCurrentYearSeptember)
  ) {
    if (text.startsWith("SP") && unitPlace === yearUnitPlaceDigit) {
      return text;
    }
    return text.slice(0, 3);
  }
  return text;
};

const formatWithHyphen = (text, departments) => {
  if (text.length === 5 && text[4] !== "-") {
    return handleAlphabetInput(text.slice(0, 4) + "-" + text[4], departments);
  }
  if (text.length === 9 && text[8] !== "-") {
    return handleDigitInput(text.slice(0, 8) + "-" + text[8]);
  }
  return text;
};
const handleAlphabetInput = (text, departments) => {
  text = text.toUpperCase();
  const department = text.slice(5);
  const isDepartmentValid = departments.some((dep) =>
    dep.startsWith(department),
  );

  if (!isDepartmentValid) {
    return text.slice(0, text.length - 1);
  }
  return text;
};

const handleDigitInput = (text) => {
  const digit = parseInt(text[text.length - 1], 10);
  if (isNaN(digit)) {
    return text.slice(0, text.length - 1);
  }
  return text.toUpperCase();
};

export { formatInput };

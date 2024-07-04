import * as countryFlagEmoji from "country-flag-emoji";

export function getCountryFlag(name: string) {
  const flagsMap = countryFlagEmoji.list;

  if (name.toLowerCase() === "england") {
    name = "United Kingdom";
  }

  if (name.toLowerCase() === "usa") {
    name = "United States";
  }

  const [flag] = flagsMap.filter((item) => {
    return item.name.toLowerCase().includes(name.toLowerCase());
  });

  return flag ? flag.emoji : "";
}

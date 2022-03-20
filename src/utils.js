export const toFeet = (n) => {
  const realFeet = (n * 0.3937) / 12;
  const feet = Math.floor(realFeet);
  const inches = ((realFeet - feet) * 12).toFixed(2);
  return `${feet}ft/${inches}in`;
};

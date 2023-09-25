export const Remap = (
  val: number,
  input_min: number,
  input_max: number,
  output_min: number,
  output_max: number
) => {
  return (
    output_min +
    ((output_max - output_min) / (input_max - input_min)) * (val - input_min)
  );
};

export const GetTime = () => {
  const time = new Date();
  const hour = time.getHours() - 6;
  const minutes = time.getMinutes();
  return hour * 60 + minutes;
};

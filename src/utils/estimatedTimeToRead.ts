export const estimatedTimeToRead = (text: string): string => {
  const averageWordsReadPerMinute = 200;

  const wordsText = text.split(' ');
  const lengthWordText = wordsText.length;
  const timeEstimatedToReadRounded = Math.round(
    lengthWordText / averageWordsReadPerMinute
  );

  return `${timeEstimatedToReadRounded} min`;
};

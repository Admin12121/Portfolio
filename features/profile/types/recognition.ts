export type RecognitionEntry = {
  key: string;
  date: string;
  award: {
    title: string;
    organizer: string;
    eventLogoURL?: string;
    organizerLogoURL?: string;
    eventURL?: string;
    organizerURL?: string;
    teamName?: string;
    teamURL?: string;
    grade?: string;
    prize?: string;
    description?: string;
    referenceLink?: string;
  };
};
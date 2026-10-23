import type { Certification } from "./certifications";

export type RecognitionAward = {
  kind: "award";
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

export type RecognitionCredential = {
  kind: "certificate";
  key: string;
  date: string;
  credential: Certification;
};

export type RecognitionEntry = RecognitionAward | RecognitionCredential;
export type RecognitionKind = RecognitionEntry["kind"];

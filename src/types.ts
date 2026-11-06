export type Speaker = { name: string; title: string; pathway?: string; level?: string; project?: string; designation?: string };
export type MeetingAwards = { speaker?: string; evaluator?: string; tableTopics?: string };
export type Collections = { raffle: number; refreshments: number; fines: number };

export type Meeting = {
  date: string;
  sourceFile: string;
  theme: string;
  chairman: string | null;
  wordOfDay: string | null;
  lexicologist: string | null;
  tableTopicsMaster: string | null;
  generalEvaluator: string | null;
  speakers: Speaker[];
  awards: MeetingAwards;
  collections: Collections;
  financialMembers: number | null;
  memberCount: number;
  guestCount: number;
  membersPresent: string[];
  guestsPresent: string[];
  corrections: string;
  motion: string;
  mattersArising: string;
  highlights: string[];
  actionItems: string[];
  opening?: {
    time?: string;
    calledToOrderBy?: string;
    invocation?: string;
    nationalAnthem?: string;
    mission?: string;
    rafflePitch?: string;
  };
  grammarian?: string;
  ahUmCounter?: string;
  timer?: string;
  evaluationTeam?: string[];
  leadingOutside?: string[];
  committeeReports?: string[];
  otherBusiness?: string[];
  announcements?: string[];
  otherMotions?: string[];
  subsequentCorrections?: string;
  attendanceNotes?: string;
  collectionsNote?: string;
  adjournment?: string;
};

export type MemberRecord = {
  name: string;
  meetings: string[];
  speeches: Speaker[];
  awards: { type: string; date: string }[];
  chaired: string[];
  roles: { role: string; date: string }[];
};

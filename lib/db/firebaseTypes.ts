import type * as firestore from "firebase/firestore";

export type Firebase = {
  Timestamp: firestore.Timestamp;
  QueryDocumentSnapshot: firestore.QueryDocumentSnapshot;
  DocumentReference: firestore.DocumentReference;
  DocumentData: firestore.DocumentData;
  FieldValue: firestore.FieldValue;
  CollectionRef: firestore.CollectionReference;
};

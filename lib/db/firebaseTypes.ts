import type * as firestore from "@react-native-firebase/firestore";

export type Firebase = {
  Timestamp: firestore.FirebaseFirestoreTypes.Timestamp;
  QueryDocumentSnapshot: firestore.FirebaseFirestoreTypes.QueryDocumentSnapshot;
  DocumentReference: firestore.FirebaseFirestoreTypes.DocumentReference;
  DocumentData: firestore.FirebaseFirestoreTypes.DocumentData;
  GeoPoint: firestore.FirebaseFirestoreTypes.GeoPoint;
  serverTimestamp: firestore.FirebaseFirestoreTypes.FieldValue;
  collectionRef: firestore.FirebaseFirestoreTypes.CollectionReference;
};

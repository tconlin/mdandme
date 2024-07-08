import { getServerTimestamp, getDb } from "@/lib/init";
import {
  collection,
  setDoc,
  doc,
  orderBy,
  query,
  getDocs,
  startAfter,
  limit,
  getDoc,
} from "firebase/firestore";
import type * as firestore from "firebase/firestore";
import { nanoid } from "nanoid/non-secure";
import { ZodSchema } from "zod";
import { isNil } from "lodash";

interface BaseEntity {
  id?: string;
}

type WithTimestamps<T> = T & {
  id: string;
  created_at: firestore.Timestamp;
};

export type CreateResponse<T> = T & {
  id: string;
  created_at: Date;
};

export default class GenericDB<
  T extends firestore.DocumentData = firestore.DocumentData,
> {
  collectionRef: firestore.CollectionReference<T>;

  constructor(collectionPath: string) {
    this.collectionRef = collection(
      getDb,
      collectionPath
    ) as firestore.CollectionReference<T>;
  }

  /**
   * Create a document in the collection
   * @param data
   * @param id
   */
  async create<T extends BaseEntity>({
    data,
    schema,
  }: {
    data: T;
    schema: ZodSchema;
  }): Promise<CreateResponse<T>> {
    const uid = data?.id ? data.id : nanoid();
    const dataToCreate: T = {
      id: uid,
      ...data,
    };

    const parsedDataToCreate = schema.safeParse(dataToCreate);

    if (!parsedDataToCreate.success) {
      console.warn(JSON.stringify(parsedDataToCreate.error.errors, null, 4));
      throw new Error("Could not complete request");
    }

    const dataToSave: WithTimestamps<T> = {
      ...parsedDataToCreate.data,
      created_at: getServerTimestamp(),
    };

    await setDoc(doc(getDb, this.collectionRef.path, uid), dataToSave, {
      merge: true,
    });

    return {
      id: uid,
      ...data,
      created_at: new Date(),
    };
  }

  async paginate<T>({
    lastVisible,
    responseLimit,
  }: {
    lastVisible: firestore.DocumentReference | null;
    responseLimit: number;
  }) {
    let docSnap: firestore.DocumentData;
    if (lastVisible) {
      docSnap = await getDocs(
        query(
          this.collectionRef,
          orderBy("created_at"),
          startAfter(lastVisible),
          limit(responseLimit)
        )
      );
    } else {
      docSnap = await getDocs(
        query(this.collectionRef, orderBy("created_at"), limit(responseLimit))
      );
    }

    const data: T = docSnap.docs.map((doc: firestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      const convertedData = this.convertObjectTimestampPropertiesToDate(data);
      return { id: doc.id, ...convertedData };
    });

    return { data, lastVisible: docSnap.docs[docSnap.docs.length - 1] };
  }

  /**
   * Read a document in the collection
   * @param id
   */
  async read<T>({ id }: { id: string }): Promise<T | null> {
    const docSnap = await getDoc(doc(this.collectionRef, id));

    const data = docSnap.exists() ? docSnap.data() : null;

    if (isNil(data)) return null;

    this.convertObjectTimestampPropertiesToDate(data);
    return { id, ...data } as T;
  }

  /**
   * Convert all object Timestamp properties to Date
   * @param obj - The object to convert
   * @returns A new object with all Timestamp properties converted to Date
   */
  convertObjectTimestampPropertiesToDate(obj: { [key: string]: any }): {
    [key: string]: any;
  } {
    const newObj: { [key: string]: any } = { ...obj };

    Object.keys(newObj).forEach((prop) => {
      if (newObj[prop] && typeof newObj[prop].toDate === "function") {
        newObj[prop] = newObj[prop].toDate().toDateString();
      } else if (
        typeof newObj[prop] === "object" &&
        newObj[prop] !== null &&
        !Array.isArray(newObj[prop])
      ) {
        newObj[prop] = this.convertObjectTimestampPropertiesToDate(
          newObj[prop]
        );
      }
    });

    return newObj;
  }
}

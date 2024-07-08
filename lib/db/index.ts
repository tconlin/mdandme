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
} from "firebase/firestore";
import type * as firestore from "firebase/firestore";
import { nanoid } from "nanoid/non-secure";
import { ZodSchema } from "zod";
import { ShowAlert } from "@/components/alert";

interface BaseEntity {
  id?: string;
}

type FirestoreQueryOperator =
  | "=="
  | "!="
  | ">"
  | "<"
  | ">="
  | "<="
  | "array-contains"
  | "array-contains-any"
  | "in"
  | "not-in";

type WithTimestamps<T> = T & {
  id: string;
  createdTimestamp: firestore.Timestamp;
  updatedTimestamp: firestore.Timestamp;
};

type WithUpdateTimestamps<T> = T & {
  updatedTimestamp: firestore.Timestamp;
};

export type CreateResponse<T> = T & {
  id: string;
  createdTimestamp: Date;
  updatedTimestamp: Date;
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
      ShowAlert({
        message: `Could not complete request. Please try again later`,
        type: "danger",
      });
      throw new Error("Could not complete request");
    }

    const dataToSave: WithTimestamps<T> = {
      ...parsedDataToCreate.data,
      createdTimestamp: getServerTimestamp(),
      updatedTimestamp: getServerTimestamp(),
    };

    await setDoc(doc(getDb, this.collectionRef.path, uid), dataToSave, {
      merge: true,
    });

    return {
      id: uid,
      ...data,
      createdTimestamp: new Date(),
      updatedTimestamp: new Date(),
    };
  }

  /**
   * Execute a query with optional pagination parameters
   */

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
   * Read a document in the collection based on single query
   * @param id
   */
  // async singleQuery<T>({
  //   field,
  //   operator,
  //   value,
  // }: {
  //   field: string;
  //   operator: FirestoreQueryOperator;
  //   value: string;
  // }): Promise<T[]> {
  //   const docSnap = await this.collectionRef
  //     .where(field, operator, value)
  //     .get();

  //   return docSnap.docs.map((doc) => {
  //     const data = doc.data();
  //     this.convertObjectTimestampPropertiesToDate(data);
  //     return {
  //       id: doc.id,
  //       ...data,
  //     } as T;
  //   });
  // }

  /**
   * Read a document in the collection
   * @param id
   */
  // async read<T>({ id }: { id: string }): Promise<T | null> {
  //   const docSnap = await this.collectionRef.doc(id).get();
  //   const docExists = docSnap.exists;

  //   const data = docExists ? docSnap.data() : null;

  //   if (isNil(data)) return null;

  //   this.convertObjectTimestampPropertiesToDate(data);
  //   return { id, ...data } as T;
  // }

  /**
   * Update a document in the collection
   * @param data
   */
  // async update<T>({
  //   data,
  //   schema,
  // }: {
  //   data: unknown;
  //   schema: ZodSchema;
  // }): Promise<T> {
  //   const parsedDataToUpdate = schema.safeParse(data);
  //   if (!parsedDataToUpdate.success) {
  //     console.warn(JSON.stringify(parsedDataToUpdate.error.errors, null, 4));
  //     ShowAlert({
  //       message: `Could not complete request. Please try again later`,
  //       type: "danger",
  //     });
  //     throw new Error("Could not complete request");
  //   }
  //   const cloneData = cloneDeep(parsedDataToUpdate.data);
  //   const id = cloneData.id;
  //   const updateData: WithUpdateTimestamps<T> = {
  //     ...cloneData,
  //     updatedTimestamp: getServerTimestamp(),
  //   };

  //   await this.collectionRef.doc(id).set(updateData as any, { merge: true });

  //   return parsedDataToUpdate.data;
  // }

  /**
   * Delete a document in the collection
   * @param id
   */
  // async delete({ id }: { id: string }): Promise<void> {
  //   return await collection.doc(id).delete();
  // }

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

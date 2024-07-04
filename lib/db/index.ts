import { cloneDeep } from "lodash";
import { getServerTimestamp, getDb } from "@/lib/init";
import type { Firebase } from "@/lib/db/firebaseTypes";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { nanoid } from "nanoid/non-secure";
import { isNil } from "lodash";
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
  createdTimestamp: Firebase["serverTimestamp"];
  updatedTimestamp: Firebase["serverTimestamp"];
};

type WithUpdateTimestamps<T> = T & {
  updatedTimestamp: Firebase["serverTimestamp"];
};

export type CreateResponse<T> = T & {
  id: string;
  createdTimestamp: Date;
  updatedTimestamp: Date;
};

export default class GenericDB<
  T extends
    FirebaseFirestoreTypes.DocumentData = FirebaseFirestoreTypes.DocumentData,
> {
  collectionRef: FirebaseFirestoreTypes.CollectionReference<T>;

  constructor(collectionPath: string) {
    this.collectionRef = getDb().collection(
      collectionPath
    ) as FirebaseFirestoreTypes.CollectionReference<T>;
  }

  getDocRef(id: string) {
    return this.collectionRef.doc(id);
  }

  getTransaction() {
    return async (
      transactionFunction: (
        transaction: FirebaseFirestoreTypes.Transaction
      ) => Promise<any>
    ) => {
      return await getDb().runTransaction(transactionFunction);
    };
  }

  getBatch() {
    return getDb().batch();
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

    await this.collectionRef.doc(uid).set(dataToSave as any, { merge: true });

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
    limit,
  }: {
    lastVisible: Firebase["DocumentReference"] | null;
    limit: number;
  }) {
    let docSnap: Firebase["DocumentData"];
    if (lastVisible) {
      docSnap = await this.collectionRef
        .orderBy("createdTimestamp", "desc")
        .startAfter(lastVisible)
        .limit(limit)
        .get();
    } else {
      docSnap = await this.collectionRef
        .orderBy("createdTimestamp", "desc")
        .limit(limit)
        .get();
    }

    const data: T = docSnap.docs.map(
      (doc: Firebase["QueryDocumentSnapshot"]) => {
        const data = doc.data();
        this.convertObjectTimestampPropertiesToDate(data);
        return { id: doc.id, ...data };
      }
    );

    return { data, lastVisible: docSnap.docs[docSnap.docs.length - 1] };
  }

  /**
   * Read a document in the collection based on single query
   */
  async compoundQuery<T>({
    field,
    operator,
    value,
    field2,
    operator2,
    value2,
  }: {
    field: string;
    operator: FirestoreQueryOperator;
    value: string | boolean;
    field2: string;
    operator2: FirestoreQueryOperator;
    value2: string | boolean;
  }): Promise<T[]> {
    const docSnap = await this.collectionRef
      .where(field, operator, value)
      .where(field2, operator2, value2)
      .get();

    return docSnap.docs.map((doc) => {
      const data = doc.data();
      this.convertObjectTimestampPropertiesToDate(data);
      return {
        id: doc.id,
        ...data,
      } as T;
    });
  }

  /**
   * Read a document in the collection based on single query
   * @param id
   */
  async singleQuery<T>({
    field,
    operator,
    value,
  }: {
    field: string;
    operator: FirestoreQueryOperator;
    value: string;
  }): Promise<T[]> {
    const docSnap = await this.collectionRef
      .where(field, operator, value)
      .get();

    return docSnap.docs.map((doc) => {
      const data = doc.data();
      this.convertObjectTimestampPropertiesToDate(data);
      return {
        id: doc.id,
        ...data,
      } as T;
    });
  }

  async readAll(): Promise<any> {
    const docSnap = await this.collectionRef.get();

    return docSnap.docs.map((doc) => {
      const data = doc.data();
      this.convertObjectTimestampPropertiesToDate(data);
      return { id: doc.id, ...data };
    });
  }

  /**
   * Read a document in the collection
   * @param id
   */
  async read<T>({ id }: { id: string }): Promise<T | null> {
    const docSnap = await this.collectionRef.doc(id).get();
    const docExists = docSnap.exists;

    const data = docExists ? docSnap.data() : null;

    if (isNil(data)) return null;

    this.convertObjectTimestampPropertiesToDate(data);
    return { id, ...data } as T;
  }

  async writeTransaction<T extends BaseEntity>({
    transaction,
    data,
    schema,
    update = false,
  }: {
    transaction: FirebaseFirestoreTypes.Transaction;
    data: T;
    schema: ZodSchema;
    update?: boolean;
  }): Promise<FirebaseFirestoreTypes.Transaction> {
    const uid = data?.id ? data.id : nanoid();
    const dataToCreate: T = {
      id: uid,
      ...data,
    };
    const parsedData = schema.safeParse(dataToCreate);

    if (!parsedData.success) {
      console.warn(JSON.stringify(parsedData.error.errors, null, 4));
      ShowAlert({
        message: `Could not complete request. Please try again later`,
        type: "danger",
      });
      throw new Error("Could not complete request");
    }

    const dataToSave: WithTimestamps<T> = {
      ...parsedData.data,
      createdTimestamp: getServerTimestamp(),
      updatedTimestamp: getServerTimestamp(),
    };

    return update
      ? transaction.update(this.collectionRef.doc(uid), dataToSave as any)
      : transaction.set(this.collectionRef.doc(uid), dataToSave as any, {
          merge: true,
        });
  }

  /**
   * Update a document in the collection
   * @param data
   */
  async update<T>({
    data,
    schema,
  }: {
    data: unknown;
    schema: ZodSchema;
  }): Promise<T> {
    const parsedDataToUpdate = schema.safeParse(data);
    if (!parsedDataToUpdate.success) {
      console.warn(JSON.stringify(parsedDataToUpdate.error.errors, null, 4));
      ShowAlert({
        message: `Could not complete request. Please try again later`,
        type: "danger",
      });
      throw new Error("Could not complete request");
    }
    const cloneData = cloneDeep(parsedDataToUpdate.data);
    const id = cloneData.id;
    const updateData: WithUpdateTimestamps<T> = {
      ...cloneData,
      updatedTimestamp: getServerTimestamp(),
    };

    await this.collectionRef.doc(id).set(updateData as any, { merge: true });

    return parsedDataToUpdate.data;
  }

  /**
   * Delete a document in the collection
   * @param id
   */
  async delete({ id }: { id: string }): Promise<void> {
    return await this.collectionRef.doc(id).delete();
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
        newObj[prop] = newObj[prop].toDate();
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

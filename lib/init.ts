import firestore from "@react-native-firebase/firestore";

const getDb = () => firestore();
const getServerTimestamp = () => firestore.FieldValue.serverTimestamp();

export { getServerTimestamp, getDb };

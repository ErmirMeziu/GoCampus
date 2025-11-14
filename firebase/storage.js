import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImage = async (uri, folder = "uploads") => {
  const storage = getStorage();

  const response = await fetch(uri);
  const blob = await response.blob();

  const fileRef = ref(storage, `${folder}/${Date.now()}-${Math.random()}.jpg`);

  await uploadBytes(fileRef, blob);

  return await getDownloadURL(fileRef);
};

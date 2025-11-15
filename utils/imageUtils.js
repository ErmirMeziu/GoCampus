import * as ImagePicker from "expo-image-picker";

export const pickImages = async (allowMultiple = true) => {
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: allowMultiple,
    base64: true,
    quality: 0.8,
  });

  if (res?.canceled) return [];

  return res.assets.map((a) => ({
    uri: a.uri,
    base64: a.base64,
  }));
};

export const restoreImages = (base64Array = []) =>
  base64Array.map((b64) => ({
    base64: b64,
    uri: `data:image/jpeg;base64,${b64}`,
  }));

export const cleanData = (obj) => {
  const clean = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined && obj[key] !== null) clean[key] = obj[key];
  });
  return clean;
};
